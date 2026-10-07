# waynemartinmellinger.com

The website and writing archive of Wayne Martin Mellinger, Ph.D.

The site is built with [Eleventy](https://www.11ty.dev/) from plain text files and published
free on GitHub Pages. Every work is one **record** in a data file. Pages are generated from
the records, so a work is entered once and appears everywhere it belongs: its collection, the
Writing page and its filters, its topics and bodies of work, search, and the home page.

**Two rules hold everywhere.** Factual fields (title, date, venue, url) are recorded as
published and never changed to make the categories tidier. Interpretive fields (programs and
topics) carry a status, `draft` or `reviewed`, and only Wayne sets `reviewed`.

Every edit below can be made on GitHub in the browser: open the file, click the pencil icon
(**Edit**), make the change, click **Commit changes**. GitHub then checks every record, builds
the site, checks every link, and publishes, usually within a few minutes (progress under the
**Actions** tab). If anything breaks a rule, the build stops with a plain-English message
naming the entry, and the live site is left unchanged.

---

## Adding a Noozhawk column

1. Open `src/_data/works/noozhawk.yml`.
2. Copy the first entry (from `- id:` down to the line before the next `- id:`) and paste it at the very top of the list.
3. Change each field for the new column.

```yaml
- id: nz-2026-10-05-the-title-in-a-few-words
  title: The Title Exactly as Published
  date: '2026-10-05'
  venue: Noozhawk
  type: column
  url: https://www.noozhawk.com/wayne-mellinger-the-title-exactly-as-published/
  status: published
  source: Noozhawk article page, checked 2026-10-05
  topics:
    - homelessness
  topics_status: draft
```

Leave out the `Wayne Mellinger: ` prefix Noozhawk adds to headlines. Topics and programs are
optional; a column with neither still appears on the Noozhawk page, the Writing page and in search.

## Adding an essay (Doing Modernity, The Dionysian Naturalist, Wild Flesh)

Open the platform's file: `src/_data/works/doing-modernity.yml`, `dionysian-naturalist.yml` or
`wild-flesh.yml`, and add an entry anywhere (pages sort by date themselves).

```yaml
- id: dm-the-title-in-a-few-words
  title: 'The Title: Exactly as Published'
  date: '2026-10'
  venue: Doing Modernity
  type: essay
  url: https://doingmodernity.blogspot.com/2026/10/the-post-address.html
  status: published
  series:
  - Also on Doing Modernity
  description: One or two sentences, in Wayne's words. Leave the line out rather than invent one.
  source: Doing Modernity post, checked 2026-10-08
```

Doing Modernity and The Dionysian Naturalist group essays under Wayne's own headings
(`series`). The heading must be one of those listed for the platform in
`src/_data/archive-collections.yml`; add a new heading there first. Wild Flesh lists by year
and needs no series.

To add the essay to a body of work, also add:

```yaml
  programs:
  - critical-interactionism
  programs_status: draft
```

## Adding a scholarly publication

Open `src/_data/works/scholarship.yml`. Journal volume and pages go in `citation`; a co-author in `with`.

```yaml
- id: pub-short-title
  title: "Full Title: As Published"
  date: '2027'
  venue: Symbolic Interaction
  citation: "50(1):1–25"
  type: article
  url: https://doi.org/10.xxxx/xxxxx
  status: published
  series: Peer-Reviewed Publications
  source: Journal page, checked 2027-01-10
```

Use `status: forthcoming` and leave out `date` for an accepted article without a year.

## Adding a poem

Open `src/_data/works/poetry.yml` and add an entry. The poem gets its own page at the `page`
address. Each stanza is one `- stanza: |-` block, and line breaks inside it are kept exactly.
`order` sets its place in the list of poems.

```yaml
- id: poem-the-title
  title: The Title
  date: '2026-11-02'
  meta:
  - 2 November 2026 — for whoever it is for
  venue: Moments of Awe Punctuated by the Mundane
  type: poem
  status: published
  page: /creative-work/poetry/the-title/
  order: 18
  source: Wayne's manuscript, 2026-11-02
  text:
  - stanza: |-
      First line
      second line
  - stanza: |-
      Next stanza
```

## Adding or changing a project (Research page)

Open `src/_data/projects.yml`. Each project needs a `title`, a `status` from the list at the
top of that file (Published, Forthcoming, Under Review, In Revision, Working Paper, Book
Project, Research in Progress, Essay in Development, Archive), and a one- or two-sentence
`summary`. `works` lists the ids of published records that belong to it; the build checks that
each id exists. `show: false` hides a project without deleting it. When a project is
published, add its record to the right works file and change its status (or set `show: false`).

## Adding an image

1. Prepare two copies, 600 and 1200 pixels wide, as both `.jpg` and `.webp`, named
   `NAME-600.jpg`, `NAME-600.webp`, `NAME-1200.jpg`, `NAME-1200.webp` (an image narrower than
   1200 needs only the 600 pair). Upload them to `src/assets/images/` (**Add file → Upload files**).
2. List it in `src/_data/images.yml` with its `alt` text (what the image shows, for people who
   cannot see it), the `width` and `height` of the 600 copy, and `large: true` if 1200 copies exist.
3. Images under `gallery` appear on the Portraits page. The image under `portrait` is the one
   on the home and About pages.

## Adding a body of work (intellectual program) or a topic

Open `src/_data/programs.yml` and add an entry with a `slug` (lowercase-with-hyphens, never
changed later), a `name`, a `path` for its page, and a one- or two-sentence `description`. The
page is created automatically and lists every record whose `programs` includes the slug.
Topics work the same way in `src/_data/topics.yml` (slug and name only; pages at `/topics/slug/`).

Then assign it to records one by one, only where a work substantively contributes. No program
is a valid answer.

## Marking classifications reviewed

When Wayne has checked a record's programs or topics, change `programs_status: draft` (or
`topics_status: draft`) to `reviewed`. The "provisional" notice disappears from a page once
nothing on it is draft.

