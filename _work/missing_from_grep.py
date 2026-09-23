# -*- coding: utf-8 -*-
"""Строит очередь второго прохода из списка ссылок, которые rewrite.py увёл в веб-архив
(по ним не нашлось локального файла). Вход — вывод grep по mirror/."""
import collections, json, mimetypes, os, re, sys, urllib.parse

ROOT = r'D:\Projects\miningshop-archive'
mimetypes.add_type('image/webp', '.webp')
mimetypes.add_type('font/woff2', '.woff2')

cnt = collections.Counter()
for l in open(sys.argv[1], encoding='utf-8', errors='replace'):
    m = re.search(r'web\.archive\.org/web/2026im_/(https://miningshop\.ru/\S+)', l)
    if m:
        cnt[urllib.parse.unquote(m.group(1))] += 1

plan = []
for url, n in cnt.most_common():
    u = urllib.parse.urlsplit(url)
    plan.append(dict(orig=url, ts='2026', mime=mimetypes.guess_type(u.path)[0] or 'application/octet-stream',
                     path=u.path, query=u.query, length=0, refs=n))
json.dump(plan, open(os.path.join(ROOT, '_work', 'plan_missing.json'), 'w', encoding='utf-8'), ensure_ascii=False)
kinds = collections.Counter(p['mime'].split('/')[0] for p in plan)
print('уникальных недостающих ресурсов: %d, ссылок на них: %d' % (len(plan), sum(cnt.values())))
print('по типам:', dict(kinds))
