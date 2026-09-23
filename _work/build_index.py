# -*- coding: utf-8 -*-
"""Оглавление архива: index.html в корне репозитория.

Одна страница со всем, что удалось вытащить: товары по разделам, статьи блога,
разделы каталога и служебные страницы. Каждая строка ведёт на локальную копию
старой страницы в mirror/ и на её текст в content/.
"""
import html, json, os, urllib.parse
from collections import defaultdict

ROOT = r'D:\Projects\miningshop-archive'


def load(name):
    p = os.path.join(ROOT, 'data', name + '.json')
    return json.load(open(p, encoding='utf-8')) if os.path.exists(p) else []


def link(path):
    return urllib.parse.quote(path.replace('\\', '/'), safe='/._-~')


def md_link(item):
    import re, hashlib
    kind = item['type']
    u = urllib.parse.urlsplit(item['url'])
    slug = urllib.parse.unquote(u.path).strip('/').replace('/', '__') or 'index'
    slug = re.sub(r'[<>:"\\|?*]', '_', slug)
    slug = re.sub(r'[ .]+(?=__|$)', '', slug)
    if u.query:
        slug += '__' + hashlib.md5(u.query.encode()).hexdigest()[:8]
    if len(slug) > 150:
        slug = slug[:130] + '-' + hashlib.md5(slug.encode()).hexdigest()[:8]
    return 'content/%s/%s.md' % (kind, slug)


def row(item, extra=''):
    name = item.get('h1') or item.get('title') or item['url']
    return ('<tr><td><a href="%s">%s</a></td><td class="m">%s</td>%s'
            '<td class="m"><a href="%s">текст</a> · <a href="%s">архив</a></td></tr>'
            % (link(item['local_copy']), html.escape(name), item['archived_at'], extra,
               link(md_link(item)), html.escape(item['archive_url'])))


def main():
    prods, arts = load('products'), load('articles')
    cats, secs, pages = load('categories'), load('blog_sections'), load('pages')

    groups = defaultdict(list)
    for p in prods:
        cp = p.get('category_path') or []
        key = ' / '.join(cp[:2]) if cp else 'Без раздела'
        groups[key].append(p)

    parts = []
    parts.append('<h2 id="products">Товары — %d</h2>' % len(prods))
    for g in sorted(groups, key=lambda k: -len(groups[k])):
        items = sorted(groups[g], key=lambda x: (x.get('name') or ''))
        parts.append('<details><summary>%s <span class="m">%d</span></summary><table>'
                     '<tr><th>Модель</th><th>Снимок</th><th>Цена</th><th>Фото</th><th></th></tr>%s</table></details>'
                     % (html.escape(g), len(items), ''.join(
                         row(p, '<td class="m">%s</td><td class="m">%d</td>' % (
                             ('%s ₽' % format(int(p['price_rub']), ',').replace(',', ' ')) if p.get('price_rub') else '—',
                             len(p.get('images') or [])))
                         for p in items)))

    parts.append('<h2 id="articles">Статьи блога — %d</h2><table><tr><th>Статья</th><th>Снимок</th><th>Дата</th><th></th></tr>%s</table>'
                 % (len(arts), ''.join(row(a, '<td class="m">%s</td>' % (a.get('date') or '—'))
                                       for a in sorted(arts, key=lambda x: x.get('date') or '', reverse=True))))
    parts.append('<h2 id="categories">Разделы каталога — %d</h2><table><tr><th>Раздел</th><th>Снимок</th><th></th></tr>%s</table>'
                 % (len(cats), ''.join(row(c) for c in sorted(cats, key=lambda x: x['url']))))
    parts.append('<h2 id="blog">Разделы блога — %d</h2><table><tr><th>Раздел</th><th>Снимок</th><th></th></tr>%s</table>'
                 % (len(secs), ''.join(row(c) for c in sorted(secs, key=lambda x: x['url']))))
    parts.append('<h2 id="pages">Прочие страницы — %d</h2><table><tr><th>Страница</th><th>Снимок</th><th></th></tr>%s</table>'
                 % (len(pages), ''.join(row(c) for c in sorted(pages, key=lambda x: x['url']))))

    page = '''<!doctype html><html lang="ru"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Архив старого miningshop.ru</title>
<style>
body{font:15px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;max-width:1100px;margin:0 auto;padding:24px 16px;color:#1f2328;background:#fff}
h1{font-size:28px;margin:0 0 6px}h2{margin:36px 0 12px;font-size:21px;border-bottom:1px solid #d0d7de;padding-bottom:6px}
table{border-collapse:collapse;width:100%%;margin:8px 0 16px}td,th{padding:6px 8px;border-bottom:1px solid #eaeef2;text-align:left;vertical-align:top}
th{font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:#57606a}.m{color:#57606a;white-space:nowrap;font-size:13px}
a{color:#0969da;text-decoration:none}a:hover{text-decoration:underline}
details{margin:6px 0}summary{cursor:pointer;font-weight:600;padding:6px 0}
nav a{margin-right:14px}.lead{color:#57606a;margin:0 0 18px}
@media (prefers-color-scheme:dark){body{background:#0d1117;color:#e6edf3}a{color:#4493f8}td,th{border-color:#30363d}h2{border-color:#30363d}.m,th,.lead{color:#9198a1}}
</style></head><body>
<h1>Архив старого miningshop.ru</h1>
<p class="lead">Сайт на Битриксе, работавший до января 2026 года, восстановленный из веб-архива. %d товаров, %d статей, %d разделов каталога, %d прочих страниц.</p>
<nav><a href="#products">Товары</a><a href="#articles">Статьи</a><a href="#categories">Разделы</a><a href="#blog">Блог</a><a href="#pages">Страницы</a><a href="mirror/index.html">Главная старого сайта</a></nav>
%s
</body></html>''' % (len(prods), len(arts), len(cats), len(pages), ''.join(parts))
    open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8', newline='\n').write(page)
    print('index.html: товаров %d, статей %d, разделов %d, страниц %d' % (len(prods), len(arts), len(cats), len(pages)))


if __name__ == '__main__':
    main()