---

## Record fields

| Field | Required | What it holds |
| --- | --- | --- |
| `id` | yes | Permanent identifier, lowercase words joined by hyphens. Never change it once published: it is part of the work's address (`/public-writing/noozhawk/#id`). |
| `title` | yes | Exactly as published. |
| `date` | yes, except forthcoming or unconfirmed work | As precise as the source allows: `'2026-10-05'`, `'2026-10'` or `'2026'`. Always in quotes. Never guess a day or month. |
| `date_display` | optional | Wayne's own wording for the date when it is a range, e.g. `2015–16`. |
| `venue` | yes | Where it appeared, e.g. `Noozhawk`, a journal, a book. |
| `citation` | optional | Volume, issue and pages, e.g. `17(2):165–185`; for a chapter, the editor and pages. |
| `with` | optional | Co-authors. |
| `type` | yes | column, essay, article, chapter, book, manuscript, poem, prayer, invocation, ritual, liturgy, speech, testimony. |
| `url` | for online work | Address of the original. Columns and essays must have one. |
| `page` | for work hosted here | Its page on this site (poems); needs `text`. |
| `status` | yes | `published`, `forthcoming`, `in progress`, `book project`, or `unverified` (listed somewhere but publication not yet confirmed). |
| `series` | collections grouped by heading | Wayne's own heading(s); the first decides where the work is listed. |
| `description` | optional | One or two sentences. Leave it out rather than invent one. |
| `programs` | optional | Bodies of work, from `programs.yml`. |
| `programs_status` | with programs | `draft` or `reviewed`. |
| `topics` | optional | From `topics.yml` only. |
| `topics_status` | with topics | `draft` or `reviewed`. |
| `classification_basis` | optional | What a draft classification rests on: `article` (full text read), `title`, or `grouping` (Wayne's own headings on the earlier site). |
| `related` | optional | Ids of other records that are the same work elsewhere (a cross-post, the book version). |
| `selected` | optional | `true` marks a work as selected (reserved for a future Selected Works list). |
| `source` | yes | Where the facts in this record were checked, and when. |
| `note` | optional | For editors only (never shown): date discrepancies, open questions. |

How these map to the field names in the 2026 brief: `venue` = publication, `type` =
publication_type, `url` = original_url, `page` = local_url, `selected` = featured. The
status of a record's publication is `status`; the status of its classification is
`programs_status` / `topics_status`.

## Where things live

```text
src/_data/works/          one records file per collection (noozhawk, scholarship, doing-modernity,
                          dionysian-naturalist, wild-flesh, poetry)
src/_data/archive-collections.yml   collections: their pages, headings, intros, coverage notes
src/_data/programs.yml    bodies of work          src/_data/topics.yml    topic list
src/_data/projects.yml    the Research page's current projects
src/_data/images.yml      images and alt text     src/_data/cv.yml        the CV
src/_data/site.yml        name, menu, email, profiles elsewhere
src/_data/redirects.yml   old addresses that forward to new ones
src/_data/archive.js      joins the records for the templates (no need to edit)
src/pages/                page templates          src/_layouts, src/_includes   shared frame and parts
src/assets/               stylesheet, scripts, images, icon
scripts/validate.mjs      the rules every record must pass (runs before every build)
scripts/qa/check_site.py  checks the built site: links, anchors, metadata, sitemap (runs after every build)
scripts/qa/browser_check.py   optional: phone and desktop layouts, menu, filters, search
scripts/migration/        the one-time script that created records from the previous site (do not re-run)
legacy/index.html         the previous single-page site, preserved at /legacy/
docs/                     changelog, implementation report, content audit, QA report
.github/workflows/deploy.yml   automatic check, build and publish
```

## Building on your own computer (optional)

Requires [Node.js](https://nodejs.org/) 20 or later, and Python 3 for the site check.

```sh
npm ci                            # install, once
npm run build                     # check records, build pages, build search → _site/
python3 scripts/qa/check_site.py  # check links, metadata and sitemap in _site/
npm run serve                     # build, then view at http://localhost:8080
```

## Publishing setup (once)

In the repository on GitHub: **Settings → Pages → Build and deployment → Source: GitHub
Actions**. The custom domain set on that page stays; `src/CNAME` also records it.

## Old addresses

The previous site was one page with sections such as `/#poetry`. A short script on the home
page (`src/assets/js/legacy-anchors.js`) forwards each old section address to its new page.
Other retired addresses are listed in `src/_data/redirects.yml`. The previous page itself is
preserved, unchanged, at `/legacy/` (hidden from search engines).
