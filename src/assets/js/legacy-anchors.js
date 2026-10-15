// The previous site was one long page with sections such as /#poetry.
// The part after "#" never reaches the server, so ordinary redirects cannot
// catch it. This forwards each old section address to its new page.
(function () {
  var map = {
    '#contact': '/contact/',
    '#biography': '/about/biography/',
    '#sociology': '/scholarship/',
    '#religion-philosophy': '/religion-philosophy/',
    '#public-writing': '/public-writing/',
    '#poetry': '/creative-work/poetry/',
    '#prayers': '/prayers/',
    '#gallery': '/about/portraits/',
    '#projects': '/community/',
    '#cv': '/cv/'
  };
  var target = map[window.location.hash];
  if (target) window.location.replace(target);
})();
