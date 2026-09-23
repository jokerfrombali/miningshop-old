# -*- coding: utf-8 -*-
"""Второй проход: докачивает ресурсы, на которые ссылаются страницы, но которых
не было в индексе веб-архива под точным адресом.

Для каждого такого адреса просим у архива ближайший снимок (метка «2026»
без точного времени — архив сам уводит на ближайшую копию). Что найдётся —
ляжет в mirror/ и попадёт в manifest.jsonl, после чего rewrite.py надо
запустить ещё раз, чтобы ссылки стали локальными.
"""
import json, os, sys, urllib.parse, mimetypes
from concurrent.futures import ThreadPoolExecutor

ROOT = r'D:\Projects\miningshop-archive'
sys.path.insert(0, os.path.join(ROOT, '_work'))
import fetch  # noqa: E402

mimetypes.add_type('image/webp', '.webp')
mimetypes.add_type('font/woff2', '.woff2')

if __name__ == '__main__':
    miss = json.load(open(os.path.join(ROOT, '_work', 'missing.json'), encoding='utf-8'))
    plan = []
    for url, _n in miss:
        u = urllib.parse.urlsplit(url)
        mime = mimetypes.guess_type(u.path)[0] or 'application/octet-stream'
        plan.append(dict(orig=url, ts='2026', mime=mime, path=urllib.parse.unquote(u.path), query=u.query, length=0))
    json.dump(plan, open(os.path.join(ROOT, '_work', 'plan_missing.json'), 'w', encoding='utf-8'), ensure_ascii=False)
    print('в очереди второго прохода: %d' % len(plan))
