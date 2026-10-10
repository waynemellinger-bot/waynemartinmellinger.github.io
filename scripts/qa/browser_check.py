#!/usr/bin/env python3
"""Browser checks for the BUILT site. Optional: needs Python Playwright and Chromium
(pip install playwright && playwright install chromium).

Run:  python3 -m http.server 8080 -d _site &   then   python3 scripts/qa/browser_check.py [screenshot-dir]

Checks, at 320, 375, 768, 1024 and 1440 px wide, on every kind of page:
  * no horizontal scrolling (page wider than the window)
  * no image covering text (the original mobile bug)
  * no JavaScript errors in the console, no failed requests to this site
Then: the phone menu (open, Escape closes and returns focus), the Writing page filters
(including the address), search, the old one-page addresses (/#poetry and so on),
and the Writing page with JavaScript switched off.
"""
import sys
from playwright.sync_api import sync_playwright

BASE = 'http://localhost:8080'
SHOTS = sys.argv[1] if len(sys.argv) > 1 else None
WIDTHS = [320, 375, 768, 1024, 1440]
PAGES = ['/', '/about/', '/about/biography/', '/about/portraits/', '/cv/', '/writing/', '/research/',
         '/community/', '/contact/', '/scholarship/', '/scholarship/publications/', '/scholarship/doing-modernity/',
         '/religion-philosophy/dionysian-naturalist/', '/public-writing/noozhawk/', '/creative-work/',
         '/creative-work/poetry/', '/creative-work/poetry/i-saw-the-best-souls-of-my-city/',
         '/creative-work/poetry/the-search-for-light/', '/scholarship/critical-interactionism/', '/topics/mental-health/',
         '/topics/', '/search/', '/writing/about-the-archive/', '/404.html']

OVERLAP_JS = """() => {
  const imgs = [...document.querySelectorAll('main img')].map(i => i.getBoundingClientRect()).filter(r => r.width && r.height);
  const texts = [...document.querySelectorAll('main p, main h1, main h2, main h3, main li, main dd, main dt')]
    .filter(el => !el.querySelector('img') && el.innerText.trim()).map(el => el.getBoundingClientRect());
  let hits = 0;
  for (const a of imgs) for (const b of texts) {
    const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
    const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
    if (x > 2 && y > 2) hits++;
  }
  return hits;
}"""

problems, passed = [], 0


def check(cond, msg):
    global passed
    if cond: passed += 1
    else: problems.append(msg)


