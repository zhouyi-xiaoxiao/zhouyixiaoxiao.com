/*! First Passage · theme-init: applies the saved Light / Dark choice before first paint (AMENDMENT 9-B).
 * Load it first in <head> as a classic blocking script, <script src="/theme-init.js"></script>:
 * no async, defer or type=module. The switch itself and the notes live in src/core/boot.ts (theme).
 * Colours = --paper in src/styles/tokens.css; a standalone page may pass data-light / data-dark. */
(function (d) {
  try {
    var s = JSON.parse(localStorage.getItem('fp:v1') || 'null');
    var t = s && s.v === 1 && s.theme;
    if (t !== 'light' && t !== 'dark') return;
    var own = d.currentScript;
    var head = d.head || d.documentElement;
    d.documentElement.setAttribute('data-theme', t);
    var m = d.createElement('meta');
    m.setAttribute('name', 'theme-color');
    m.setAttribute('content', (own && own.getAttribute('data-' + t)) || (t === 'dark' ? '#12110E' : '#EEE8DC'));
    m.setAttribute('data-theme-color', '');
    head.insertBefore(m, head.querySelector('meta[name="theme-color"]'));
  } catch (e) {
    /* storage blocked or unreadable: stay on Auto */
  }
})(document);
