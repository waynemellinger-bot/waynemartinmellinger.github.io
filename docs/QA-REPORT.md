# QA report

October 7, 2026, on a clean build of branch `archive-rebuild` (Eleventy 3.1.6, Node 22,
Chromium 141). **All of this was tested in Claude's workspace, not on GitHub or the live
domain.** The GitHub Actions workflow has never run.

## Results

| # | Check (from the brief) | Method | Result |
| --- | --- | --- | --- |
| — | Accepted Noozhawk baseline | SHA-256 of `noozhawk.yml`; counts; rendered filters | Unchanged: 133 records, 49 Public Sociology, 50 none, all draft; the Writing page filters show 133 / 49 / 50 |
| 1 | Every navigation link | site checker (all pages); browser at 5 widths | Pass |
| 2 | Internal links and #anchors | site checker: every `<a>` on 65 pages | Pass, 0 broken |
| 3 | External links | Listed, not opened — no web access from this workspace | **Not tested** (Noozhawk: 8 of 133 opened during the pilot) |
| 4 | Missing images, scripts, stylesheets | site checker | Pass |
| 5 | Duplicate pages | site checker; redirect page for the old duplicate | Pass |
| 6 | Duplicate titles / descriptions | site checker | Pass, none |
| 7 | Mobile layouts | browser at 320, 375, 768 px on 24 pages: no horizontal scroll, no image over text | Pass |
| 8 | Desktop layouts | browser at 1024, 1440 px on 24 pages; screenshots reviewed | Pass |
| 9 | Archive filters | browser: collection, program (incl. none), topic, type, decade, words, address, clear, no results | Pass (10 checks) |
| 10 | Search | browser: Pagefind results for "chumash", "garfinkel"; 257 records + 66 pages indexed | Pass |
| 11 | Malformed records | validator; 13 deliberate-error tests (12 bad values, 1 permitted variation) | Pass; all 12 bad values rejected, the permitted one accepted |
| 12 | Missing required fields | validator (missing venue test) | Pass |
| 13 | Invalid program values | validator (misspelt program test) | Pass |
| 14 | Program-status values | validator ("reveiwed" test) | Pass |
| 15 | Sitemap | site checker: 63 entries = 63 indexable pages | Pass, **after fixing** a pilot defect (only first paginated page listed) |
| 16 | Canonical addresses | site checker: present and self-referencing on every page | Pass |
| 17 | Metadata | site checker: title, description, lang on every page | Pass |
| 18 | Structured data | site checker: every JSON-LD block parses, has @context | Pass. Not run through Google's Rich Results Test (needs the live site) |
| 19 | Accessibility | axe-core 4 (WCAG 2.0/2.1/2.2 A/AA + best practice) on 23 pages at 375 and 1280 px; keyboard menu test; contrast computed | Pass, **after fixing** one violation (unlabelled search box) |
| 20 | Build warnings and errors | `npm run build` | None |
| 21 | Browser console errors | browser: every page at 5 widths | None from the site (external fonts unreachable in this workspace only) |
| 22 | Performance | page weight measured | Home 84 KB, Writing 228 KB, Portraits 340 KB, poem 32 KB (old page: 2 MB) |
| 23 | Orphan pages | site checker | None |
| 24 | Spelling / formatting | Poems and biography compared word-for-word with the old page; titles and annotations compared with the old page | Identical; 3 expected title differences explained in the content audit |

Also tested: old addresses `/#poetry`, `/#cv`, `/#biography`, `/#gallery`, `/#contact`,
`/#projects` and `/index (1).html` forward correctly; with JavaScript off, the full list
shows and the menu stays visible; each README "how to add" example builds and appears
where it should (this caught and fixed a crash when a project lists no programs).

## Defects found and fixed during QA

1. Sitemap missing 46 pages (paginated templates) — present since the pilot.
2. Collection breadcrumbs named the wrong section.
3. Writing page showed "Noozhawk" for every Scholarship collection.
4. Research/program pages crashed if a project had no programs.
5. Search box had no visible label.
6. "Forthcoming" shown twice on an undated forthcoming article.
7. Wrapped poem lines were indistinguishable from line breaks on phones.

## Remaining issues and limits

- External links not opened (no web access here). Check after publishing, e.g. with a link checker.
- Rich-result validation, real-device testing (iOS Safari, Android Chrome) and screen-reader
  testing (VoiceOver, NVDA) not done; automated checks are not a substitute for them.
- Web fonts were blocked in this workspace, so screenshots show the fallback serif. The live
  site loads Fraunces, Source Serif 4 and IBM Plex Mono from Google Fonts, as before.
- The Writing page holds all 257 works in one page (228 KB). Comfortable now; past roughly
  2,000 works it should be paginated.

## How to rerun

```sh
npm run build && npm run check                         # always
python3 -m http.server 8080 -d _site &                 # optional browser checks
python3 scripts/qa/browser_check.py                    # needs Playwright + Chromium
```
