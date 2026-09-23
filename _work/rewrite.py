# -*- coding: utf-8 -*-
"""Делает зеркало самодостаточным.

1. Ссылки на miningshop.ru (абсолютные и от корня) в HTML и CSS переписываются
   в относительные пути внутри mirror/, если такой файл выкачан. Если файла нет —
   ссылка уводится в веб-архив, чтобы по ней всё равно можно было перейти.
2. Счётчики и виджеты вырезаются: Метрика, Google Analytics, Jivo и т. п. Иначе
   каждый просмотр архивной копии засчитывался бы живому счётчику сайта.
3. Собирается список ресурсов, на которые страницы ссылаются, но которых нет
   в выгрузке, — для второго прохода (missing.json).

Запускать можно повторно: исходники сохраняются в mirror_raw/ при первом проходе.
"""
import json, os, re, shutil, sys, urllib.parse, posixpath
from collections import Counter

ROOT = r'D:\Projects\miningshop-archive'
MIRROR = os.path.join(ROOT, 'mirror')
RAW = os.path.join(ROOT, '_work', 'mirror_raw')

sys.path.insert(0, os.path.join(ROOT, '_work'))
from fetch import local_path, long  # noqa: E402

KEEP = re.compile(r'^(PAGEN_\d+|oid|q|tags|SECTION_ID|ELEMENT_ID)$', re.I)

# Признаки счётчиков и виджетов. Ищем их внутри каждого <script> отдельно:
# одна общая регулярка по всей странице на тяжёлых страницах Битрикса
# работала минутами из-за перебора с возвратами.
TRACKER_MARK = re.compile(r'mc\.yandex\.ru|ym\(\d+|yaCounter|googletagmanager|google-analytics|gtag\(|'
                          r'jivosite|jivo_|code\.jivo|top\.mail\.ru|top-fwz1|_tmr|fbq\(|vk\.com/rtrg|roistat|'
                          r'calltouch|bitrix24|b24-|callbackhunter|envybox|cackle', re.I)
SCRIPT = re.compile(r'<script\b[^>]*>.*?</script\s*>', re.I | re.S)
# пиксели: и обычный src, и ленивый data-src
PIXEL = re.compile(r'<img\b[^>]*(?:mc\.yandex\.ru|top-fwz1\.mail\.ru|facebook\.com/tr|vk\.com/rtrg)[^>]*>', re.I)


def strip_trackers(data):
    data = SCRIPT.sub(lambda m: '' if TRACKER_MARK.search(m.group(0)) else m.group(0), data)
    return PIXEL.sub('', data)


def load():
    recs = [json.loads(l) for l in open(os.path.join(ROOT, '_work', 'manifest.jsonl'), encoding='utf-8')]
    by_key, by_path, ts_of = {}, {}, {}
    for r in recs:
        if r['status'] != 200:
            continue
        loc = os.path.join(ROOT, r['local'].replace('/', os.sep))
        by_key[(r['path'], r['query'])] = loc
        # страница без параметров или первый вариант — запасной вариант для ссылок с мусорными параметрами
        if not r['query'] or r['path'] not in by_path:
            by_path[r['path']] = loc
        ts_of[r['path']] = r['ts']
    return recs, by_key, by_path, ts_of


def resolve(url, cur_page_path, by_key, by_path):
    """Возвращает (локальный файл или None, нормализованный путь, запрос)."""
    u = url.strip()
    if not u or u.startswith(('#', 'data:', 'mailto:', 'tel:', 'javascript:')):
        return None, None, None
    if u.startswith('//'):
        u = 'https:' + u
    m = re.match(r'^https?://(www\.)?miningshop\.ru(:\d+)?(/.*)?$', u, re.I)
    if m:
        u = m.group(3) or '/'
    elif re.match(r'^[a-z]+:', u, re.I):
        return None, None, None  # внешний ресурс
    elif not u.startswith('/'):
        u = posixpath.join(posixpath.dirname(cur_page_path.rstrip('/') + '/x'), u)
    parts = urllib.parse.urlsplit(u)
    path = posixpath.normpath(urllib.parse.unquote(parts.path)) if parts.path else '/'
    if parts.path.endswith('/') and not path.endswith('/'):
        path += '/'
    q = sorted((k, v) for k, v in urllib.parse.parse_qsl(parts.query, keep_blank_values=True) if KEEP.match(k))
    q = urllib.parse.urlencode(q)
    for cand in [(path, q), (path.rstrip('/') + '/', q), (path.rstrip('/'), q)]:
        if cand in by_key:
            return by_key[cand], path, q
    for cand in [path, path.rstrip('/') + '/', path.rstrip('/')]:
        if cand in by_path:
            return by_path[cand], path, q
    return None, path, q


