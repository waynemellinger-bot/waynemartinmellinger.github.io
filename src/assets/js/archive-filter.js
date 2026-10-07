// Filters the list of works on the Writing page (/writing/).
// Every work is already in the page, so without JavaScript the whole list simply shows.
// The current filters are kept in the address (/writing/?program=none&decade=201),
// so a filtered view can be bookmarked or shared.
(function () {
  var form = document.getElementById('filters');
  var list = document.getElementById('work-list');
  if (!form || !list) return;
  var items = Array.prototype.slice.call(list.children);
  var count = document.getElementById('filter-count');
  var empty = document.getElementById('no-results');
  var total = items.length;
  var FIELDS = ['q', 'collection', 'type', 'program', 'topic', 'decade'];

  // Words to match: title, venue, description and topics, folded to plain lowercase.
  var fold = function (s) {
    return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[‘’]/g, "'");
  };
  var haystack = items.map(function (li) { return fold(li.textContent); });

  function values() {
    var v = {};
    FIELDS.forEach(function (k) { v[k] = (form.elements[k].value || '').trim(); });
    return v;
  }

  function matches(li, i, v, words) {
    var d = li.dataset;
    if (v.collection && d.collection !== v.collection) return false;
    if (v.type && d.type !== v.type) return false;
    if (v.program && (' ' + d.programs + ' ').indexOf(' ' + v.program + ' ') < 0) return false;
    if (v.topic && (' ' + d.topics + ' ').indexOf(' ' + v.topic + ' ') < 0) return false;
    if (v.decade && d.year.slice(0, 3) !== v.decade) return false;
    for (var w = 0; w < words.length; w++) if (haystack[i].indexOf(words[w]) < 0) return false;
    return true;
  }

  function apply(updateAddress) {
    var v = values();
    var words = fold(v.q).split(/\s+/).filter(Boolean);
    var shown = 0;
    items.forEach(function (li, i) {
      var ok = matches(li, i, v, words);
      li.hidden = !ok;
      if (ok) shown++;
    });
    var active = FIELDS.some(function (k) { return v[k]; });
    count.textContent = active
      ? 'Showing ' + shown + ' of ' + total + ' works.'
      : 'Showing all ' + total + ' works.';
    empty.hidden = shown !== 0;
    if (updateAddress) {
      var params = new URLSearchParams();
      FIELDS.forEach(function (k) { if (v[k]) params.set(k, v[k]); });
      var qs = params.toString();
      history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '') + location.hash);
    }
  }

  // Start from the filters in the address, ignoring values that are not offered.
  var params = new URLSearchParams(location.search);
  FIELDS.forEach(function (k) {
    var el = form.elements[k];
    var val = params.get(k);
    if (!val) return;
    if (el.tagName === 'SELECT' && !Array.prototype.some.call(el.options, function (o) { return o.value === val; })) return;
    el.value = val;
  });

  var timer;
  form.addEventListener('input', function (e) {
    clearTimeout(timer);
    timer = setTimeout(function () { apply(true); }, e.target.name === 'q' ? 150 : 0);
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); apply(true); });
  form.addEventListener('reset', function () { setTimeout(function () { apply(true); }, 0); });
  document.querySelectorAll('[data-clear]').forEach(function (b) {
    b.addEventListener('click', function () { form.reset(); form.elements.q.focus(); });
  });
  apply(false);
})();
