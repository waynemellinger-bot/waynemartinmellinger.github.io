// Checks every record and every list the site is built from, before the site is built.
// A record that fails any rule stops the build, so nothing unchecked is published.
// Run by hand with:  npm run validate
//
// What is checked:
//   records (src/_data/works/*.yml): required bibliographic fields, known fields only,
//     unique ids, unique urls and pages, real dates, controlled values for type, status,
//     programs, topics, programs_status/topics_status (draft|reviewed) and
//     classification_basis, series names, related ids, poem text
//   collections, programs, topics: well-formed, unique slugs and paths
//   projects (src/_data/projects.yml): status from the agreed list, programs and works exist
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const DATA = 'src/_data';
const load = (f) => yaml.load(fs.readFileSync(path.join(DATA, f), 'utf8'));

const errors = [];
const warnings = [];
const asList = (v) => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]);
const isSlug = (s) => typeof s === 'string' && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(s);

// ---------- Controlled lists ----------
const programsList = load('programs.yml') || [];
const topicsList = load('topics.yml') || [];
const collections = load('archive-collections.yml') || [];
const projects = load('projects.yml') || [];

function uniqueBy(list, key, label) {
  const seen = new Set();
  list.forEach((x, i) => {
    const v = x && x[key];
    if (v === undefined) errors.push(`${label}, entry ${i + 1}: missing "${key}"`);
    else if (seen.has(v)) errors.push(`${label}: duplicate ${key} "${v}"`);
    seen.add(v);
  });
}
uniqueBy(programsList, 'slug', 'programs.yml');
uniqueBy(programsList, 'path', 'programs.yml');
uniqueBy(topicsList, 'slug', 'topics.yml');
uniqueBy(collections, 'slug', 'archive-collections.yml');
uniqueBy(collections, 'path', 'archive-collections.yml');
uniqueBy(collections, 'file', 'archive-collections.yml');
for (const p of programsList) {
  if (!isSlug(p.slug)) errors.push(`programs.yml: slug "${p.slug}" must be lowercase letters, digits and hyphens`);
  if (!p.name) errors.push(`programs.yml: "${p.slug}" needs a name`);
  if (!/^\/.*\/$/.test(p.path || '')) errors.push(`programs.yml: "${p.slug}" path must start and end with /`);
}
for (const t of topicsList) if (!isSlug(t.slug) || !t.name) errors.push(`topics.yml: "${t.slug}" needs a valid slug and a name`);

const GROUP_BY = new Set(['year', 'series', 'none']);
for (const c of collections) {
  for (const k of ['slug', 'name', 'title', 'venue', 'path', 'file', 'section', 'noun', 'intro', 'coverage']) {
    if (c[k] === undefined || c[k] === '') errors.push(`archive-collections.yml: "${c.slug}" is missing "${k}"`);
  }
  if (!/^\/.*\/$/.test(c.path || '')) errors.push(`archive-collections.yml: "${c.slug}" path must start and end with /`);
  if (c.group_by && !GROUP_BY.has(c.group_by)) errors.push(`archive-collections.yml: "${c.slug}" group_by must be year, series or none`);
  if (c.group_by === 'series' && !(c.series || []).length) errors.push(`archive-collections.yml: "${c.slug}" groups by series but lists none`);
  if (!fs.existsSync(path.join(DATA, 'works', `${c.file}.yml`))) errors.push(`archive-collections.yml: "${c.slug}" records file works/${c.file}.yml does not exist`);
}

const programs = new Set(programsList.map((p) => p.slug));
const topics = new Set(topicsList.map((t) => t.slug));

// ---------- Records ----------
const TYPES = new Set(['column', 'essay', 'article', 'chapter', 'book', 'manuscript', 'poem',
  'prayer', 'invocation', 'ritual', 'liturgy', 'speech', 'testimony']);
const STATUSES = new Set(['published', 'forthcoming', 'in progress', 'book project', 'unverified']);
const UNDATED_OK = new Set(['forthcoming', 'in progress', 'book project', 'unverified']);
const ONLINE_TYPES = new Set(['column', 'essay']);
const VISIBILITY = new Set(['full', 'excerpt', 'title-only']);
const REVIEW = new Set(['draft', 'reviewed']);
const BASIS = new Set(['title', 'article', 'grouping']);
const FIELDS = new Set(['id', 'title', 'date', 'date_display', 'date_note', 'venue', 'type', 'url', 'page', 'status',
  'with', 'citation', 'series', 'description', 'programs', 'topics', 'topics_status', 'programs_status',
  'classification_basis', 'related', 'selected', 'source', 'note', 'visibility', 'meta', 'order', 'text']);
