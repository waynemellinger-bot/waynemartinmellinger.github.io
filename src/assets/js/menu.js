// Phone and tablet menu.
// Without JavaScript the menu is simply always shown, so it never traps anyone.
(function () {
  var button = document.querySelector('.menu-button');
  var nav = document.getElementById('site-nav');
  if (!button || !nav) return;
  var wide = window.matchMedia('(min-width: 56rem)');

  function setOpen(open, returnFocus) {
    button.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('menu-open', open);
    if (open) {
      var first = nav.querySelector('a');
      if (first) first.focus();
    } else if (returnFocus) {
      button.focus();
    }
  }

  button.addEventListener('click', function () {
    setOpen(button.getAttribute('aria-expanded') !== 'true', true);
  });

  // Escape closes the menu and returns focus to the Menu button.
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && button.getAttribute('aria-expanded') === 'true') {
      setOpen(false, true);
    }
  });

  // Choosing a destination closes the menu.
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false, false);
  });

  // Widening the window to desktop size resets the menu.
  function onWidth() { if (wide.matches) setOpen(false, false); }
  if (wide.addEventListener) wide.addEventListener('change', onWidth);
  else if (wide.addListener) wide.addListener(onWidth);
})();
