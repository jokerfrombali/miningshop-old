# -*- coding: utf-8 -*-
"""Отмечает как уже переписанные те страницы, у которых есть исходная копия в mirror_raw/:
прошлые прогоны rewrite.py переписали их текущей версией кода."""
import json, os

ROOT = r'D:\Projects\miningshop-archive'
RAW = os.path.join(ROOT, '_work', 'mirror_raw')


def long(p):
    return '\\\\?\\' + os.path.abspath(p)


done = set()
for l in open(os.path.join(ROOT, '_work', 'manifest.jsonl'), encoding='utf-8'):
    r = json.loads(l)
    if r['status'] == 200 and (r['mime'].startswith('text/html') or r['mime'] == 'text/css'):
        if os.path.exists(long(os.path.join(RAW, r['local'].replace('/', os.sep)))):
            done.add(r['local'])
open(os.path.join(ROOT, '_work', 'rewrite_done.txt'), 'w', encoding='utf-8').write('\n'.join(sorted(done)) + '\n')
print('уже переписано:', len(done))
