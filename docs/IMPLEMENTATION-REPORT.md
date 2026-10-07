# Implementation report — waynemartinmellinger.com

October 7, 2026. Branch `archive-rebuild`. For maintenance instructions see `README.md`.

## 1. Audit of the starting point

**Repository on GitHub** (`waynemellinger-bot/waynemartinmellinger.github.io`, branch `main`,
commit `a05e5c7`, checked October 7): three files only — `CNAME`, a 2 MB single-page
`index.html` (1.9 MB of it eight embedded images), and `index (1).html`, a byte-identical
duplicate. No build system, no structured data, no Open Graph tags, no canonical address,
no sitemap or robots.txt, one description tag. **The live site is this page.**

**Recovered work** (Wayne's recovery package of October 7, restored from its full git history):

| Earlier recommendation | Status found |
| --- | --- |
| Mobile biography/photo overlap fixed; phone menu | Done on branch `mobile-hotfix`; never deployed |
| Eleventy architecture, content separated from design | Done on `archive-rebuild`; never deployed |
| One record per work; validator | Done for Noozhawk |
| Collections / programs / topics as separate dimensions | Done |
| `programs_status`, `topics_status` (draft/reviewed), `classification_basis` | Done |
| Noozhawk pilot, corrected and accepted | Done; verified unchanged (133 / 49 / 50 / all draft) |
| Pagefind search, structured data, deploy workflow | Done; workflow never run on GitHub |
| Sitemap | Present but **defective**: listed only the first page of each paginated template |
| Other collections, About, CV, Projects, Poetry, Prayers | **Not started** — placeholders pointing to the old page |
| Designed home page | **Not started** — placeholder |

"Submitted sitemaps to Google Search Console" (from the brief) cannot have covered the new
site, which has never been published; whatever was submitted described the single page.

## 2. Architecture

**Static site, no framework.** Eleventy 3 turns plain-text data into HTML at build time.
GitHub Actions validates the data, builds, checks the built site, and publishes to GitHub
Pages. Runtime JavaScript is small and optional: the phone menu, the Writing page filters,
search (Pagefind), and the old-address forwarding. Everything is readable without it.

**Four layers, kept apart.**

| Layer | Where | Edited by |
| --- | --- | --- |
| Content (records, CV, projects, images) | `src/_data/` | Wayne, in the browser |
| Metadata vocabularies (programs, topics, collections) | `src/_data/*.yml` | Wayne |
| Templates | `src/pages/`, `src/_layouts/`, `src/_includes/` | rarely |
| Styles and behaviour | `src/assets/css/`, `src/assets/js/` | rarely |

**The record.** Each work is one entry in one collection file. Factual fields — `title`,
`date`, `venue`, `citation`, `url` — are recorded as published. Interpretive fields —
`programs`, `topics` — always carry `programs_status`/`topics_status` (`draft` until Wayne
marks them `reviewed`) and `classification_basis` (`article`, `title` or `grouping`). Four
dimensions are never merged: **collection** (where it appeared), **type** (what it is),
**program** (the body of work it substantively contributes to — none is valid), **topic**
(what it discusses).

**Collections** (`archive-collections.yml`): Noozhawk 133, Scholarly Publications 13, Doing
Modernity 43, The Dionysian Naturalist 33, Wild Flesh 18, Poems 17. Each declares how its
page groups works: by year (Noozhawk, Wild Flesh), by Wayne's own headings (Publications, Doing
Modernity, Dionysian Naturalist), or in Wayne's order (Poems). Each states its coverage honestly.

**Information architecture.**

```text
Home
About ── Biography (verbatim) · CV · Portraits
Writing (all 257 works, filterable) ── About the Archive
  ├ Scholarship ── Publications · Doing Modernity · Wild Flesh
  ├ Public Writing ── Noozhawk
  ├ Religion & Philosophy ── The Dionysian Naturalist
  ├ Creative Work ── Poems (one page each) · Prayers & ritual · Books
  └ Topics (18)
Research ── 6 bodies of work (program pages) · 10 current projects
Community · Contact · Search
```

The menu holds six items. The brief's thirteen candidate headings are covered without a menu
item each: Public Sociology, Scholarship, Homelessness, Religion and Poetry are second-level
pages reached from Writing and Research; Teaching is covered by the CV and About page (there
is no teaching material to justify a page); Media/Talks is omitted until there is a record of
talks (see Future enhancements); Archive is the Writing page.

**Projects** (`projects.yml`) are separate from works: a project is never a publication
claim. Each has one status from the brief's list, links to the published records that belong
to it (validated), and `show: false` to hide it.

**URLs.** Pilot URLs are kept (`/public-writing/noozhawk/`, program paths, topic paths). A
work's permanent address is its record id: `/public-writing/noozhawk/#nz-…`, or its own page
for poems. Old one-page anchors forward by script; retired files forward by redirect pages
(`redirects.yml`); the old page is preserved at `/legacy/` (excluded from search engines).

**Search engines.** Canonical address, description, Open Graph/Twitter and a share image on
every page. One JSON-LD graph per page: `Person` (`@id …/#person`, `sameAs` limited to the
three self-published profiles), `WebSite` with `SearchAction`, `BreadcrumbList`. Collection
pages add `CollectionPage` + `ItemList` of typed works; poem pages add `CreativeWork`.
Sitemap generated from all indexable pages; robots.txt excludes `/legacy/`.

**Accessibility.** Semantic landmarks, one `h1` per page, skip link, visible focus,
keyboard-operable menu (Escape closes and returns focus), labelled filters with a live result
count, AA contrast for every text colour, alt text on every image, no-JS fallbacks.

## 3. Checks that guard the site

| Check | When | Stops a bad deploy |
| --- | --- | --- |
| `scripts/validate.mjs` — records, vocabularies, projects, relations | every build | yes |
| `scripts/qa/check_site.py` — links, anchors, files, metadata, headings, alt, JSON-LD, sitemap | every build (workflow) | yes |
| `scripts/qa/browser_check.py` — widths, overlap, console, menu, filters, search, redirects, no-JS | by hand | — |

## 4. Choices made conservatively (reversible)

- Wild Flesh stays at the pilot's address under Scholarship (`/scholarship/wild-flesh/`), though
  a September note records Wayne wanting it as its own top-level section — see decisions list.
- Migrated programs were assigned only where Wayne's own heading names the program
  (`classification_basis: grouping`); "Also on…" lists, Human-AI and Media headings got none.
- Where the previous site gave a year and the post address gives the same year with a month,
  the month was taken from the address and noted. Where they disagree, Wayne's year stands
  and the conflict is noted (7 records).
- The *Abandonment in Real Time* subtitle is withheld (two versions exist).
- The sunflower portrait remains the main image, as on the previous site.
- No new biographical prose was written. New prose is limited to page introductions, program
  descriptions (built from Wayne's published wording) and project summaries — all listed for review.
