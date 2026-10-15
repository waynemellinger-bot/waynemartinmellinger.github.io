#!/usr/bin/env python3
"""One-time migration: the previous single-page site -> structured records.

Run once on October 7, 2026 to create:
  src/_data/works/doing-modernity.yml
  src/_data/works/dionysian-naturalist.yml
  src/_data/works/wild-flesh.yml
  src/_data/works/poetry.yml

It is kept in the repository as a record of HOW those files were derived, so
any record can be traced back to the previous site. Do not re-run it: the
records it produced are now edited by hand, and re-running would overwrite them.

Rules it follows (see docs/IMPLEMENTATION-REPORT.md):
  * Titles, URLs, dates and Wayne's own annotations are copied exactly.
  * A date is never invented. When the previous site gave only a year and the
    post address carries the same year plus a month, the month is taken from
    the address and the record says so in its `note`.
  * Programs come ONLY from Wayne's own section headings on the previous site
    (classification_basis: grouping), and are always draft. A heading that does
    not name a program assigns none.
  * The Noozhawk records are not touched.

Usage: python3 scripts/migration/extract-legacy.py legacy/index.html
"""
import re
import sys
import html as htmllib
from pathlib import Path

import yaml
from bs4 import BeautifulSoup

SRC = Path(sys.argv[1] if len(sys.argv) > 1 else 'legacy/index.html')
OUT = Path('src/_data/works')
MONTHS = {m: i + 1 for i, m in enumerate(
    ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'])}
LONG_MONTHS = {m: i + 1 for i, m in enumerate(
    ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
     'september', 'october', 'november', 'december'])}
SOURCE = 'Previous site (waynemartinmellinger.com, single page), migrated 2026-10-07'

# Wayne's headings on the previous site -> (collection, series name, programs).
# A programs list is filled only where Wayne's own heading names the program.
HEADINGS = {
    'I. Overviews & Theoretical Frameworks': ('doing-modernity', 'I. Overviews & Theoretical Frameworks', ['interaction-emca']),
    'II. Founders & First-Generation Figures': ('doing-modernity', 'II. Founders & First-Generation Figures', ['interaction-emca']),
    'III. Institutional Sites & Applied Work': ('doing-modernity', 'III. Institutional Sites & Applied Work', ['interaction-emca']),
    'IV. The Second Santa Barbara School': ('doing-modernity', 'IV. The Second Santa Barbara School', ['interaction-emca']),
    'V. Critical Interactionism & Normative Questions': ('doing-modernity', 'V. Critical Interactionism & Normative Questions', ['critical-interactionism']),
    'Also on Doing Modernity': ('doing-modernity', 'Also on Doing Modernity', []),
    'Doing Modernity — Sociology of Homelessness & Abandonment': ('doing-modernity', 'Sociology of Homelessness & Abandonment', ['homelessness-abandonment']),
    'Doing Modernity — Workplace Studies & Applied EM/CA': ('doing-modernity', 'Workplace Studies & Applied EM/CA', ['interaction-emca']),
    'Doing Modernity — Human-AI Interaction': ('doing-modernity', 'Human-AI Interaction', []),
    'Doing Modernity — Media, Politics & Other Essays': ('doing-modernity', 'Media, Politics & Other Essays', []),
    'The Dionysian Naturalist — Annotated Bibliography (2014–2025)': ('dionysian-naturalist', 'Annotated Bibliography (2014–2025)', ['religious-dionysian-naturalism']),
    'Also on The Dionysian Naturalist': ('dionysian-naturalist', 'Also on The Dionysian Naturalist', []),
    'Wild Flesh — Critical Drug Studies': ('wild-flesh', 'Critical Drug Studies', ['critical-drug-studies']),
}
VENUE = {'doing-modernity': 'Doing Modernity', 'dionysian-naturalist': 'The Dionysian Naturalist', 'wild-flesh': 'Wild Flesh'}
PREFIX = {'doing-modernity': 'dm', 'dionysian-naturalist': 'dn', 'wild-flesh': 'wf'}


def clean(s):
    return re.sub(r'\s+', ' ', htmllib.unescape(s or '')).strip()


def slug(s, n=60):
    s = re.sub(r'[‘’“”"\']', '', s.lower())
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:n].rstrip('-')


