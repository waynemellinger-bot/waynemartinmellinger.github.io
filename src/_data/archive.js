// Joins every collection's records into one archive and indexes them by
// collection, series, topic and program. Pages read from `archive`; nobody edits
// this file to add a work — records live in src/_data/works/*.yml.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (f) => yaml.load(fs.readFileSync(path.join(here, f), 'utf8')) || [];

const TYPE_LABELS = {
  column: 'Column', essay: 'Essay', article: 'Article', chapter: 'Chapter', book: 'Book',
  manuscript: 'Manuscript', poem: 'Poem', prayer: 'Prayer', invocation: 'Invocation',
  ritual: 'Ritual', liturgy: 'Liturgy', speech: 'Speech', testimony: 'Testimony',
};
// Statuses other than "published" are always shown next to the title.
const STATUS_LABELS = {
  published: '', forthcoming: 'Forthcoming', 'in progress': 'In progress',
  'book project': 'Book project', unverified: 'Publication not yet confirmed',
};

const asList = (v) => (v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]);

// Sort key: forthcoming work first, then newest first; undated work last.
// A less precise date (2026) sorts after a precise one in the same period.
const sortKey = (w) => (w.status === 'forthcoming' && !w.date ? '9999' : w.date || '0000');

export default function () {
  const collections = load('archive-collections.yml');
  const topics = load('topics.yml');
  const programs = load('programs.yml');
  const projectsAll = load('projects.yml');
  const topicName = Object.fromEntries(topics.map((t) => [t.slug, t.name]));
  const programBySlug = Object.fromEntries(programs.map((p) => [p.slug, p]));

  const works = [];
  for (const c of collections) {
    for (const r of load(`works/${c.file}.yml`)) {
      const date = r.date === undefined ? undefined : String(r.date);
      works.push({
        ...r,
        date,
        year: date ? date.slice(0, 4) : undefined,
        series: asList(r.series),
        collection: c.slug,
        collectionName: c.name,
        collectionPath: c.path,
        // Where a work "lives" on this site: its own page if it has one (poems),
        // otherwise its entry on its collection page.
        permalink: r.page || `${c.path}#${r.id}`,
        typeLabel: TYPE_LABELS[r.type] || r.type,
        statusLabel: STATUS_LABELS[r.status] ?? r.status,
        topicList: (r.topics || []).map((s) => ({ slug: s, name: topicName[s] })),
        programList: (r.programs || []).map((s) => programBySlug[s]),
        draft: r.programs_status === 'draft' || r.topics_status === 'draft',
      });
    }
  }
  works.sort((a, b) => (sortKey(a) < sortKey(b) ? 1 : sortKey(a) > sortKey(b) ? -1 : 0));

  const byId = Object.fromEntries(works.map((w) => [w.id, w]));
  const collectionBySlug = Object.fromEntries(collections.map((c) => [c.slug, c]));
  const programPageBySlug = {};
  for (const w of works) w.relatedList = asList(w.related).map((id) => byId[id]).filter(Boolean);

  // Per collection: its works in display order, and (for series collections) its groups.
  const byCollection = {};
  const groups = {};
  for (const c of collections) {
    let list = works.filter((w) => w.collection === c.slug);
    if (c.group_by === 'none') list = [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    byCollection[c.slug] = list;
    if (c.group_by === 'series') {
      // Each work appears once, under the first of its series; the others are noted.
      groups[c.slug] = (c.series || []).map((s) => ({
        ...s,
        works: list.filter((w) => w.series[0] === s.name),
      }));
    }
  }

  const topicPages = topics
    .map((t) => ({ ...t, path: `/topics/${t.slug}/`, works: works.filter((w) => (w.topics || []).includes(t.slug)) }))
    .filter((t) => t.works.length);
  const programPages = programs.map((p) => ({ ...p, works: works.filter((w) => (w.programs || []).includes(p.slug)) }));
  for (const p of programPages) programPageBySlug[p.slug] = p;

  const projects = projectsAll
    .filter((p) => p.show !== false)
    .map((p) => ({
      ...p,
      programList: (p.programs || []).map((s) => programBySlug[s]).filter(Boolean),
      workList: (p.works || []).map((id) => byId[id]).filter(Boolean),
    }));

  // Facets for the Writing page's filters.
  const count = (key) => {
    const m = new Map();
    for (const w of works) for (const v of asList(key(w))) m.set(v, (m.get(v) || 0) + 1);
    return m;
  };
  const typeCounts = count((w) => w.type);
  const facets = {
    collections: collections.map((c) => ({ value: c.slug, label: c.name, n: byCollection[c.slug].length })),
    types: Object.keys(TYPE_LABELS).filter((t) => typeCounts.has(t)).map((t) => ({ value: t, label: TYPE_LABELS[t], n: typeCounts.get(t) })),
    programs: programPages.map((p) => ({ value: p.slug, label: p.name, n: p.works.length })),
    unprogrammed: works.filter((w) => !(w.programs || []).length).length,
    topics: topicPages.map((t) => ({ value: t.slug, label: t.name, n: t.works.length })),
    decades: [...new Set(works.filter((w) => w.year).map((w) => `${w.year.slice(0, 3)}0s`))].sort().reverse(),
  };

  const years = works.filter((w) => w.year).map((w) => w.year).sort();
  const stats = {
    total: works.length,
    first: years[0],
    last: years[years.length - 1],
  };

  return {
    works, byId, collections, collectionBySlug, programPageBySlug, byCollection, groups, topicPages, programPages, topicName, programBySlug,
    projects, facets, stats,
  };
}
