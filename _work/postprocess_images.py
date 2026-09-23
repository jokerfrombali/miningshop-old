# -*- coding: utf-8 -*-
"""Подставляет товарам уменьшенные копии фото, если полноразмерных в архиве нет.

Галерея Битрикса ссылается на оригинал /upload/iblock/<dir>/<файл>, а на самой
странице показывает копию из /upload/resize_cache/iblock/<dir>/<размер>/<файл>.
Веб-архив чаще сохранял именно показанную копию. Берём самую крупную из доступных.
"""
import csv, collections, json, os, re, urllib.parse

ROOT = r'D:\Projects\miningshop-archive'


def size_of(path):
    m = re.search(r'/(\d+)_(\d+)_', path)
    return int(m.group(1)) * int(m.group(2)) if m else 10 ** 9  # оригинал — самый крупный


man = [json.loads(l) for l in open(os.path.join(ROOT, '_work', 'manifest.jsonl'), encoding='utf-8')]
local_by_path = {}
by_key = collections.defaultdict(list)  # (подпапка iblock, имя файла) -> пути
for r in man:
    if r['status'] == 200 and r['mime'].startswith('image/'):
        local_by_path[r['path']] = r['local']
        m = re.search(r'/iblock/([^/]+)/(?:[^/]+/)*([^/]+)$', r['path'])
        if m:
            by_key[(m.group(1), m.group(2))].append(r['path'])

prods = json.load(open(os.path.join(ROOT, 'data', 'products.json'), encoding='utf-8'))
filled = 0
for p in prods:
    loc = []
    for u in p.get('images') or []:
        path = urllib.parse.unquote(urllib.parse.urlsplit(u).path)
        l = local_by_path.get(path)
        if not l:
            m = re.search(r'/iblock/([^/]+)/(?:[^/]+/)*([^/]+)$', path)
            cands = by_key.get((m.group(1), m.group(2))) if m else None
            if cands:
                l = local_by_path[max(cands, key=size_of)]
                filled += 1
        loc.append(l)
    p['images_local'] = loc
json.dump(prods, open(os.path.join(ROOT, 'data', 'products.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# переписываем CSV
spec_keys = collections.Counter(k for p in prods for k in p['specs'])
spec_cols = [k for k, n in spec_keys.most_common() if n >= 3]
with open(os.path.join(ROOT, 'data', 'products.csv'), 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f, delimiter=';')
    w.writerow(['Название', 'Раздел', 'Цена, ₽', 'Наличие', 'Артикул', 'Архивирована', 'Адрес', 'Фото',
                'Фото в архиве', 'Описание (знаков)'] + spec_cols)
    for p in prods:
        w.writerow([p['name'], ' / '.join(p['category_path']), p['price_rub'] or '', p['availability'] or '',
                    p['sku'] or '', p['archived_at'], p['url'], ' '.join(p['images']),
                    ' '.join(x for x in p['images_local'] if x),
                    len(p['description_md'] or '')] + [p['specs'].get(k, '') for k in spec_cols])

# обновляем строку images_local в метаданных markdown-файлов товаров
by_copy = {p['local_copy']: p for p in prods}
n_md = 0
mddir = os.path.join(ROOT, 'content', 'product')
for fn in os.listdir(mddir):
    full = os.path.join(mddir, fn)
    s = open(full, encoding='utf-8').read()
    m = re.search(r'^local_copy: "([^"]+)"$', s, re.M)
    if not m or m.group(1) not in by_copy:
        continue
    line = 'images_local: ' + json.dumps(by_copy[m.group(1)]['images_local'], ensure_ascii=False)
    if re.search(r'^images_local: .*$', s, re.M):
        s = re.sub(r'^images_local: .*$', lambda _: line, s, count=1, flags=re.M)
    else:
        s = s.replace('\n---\n', '\n' + line + '\n---\n', 1)
    open(full, 'w', encoding='utf-8', newline='\n').write(s)
    n_md += 1

with_photo = sum(1 for p in prods if any(p['images_local']))
print('подставлено уменьшенных копий: %d; товаров с фото в архиве: %d из %d; обновлено md: %d'
      % (filled, with_photo, len(prods), n_md))