def url_date(url):
    m = re.search(r'/(\d{4})/(\d{2})/', url or '')
    return (m.group(1), m.group(2)) if m else None


def parse_date(label, url):
    """Returns (date, date_display, note) without inventing anything."""
    label = clean(label)
    ud = url_date(url)
    m = re.fullmatch(r'([A-Za-z]{3}) (\d{4})', label)
    if m:
        return f'{m.group(2)}-{MONTHS[m.group(1).lower()]:02d}', None, None
    m = re.fullmatch(r'(\d{4})', label)
    if m:
        y = m.group(1)
        if ud and ud[0] == y:
            return f'{y}-{ud[1]}', None, 'Month taken from the post address; the previous site gave the year only.'
        if ud:
            return y, None, f'The post address is dated {ud[0]}-{ud[1]}; the year {y} is as Wayne listed it.'
        return y, None, None
    m = re.fullmatch(r'(\d{4})[–-](\d{2})', label)           # 2015–16
    if m:
        note = f'Published in parts, {label}.'
        if ud:
            note += f' The post address is dated {ud[0]}-{ud[1]}.'
        return m.group(1), label, note
    m = re.fullmatch(r'(\d{4})/(\d{2})', label)               # 2008/24
    if m:
        return m.group(1), None, None
    if label in ('—', '-', ''):
        if ud:
            return f'{ud[0]}-{ud[1]}', None, 'Date taken from the post address; the previous site gave none.'
        return None, None, 'Undated on the previous site.'
    raise ValueError(f'unrecognised date label {label!r}')


def main():
    soup = BeautifulSoup(SRC.read_text(encoding='utf-8'), 'html.parser')
    records = {c: [] for c in VENUE}
    by_url, by_title = {}, {}
    seen_ids = set()

    for sec_id in ('sociology', 'religion-philosophy'):
        section = soup.find('section', id=sec_id)
        current = None
        for el in section.find_all(['div', 'p']):
            classes = el.get('class') or []
            if 'eyebrow' in classes:
                current = HEADINGS.get(clean(el.get_text()))
                continue
            if current is None or not ({'writing-item', 'annot-item'} & set(classes)):
                continue
            coll, series, programs = current
            if 'annot-item' in classes:
                label = el.select_one('.annot-year').get_text()
                t = el.select_one('.annot-title')
                desc = clean(el.select_one('.annot-desc').get_text()) if el.select_one('.annot-desc') else None
                extra = None
            else:
                label = el.select_one('.writing-date').get_text()
                t = el.select_one('.writing-title')
                desc = None
                extra = clean(el.select_one('.writing-venue').get_text()) if el.select_one('.writing-venue') else None
            a = t.find('a')
            url = a['href'] if a else None
            title = clean(t.get_text())

            # The same essay listed under two of Wayne's headings becomes one record.
            key_title = slug(title, 200)
            existing = by_url.get(url) if url else None
            if existing is None:
                for k, rec in by_title.items():
                    if rec['_coll'] == coll and (k.startswith(key_title) or key_title.startswith(k)) and min(len(k), len(key_title)) > 20:
                        existing = rec
                        break
            if existing is not None:
                if series not in existing['series']:
                    existing['series'].append(series)
                for p in programs:
                    if p not in existing.setdefault('programs', []):
                        existing['programs'].append(p)
                if url and 'url' not in existing:
                    existing['url'] = url
                if desc and not existing.get('description'):
                    existing['description'] = desc
                if len(title) > len(existing['title']):
                    existing['title'] = title
                continue

            date, display, note = parse_date(label, url)
            rid = f'{PREFIX[coll]}-{slug(title)}'
            n = 2
            while rid in seen_ids:
                rid = f'{PREFIX[coll]}-{slug(title)}-{n}'; n += 1
            seen_ids.add(rid)
            rec = {'_coll': coll, 'id': rid, 'title': title}
            if date: rec['date'] = date
            if display: rec['date_display'] = display
            rec['venue'] = VENUE[coll]
            rec['type'] = 'essay'
            if url: rec['url'] = url
            rec['status'] = 'published' if url else 'unverified'
            rec['series'] = [series]
            if desc: rec['description'] = desc
            if programs:
                rec['programs'] = list(programs)
            notes = [x for x in [note] if x]
            if extra and extra not in VENUE.values():
                notes.append(f'Listed on the previous site as: {extra}.')
            if not url:
                notes.append('No link on the previous site; publication not yet confirmed.')
            if notes: rec['note'] = ' '.join(notes)
            rec['source'] = SOURCE
            records[coll].append(rec)
            by_title[key_title] = rec
            if url: by_url[url] = rec

    for coll, recs in records.items():
        out = []
        for r in recs:
            r.pop('_coll')
            if r.get('programs'):
                r['programs_status'] = 'draft'
                r['classification_basis'] = 'grouping'
            # stable key order
            order = ['id', 'title', 'date', 'date_display', 'venue', 'type', 'url', 'status', 'series',
                     'description', 'programs', 'programs_status', 'classification_basis', 'note', 'source']
            out.append({k: r[k] for k in order if k in r})
        write(OUT / f'{coll}.yml', out, f'{VENUE[coll]}: works listed on the previous site, migrated 2026-10-07.')

    write(OUT / 'poetry.yml', poems(soup), 'Poems from Moments of Awe Punctuated by the Mundane (2025), full text as on the previous site.')


