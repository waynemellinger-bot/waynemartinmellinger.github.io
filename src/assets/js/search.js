// Search page, powered by Pagefind (built into /pagefind/ when the site is built).
// A query in the address (/search/?q=chumash) runs immediately, so searches can be linked.
window.addEventListener('DOMContentLoaded', function () {
  if (!window.PagefindUI) return;
  var ui = new PagefindUI({
    element: '#search',
    showSubResults: false,
    showImages: false,
    resetStyles: false,
    pageSize: 20,
    translations: { placeholder: 'Search the archive' }
  });
  var q = new URLSearchParams(window.location.search).get('q');
  if (q) ui.triggerSearch(q);
});
