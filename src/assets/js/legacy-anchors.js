// The previous site was one long page with sections such as /#poetry.
// The part after "#" never reaches the server, so ordinary redirects cannot
// catch it. This forwards each old section address to its new page.
(function () {
  var map = {
    '#top': '/',
    '#contact': '/about/',
    '#biography': '/about/',
    '#sociology': '/scholarship/',
    '#religion-philosophy': '/religion-philosophy/',
    '#public-writing': '/public-writing/',
    '#poetry': '/poetry/',
    '#prayers': '/prayers-ritual/',
    '#gallery': '/about/portraits/',
    '#projects': '/projects/',
    '#cv': '/cv/'
  };
  var target = map[window.location.hash];
  if (target && target !== '/') window.location.replace(target);
})();
