# -*- coding: utf-8 -*-
"""Сводка по счётчикам Метрики: на скольких страницах и в какие годы стоял каждый."""
import collections, json, os, re, sys

ROOT = r'D:\Projects\miningshop-archive'
RAW_PREFIX = os.path.normcase(os.path.join(ROOT, '_work', 'mirror_raw', 'mirror')) + os.sep
MIR_PREFIX = os.path.normcase(os.path.join(ROOT, 'mirror')) + os.sep

ts = {}
for l in open(os.path.join(ROOT, '_work', 'manifest.jsonl'), encoding='utf-8'):
    r = json.loads(l)
    if r['status'] == 200:
        ts[os.path.normcase(os.path.join(ROOT, r['local'].replace('/', os.sep)))] = r['ts'][:8]

pages = collections.defaultdict(set)
for f in sys.argv[1:]:
    for l in open(f, encoding='utf-8', errors='replace'):
        l = l.strip()
        m = re.search(r'(\d{6,10})$', l)
        if not m or '.html:' not in l:
            continue
        p = os.path.normcase(l.split('.html:')[0] + '.html')
        if p.startswith(RAW_PREFIX):
            p = MIR_PREFIX + p[len(RAW_PREFIX):]
        pages[m.group(1)].add(p)

fmt = lambda t: '%s-%s-%s' % (t[:4], t[4:6], t[6:])
for k, v in sorted(pages.items(), key=lambda x: -len(x[1])):
    d = sorted(ts[p] for p in v if p in ts)
    years = collections.Counter(t[:4] for t in d)
    print('%-10s на %4d страницах, снимки %s … %s, по годам: %s'
          % (k, len(v), fmt(d[0]), fmt(d[-1]), dict(sorted(years.items()))))