def poem_date(meta):
    m = re.search(r'(\d{1,2}) ([A-Z][a-z]+) (\d{4})', meta)
    if m and m.group(2).lower() in LONG_MONTHS:
        return f'{m.group(3)}-{LONG_MONTHS[m.group(2).lower()]:02d}-{int(m.group(1)):02d}'
    m = re.search(r'([A-Z][a-z]+) (\d{4})', meta)
    if m and m.group(1).lower() in LONG_MONTHS:
        return f'{m.group(2)}-{LONG_MONTHS[m.group(1).lower()]:02d}'
    m = re.search(r'\b(\d{4})\b', meta)
    return m.group(1)


def poems(soup):
    out = []
    for i, entry in enumerate(soup.select('#poetry .poem-entry')):
        title = clean(entry.select_one('.poem-entry-title').get_text())
        meta_el = entry.select_one('.poem-entry-meta')
        meta_lines = [clean(BeautifulSoup(x, 'html.parser').get_text()) for x in re.split(r'<br\s*/?>', meta_el.decode_contents())]
        meta_lines = [m for m in meta_lines if m]
        blocks = []
        for b in entry.select_one('.poem').find_all('div', recursive=False):
            if 'poem-section-label' in (b.get('class') or []):
                blocks.append({'section': clean(b.get_text())})
            else:
                lines = [clean(BeautifulSoup(x, 'html.parser').get_text()) for x in re.split(r'<br\s*/?>', b.decode_contents())]
                blocks.append({'stanza': '\n'.join(lines)})
        out.append({
            'id': f'poem-{slug(title, 50)}',
            'title': title,
            'date': poem_date(meta_lines[0]),
            'meta': meta_lines,
            'venue': 'Moments of Awe Punctuated by the Mundane',
            'type': 'poem',
            'status': 'published',
            'page': f'/creative-work/poetry/{slug(title, 50)}/',
            'order': i + 1,
            'source': SOURCE,
            'text': blocks,
        })
    return out


class Dumper(yaml.SafeDumper):
    pass


def _str(dumper, s):
    # Multi-line text (poem stanzas) as literal blocks; everything else through the
    # normal representer, which quotes values such as '2025-11' so YAML keeps them as text.
    if '\n' in s:
        return dumper.represent_scalar('tag:yaml.org,2002:str', s, style='|')
    return yaml.SafeDumper.represent_str(dumper, s)


Dumper.add_representer(str, _str)


def write(path, data, header):
    body = yaml.dump(data, Dumper=Dumper, allow_unicode=True, sort_keys=False, width=10000)
    path.write_text(f'# {header}\n# Created by scripts/migration/extract-legacy.py; edit by hand from now on.\n' + body, encoding='utf-8')
    print(f'{path}: {len(data)} records')


if __name__ == '__main__':
    main()
