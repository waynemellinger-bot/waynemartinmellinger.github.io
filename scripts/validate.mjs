// Checks every work record before the site is built.
// A record that fails any rule stops the build, so nothing unchecked is published.
// Run by hand with:  npm run validate
import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';

const DATA = 'src/_data';
const load = (f) => yaml.load(fs.readFileSync(path.join(DATA, f), 'utf8'));

const programs = new Set(load('programs.yml').map((p) => p.slug));
const topics = new Set(load('topics.yml').map((t) => t.slug));
const collections = load('archive-collections.yml');

const TYPES = new Set(['column', 'essay', 'article', 'chapter', 'book', 'manuscript', 'poem',
  'prayer', 'invocation', 'ritual', 'liturgy', 'speech', 'testimony']);
const STATUSES = new Set(['published', 'forthcoming', 'in progress']);
const VISIBILITY = new Set(['full', 'excerpt', 'title-only']);
const FIELDS = new Set(['id', 'title', 'date', 'venue', 'type', 'url', 'status', 'programs', 'topics',
  'topics_status', 'description', 'series', 'selected', 'source', 'note', 'visibility']);
const REQUIRED = ['id', 'title', 'date', 'venue', 'type', 'status', 'source'];

const errors = [];
const allIds = new Set();
const allUrls = new Set();
let total = 0;

const validDate = (d) => {
  const m = /^(\d{4})(?:-(\d{2})(?:-(\d{2}))?)?$/.exec(String(d));
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
  const recs = load(file) || [];
  recs.forEach((r, i) => {
    total++;
    const where = `${file}, entry ${i + 1}${r && r.title ? ` ("${r.title}")` : ''}`;
    const err = (msg) => errors.push(`${where}: ${msg}`);
    if (!r || typeof r !== 'object') return err('is not a record');
    for (const k of Object.keys(r)) if (!FIELDS.has(k)) err(`unknown field "${k}"`);
    for (const k of REQUIRED) if (r[k] === undefined || r[k] === null || String(r[k]).trim() === '') err(`missing required field "${k}"`);
    if (r.id && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.id)) err('id must be lowercase letters, digits and hyphens');
    if (r.id && allIds.has(r.id)) err(`duplicate id "${r.id}"`);
    allIds.add(r.id);
    if (r.date && !validDate(r.date)) err(`date "${r.date}" must be YYYY, YYYY-MM or YYYY-MM-DD and real`);
    if (r.type && !TYPES.has(r.type)) err(`type "${r.type}" is not one of: ${[...TYPES].join(', ')}`);
    if (r.status && !STATUSES.has(r.status)) err(`status "${r.status}" is not one of: ${[...STATUSES].join(', ')}`);
    if (r.visibility && !VISIBILITY.has(r.visibility)) err(`visibility must be full, excerpt or title-only`);
    if (r.url !== undefined) {
      if (!/^https:\/\/[^\s]+$/.test(r.url)) err('url must start with https:// and contain no spaces');
      if (allUrls.has(r.url)) err(`duplicate url ${r.url}`);
      allUrls.add(r.url);
    } else if (r.status === 'published' && r.venue !== 'this site') {
      err('a published work hosted elsewhere needs a url');
    }
    for (const p of r.programs || []) if (!programs.has(p)) err(`unknown program "${p}" (see programs.yml)`);
    for (const t of r.topics || []) if (!topics.has(t)) err(`unknown topic "${t}" (add it to topics.yml first)`);
    if (r.selected !== undefined && typeof r.selected !== 'boolean') err('selected must be true or false');
  });
}

if (errors.length) {
  console.error(`\n${errors.length} problem(s) found in the work records:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error('\nThe site was not built. Fix the records above and try again.\n');
  process.exit(1);
}
console.log(`Records valid: ${total} works across ${collections.length} collection(s).`);
