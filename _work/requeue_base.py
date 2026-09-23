# -*- coding: utf-8 -*-
"""Снимает с отметки «переписано» страницы с тегом <base>, чтобы rewrite.py обработал их заново."""
import os, sys

ROOT = r'D:\Projects\miningshop-archive'
prefix = os.path.join(ROOT, '_work', 'mirror_raw') + os.sep
lst = sys.argv[1]
redo = set()
for l in open(lst, encoding='utf-8', errors='replace'):
    l = l.strip()
    if l.startswith(prefix):
        redo.add(l[len(prefix):].replace(os.sep, '/'))
done_path = os.path.join(ROOT, '_work', 'rewrite_done.txt')
done = [x for x in open(done_path, encoding='utf-8').read().splitlines() if x]
keep = [x for x in done if x not in redo]
open(done_path, 'w', encoding='utf-8').write('\n'.join(keep) + '\n')
print('в очереди на повтор: %d, осталось отмеченных: %d' % (len(done) - len(keep), len(keep)))
