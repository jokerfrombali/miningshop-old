# -*- coding: utf-8 -*-
"""Вытаскивает содержимое старого сайта в структурированном виде.

На входе — выкачанные из веб-архива HTML-страницы (manifest.jsonl + mirror/).
На выходе:
  content/<тип>/<путь>.md  — текст каждой страницы в Markdown с метаданными
  data/products.json|csv   — карточки товаров: название, цена, характеристики, фото
  data/articles.json       — статьи блога
  data/categories.json     — разделы каталога
  data/pages.json          — остальные страницы (о компании, доставка и т. п.)

Разметка сайта менялась с 2017 по 2026 год, поэтому опираемся в первую очередь
на микроразметку schema.org и хлебные крошки, а текст берём через trafilatura.
"""
import csv, io, json, os, re, sys, urllib.parse
from collections import defaultdict
from bs4 import BeautifulSoup
import trafilatura

ROOT = r'D:\Projects\miningshop-archive'
BASE = 'https://miningshop.ru'


def long(p):
    return '\\\\?\\' + os.path.abspath(p) if os.name == 'nt' else p


def clean(t):
    return re.sub(r'\s+', ' ', t or '').strip()


def abs_url(u):
    if not u:
        return None
    u = u.strip()
    if u.startswith('//'):
        u = 'https:' + u
    if u.startswith('/'):
        u = BASE + u
    u = re.sub(r'^https?://(www\.)?miningshop\.ru', BASE, u)
    return u


MONTHS = {'января': 1, 'февраля': 2, 'марта': 3, 'апреля': 4, 'мая': 5, 'июня': 6, 'июля': 7,
          'августа': 8, 'сентября': 9, 'октября': 10, 'ноября': 11, 'декабря': 12}


def find_date(soup):
    for el in soup.select('[itemprop=datePublished], time[datetime], .period, .date, .news-date, .item-date'):
        v = el.get('content') or el.get('datetime') or el.get_text(' ', strip=True)
        m = re.search(r'(\d{4})-(\d{2})-(\d{2})', v or '')
        if m:
            return '%s-%s-%s' % m.groups()
        m = re.search(r'(\d{1,2})\.(\d{1,2})\.(\d{4})', v or '')
        if m:
            return '%s-%02d-%02d' % (m.group(3), int(m.group(2)), int(m.group(1)))
        m = re.search(r'(\d{1,2})\s+(%s)\s+(\d{4})' % '|'.join(MONTHS), v or '')
        if m:
            return '%s-%02d-%02d' % (m.group(3), MONTHS[m.group(2)], int(m.group(1)))
    return None


def breadcrumbs(soup):
    out = []
    for li in soup.select('[itemprop=itemListElement]'):
        n = li.select_one('[itemprop=name]')
        a = li.select_one('[itemprop=item]')
        name = clean(n.get_text() if n else li.get_text())
        href = a.get('href') or a.get('content') if a else None
        if name:
            out.append({'name': name, 'url': abs_url(href)})
    if not out:
        for a in soup.select('.breadcrumbs a, .breadcrumb a, #navigation a'):
            out.append({'name': clean(a.get_text()), 'url': abs_url(a.get('href'))})
    return out


def specs(soup):
    res = {}
    for name in soup.select('.char_name'):
        v = name.find_next(class_='char_value')
        k = clean(name.get_text())
        val = clean(v.get_text(' ')) if v else ''
        if k and val and k not in res:
            res[k] = val
    for ap in soup.select('[itemprop=additionalProperty]'):
        n = ap.select_one('[itemprop=name]')
        v = ap.select_one('[itemprop=value]')
        k = clean(n.get_text()) if n else ''
        val = clean(v.get('content') or v.get_text(' ')) if v else ''
        if k and val and k not in res:
            res[k] = val
    for tbl in soup.select('table.props_list, .props_list table, .char-table, table.characteristics'):
        for tr in tbl.select('tr'):
            cells = [clean(td.get_text(' ')) for td in tr.select('td, th')]
            if len(cells) >= 2 and cells[0] and cells[1] and cells[0] not in res:
                res[cells[0]] = cells[1]
    return res


def product_images(soup):
    imgs = []
    for sel in ['a.fancy', '[data-fancybox]', '.detail-gallery-big a', '.product-detail-gallery a']:
        for a in soup.select(sel):
            h = a.get('href') or a.get('data-src')
            if h and re.search(r'\.(jpe?g|png|webp|gif)$', h, re.I):
                imgs.append(abs_url(h))
    for el in soup.select('[itemprop=image]'):
        h = el.get('href') or el.get('src') or el.get('content')
        if h:
            imgs.append(abs_url(h))
    seen, out = set(), []
    for i in imgs:
        # иконки преимуществ из resize_cache 50x50 к товару не относятся
        if i and i not in seen and '/resize_cache/uf/' not in i:
            seen.add(i); out.append(i)
    return out


