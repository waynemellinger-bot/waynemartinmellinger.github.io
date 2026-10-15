# Site audit and repairs — October 14, 2026

Branch `site-repairs-2026-10-14`, built on `archive-rebuild` (the October 8 rebuild, already in
pull request #1). Nothing here is merged or published.

## 1. Diagnosis

### Mobile biography photograph

**Cause.** On the live single-page site the portrait's container (`.intro-figure`) is
`position: sticky; top: 120px`. That was meant for the desktop two-column layout, where the photo
stays in view beside the long biography. Below about 820px the layout drops to one column, but
the sticky rule stays on, so the photo pins itself under the header and the biography scrolls
up *beneath* it. Reproduced in Chromium at 375, 390 and 430px wide
(`screenshots/2026-10-14/before-*.jpg`): the photo covers the heading, the role list and the
first lines of the biography.

**Why it was still live.** A fix was written on October 1 (commit `385ee90`) but only on the
`archive-rebuild` branch, which has never been merged. The live site still serves `main`
commit `a05e5c7` (July 21) — confirmed from the repository's GitHub Pages deployment log.

**Fix.** In the new site the portrait is in normal page flow on every page that shows it (home,
About), never sticky, fixed or absolutely positioned. On phones it now sits above the text,
centred, at most 15rem (240px) wide, with the heading and opening lines visible on the first
screen. Desktop keeps the side-by-side layout. The photo is kept, not hidden.

### Continuous-scroll architecture

**Cause.** The multipage site was built (Oct 1–8) and pushed to GitHub on Oct 9 as branch
`archive-rebuild`, with pull request #1 open. It was never merged, and GitHub Pages is still set to
publish `main` directly. So the redesign exists, complete and tested, but has never been deployed.
This session reused it rather than rebuilding.

**What was still missing** against the agreed list of destinations: Philosophy and Prayers had no
pages of their own (prayers were a section of Creative Work), and the menu had six general entries
(About, Writing, Research, Community, Contact, Search) rather than the agreed areas. Now added and
renamed — see the site map below.

### Publication links

**Cause.** The October rebuild copied the bibliography exactly as it stood on the old page, where
only one item (the PhilArchive book) had a link, and the John Henry Adams article had never been
listed. Details in `PUBLICATION-AUDIT.md`.

## 2. Site map

```
/                                  Home — introduction and doorways
├── /about/                        About
│   ├── /about/biography/          Biography
│   ├── /about/portraits/          Portraits
│   └── /cv/                       CV
├── /scholarship/                  Sociology                          (menu: Sociology)
│   ├── /scholarship/publications/ Scholarly Publications             (menu: Publications)
│   ├── /scholarship/doing-modernity/   Doing Modernity essays
│   ├── /scholarship/wild-flesh/        Wild Flesh essays
│   └── 4 bodies-of-work pages (Critical Interactionism, EMCA, Homelessness, Critical Drug Studies)
├── /philosophy/                   Philosophy                    NEW  (menu: Philosophy)
├── /religion-philosophy/          Theology & Religious Naturalism    (menu: Theology)
│   ├── /religion-philosophy/dionysian-naturalist/
│   └── /religion-philosophy/religious-and-dionysian-naturalism/
├── /creative-work/                Poetry & Creative Work
│   └── /creative-work/poetry/     Poems, each with its own page      (menu: Poetry)
├── /prayers/                      Prayers & Spiritual Writings  NEW  (menu: Prayers)
├── /public-writing/               Public Scholarship & Media         (menu: Public Scholarship)
│   ├── /public-writing/noozhawk/  133 Noozhawk columns
│   └── /public-writing/public-sociology/
├── /community/                    Community work (footer, and linked from Public Scholarship)
├── /research/                     Research and current projects (footer, Sociology)
├── /writing/                      Every work, filterable; /writing/about-the-archive/
├── /topics/  + 19 topic pages
├── /contact/                      Contact                            (menu: Contact)
├── /search/                       Search                             (menu: Search)
└── /legacy/                       The previous one-page site, preserved, hidden from search engines
```

Menu (all widths): Home · About · Sociology · Philosophy · Theology · Poetry · Prayers ·
Publications · Public Scholarship · Contact · Search. Phones and tablets get a Menu button.

**URL continuity.** The only addresses ever live are `/`, the old section anchors (`/#poetry`,
`/#prayers` and so on) and the accidental `/index (1).html`. All forward to their new pages
(`src/assets/js/legacy-anchors.js`, `src/_data/redirects.yml`); `#prayers` now goes to `/prayers/`.
Paths of the unpublished rebuild were kept unchanged, including the accepted Noozhawk and program
paths, so `/religion-philosophy/` now carries the title "Theology & Religious Naturalism" and
`/scholarship/` the title "Sociology" (see decisions, below).

## 3. Content accounting

Every titled item on the previous page was matched by script to a record or page in the new site.

| Previous section | Items | New location | Not matched, and why |
| --- | --- | --- | --- |
| Biography | full text | `/about/biography/` (unchanged text); opening paragraph also on home and About | — |
| Sociology | 62 works | `/scholarship/publications/`, `/scholarship/doing-modernity/`, `/scholarship/wild-flesh/`; books in progress on `/research/` | "EM/CA at Xerox PARC" is the short title of the Doing Modernity record "Ethnomethodology and Conversation Analysis at Xerox PARC…"; *Abandonment in Real Time* (book in progress) is on `/research/` (subtitle conflict, decision A4) |
| Religion & Philosophy | 51 works | `/religion-philosophy/dionysian-naturalist/`, `/scholarship/wild-flesh/`; selections on `/philosophy/` | — |
| Public Writing | 14 listed + link to archive | `/public-writing/noozhawk/` (all 133 columns) | — |
| Poetry | 17 poems | `/creative-work/poetry/`, one page per poem | — |
| Prayers | 2 works + 3 named | `/prayers/` | Three prayer-poems named but never on the site; still named on `/prayers/` (decision B9) |
| Gallery | portraits | `/about/portraits/` | — |
| Projects & Community | roles | `/community/` | — |
| CV | full CV | `/cv/` | — |

New since the previous page: 1 publication (John Henry Adams), and 119 Noozhawk columns the old
page did not list.

## 4. Publication-link audit

See `PUBLICATION-AUDIT.md`: 14 records, 5 linked (3 publisher/DOI, 2 PhilArchive), 8
unresolved and left unlinked rather than guessed, 1 added and labelled unconfirmed.

## 5. Testing report

Run on the built site in Chromium (Playwright), 2026-10-14.

| Check | Result |
| --- | --- |
| Record validation (`npm run validate`), incl. new check that every Philosophy/Prayers id exists | Pass: 258 works, 10 projects |
| Built-site check (`scripts/qa/check_site.py`): internal links and anchors, titles, descriptions, canonical URLs, headings, image alt text, structured data, sitemap | Pass: 67 pages, 65 sitemap entries, no problems |
| Browser check (`scripts/qa/browser_check.py`) at 320, 375, 390, 430, 768, 1024, 1440px on 28 page types: no horizontal scroll, no image overlapping text, no console errors, no failed requests; phone menu opens, Escape closes it and returns focus; filters; search; old anchors incl. `/#prayers` | Pass: 617 checks |
| Biography photo at iPhone SE (375), iPhone 15 (390), iPhone 15 Pro Max (430), iPad (768), desktop (1440): image/text overlap measured at four scroll positions on home, About and Biography | 0 overlaps everywhere; nothing sticky, fixed or absolute in the page body |
| Every menu entry opens its own page with its own heading | Pass: 11 of 11 |
| Menu marks the current area (e.g. Publications, not Sociology, on the Publications page) | Pass |

**Not tested here:** a real iPhone or Safari (Chromium was used with iPhone viewport sizes and
touch); screen readers; the live domain (the site is not deployed); clicking through each external
publication link by hand (see the audit's note). Fonts load from Google, which this test
environment blocks, so screenshots show fallback fonts; layout is unaffected.

Screenshots: `docs/screenshots/2026-10-14/` — `before-*` (current live page) and `after-*`.

## 6. Decisions for Wayne

1. **Publication groupings.** Approve replacing "Peer-Reviewed Publications" with Journal Articles /
   Chapters and Research Annuals / Other Articles / Books / Forthcoming, or say which items are
   refereed so the label can return to those.
2. **John Henry Adams article.** Confirm journal, year, volume, issue and pages (or send a copy).
   Until then it shows "Publication not yet confirmed".
3. **"Many Interaction Orders."** Has Vol. 64 appeared, and is the full title "…: Political
   Socialization and the Organizational Ecology of Housing Justice"?
4. **Philosophy page.** The nine works on it were chosen from their titles. Add, remove or approve,
   then the "provisional" note comes off (`src/_data/curated.yml`, `status: reviewed`).
5. **Spiritual writings on the Prayers page.** Same: four essays chosen from titles.
6. **Labels and addresses.** Menu says "Theology" for Theology & Religious Naturalism and "Public
   Scholarship" for Public Scholarship & Media. The addresses stay `/religion-philosophy/`,
   `/scholarship/` and `/public-writing/`. They could become `/theology/`, `/sociology/` and
   `/public-scholarship/` before launch at no cost, since none has ever been public; say if you want that.
7. **New page wording.** The introductions of Philosophy, Prayers, and the retitled Sociology,
   Public Scholarship and Poetry pages are new drafts in my words.
8. **The earlier items A0–A4** in `DECISIONS-FOR-WAYNE.md` still stand.
9. **Pull request #1** (`archive-rebuild`) is superseded by this one, which contains all of it.
   Close #1 if you agree.
