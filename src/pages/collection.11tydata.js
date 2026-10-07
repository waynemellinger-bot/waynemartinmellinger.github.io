// Breadcrumbs for collection pages, computed per page. (Nested values in a template's
// own eleventyComputed front matter are not re-evaluated for each paginated page.)
export default {
  eleventyComputed: {
    breadcrumbs: (data) => [
      { label: 'Writing', url: '/writing/' },
      { label: data.coll.section.label, url: data.coll.section.url },
    ],
  },
};
