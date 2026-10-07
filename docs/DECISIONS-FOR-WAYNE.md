# Status and decisions for Wayne

October 7, 2026.

## Where the work is

| | |
| --- | --- |
| **Built and tested** | Yes, in Claude's workspace (see QA report). |
| **Pushed to GitHub** | **No.** GitHub refused access: your GitHub account is not linked to Claude. GitHub's `main` branch is still the original single page (commit `a05e5c7`). |
| **Deployed / live** | **No.** waynemartinmellinger.com still serves the original single page. Neither the mobile fix nor anything since has gone live. |
| **Where it exists** | In the source ZIP and the full-history bundle delivered with this report, and in Claude's workspace for this conversation. |

How to publish it: `UPLOAD-INSTRUCTIONS.md`. Recommended order: review items A1–A4 below
first, because publishing makes them public.

## COMPLETED

- Archive of 257 works across six collections, each linked to the original or (poems)
  hosted here; filterable by collection, type, body of work, topic, decade and words.
- Home, About, Biography, CV, Portraits, Writing, Research, Community, Contact, About the
  Archive, collection, program, topic and poem pages; six-item menu.
- Records, vocabularies and projects validated on every build; built pages checked for
  links, metadata, headings, alt text, structured data and sitemap on every build.
- Search (Pagefind), structured data, sitemap, robots.txt, canonical addresses, sharing tags.
- Old addresses forwarded; the old page preserved at `/legacy/`.
- Mobile, keyboard and screen-reader basics; WCAG AA contrast; zero axe-core violations.
- Maintenance instructions (`README.md`) tested by following them.

## NEEDS WAYNE'S REVIEW — before publishing

**A1. The Research page** (`src/_data/projects.yml`). Ten projects with titles, statuses and
one- or two-sentence summaries drafted from your notes. Publishing makes them public claims.
Check every status and summary; set `show: false` on any you do not want public. Specific
questions: is "Dionysian Wine, Apollonian Cup" correctly "In Revision"? Is "The Career of the
Record" in development or finished? Is "Lessons from the Longest Night" a book project? Do
you want working titles shown for the strangers/civil-inattention work?

**A2. Program descriptions** (`src/_data/programs.yml`). Six one- or two-sentence descriptions,
built from your published wording, shown on the home, Research and program pages.

**A3. New page prose.** Short introductions written for this site: Writing, Research ("…grow
from a few long-running bodies of work"), the four section pages, collection intros, About the
Archive. Your biography, CV, poems and annotations are unchanged.

**A4. Facts that conflict** (details in `CONTENT-AUDIT.md`): Noozhawk "since 2012 / more than
a hundred" vs. 133 columns from June 2011; Freedom Warming Centers "co-founder" vs. "helped
establish"; "Longest Night (14th year)" will date; *Abandonment in Real Time* subtitle;
"From Minds to Moments" vs. *The Sociology of Interaction*.

**After publishing, at your pace:**

B1. The 157 draft program assignments, starting with the 70 based on your old headings (`record-audit.csv`). Mark each `reviewed` or change it.
B2. Five works listed without links: confirm and add addresses, or remove.
B3. Seven date conflicts between your bibliography and post addresses.
B4. Peer-reviewed citations: check against the journals and add DOIs.
B5. *Many Interaction Orders*: confirm Vol. 64 and add it.
B6. Wild Flesh's place: a September note records you wanting it as its own top-level section; the approved pilot put it under Scholarship. Moving it later is one line, plus a redirect.
B7. Portrait credits, or a note on how the portraits were made.
B8. The 17 vs. 18 poems question; whether "I Saw the Best Souls of My City" is in the book.
B9. The three prayer-poems named but not on the site.
B10. Whether `sameAs` (the profiles that identify you to search engines) should also include PhilArchive or an ORCID iD, if you have one.

## FUTURE ENHANCEMENT

- Catalogue the full archives of Doing Modernity, The Dionysian Naturalist and Wild Flesh
  (needs Blogger exports or web access); Our Neighbors on the Streets; Santa Barbara
  Independent, Everyday Sociology Blog, Naturalistic Paganism and Gods & Radicals pieces;
  *Spiritus Mundi* (2013).
- Topics for the non-Noozhawk collections (deliberately not guessed).
- DOIs and links for the peer-reviewed work; a downloadable CV PDF.
- A "Selected works" list (the `selected` field is ready).
- Talks and media appearances, once there is a record of them; teaching materials (e.g. the
  outreach training built on "First Encounter at the Stone Wall") if you want them public.
- Rich-result testing and real-device and screen-reader testing once live; an external link check.
- Self-hosting the fonts (privacy and speed) instead of loading them from Google.
