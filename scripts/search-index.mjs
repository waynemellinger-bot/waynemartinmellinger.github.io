// Builds the search index after Eleventy has built the site.
// Pages on this site are indexed in full. Each work record is also added as its
// own search result, pointing to its entry on its collection page, with filters
// for collection, body of work, topic, type and year.
import * as pagefind from 'pagefind';
import archiveData from '../src/_data/archive.js';

const archive = archiveData();
const { index, errors } = await pagefind.createIndex({});
if (errors.length) throw new Error(errors.join('\n'));

const pages = await index.addDirectory({ path: '_site' });
if (pages.errors.length) throw new Error(pages.errors.join('\n'));

let added = 0;
for (const w of archive.works) {
  const topics = w.topicList.map((t) => t.name);
  const programs = w.programList.map((p) => p.name);
  const year = String(w.date).slice(0, 4);
  const { errors: e } = await index.addCustomRecord({
    url: w.permalink,
    language: 'en',
    content: [w.title, w.description, w.venue, topics.join('. '), programs.join('. '), year].filter(Boolean).join('. '),
    meta: { title: w.title, venue: w.venue, date: w.date },
    filters: { Collection: [w.collectionName], 'Body of work': programs, Topic: topics, Type: [w.type], Year: [year] },
    sort: { date: w.date },
  });
  if (e.length) throw new Error(e.join('\n'));
  added++;
}

const out = await index.writeFiles({ outputPath: '_site/pagefind' });
if (out.errors.length) throw new Error(out.errors.join('\n'));
console.log(`Search index: ${pages.page_count} pages and ${added} work records.`);
await pagefind.close();
