# Handoff — read this first

Every working session on this site, whether Claude, ChatGPT or a person, starts by reading this
file and ends by updating it. It records where the work stands, so no session has to
reconstruct the project from memory or chat history.

**Roles.** Wayne Martin Mellinger, Ph.D., is publisher and final editorial authority.
Claude implements. ChatGPT acts as senior editor and QA auditor.
Nothing is merged into `main` or published without Wayne's explicit approval.

## Current state (updated 2026-10-14)

| | |
| --- | --- |
| Live site | Still the original single page (`main`, commit `a05e5c7`, tag `legacy-original`). |
| Work in review | Branch `site-repairs-2026-10-14` (contains all of `archive-rebuild` plus the October 14 repairs), pull request into `main`. Supersedes PR #1. **Not merged, not published.** |
| Restored from | `waynemartinmellinger-site-source-2026-10-08.zip` and `waynemartinmellinger-full-history-2026-10-08.bundle`. The ZIP matches the bundle's tip file for file; the history is preserved commit by commit. |
| Checks | `npm run build` (record validation, build, search index), `scripts/qa/check_site.py` and `scripts/qa/browser_check.py` (now incl. 390 and 430px iPhone widths) all pass as of 2026-10-14. |

### Tags (restore points)

These live in the full-history bundle; they are **not yet on GitHub** (the 2026-10-09 session could
push branches but not tags). Each tagged commit is in the `archive-rebuild` history either way.

| Tag | What it marks |
| --- | --- |
| `legacy-original` | The original single-page site. |
| `noozhawk-pilot-accepted` | The Noozhawk pilot, as accepted on 2026-10-02. |
| `site-complete-2026-10-07` | Whole site built, with reports. |
| `content-review-2026-10-08` | Corrections from the October 7 content review applied. Tip of `archive-rebuild` before the handoff commit. |

### Must not change without Wayne's say-so

- `src/_data/works/noozhawk.yml`: the accepted Noozhawk records and classifications.
  SHA-256 `7e89db8e2ab0d0a791c58b38462652132543c63a52083452e236011aee1aebc3`,
  identical at all three tags above (133 records; classifications still `draft`).
- Program slugs, names and paths in `src/_data/programs.yml`.
- Factual fields (title, date, venue, url) are recorded as published, never tidied.
  Only Wayne sets a classification to `reviewed`.

## Open items

**Before merging** (details in `docs/DECISIONS-FOR-WAYNE.md` and `docs/SITE-REPAIRS-2026-10-14.md` §6):
- A0: Behavioral Wellness Commission, current or former service.
- A1: Research page statuses and summaries.
- A2: Program descriptions.
- A3: New page prose.
- A4: Conflicting facts.
- October 14 items 1–7: publication groupings, John Henry Adams details, Many Interaction Orders,
  Philosophy and spiritual-writings selections (`src/_data/curated.yml`), menu labels and addresses, new page wording.

**At merge:** set Settings → Pages → Source to **GitHub Actions**, then merge right away
(`docs/UPLOAD-INSTRUCTIONS.md`, step 9).

**Cleanup:** delete the stray branch `claude-access-test`. It was created on 2026-10-09 by an
access test and is identical to `main`; Claude's session could not delete branches.

**After publishing:** B1–B10 in `docs/DECISIONS-FOR-WAYNE.md`. Blogger exports are needed
only to expand the Doing Modernity, Dionysian Naturalist and Wild Flesh archives; they do not
block publishing.

## Session log

- 2026-10-01 to 10-02: mobile hotfix; Noozhawk pilot built and accepted.
- 2026-10-07: site completed; reports written. Not pushed (no GitHub access then).
- 2026-10-08: content-review corrections applied; handoff ZIP and bundle produced.
- 2026-10-14: Audit. Live site confirmed still `main` a05e5c7 (sticky-photo bug reproduced). On a new
  branch: phone portrait centred and capped; Philosophy and Prayers pages; eleven-item menu for the agreed
  areas; publications regrouped by type, five linked, John Henry Adams added; audit and test reports in `docs/`.
- 2026-10-09: GitHub write access confirmed. Restored from the handoff package onto
  `archive-rebuild`, history intact; all checks re-run and passing; pull request opened.
