# Changelog

## 2026-10-14 — Audit and repairs (branch `site-repairs-2026-10-14`)

Full report: `docs/SITE-REPAIRS-2026-10-14.md`; publications: `docs/PUBLICATION-AUDIT.md`.

- Mobile portrait: centred above the text on phones, at most 15rem wide, in normal flow
  (never sticky, fixed or absolute). Desktop unchanged. Before/after screenshots in
  `docs/screenshots/2026-10-14/`.
- Menu: eleven entries for the agreed areas (Home, About, Sociology, Philosophy, Theology, Poetry,
  Prayers, Publications, Public Scholarship, Contact, Search); on desktop it runs on its own line
  under the name. The current page or area is marked by the longest matching address.
- New pages: `/philosophy/` and `/prayers/` (selections in new `src/_data/curated.yml`, checked
  by `scripts/validate.mjs`). Prayers moved off `/creative-work/`; old `/#prayers` now forwards to `/prayers/`.
- Section pages retitled: Sociology (`/scholarship/`), Theology & Religious Naturalism
  (`/religion-philosophy/`), Public Scholarship & Media (`/public-writing/`), Poetry & Creative
  Work (`/creative-work/`), with "See also" links. Addresses unchanged.
- Publications: regrouped by type; links added to four records (two DOIs, one ScienceDirect page,
  one PhilArchive record); "John Henry Adams and the Image of the New Negro" (1997) added as
  `unverified`; every record's source and open questions noted.
- Browser QA: adds 390 and 430px widths, the new pages and the old section anchors.
- Footer: Community work and Poetry & creative work links.

## 2026-10-08 — Content review corrections (October 7 review)

- Research page: "Dionysian Wine, Apollonian Cup" now Under Review, summary naming the
  American Journal of Theology & Philosophy (receipt and editorial stage recorded as unverified);
  "The Career of the Record" now a Book Project with the review's summary; the Doing essays
  no longer narrow Doing Equality to formal consensus.
- Biography (two sentences only): commission service made date-neutral ("has served"); the
  Noozhawk sentence no longer says "since 2012" or "more than a hundred".
- CV: Noozhawk start year removed; "14th year" removed ("Founder and organizer, Longest Night
  Homeless Memorial Vigil"); commission service date-neutral; Foot Washing "Founder" harmonized
  to "Co-founder", matching the biography and Community page.
- Community: Freedom Warming Centers "Helped establish" (matches the biography); commission
  "Has served as commissioner". About and home page wording aligned; the home page no longer
  lists the commission.
- Coverage: Noozhawk described as "133 columns catalogued … on October 1, 2026", not "every column".
- Poems: presented as a selection shown on the earlier site, not the book's contents or final
  texts; the structured-data claim that each poem is part of the book removed.
- Seven date conflicts now shown publicly on each record (bibliography year and post date)
  instead of silently showing one. New record field `date_note`.
- Program descriptions: four replaced per the review; all six remain provisional.

## 2026-10-07 — Site completed (branch `archive-rebuild`, commit after `10f3067`)

Built on the accepted Noozhawk pilot (tag `noozhawk-pilot-accepted`). The Noozhawk records
file is byte-for-byte unchanged (SHA-256 `7e89db8e…1aebc3`): 133 records, 49 Public
Sociology & Social Justice, 50 with no program, all classifications draft.

### Content
- **Migrated from the previous site into records**, with titles, links, dates and Wayne's
  annotations copied exactly (script kept in `scripts/migration/extract-legacy.py`):
  13 scholarly publications, 43 Doing Modernity essays, 33 Dionysian Naturalist works,
  18 Wild Flesh works, 17 poems. Total archive: 257 works, 1992–2026.
- Poems: full text on their own pages, verified word-for-word and line-for-line against the
  previous site. Biography: verbatim, verified against the previous site.
- CV, community roles, portraits (7 images, alt text as before) moved to their own pages.
- Three hand corrections to migrated records, each noted in the record: "The Ordeal" typed
  as a poem (Wayne's annotation calls it one); the Wild Flesh book prospectus marked a book
  project rather than a published work; "My Four Blogs" given no program.
- Removed one drafting note from the public CV ("A full publication list can be added
  here, or linked out to a PDF — your call"); the CV now links to the Publications page.

### Pages and navigation
- New menu: About · Writing · Research · Community · Contact · Search (was nine items).
- New: Home (designed), About, Biography, CV, Portraits, Writing (all works, with filters
  by collection, type, body of work, topic, decade and words), Research (bodies of work and
  current projects with explicit status), Community, Contact, About the Archive, one page per
  poem, and collection pages for Publications, Doing Modernity, The Dionysian Naturalist,
  Wild Flesh and Poems.
- Removed the pilot's "not yet moved" placeholder pages and preview banner.
- Old one-page addresses (`/#poetry`, `/#cv`, …) forward to their new pages;
  `/index (1).html`, a duplicate live on the old site, forwards to the home page.

### Data and checks
- Records: new optional fields `date_display`, `citation`, `with`, `page`, `text`, `meta`,
  `order`, `related`; new statuses `book project` and `unverified`; new
  `classification_basis: grouping`; undated records allowed only when forthcoming or unconfirmed.
- New `src/_data/projects.yml` (Research page), `images.yml`, `cv.yml`, `redirects.yml`;
  programs gained descriptions (draft).
- Validator extended: series names, related ids, project statuses and links, poem text,
  quoted dates, collection and program definitions.
- New `scripts/qa/check_site.py`, run by the deploy workflow after every build: internal
  links and anchors, missing files, titles, descriptions, canonical addresses, one h1 per
  page, alt text, structured data, sitemap completeness.
- New optional `scripts/qa/browser_check.py`: layouts at five widths, menu, filters, search,
  old addresses, no-JavaScript.
- `npm run build` now starts from an empty `_site/` so stale pages cannot hide problems.

### Fixes
- **Sitemap listed only the first page of each paginated template** (one topic, one
  collection, one poem) — present since the pilot. Now lists all 63 pages.
- Collection-page breadcrumbs showed the wrong section on every collection but the first.
- Search box lacked a visible label (the one accessibility violation found).

### Search engines and structured data
- Every page: canonical address, description, Open Graph and Twitter tags with a share image,
  and one structured-data graph: Person (with `sameAs` only for Noozhawk, Academia.edu and
  LinkedIn), WebSite with site search, BreadcrumbList.
- Collection pages: CollectionPage with an ItemList of OpinionNewsArticle / ScholarlyArticle /
  Article / CreativeWork. Poem pages: CreativeWork (genre Poetry) within the book.

### Design
- Same palette and typefaces as the previous site; every text colour meets WCAG AA.
- Long-form reading column of about 70 characters; poems keep the poet's line breaks, with
  a hanging indent when a long line wraps on a phone.
- Images served as WebP with JPEG fallback at 600/1200 px. Home page: 84 KB (was 2 MB).

## 2026-10-02 — Noozhawk pilot accepted (tag `noozhawk-pilot-accepted`)
## 2026-10-01 — Noozhawk pilot built; mobile hotfix (branch `mobile-hotfix`)
## Before October 2026 — single-page site (tag `legacy-original`)