ATTR = re.compile(r'''(?P<pre>\b(?:href|src|data-src|data-original|data-lazy|data-bg|poster|action|content)\s*=\s*)(?P<q>["'])(?P<url>[^"']*)(?P=q)''', re.I)
SRCSET = re.compile(r'''(?P<pre>\bsrcset\s*=\s*)(?P<q>["'])(?P<val>[^"']*)(?P=q)''', re.I)
CSSURL = re.compile(r'''url\(\s*(?P<q>["']?)(?P<url>[^)"']+)(?P=q)\s*\)''', re.I)


def rel(target, cur_file):
    r = os.path.relpath(target, os.path.dirname(cur_file)).replace('\\', '/')
    return urllib.parse.quote(r, safe='/._-~')


BASE_TAG = re.compile(r'<base\b[^>]*href\s*=\s*["\']([^"\']*)["\'][^>]*>', re.I)


def rewrite_file(fn, page_path, by_key, by_path, ts_of, missing, is_css=False):
    data = open(long(fn), 'rb').read().decode('utf-8', errors='replace')

    # Старая версия сайта (OpenCart, 2019) задавала <base href="https://miningshop.ru/">:
    # относительные ссылки там считаются от корня, а не от страницы. Учитываем это при
    # разборе, а сам тег убираем — после переписывания все пути относительны файла.
    if not is_css:
        mb = BASE_TAG.search(data)
        if mb:
            bm = re.match(r'^(?:https?:)?(?://(?:www\.)?miningshop\.ru)?(/.*)?$', mb.group(1).strip(), re.I)
            if bm:
                base_path = bm.group(1) or '/'
                page_path = base_path if base_path.endswith('/') else posixpath.dirname(base_path) + '/'
            data = BASE_TAG.sub('', data, count=1)

    def fix(url, want_asset=False):
        loc, path, q = resolve(url, page_path, by_key, by_path)
        if loc:
            return rel(loc, fn)
        if path is None:
            return url
        full = 'https://miningshop.ru' + path + (('?' + q) if q else '')
        if re.search(r'\.(jpe?g|png|gif|webp|svg|css|js|woff2?|ttf|eot|ico)$', path, re.I):
            missing[full] += 1
            return 'https://web.archive.org/web/2026im_/' + full
        if path.startswith(('/bitrix/', '/ajax/', '/local/')):
            return url
        return 'https://web.archive.org/web/2026/' + full

    if not is_css:
        data = strip_trackers(data)

        def attr(m):
            url = m.group('url')
            # content= трогаем только у og:image и подобных — это адреса картинок
            if m.group('pre').lower().startswith('content') and not re.match(r'^(https?:)?//|^/', url):
                return m.group(0)
            return m.group('pre') + m.group('q') + fix(url) + m.group('q')
        data = ATTR.sub(attr, data)

        def srcset(m):
            items = []
            for part in m.group('val').split(','):
                bits = part.strip().split()
                if bits:
                    bits[0] = fix(bits[0])
                items.append(' '.join(bits))
            return m.group('pre') + m.group('q') + ', '.join(items) + m.group('q')
        data = SRCSET.sub(srcset, data)

    data = CSSURL.sub(lambda m: 'url(%s%s%s)' % (m.group('q'), fix(m.group('url')), m.group('q')), data)
    open(long(fn), 'wb').write(data.encode('utf-8'))


def main():
    recs, by_key, by_path, ts_of = load()
    missing = Counter()
    todo = [r for r in recs if r['status'] == 200 and (r['mime'].startswith('text/html') or r['mime'] == 'text/css')]
    done_path = os.path.join(ROOT, '_work', 'rewrite_done.txt')
    done = set(open(done_path, encoding='utf-8').read().splitlines()) if os.path.exists(done_path) else set()
    done_f = open(done_path, 'a', encoding='utf-8')
    for n, r in enumerate(todo, 1):
        fn = os.path.join(ROOT, r['local'].replace('/', os.sep))
        raw_copy = os.path.join(RAW, r['local'].replace('/', os.sep))
        if r['local'] in done:
            continue
        if not os.path.exists(long(fn)) and not os.path.exists(long(raw_copy)):
            # файл не записался (конфликт «файл и папка с одним именем»), пропускаем
            continue
        if not os.path.exists(long(raw_copy)):
            os.makedirs(long(os.path.dirname(raw_copy)), exist_ok=True)
            shutil.copyfile(long(fn), long(raw_copy))
        else:
            shutil.copyfile(long(raw_copy), long(fn))  # повторный прогон — всегда от исходника
        rewrite_file(fn, r['path'], by_key, by_path, ts_of, missing, is_css=r['mime'] == 'text/css')
        done_f.write(r['local'] + '\n'); done_f.flush()
        if n % 500 == 0:
            print('  переписано %d/%d' % (n, len(todo)), flush=True)
    json.dump(missing.most_common(), open(os.path.join(ROOT, '_work', 'missing.json'), 'w', encoding='utf-8'),
              ensure_ascii=False, indent=0)
    print('готово: %d файлов, ресурсов не хватает: %d' % (len(todo), len(missing)))


if __name__ == '__main__':
    main()
