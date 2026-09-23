# -*- coding: utf-8 -*-
"""Загрузка исходных (без панели веб-архива) копий по plan.json.

Режим id_ отдаёт байты ровно такими, какими их сохранил архив. Загрузка
возобновляемая: готовые файлы пропускаются, прогресс пишется в manifest.jsonl.
"""
import json, os, sys, time, hashlib, threading, urllib.request, urllib.error, urllib.parse, http.client
from concurrent.futures import ThreadPoolExecutor

ROOT = r'D:\Projects\miningshop-archive'
MIRROR = os.path.join(ROOT, 'mirror')
MANIFEST = os.path.join(ROOT, '_work', 'manifest.jsonl')
WORKERS = int(os.environ.get('WORKERS', '4'))

lock = threading.Lock()
pause_until = [0.0]


def local_path(it):
    """Путь в зеркале. Страница -> <path>/index.html, запрос -> отдельный файл рядом."""
    path = it['path']
    parts = [p for p in path.split('/') if p]
    safe = []
    for p in parts:
        p = ''.join('_' if ch in '<>:"\\|?*' else ch for ch in p)
        # Windows не допускает пробел или точку в конце имени файла или папки
        p = p.rstrip(' .') or '_'
        if len(p) > 120:  # Windows и git плохо переносят очень длинные имена
            p = p[:100] + '-' + hashlib.md5(p.encode()).hexdigest()[:8]
        safe.append(p)
    is_html = it['mime'].startswith('text/html')
    if is_html:
        if safe and '.' in safe[-1] and safe[-1].rsplit('.', 1)[1].lower() in ('php', 'html', 'htm'):
            safe[-1] = safe[-1].rsplit('.', 1)[0]
        name = 'index.html'
        if it['query']:
            name = 'index__' + hashlib.md5(it['query'].encode()).hexdigest()[:10] + '.html'
        return os.path.join(MIRROR, *safe, name)
    if not safe:
        safe = ['_root']
    if it['query']:
        base, dot, ext = safe[-1].rpartition('.')
        tag = hashlib.md5(it['query'].encode()).hexdigest()[:8]
        safe[-1] = (base + '__' + tag + '.' + ext) if dot else (safe[-1] + '__' + tag)
    return os.path.join(MIRROR, *safe)


def long(p):
    return '\\\\?\\' + os.path.abspath(p) if os.name == 'nt' and not p.startswith('\\\\?\\') else p


_local = threading.local()


def session():
    """Одна сессия на поток: соединение переиспользуется, TLS не поднимается заново."""
    if not hasattr(_local, 's'):
        import requests
        s = requests.Session()
        s.headers['User-Agent'] = 'miningshop-archive-restore/1.0 (owner backup)'
        _local.s = s
    return _local.s


def get(url):
    """Архив сбрасывает часть соединений, поэтому на обрыв — короткий повтор,
    а общая пауза для всех потоков — только когда архив прямо просит сбавить темп."""
    import requests
    for attempt in range(10):
        wait = pause_until[0] - time.time()
        if wait > 0:
            time.sleep(wait)
        try:
            r = session().get(url, timeout=(15, 90))
            if r.status_code == 200:
                return 200, r.content
            if r.status_code == 404:
                return 404, b''
            if r.status_code in (429, 503):
                with lock:
                    pause_until[0] = max(pause_until[0], time.time() + 30)
                continue
            if r.status_code >= 500:
                time.sleep(3)
                continue
            return r.status_code, b''
        except requests.RequestException:
            _local.__dict__.pop('s', None)
            time.sleep(2 + attempt)
    return -1, b''


def work(it):
    dst = local_path(it)
    if os.path.exists(long(dst)):
        return None
    url = 'https://web.archive.org/web/%sid_/%s' % (it['ts'], it['orig'])
    status, body = get(url)
    rec = dict(orig=it['orig'], ts=it['ts'], mime=it['mime'], path=it['path'], query=it['query'],
               local=os.path.relpath(dst, ROOT).replace('\\', '/'), status=status, bytes=len(body))
    if status == 200 and body:
        try:
            os.makedirs(long(os.path.dirname(dst)), exist_ok=True)
            with open(long(dst), 'wb') as f:
                f.write(body)
        except OSError as e:
            rec['status'] = -2
            rec['error'] = str(e)
    with lock:
        with open(MANIFEST, 'a', encoding='utf-8') as f:
            f.write(json.dumps(rec, ensure_ascii=False) + '\n')
    return status


if __name__ == '__main__':
    plan = json.load(open(os.path.join(ROOT, '_work', sys.argv[1] if len(sys.argv) > 1 else 'plan.json'), encoding='utf-8'))
    done = set()
    if os.path.exists(MANIFEST):
        for l in open(MANIFEST, encoding='utf-8'):
            r = json.loads(l)
            if r['status'] in (200, 404):
                done.add((r['orig'], r['ts']))
    todo = [it for it in plan if (it['orig'], it['ts']) not in done]
    print('всего %d, осталось %d, потоков %d' % (len(plan), len(todo), WORKERS), flush=True)
    t0 = time.time(); n = 0; stats = {}
    with ThreadPoolExecutor(WORKERS) as ex:
        for st in ex.map(work, todo):
            n += 1
            stats[st] = stats.get(st, 0) + 1
            if n % 50 == 0:
                rate = n / (time.time() - t0)
                print('%d/%d  %.1f/с  осталось ~%d мин  %s' % (n, len(todo), rate, (len(todo) - n) / rate / 60, stats), flush=True)
    print('готово', stats, flush=True)
