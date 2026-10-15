#!/usr/bin/env python3
"""Checks the BUILT site in _site/ for problems a visitor or a search engine would hit.

Run after `npm run build`:   python3 scripts/qa/check_site.py
Standard library only, so it also runs on GitHub's build machines. Exit code 1 on any error.

Errors (stop the deploy):
  broken internal links and #anchors, missing images/scripts/stylesheets, pages without
  exactly one <h1>, a <title>, a meta description or a canonical address, images without
  alt text, invalid structured data, duplicate ids on a page, sitemap entries that do not
  exist, indexable pages missing from the sitemap, noindex pages listed in it.
Warnings (reported, do not stop the deploy):
  duplicate titles or descriptions, skipped heading levels, pages nothing links to.
"""
import json
import os
import re
import sys
from collections import defaultdict
from html.parser import HTMLParser
from urllib.parse import urlparse, unquote

SITE = '_site'
BASE = 'https://waynemartinmellinger.com'
SKIP_DIRS = {'legacy', 'pagefind'}   # the preserved old page and the search index


class Page(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids, self.links, self.assets, self.headings = [], [], [], []
        self.title, self.desc, self.canonical, self.lang, self.robots = None, None, None, None, ''
        self.imgs_no_alt, self.jsonld, self._in_title, self._in_ld, self._buf = 0, [], False, False, ''

    def handle_starttag(self, tag, a):
        a = dict(a)
        if 'id' in a: self.ids.append(a['id'])
        if tag == 'html': self.lang = a.get('lang')
        if tag == 'a' and a.get('href'): self.links.append(a['href'])
        if tag in ('img', 'script') and a.get('src'): self.assets.append(a['src'])
        if tag == 'source' and a.get('srcset'):
            self.assets += [s.strip().split(' ')[0] for s in a['srcset'].split(',')]
        if tag == 'img':
            if 'srcset' in a: self.assets += [s.strip().split(' ')[0] for s in a['srcset'].split(',')]
            if 'alt' not in a: self.imgs_no_alt += 1
        if tag == 'link':
            if a.get('rel') == 'canonical': self.canonical = a.get('href')
            elif a.get('rel') in ('stylesheet', 'icon') and a.get('href'): self.assets.append(a['href'])
        if tag == 'meta':
            if a.get('name') == 'description': self.desc = a.get('content')
            if a.get('name') == 'robots': self.robots = a.get('content', '')
        if re.fullmatch(r'h[1-6]', tag): self.headings.append(int(tag[1]))
        if tag == 'title': self._in_title, self._buf = True, ''
        if tag == 'script' and a.get('type') == 'application/ld+json': self._in_ld, self._buf = True, ''

    def handle_endtag(self, tag):
        if tag == 'title' and self._in_title: self.title, self._in_title = self._buf.strip(), False
        if tag == 'script' and self._in_ld: self.jsonld.append(self._buf); self._in_ld = False

    def handle_data(self, d):
        if self._in_title or self._in_ld: self._buf += d


def url_of(path):
    rel = os.path.relpath(path, SITE).replace(os.sep, '/')
    if rel == 'index.html': return '/'
    if rel.endswith('/index.html'): return '/' + rel[:-len('index.html')]
    return '/' + rel


def target_file(url_path):
    p = unquote(url_path)
    if p.endswith('/'): p += 'index.html'
    f = os.path.join(SITE, p.lstrip('/'))
    if os.path.isdir(f): f = os.path.join(f, 'index.html')
    return f


def main():
    errors, warnings = [], []
    pages = {}
    for root, dirs, files in os.walk(SITE):
        rel = os.path.relpath(root, SITE).split(os.sep)[0]
        if rel in SKIP_DIRS: continue
        for f in files:
            if f.endswith('.html'):
                path = os.path.join(root, f)
                p = Page(); p.feed(open(path, encoding='utf-8').read())
                pages[url_of(path)] = p

    redirects = {u for u, p in pages.items() if 'noindex' in p.robots and p.title == 'Moved'}
    indexable = {u for u, p in pages.items() if 'noindex' not in p.robots}
    inbound = defaultdict(set)

    for u, p in pages.items():
        e = lambda m: errors.append(f'{u}: {m}')
        if u in redirects: continue
        if p.lang != 'en': e('missing lang="en"')
        if not p.title: e('missing <title>')
        if not p.desc: e('missing meta description')
        if not p.canonical: e('missing canonical link')
        elif u != '/404.html' and p.canonical != BASE + u: e(f'canonical {p.canonical} is not this page')
        if p.headings.count(1) != 1: e(f'has {p.headings.count(1)} <h1> elements (should be 1)')
        for a, b in zip(p.headings, p.headings[1:]):
            if b > a + 1: warnings.append(f'{u}: heading jumps from h{a} to h{b}'); break
        if p.imgs_no_alt: e(f'{p.imgs_no_alt} image(s) without alt text')
        dup = {i for i in p.ids if p.ids.count(i) > 1}
        if dup: e(f'duplicate ids: {", ".join(sorted(dup))[:200]}')
        for ld in p.jsonld:
            try:
                d = json.loads(ld)
                if '@context' not in d: e('structured data without @context')
            except ValueError as x:
                e(f'invalid structured data: {x}')
        for href in p.links:
            parsed = urlparse(href)
            if parsed.scheme in ('http', 'https', 'mailto', 'tel') and parsed.netloc != 'waynemartinmellinger.com':
                continue
            path = parsed.path or u
            if not path.startswith('/'): path = os.path.dirname(u.rstrip('/') + '/x') + '/' + path
            tf = target_file(path)
            target_url = url_of(tf) if os.path.exists(tf) else None
            if path.startswith('/legacy/'):
                if not os.path.exists(tf): e(f'link to missing {href}')
                continue
            if not os.path.exists(tf):
                e(f'broken link {href}'); continue
            inbound[target_url].add(u)
            if parsed.fragment and tf.endswith('.html'):
                tp = pages.get(target_url)
                if tp is not None and parsed.fragment not in tp.ids:
                    e(f'link {href} points to a missing #anchor')
        for src in p.assets:
            parsed = urlparse(src)
            if parsed.scheme in ('http', 'https'): continue
            if not os.path.exists(target_file(parsed.path)): e(f'missing file {src}')

    # Sitemap
    sm = open(os.path.join(SITE, 'sitemap.xml'), encoding='utf-8').read()
    locs = re.findall(r'<loc>(.*?)</loc>', sm)
    listed = set()
    for loc in locs:
        path = loc.replace(BASE, '')
        listed.add(path)
        if not os.path.exists(target_file(path)): errors.append(f'sitemap: {loc} does not exist')
        elif path in pages and 'noindex' in pages[path].robots: errors.append(f'sitemap: {loc} is noindex')
    for u in sorted(indexable - listed - {'/404.html'}):
        errors.append(f'sitemap: indexable page {u} is missing')
    if len(locs) != len(set(locs)): errors.append('sitemap: duplicate entries')

    # Duplicates and orphans
    for key, label in (('title', 'title'), ('desc', 'description')):
        seen = defaultdict(list)
        for u in indexable: seen[getattr(pages[u], key)].append(u)
        for v, us in seen.items():
            if len(us) > 1: warnings.append(f'duplicate {label} on {", ".join(sorted(us))}')
    for u in sorted(indexable - {'/', '/404.html'}):
        if not (inbound[u] - {u}): warnings.append(f'orphan: nothing links to {u}')

    print(f'Checked {len(pages)} pages ({len(indexable)} indexable, {len(redirects)} redirects), {len(locs)} sitemap entries.')
    for w in warnings: print(f'  note: {w}')
    if errors:
        print(f'\n{len(errors)} problem(s):')
        for x in errors: print(f'  - {x}')
        sys.exit(1)
    print('No problems found.')


if __name__ == '__main__':
    main()
