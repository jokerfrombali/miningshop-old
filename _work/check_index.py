# -*- coding: utf-8 -*-
"""Проверяет, что все локальные ссылки оглавления ведут на существующие файлы."""
import os, re, urllib.parse

ROOT = r'D:\Projects\miningshop-archive'


def exists(rel):
    return os.path.exists('\\\\?\\' + os.path.join(ROOT, urllib.parse.unquote(rel).replace('/', os.sep)))


s = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
links = re.findall(r'href="([^"#]+)"', s)
local = [l for l in links if not l.startswith('http')]
bad = [l for l in local if not exists(l)]
print('ссылок: %d, локальных: %d, битых: %d' % (len(links), len(local), len(bad)))
for b in bad[:8]:
    print('  ', b)
