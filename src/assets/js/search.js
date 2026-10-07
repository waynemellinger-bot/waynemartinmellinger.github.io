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
    translations: { placeholder: 'e.g. Chumash, civil inattention, Dionysus' }
  });
  // Give Pagefind's search box a visible label (a placeholder is not a label).
  var input = document.querySelector('#search .pagefind-ui__search-input');
  if (input) {
    input.id = 'search-input';
    var label = document.createElement('label');
    label.htmlFor = 'search-input';
    label.className = 'search-label';
    label.textContent = 'Search the archive';
    var form = input.closest('form') || input.parentNode;
    form.parentNode.insertBefore(label, form);
  }
  var q = new URLSearchParams(window.location.search).get('q');
  if (q) ui.triggerSearch(q);
});