const REQUIRED = ['id', 'title', 'venue', 'type', 'status', 'source'];

const allIds = new Set();
const allUrls = new Set();
const allPages = new Set();
const pendingRelated = [];
let total = 0;

const validDate = (d) => {
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(d);
  if (!m) return false;
  if (!m[2]) return true;
  const mo = Number(m[2]);
  if (mo < 1 || mo > 12) return false;
  if (!m[3]) return true;
  const dt = new Date(Date.UTC(+m[1], mo - 1, +m[3]));
  return dt.getUTCDate() === Number(m[3]);
};

for (const c of collections) {
  const file = `works/${c.file}.yml`;
  if (!fs.existsSync(path.join(DATA, file))) continue;
  const recs = load(file) || [];
  if (!Array.isArray(recs)) { errors.push(`${file}: must be a list of records`); continue; }
  const seriesNames = new Set((c.series || []).map((s) => s.name));
  const titles = new Map();
  recs.forEach((r, i) => {
    total++;
    const where = `${file}, entry ${i + 1}${r && r.title ? ` ("${r.title}")` : ''}`;
    const err = (msg) => errors.push(`${where}: ${msg}`);
    if (!r || typeof r !== 'object' || Array.isArray(r)) return err('is not a record');
    for (const k of Object.keys(r)) if (!FIELDS.has(k)) err(`unknown field "${k}"`);
    for (const k of REQUIRED) if (r[k] === undefined || r[k] === null || String(r[k]).trim() === '') err(`missing required field "${k}"`);
    if (r.id !== undefined && !isSlug(r.id)) err('id must be lowercase letters, digits and hyphens');
    if (r.id && allIds.has(r.id)) err(`duplicate id "${r.id}"`);
    allIds.add(r.id);

    // Dates: text, real, at the precision the source allows. YAML turns an unquoted
    // 2026-09-28 into a date object, which would display wrongly, so it must be quoted.
    if (r.date instanceof Date) err(`date must be quoted, like date: '${r.date.toISOString().slice(0, 10)}'`);
    else if (r.date !== undefined && !validDate(String(r.date))) err(`date "${r.date}" must be YYYY, YYYY-MM or YYYY-MM-DD and real`);
    if (r.date === undefined && !UNDATED_OK.has(r.status)) err('missing required field "date" (only forthcoming, in-progress or unconfirmed works may be undated)');

    if (r.type && !TYPES.has(r.type)) err(`type "${r.type}" is not one of: ${[...TYPES].join(', ')}`);
    if (r.status && !STATUSES.has(r.status)) err(`status "${r.status}" is not one of: ${[...STATUSES].join(', ')}`);
    if (r.visibility && !VISIBILITY.has(r.visibility)) err('visibility must be full, excerpt or title-only');

    // Classification: interpretive, always with a review status.
    for (const k of ['topics_status', 'programs_status']) {
      if (r[k] !== undefined && !REVIEW.has(r[k])) err(`${k} must be draft or reviewed, not "${r[k]}"`);
    }
    if (r.programs !== undefined && !Array.isArray(r.programs)) err('programs must be a list');
    if (r.topics !== undefined && !Array.isArray(r.topics)) err('topics must be a list');
    if (asList(r.programs).length && !r.programs_status) err('programs_status is required when programs are given');
    if (asList(r.topics).length && !r.topics_status) err('topics_status is required when topics are given');
    if (r.classification_basis !== undefined && !BASIS.has(r.classification_basis)) err(`classification_basis must be one of: ${[...BASIS].join(', ')}`);
    for (const p of asList(r.programs)) if (!programs.has(p)) err(`unknown program "${p}" (see programs.yml)`);
    for (const t of asList(r.topics)) if (!topics.has(t)) err(`unknown topic "${t}" (add it to topics.yml first)`);

    // Where the work can be read.
    if (r.url !== undefined) {
      if (!/^https:\/\/[^\s]+$/.test(r.url)) err('url must start with https:// and contain no spaces');
      if (allUrls.has(r.url)) err(`duplicate url ${r.url}`);
      allUrls.add(r.url);
    } else if (r.status === 'published' && ONLINE_TYPES.has(r.type) && !r.page && r.venue !== 'this site') {
      err('a published column or essay needs a url (or a page on this site)');
    }
    if (r.page !== undefined) {
      if (!/^\/[a-z0-9\-/]+\/$/.test(r.page)) err('page must be a site path like /creative-work/poetry/title/');
      if (allPages.has(r.page)) err(`duplicate page ${r.page}`);
      allPages.add(r.page);
      if (!Array.isArray(r.text) || !r.text.length) err('a work with its own page needs its text');
    }
    if (r.text !== undefined) {
      if (!Array.isArray(r.text)) err('text must be a list of stanzas');
      else r.text.forEach((b, j) => {
        const keys = b && typeof b === 'object' ? Object.keys(b) : [];
        if (keys.length !== 1 || !['stanza', 'section'].includes(keys[0]) || typeof b[keys[0]] !== 'string') {
          err(`text block ${j + 1} must be "stanza: ..." or "section: ..."`);
        }
      });
    }

    // Series: Wayne's own groupings; must match the collection's list when it groups by them.
    const series = asList(r.series);
    if (series.some((s) => typeof s !== 'string')) err('series must be text or a list of text');
    if (c.group_by === 'series') {
      if (!series.length) err(`needs a series (one of: ${[...seriesNames].join('; ')})`);
      for (const s of series) if (!seriesNames.has(s)) err(`series "${s}" is not listed for ${c.slug} in archive-collections.yml`);
    }
    if (r.selected !== undefined && typeof r.selected !== 'boolean') err('selected must be true or false');
    if (r.related !== undefined) {
      if (!Array.isArray(r.related)) err('related must be a list of ids');
      else for (const id of r.related) pendingRelated.push({ where, id, self: r.id });
    }
    if (r.title) {
      const key = String(r.title).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
      if (titles.has(key)) warnings.push(`${where}: same title as entry ${titles.get(key)} in this collection — intended?`);
      titles.set(key, i + 1);
    }
  });
}
for (const { where, id, self } of pendingRelated) {
  if (id === self) errors.push(`${where}: related lists the record itself`);
  else if (!allIds.has(id)) errors.push(`${where}: related id "${id}" does not exist`);
}

