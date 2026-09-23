# -*- coding: utf-8 -*-
"""Добавляет товарам фото из карточек в списках разделов.

В разделах каталога у каждого товара есть превью. Если детальную картинку архив не
сохранил, превью из списка часто есть — привязываем его к товару по ссылке карточки.
"""
import collections, json, os, re, urllib.parse
from bs4 import BeautifulSoup

ROOT = r'D:\Projects\miningshop-archive'


def long(p):
    return '\\\\?\\' + os.path.abspath(p)


def norm(u):
    p = urllib.parse.urlsplit(u).path
    p = re.sub(r'^https?://(www\.)?miningshop\.ru', '', p)
    return urllib.parse.unquote(p).rstrip('/') + '/'


man = [json.loads(l) for l in open(os.path.join(ROOT, '_work', 'manifest.jsonl'), encoding='utf-8')]
local_img = {r['path']: r['local'] for r in man if r['status'] == 200 and r['mime'].startswith('image/')}
cats = json.load(open(os.path.join(ROOT, 'data', 'categories.json'), encoding='utf-8'))

previews = collections.defaultdict(list)
for c in cats:
    fn = os.path.join(ROOT, '_work', 'mirror_raw', c['local_copy'])
    if not os.path.exists(long(fn)):
        fn = os.path.join(ROOT, c['local_copy'])
    try:
        soup = BeautifulSoup(open(long(fn), 'rb').read().decode('utf-8', 'replace'), 'lxml')
    except OSError:
        continue
    for img in soup.find_all('img'):
        src = img.get('data-src') or img.get('data-original') or img.get('src') or ''
        if '/upload/' not in src:
            continue
        a = img.find_parent('a')
        if not a or not a.get('href'):
            continue
        path = urllib.parse.unquote(urllib.parse.urlsplit(src).path)
        loc = local_img.get(path)
        if loc and loc not in previews[norm(a['href'])]:
            previews[norm(a['href'])].append(loc)

prods = json.load(open(os.path.join(ROOT, 'data', 'products.json'), encoding='utf-8'))
added = 0
for p in prods:
    have = [x for x in p.get('images_local') or [] if x]
    extra = [x for x in previews.get(norm(p['url']), []) if x not in have]
    if extra:
        p['images_preview_local'] = extra
        added += 1
json.dump(prods, open(os.path.join(ROOT, 'data', 'products.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('товаров с превью из разделов: %d; всего товаров с хотя бы одним фото: %d из %d'
      % (added, sum(1 for p in prods if any(p.get('images_local') or []) or p.get('images_preview_local')), len(prods)))
