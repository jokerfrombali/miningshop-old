# -*- coding: utf-8 -*-
"""Локальный приёмник: страница Метрики в браузере отправляет сюда POST с
текстом отчёта, а он пишется в analytics/metrika_raw/<имя>.tsv.

Слушает только 127.0.0.1 — снаружи недоступен.
"""
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import urlsplit, parse_qs

OUT = r'D:\Projects\miningshop-archive\analytics\metrika_raw'
os.makedirs(OUT, exist_ok=True)


class H(BaseHTTPRequestHandler):
    def _cors(self):
        self.send_header('Access-Control-Allow-Origin', 'https://metrika.yandex.ru')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Allow-Private-Network', 'true')

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_POST(self):
        name = parse_qs(urlsplit(self.path).query).get('name', ['report'])[0]
        name = ''.join(c for c in name if c.isalnum() or c in '-_')[:80] or 'report'
        body = self.rfile.read(int(self.headers.get('Content-Length', 0)))
        with open(os.path.join(OUT, name + '.tsv'), 'wb') as f:
            f.write(body)
        self.send_response(200)
        self._cors()
        self.end_headers()
        self.wfile.write(b'saved %d' % len(body))
        print('saved', name, len(body), flush=True)

    def log_message(self, *a):
        pass


HTTPServer(('127.0.0.1', 8765), H).serve_forever()