with sync_playwright() as p:
    browser = p.chromium.launch()
    for w in WIDTHS:
        ctx = browser.new_context(viewport={'width': w, 'height': 900})
        page = ctx.new_page()
        errs = []
        # Failed loads are judged by the network listener below (this site only); external fonts may be unreachable offline.
        page.on('console', lambda m: errs.append(m.text) if m.type == 'error' and 'Failed to load resource' not in m.text else None)
        page.on('pageerror', lambda e: errs.append(str(e)))
        page.on('requestfailed', lambda r: errs.append('failed ' + r.url) if r.url.startswith(BASE) else None)
        for path in PAGES:
            errs.clear()
            page.goto(BASE + path, wait_until='load')
            page.wait_for_timeout(150)
            sw = page.evaluate('document.documentElement.scrollWidth')
            check(sw <= w, f'{path} at {w}px: page is {sw}px wide (horizontal scrolling)')
            check(page.evaluate(OVERLAP_JS) == 0, f'{path} at {w}px: an image overlaps text')
            check(not errs, f'{path} at {w}px: console/network errors: {errs[:3]}')
            if SHOTS and w in (375, 1440) and path in ('/', '/writing/', '/research/', '/about/', '/creative-work/poetry/i-saw-the-best-souls-of-my-city/', '/scholarship/doing-modernity/'):
                name = (path.strip('/').replace('/', '_') or 'home')
                page.screenshot(path=f'{SHOTS}/{name}-{w}.png', full_page=False)
        ctx.close()

    # Phone menu: opens, focus moves in, Escape closes and returns focus to the button.
    ctx = browser.new_context(viewport={'width': 375, 'height': 800}); page = ctx.new_page()
    page.goto(BASE + '/')
    btn = page.locator('.menu-button')
    check(btn.is_visible() and not page.locator('#site-nav').is_visible(), 'phone: menu button not shown or menu not collapsed')
    btn.focus(); page.keyboard.press('Enter'); page.wait_for_timeout(100)
    check(page.locator('#site-nav').is_visible() and btn.get_attribute('aria-expanded') == 'true', 'phone: menu does not open with Enter')
    check(page.evaluate("document.activeElement.closest('#site-nav') !== null"), 'phone: focus does not move into the menu')
    page.keyboard.press('Escape'); page.wait_for_timeout(100)
    check(not page.locator('#site-nav').is_visible() and page.evaluate("document.activeElement.classList.contains('menu-button')"), 'phone: Escape does not close the menu and return focus')
    if SHOTS:
        btn.click(); page.wait_for_timeout(100); page.screenshot(path=f'{SHOTS}/menu-open-375.png')
    ctx.close()

    # Writing page filters.
    page = browser.new_page(viewport={'width': 1280, 'height': 900})
    page.goto(BASE + '/writing/')
    total = page.locator('#work-list > li').count()
    vis = lambda: page.locator('#work-list > li:not([hidden])').count()
    check(vis() == total, 'filters: not all works shown initially')
    page.select_option('select[name=collection]', 'noozhawk'); page.wait_for_timeout(50)
    check(vis() == 133, f'filters: Noozhawk shows {vis()} works, expected 133')
    page.select_option('select[name=program]', 'none'); page.wait_for_timeout(50)
    check(vis() == 50, f'filters: Noozhawk with no program shows {vis()}, expected 50 (accepted baseline)')
    check('program=none' in page.url and 'collection=noozhawk' in page.url, 'filters: address not updated')
    page.select_option('select[name=program]', 'public-sociology-justice'); page.wait_for_timeout(50)
    check(vis() == 49, f'filters: Noozhawk in Public Sociology shows {vis()}, expected 49 (accepted baseline)')
    page.click('button[type=reset]'); page.wait_for_timeout(100)
    check(vis() == total, 'filters: Clear filters does not restore the full list')
    page.fill('input[name=q]', 'zimmerman'); page.wait_for_timeout(300)
    check(0 < vis() < total, f'filters: word search "zimmerman" shows {vis()}')
    page.fill('input[name=q]', 'qqqxyz'); page.wait_for_timeout(300)
    check(vis() == 0 and page.locator('#no-results').is_visible(), 'filters: no-results message missing')
    page.goto(BASE + '/writing/?type=poem'); page.wait_for_timeout(100)
    check(vis() == 18, f'filters: ?type=poem shows {vis()}, expected 18 (17 poems + The Ordeal)')
    page.goto(BASE + '/writing/?decade=199'); page.wait_for_timeout(100)
    check(vis() == 11, f'filters: 1990s shows {vis()}, expected 11')

    # Search (Pagefind).
    page.goto(BASE + '/search/?q=chumash'); page.wait_for_timeout(1500)
    n = page.locator('.pagefind-ui__result').count()
    check(n > 0, 'search: no results for "chumash"')
    page.goto(BASE + '/search/?q=garfinkel'); page.wait_for_timeout(1500)
    check(page.locator('.pagefind-ui__result').count() > 0, 'search: no results for "garfinkel"')

    # Old one-page addresses forward to their new pages.
    for old, new in [('/#poetry', '/creative-work/poetry/'), ('/#cv', '/cv/'), ('/#biography', '/about/biography/'),
                     ('/#gallery', '/about/portraits/'), ('/#contact', '/contact/'), ('/#projects', '/community/')]:
        page.goto(BASE + old); page.wait_for_timeout(300)
        check(page.url.endswith(new), f'old address {old} went to {page.url}, expected {new}')
    page.goto(BASE + '/index%20(1).html'); page.wait_for_timeout(500)
    check(page.url.rstrip('/') == BASE, f'/index (1).html went to {page.url}')

    # Without JavaScript the full list is visible and the filter form is hidden.
    ctx = browser.new_context(java_script_enabled=False); page = ctx.new_page()
    page.goto(BASE + '/writing/')
    check(page.locator('#work-list > li').count() == total and not page.locator('#filters').is_visible(), 'no-JS: list or form wrong')
    page.goto(BASE + '/'); page.set_viewport_size({'width': 375, 'height': 800})
    check(page.locator('#site-nav').is_visible(), 'no-JS: menu hidden on phone')
    ctx.close()
    browser.close()

print(f'{passed} checks passed.')
if problems:
    print(f'{len(problems)} problem(s):')
    for x in problems: print('  -', x)
    sys.exit(1)
print('No problems found.')
