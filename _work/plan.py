# -*- coding: utf-8 -*-
"""Составляет список того, что качаем из веб-архива.

Из 13 292 уникальных адресов выбрасываем мусорные дубли: utm-метки, сброс кеша
Битрикса, bxrand и прочие технические параметры. У одной страницы остаётся
одна копия — самый свежий снимок. Постраничная навигация (PAGEN_*) и
варианты товаров (oid) сохраняются: это разные страницы с разным содержимым.
"""
import json, urllib.parse, collections, re

KEEP_PARAMS = re.compile(r'^(PAGEN_\d+|oid|q|tags|SECTION_ID|ELEMENT_ID)$', re.I)
ADMIN = re.compile(r'^/(bitrix/admin|bitrix/tools|personal|auth|login|order/make|basket)', re.I)

L = json.load(open('latest.json', encoding='utf-8'))


def canon(orig):
    u = urllib.parse.urlsplit(orig)
    host = u.netloc.lower().split(':')[0]
    if host.startswith('www.'):
        host = host[4:]
    q = [(k, v) for k, v in urllib.parse.parse_qsl(u.query, keep_blank_values=True) if KEEP_PARAMS.match(k)]
    q.sort()
    path = urllib.parse.unquote(u.path) or '/'
    return host, path, urllib.parse.urlencode(q)


best = {}
for urlkey, (ts, orig, mime, ln) in L.items():
    host, path, q = canon(orig)
    if host != 'miningshop.ru':
        continue
    if ADMIN.match(path):
        continue
    key = (path, q)
    kind = mime.split(';')[0]
    cur = best.get(key)
    # предпочитаем https и более свежий снимок
    score = (ts, orig.startswith('https'))
    if cur is None or score > cur['score']:
        best[key] = dict(score=score, ts=ts, orig=orig, mime=kind, path=path, query=q, length=ln)

items = sorted(best.values(), key=lambda x: (not x['mime'].startswith('text/html'), x['path']))
for it in items:
    it.pop('score')
json.dump(items, open('plan.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)

c = collections.Counter(i['mime'] for i in items)
print('к загрузке: %d' % len(items))
for k, v in c.most_common(12):
    print('  %-32s %d' % (k, v))