def price(soup):
    el = soup.select_one('[itemprop=price]')
    if el and (el.get('content') or '').replace('.', '').isdigit():
        return float(el.get('content'))
    for sel in ['.price_value', '.price']:
        el = soup.select_one(sel)
        if el:
            m = re.search(r'(\d[\d\s\xa0]{2,})', el.get_text())
            if m:
                return float(re.sub(r'\D', '', m.group(1)))
    return None


def availability(soup, text):
    el = soup.select_one('[itemprop=availability]')
    v = (el.get('href') or el.get('content') or '') if el else ''
    if v:
        return v.rsplit('/', 1)[-1]
    for phrase in ['Ожидаем поставку', 'Нет в наличии', 'В наличии', 'Под заказ', 'Предзаказ']:
        if phrase in text:
            return phrase
    return None


def description(soup):
    for sel in ['.detail_text', '[itemprop=description]:not(meta)', '.product-description', '.item_description', '#desc']:
        el = soup.select_one(sel)
        if el and len(el.get_text(strip=True)) > 80:
            return trafilatura.extract('<html><body>%s</body></html>' % el, output_format='markdown',
                                       include_images=True, include_tables=True) or clean(el.get_text(' '))
    m = soup.select_one('meta[itemprop=description]')
    if m and len(m.get('content') or '') > 80:
        return m['content'].strip()
    return None


def kind_of(path, soup):
    if soup.select_one('[itemtype$="schema.org/Product"], [itemtype$="schema.org/Product/"]') and soup.h1:
        return 'product'
    parts = [p for p in path.strip('/').split('/') if p]
    if parts and parts[0] in ('blog', 'news', 'articles', 'stati', 'info') and len(parts) >= 3:
        return 'article'
    if parts and parts[0] in ('blog', 'news'):
        return 'blog_section'
    if parts and parts[0] in ('catalog', 'asic_maineri', 'videokarty_dlya_majninga', 'fermy_dlja_majninga_kriptovaljuty',
                              'used_asics', 'store', 'sale'):
        return 'category'
    return 'page'


def md_path(kind, path, query):
    slug = path.strip('/').replace('/', '__') or 'index'
    slug = re.sub(r'[<>:"\\|?*]', '_', slug)
    slug = re.sub(r'[ .]+(?=__|$)', '', slug)  # Windows: без пробела и точки в конце имени
    import hashlib
    if query:
        slug += '__' + hashlib.md5(query.encode()).hexdigest()[:8]
    if len(slug) > 150:
        slug = slug[:130] + '-' + hashlib.md5(slug.encode()).hexdigest()[:8]
    return os.path.join(ROOT, 'content', kind, slug + '.md')


def front(meta):
    lines = ['---']
    for k, v in meta.items():
        if v is None or v == [] or v == {}:
            continue
        lines.append('%s: %s' % (k, json.dumps(v, ensure_ascii=False)))
    lines.append('---')
    return '\n'.join(lines) + '\n\n'