// ---------- Projects ----------
const PROJECT_STATUSES = new Set(['Published', 'Forthcoming', 'Under Review', 'In Revision', 'Working Paper',
  'Book Project', 'Research in Progress', 'Essay in Development', 'Archive']);
const PROJECT_FIELDS = new Set(['id', 'title', 'status', 'summary', 'programs', 'works', 'show', 'review', 'basis']);
uniqueBy(projects, 'id', 'projects.yml');
projects.forEach((p, i) => {
  const where = `projects.yml, entry ${i + 1}${p && p.title ? ` ("${p.title}")` : ''}`;
  for (const k of Object.keys(p || {})) if (!PROJECT_FIELDS.has(k)) errors.push(`${where}: unknown field "${k}"`);
  for (const k of ['id', 'title', 'status', 'summary', 'review']) if (!p || !p[k]) errors.push(`${where}: missing "${k}"`);
  if (p.id && !isSlug(p.id)) errors.push(`${where}: id must be lowercase letters, digits and hyphens`);
  if (p.status && !PROJECT_STATUSES.has(p.status)) errors.push(`${where}: status "${p.status}" is not one of: ${[...PROJECT_STATUSES].join(', ')}`);
  if (p.review && !REVIEW.has(p.review)) errors.push(`${where}: review must be draft or reviewed`);
  if (p.show !== undefined && typeof p.show !== 'boolean') errors.push(`${where}: show must be true or false`);
  for (const s of asList(p.programs)) if (!programs.has(s)) errors.push(`${where}: unknown program "${s}"`);
  for (const id of asList(p.works)) if (!allIds.has(id)) errors.push(`${where}: work id "${id}" does not exist`);
});

// ---------- Curated selections (Philosophy and Prayers pages) ----------
const curated = load('curated.yml') || {};
const projectIds = new Set(projects.map((p) => p.id));
for (const [name, list] of Object.entries(curated)) {
  const where = `curated.yml, "${name}"`;
  if (!REVIEW.has(list.status)) errors.push(`${where}: status must be draft or reviewed`);
  if (!['title', 'article', 'wayne'].includes(list.basis)) errors.push(`${where}: basis must be title, article or wayne`);
  if (!asList(list.ids).length) errors.push(`${where}: needs at least one id`);
  const seen = new Set();
  for (const id of asList(list.ids)) {
    if (!allIds.has(id)) errors.push(`${where}: work id "${id}" does not exist`);
    if (seen.has(id)) errors.push(`${where}: "${id}" is listed twice`);
    seen.add(id);
  }
  for (const id of asList(list.projects)) if (!projectIds.has(id)) errors.push(`${where}: project id "${id}" does not exist`);
}

// ---------- Report ----------
for (const w of warnings) console.warn(`  note: ${w}`);
if (errors.length) {
  console.error(`\n${errors.length} problem(s) found:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\nThe site was not built. Fix the records above and try again.\n');
  process.exit(1);
}
console.log(`Records valid: ${total} works across ${collections.length} collections; ${projects.length} projects.`);
