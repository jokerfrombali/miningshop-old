# -*- coding: utf-8 -*-
"""Ищет идентификаторы счётчиков аналитики в исходных копиях старых страниц."""
import json, os, re, collections

ROOT = r'D:\Projects\miningshop-archive'
PAT = re.compile(r'ym\(\s*(\d{6,10})|yaCounter(\d{6,10})|mc\.yandex\.ru/watch/(\d{6,10})')
GPAT = re.compile(r'\b(UA-\d{4,10}-\d{1,3}|G-[A-Z0-9]{6,12}|GTM-[A-Z0-9]{5,8})\b')


def long(p):
    return '\\\\?\\' + os.path.abspath(p)


recs = {}
for l in open(os.path.join(ROOT, '_work', 'manifest.jsonl'), encoding='utf-8'):
    r = json.loads(l)
    if r['status'] == 200 and r['mime'].startswith('text/html'):
        recs[r['local']] = r

ids = collections.defaultdict(lambda: [None, None, 0, None])
g = collections.Counter()
for loc, r in recs.items():
    s = None
    for base in (os.path.join(ROOT, '_work', 'mirror_raw', loc), os.path.join(ROOT, loc)):
        if os.path.exists(long(base)):
            s = open(long(base), 'rb').read().decode('utf-8', 'replace')
            break
    if s is None:
        continue
    ts = r['ts'][:8]
    for i in {x for m in PAT.finditer(s) for x in m.groups() if x}:
        e = ids[i]
        e[0] = min(e[0] or ts, ts); e[1] = max(e[1] or ts, ts); e[2] += 1
        if not e[3]:
            e[3] = r['orig']
    for x in set(GPAT.findall(s)):
        g[x] += 1

d = lambda t: '%s-%s-%s' % (t[:4], t[4:6], t[6:])
print('Счётчики Яндекс.Метрики на старом сайте:')
for i, (a, b, n, ex) in sorted(ids.items(), key=lambda x: -x[1][2]):
    print('  %-12s на %4d стр., снимки %s … %s' % (i, n, d(a), d(b)))
print('Google-коды:', g.most_common(6))
