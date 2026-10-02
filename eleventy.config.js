// Eleventy configuration for waynemartinmellinger.com
// Content lives in src/_data (records) and src/pages (pages); design lives in
// src/_layouts, src/_includes and src/assets. See README.md.
import yaml from 'js-yaml';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
  'August', 'September', 'October', 'November', 'December'];
const SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Dates are stored at the precision the source allows: YYYY, YYYY-MM or YYYY-MM-DD.
// These filters never invent a missing day or month.
const parts = (d) => String(d).split('-').map(Number);

export default function (eleventyConfig) {
  eleventyConfig.addDataExtension('yml,yaml', (contents) => yaml.load(contents));

  eleventyConfig.addPassthroughCopy({ 'src/assets': 'assets' });
  eleventyConfig.addPassthroughCopy({ 'src/CNAME': 'CNAME' });
  eleventyConfig.addPassthroughCopy({ legacy: 'legacy' });

  // "September 28, 2026" / "September 2026" / "2026"
  eleventyConfig.addFilter('fullDate', (d) => {
    const [y, m, day] = parts(d);
    if (!m) return String(y);
    if (!day) return `${MONTHS[m - 1]} ${y}`;
    return `${MONTHS[m - 1]} ${day}, ${y}`;
  });
  // "Sep 28" within a year heading; "Sep" or "" when less precise
  eleventyConfig.addFilter('dayMonth', (d) => {
    const [, m, day] = parts(d);
    if (!m) return '';
    return day ? `${SHORT[m - 1]} ${day}` : SHORT[m - 1];
  });
  eleventyConfig.addFilter('year', (d) => String(d).slice(0, 4));
  eleventyConfig.addFilter('monthYear', (d) => {
    const [y, m] = parts(d);
    return m ? `${MONTHS[m - 1]} ${y}` : String(y);
  });
  eleventyConfig.addFilter('groupByYear', (works) => {
    const groups = [];
    for (const w of works) {
      const y = String(w.date).slice(0, 4);
      if (!groups.length || groups[groups.length - 1].year !== y) groups.push({ year: y, works: [] });
      groups[groups.length - 1].works.push(w);
    }
    return groups;
  });
  eleventyConfig.addFilter('absolute', (path, base) => new URL(path, base).href);
  eleventyConfig.addFilter('json', (v) => JSON.stringify(v).replace(/</g, '\\u003c'));
  eleventyConfig.addFilter('limit', (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter('isoNow', () => new Date().toISOString().slice(0, 10));

  return {
    dir: { input: 'src', includes: '_includes', layouts: '_layouts', data: '_data', output: '_site' },
    templateFormats: ['njk', 'md', 'html'],
    markdownTemplateEngine: 'njk',
    htmlTemplateEngine: 'njk',
  };
}
