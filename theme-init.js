/*! First Passage · theme-init (9-B, J2-06): first in <head>, classic, blocking. Before first paint: the saved
 * theme; html[data-platform] for the key chip. Until boot: theme choices. Notes: src/core/boot.ts (theme). */
(function (d) {
  var r = d.documentElement, h = d.head || r, own = d.currentScript, K = 'fp:v1';
  try {
    var n = navigator;
    if (/mac|iphone|ipad|ipod|ios/i.test((n.userAgentData && n.userAgentData.platform) || n.platform || n.userAgent || '')) r.setAttribute('data-platform', 'apple');
  } catch (e) {}
  function get() {
    try { var s = JSON.parse(localStorage.getItem(K) || 'null'); return s && s.v === 1 ? s : null; } catch (e) { return null; }
  }
  function set(t) {
    var m = h.querySelector('meta[data-theme-color]');
    if (t !== 'light' && t !== 'dark') { r.removeAttribute('data-theme'); if (m) m.remove(); return; }
    r.setAttribute('data-theme', t);
    if (!m) {
      m = d.createElement('meta');
      m.name = 'theme-color';
      m.setAttribute('data-theme-color', '');
      h.insertBefore(m, h.querySelector('meta[name="theme-color"]'));
    }
    m.content = (own && own.getAttribute('data-' + t)) || (t === 'dark' ? '#12110E' : '#EEE8DC');
  }
  var s = get();
  if (s) set(s.theme);
  d.addEventListener('click', function (e) {
    var b = !r.hasAttribute('data-theme-mode') && e.target.closest && e.target.closest('[data-theme-set]');
    if (!b) return;
    var t = b.getAttribute('data-theme-set'), c = get() || { v: 1, lastVisit: null, stamps: {}, ach: [], seenIntro: false };
    if (t !== 'light' && t !== 'dark') t = 'auto';
    set(t);
    if (t === 'auto') delete c.theme; else c.theme = t;
    try { localStorage.setItem(K, JSON.stringify(c)); } catch (e) {}
    d.querySelectorAll('[data-theme-set]').forEach(function (x) {
      x.setAttribute(x.getAttribute('role') === 'radio' ? 'aria-checked' : 'aria-pressed', String(x.getAttribute('data-theme-set') === t));
    });
  });
})(document);