def main():
    recs = [json.loads(l) for l in open(os.path.join(ROOT, '_work', 'manifest.jsonl'), encoding='utf-8')]
    pages = {}
    for r in recs:
        if r['status'] == 200 and r['mime'].startswith('text/html'):
            pages[(r['path'], r['query'])] = r
    bare = {p for (p, q) in pages if not q}
    # где лежит выкачанная копия каждой картинки — чтобы из данных сразу можно было взять файл
    asset_local = {r['path']: r['local'] for r in recs
                   if r['status'] == 200 and not r['mime'].startswith('text/html')}

    def local_images(urls):
        out = []
        for u in urls or []:
            p = urllib.parse.unquote(urllib.parse.urlsplit(u).path)
            out.append(asset_local.get(p))
        return out

    out = defaultdict(list)
    total = len(pages)
    for n, ((path, q), r) in enumerate(sorted(pages.items()), 1):
        if n % 250 == 0:
            print('  разобрано %d/%d' % (n, total), flush=True)
        # варианты товара (?oid=...) — та же карточка с другим выбранным предложением;
        # если есть основная страница, отдельный вариант не разбираем
        if q and path in bare:
            continue
        # разбираем исходную копию: в mirror/ ссылки уже переписаны на локальные пути,
        # а в данных нужны настоящие адреса старого сайта
        fn = os.path.join(ROOT, '_work', 'mirror_raw', r['local'])
        if not os.path.exists(long(fn)):
            fn = os.path.join(ROOT, r['local'])
        try:
            raw = open(long(fn), 'rb').read().decode('utf-8', errors='replace')
        except OSError:
            continue
        soup = BeautifulSoup(raw, 'lxml')
        title = clean(soup.title.get_text()) if soup.title else None
        md_desc = soup.select_one('meta[name=description]')
        h1 = clean(soup.h1.get_text(' ')) if soup.h1 else None
        kind = kind_of(path, soup)
        text_md = trafilatura.extract(raw, output_format='markdown', include_images=True, include_tables=True,
                                      favor_recall=True) or ''
        url = BASE + path + (('?' + q) if q else '')
        item = {
            'url': url,
            'archived_at': r['ts'][:4] + '-' + r['ts'][4:6] + '-' + r['ts'][6:8],
            'archive_url': 'https://web.archive.org/web/%s/%s' % (r['ts'], r['orig']),
            'local_copy': r['local'],
            'title': title,
            'meta_description': (md_desc.get('content') or '').strip() if md_desc else None,
            'h1': h1,
            'breadcrumbs': breadcrumbs(soup),
        }
        if kind == 'product':
            full_text = soup.get_text(' ')
            item.update({
                'name': h1,
                'price_rub': price(soup),
                'availability': availability(soup, full_text),
                'sku': (re.search(r'Артикул[^:]*:\s*([\w-]+)', full_text) or [None, None])[1],
                'specs': specs(soup),
                'description_md': description(soup),
                'images': product_images(soup),
                'category_path': [b['name'] for b in item['breadcrumbs'][1:-1]],
            })
            item['images_local'] = local_images(item['images'])
        elif kind == 'article':
            item.update({'date': find_date(soup), 'text_md': text_md,
                         'images': [abs_url(i.get('src')) for i in soup.select('.detail img, article img, .content img')
                                    if i.get('src')]})
        elif kind in ('category', 'blog_section'):
            links = sorted({abs_url(a.get('href')) for a in soup.select('.catalog_block .item a, .item-title a, '
                                                                          '.catalog_item a, .item_info a, .item-title a')
                            if a.get('href')})
            item.update({'text_md': text_md, 'item_links': links})
        else:
            item.update({'text_md': text_md})
        item['type'] = kind
        out[kind].append(item)

        body = item.get('description_md') or item.get('text_md') or ''
        meta = {k: v for k, v in item.items() if k not in ('text_md', 'description_md')}
        dst = md_path(kind, path, q)
        os.makedirs(long(os.path.dirname(dst)), exist_ok=True)
        with open(long(dst), 'w', encoding='utf-8', newline='\n') as f:
            f.write(front(meta))
            if kind == 'product' and item.get('specs'):
                f.write('## Характеристики\n\n| Параметр | Значение |\n|---|---|\n')
                for k, v in item['specs'].items():
                    f.write('| %s | %s |\n' % (k.replace('|', '/'), v.replace('|', '/')))
                f.write('\n')
            if kind == 'product' and body:
                f.write('## Описание\n\n')
            f.write(body + '\n')

    os.makedirs(os.path.join(ROOT, 'data'), exist_ok=True)
    names = {'product': 'products', 'article': 'articles', 'category': 'categories',
             'blog_section': 'blog_sections', 'page': 'pages'}
    for kind, items in out.items():
        json.dump(items, open(os.path.join(ROOT, 'data', names[kind] + '.json'), 'w', encoding='utf-8'),
                  ensure_ascii=False, indent=1)

    # таблица товаров для Excel: характеристики разворачиваем в колонки
    prods = out.get('product', [])
    spec_keys = defaultdict(int)
    for p in prods:
        for k in p['specs']:
            spec_keys[k] += 1
    spec_cols = [k for k, n in sorted(spec_keys.items(), key=lambda x: -x[1]) if n >= 3]
    with open(os.path.join(ROOT, 'data', 'products.csv'), 'w', encoding='utf-8-sig', newline='') as f:
        w = csv.writer(f, delimiter=';')
        w.writerow(['Название', 'Раздел', 'Цена, ₽', 'Наличие', 'Артикул', 'Архивирована', 'Адрес', 'Фото',
                    'Фото в архиве', 'Описание (знаков)'] + spec_cols)
        for p in prods:
            w.writerow([p['name'], ' / '.join(p['category_path']), p['price_rub'] or '', p['availability'] or '',
                        p['sku'] or '', p['archived_at'], p['url'], ' '.join(p['images']),
                        ' '.join(x for x in p.get('images_local') or [] if x),
                        len(p['description_md'] or '')] + [p['specs'].get(k, '') for k in spec_cols])

    for kind, items in sorted(out.items()):
        print('%-14s %d' % (kind, len(items)))


if __name__ == '__main__':
    main()
