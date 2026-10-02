// Joins every collection's records into one archive, and indexes them by
// topic and by program. Pages read from `archive`; nobody edits this file to add a work.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';

const here = path.dirname(fileURLToPath(import.meta.url));
const load = (f) => yaml.load(fs.readFileSync(path.join(here, f), 'utf8')) || [];

export default function () {
  const collections = load('archive-collections.yml');
  const topics = load('topics.yml');
  const programs = load('programs.yml');
  const topicName = Object.fromEntries(topics.map((t) => [t.slug, t.name]));
  const programBySlug = Object.fromEntries(programs.map((p) => [p.slug, p]));

  const works = [];
  for (const c of collections) {
    for (const r of load(`works/${c.file}.yml`)) {
      works.push({
        ...r,
        date: String(r.date),
        collection: c.slug,
        collectionName: c.name,
        collectionPath: c.path,
        permalink: `${c.path}#${r.id}`,
        topicList: (r.topics || []).map((s) => ({ slug: s, name: topicName[s] })),
        programList: (r.programs || []).map((s) => programBySlug[s]),
      });
    }
  }
  // Newest first; a less precise date (2026) sorts after a precise one in the same period.
  works.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));

  const byCollection = Object.fromEntries(collections.map((c) => [c.slug, works.filter((w) => w.collection === c.slug)]));
  const topicPages = topics
    .map((t) => ({ ...t, path: `/topics/${t.slug}/`, works: works.filter((w) => (w.topics || []).includes(t.slug)) }))
    .filter((t) => t.works.length);
  const programPages = programs.map((p) => ({ ...p, works: works.filter((w) => (w.programs || []).includes(p.slug)) }));

  return { works, collections, byCollection, topicPages, programPages, topicName, programBySlug };
}
