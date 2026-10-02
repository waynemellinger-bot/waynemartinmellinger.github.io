# waynemartinmellinger.com

The digital collected works of Wayne Martin Mellinger, Ph.D.

The site is built with [Eleventy](https://www.11ty.dev/) from plain text files and
published free on GitHub Pages. Every work is one **record** in a data file. Pages are
generated from the records, so a work is entered once and appears everywhere it belongs:
its collection, its topics, its bodies of work, search, and the home page's recent list.

---

## Adding a Noozhawk column (no software needed)

1. On GitHub, open `src/_data/works/noozhawk.yml` and click the pencil icon (**Edit**).
2. Copy the first entry (from `- id:` down to the line before the next `- id:`).
3. Paste it at the very top of the list, just above the first `- id:`.
4. Change each field for the new column (see **Record fields** below).
5. Click **Commit changes**.

GitHub then checks the records, rebuilds the site and publishes it, usually within a few
minutes. Progress shows under the repository's **Actions** tab. If a record breaks a rule,
the build stops with a plain-English message naming the entry, and the live site is left
unchanged.

Example:

```yaml
- id: nz-2026-10-05-the-title-in-a-few-words
  title: The Title Exactly as Published
  date: "2026-10-05"
  venue: Noozhawk
  type: column
  url: https://www.noozhawk.com/wayne-mellinger-the-title-exactly-as-published/
  status: published
  source: Noozhawk article page, checked 2026-10-05
  topics:
    - homelessness
  topics_status: draft
```

Leave out the `Wayne Mellinger: ` prefix Noozhawk adds to every headline.

## Record fields

| Field | Required | What it holds |
| --- | --- | --- |
| `id` | yes | Permanent identifier. Lowercase words joined by hyphens. Never change it once published: it is the work's address on this site (`/public-writing/noozhawk/#id`). |
| `title` | yes | Exactly as published. |
| `date` | yes | As precise as the source allows: `"2026-10-05"`, `"2026-10"` or `"2026"`. Always in quotes. Never guess a day or month. |
| `venue` | yes | Where it appeared, e.g. `Noozhawk`. |
| `type` | yes | One of: column, essay, article, chapter, book, manuscript, poem, prayer, invocation, ritual, liturgy, speech, testimony. |
| `url` | if one exists | Address of the original. |
| `status` | yes | `published`, `forthcoming` or `in progress`. |
| `programs` | optional | Bodies of work, from `src/_data/programs.yml`. A work joins a program only if it substantively contributes to it; none is a valid answer. |
| `topics` | optional | From `src/_data/topics.yml` only. To use a new topic, add it there first. |
| `topics_status` | with topics | `draft` or `reviewed`. Only a human editor sets `reviewed`. |
| `programs_status` | with programs | `draft` or `reviewed`. Only a human editor sets `reviewed`. |
| `classification_basis` | optional | What a draft classification was based on: `title` or `article`. |
| `description` | optional | One or two sentences. Leave it out rather than invent one. |
| `series` | optional | A series within a collection. |
| `selected` | optional | `true` adds the work to Selected Works. |
| `visibility` | poems and prayers | `full`, `excerpt` or `title-only`. |
| `source` | yes | Where the facts in this record were checked, and when. |
| `note` | optional | Anything a future editor should know, such as a date discrepancy. |

## Where things live

```text
src/_data/works/          one records file per collection (noozhawk.yml, ...)
src/_data/archive-collections.yml   the collections and their pages
src/_data/programs.yml    bodies of work and their pages
src/_data/topics.yml      the controlled topic list
src/_data/site.yml        name, menu, footer links; `pilot: true` shows preview notices
src/pages/                page templates (collection, topic, program, search, home, ...)
src/_layouts/ src/_includes/   shared page frame and the one template that draws every record
src/assets/               stylesheet, scripts, icon
scripts/validate.mjs      the rules every record must pass
scripts/search-index.mjs  builds the search index after the pages are built
legacy/index.html         the previous single-page site, kept for reference
.github/workflows/deploy.yml   automatic build and publish
```

## Building on your own computer (optional)

Requires [Node.js](https://nodejs.org/) 20 or later.

```sh
npm ci            # install, once
npm run build     # check records, build pages, build search → _site/
npm run serve     # build, then view at http://localhost:8080
```

`npm run validate` checks the records alone.

## Publishing setup (once)

In the repository on GitHub: **Settings → Pages → Build and deployment → Source:
GitHub Actions**. The custom domain is kept by `src/CNAME`.

## Old addresses

The previous site was one page with sections such as `/#poetry`. A short script on the
home page (`src/assets/js/legacy-anchors.js`) forwards each old section address to its
new page.
