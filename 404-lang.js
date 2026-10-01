/*! 404-lang.js · First Passage · 首达 — GitHub Pages serves one 404.html for every unknown URL;
 * under /zh/ this swaps in the Chinese page that 404.html carries in <template id="nf-zh">.
 * Source: scripts/wp12/notfound.ts. */
(function (d) {
  if (!/^\/zh(\/|$)/.test(location.pathname)) return;
  var root = d.documentElement;
  if (root.getAttribute('data-nf')) return;
  root.lang = 'zh-Hans';
  root.setAttribute('data-nf', 'zh');
  function swap() {
    try {
      var tpl = d.getElementById('nf-zh');
      var body = d.body;
      if (!tpl || !tpl.content || !body) return;
      var kids = [].slice.call(body.childNodes);
      var firstScript = null;
      for (var i = 0; i < kids.length; i++) {
        var k = kids[i];
        if (k === tpl) continue;
        // executable scripts stay (they are already queued); the English data island goes with its page
        if (k.nodeName === 'SCRIPT' && !/json/i.test(k.type || '')) {
          firstScript = firstScript || k;
          continue;
        }
        body.removeChild(k);
      }
      var title = tpl.getAttribute('data-title');
      var cls = tpl.getAttribute('data-body-class');
      body.insertBefore(tpl.content, firstScript || tpl);
      body.removeChild(tpl);
      if (title) d.title = title;
      if (cls !== null) body.className = cls;
    } finally {
      root.setAttribute('data-nf-ready', '');
    }
  }
  if (d.readyState === 'loading') {
    d.addEventListener('readystatechange', function on() {
      if (d.readyState === 'loading') return;
      d.removeEventListener('readystatechange', on);
      swap();
    });
  } else swap();
})(document);
