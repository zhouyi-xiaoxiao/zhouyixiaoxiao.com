/*! SMS market map · theme (J6-19; AMENDMENT 9-B). The site's own control, with the site's contract
 * (src/templates/partials/theme.ts, src/core/boot.ts): the bar's ◑ button opens a native popover with
 * Light / Dark / Auto, the footer carries the same three choices, and every choice is a
 * <button data-theme-set="light|dark|auto"> whose aria-pressed shows the current one. The choice lives where
 * the site keeps it — localStorage "fp:v1" → { v: 1, theme: "light" | "dark" } (Auto = no theme key) — so it
 * follows the reader between the site and this page. /theme-init.js applies a saved choice before first paint
 * and handles a choice made before this file runs; html[data-theme-mode] is the hand-off that makes it stand
 * down, as it does when the site's boot runs. app.js redraws the bar and the footer when the language changes
 * (already showing the current choice); the copies are synced again all the same. Blocked storage: the
 * choice holds for this visit. */
(function () {
  'use strict';
  var d = document;
  var root = d.documentElement;
  var KEY = 'fp:v1';
  var PAPER = { light: '#EEE8DC', dark: '#12110E' };
  var memo = null; // the choice for this visit when storage is unavailable

  function toMode(v) {
    return v === 'light' || v === 'dark' ? v : 'auto';
  }
  function read() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      return toMode(s && s.v === 1 && s.theme);
    } catch (e) {
      // blocked storage: this visit's choice (or one /theme-init.js applied before this file ran)
      return memo || toMode(root.getAttribute('data-theme'));
    }
  }
  function write(mode) {
    memo = mode;
    try {
      var s = null;
      try {
        s = JSON.parse(localStorage.getItem(KEY) || 'null');
      } catch (e) {
        s = null;
      }
      if (!s || typeof s !== 'object' || s.v !== 1) s = { v: 1, lastVisit: null, stamps: {}, ach: [], seenIntro: false };
      if (mode === 'auto') delete s.theme;
      else s.theme = mode;
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {
      /* blocked storage: this visit only */
    }
  }
  function sync(mode) {
    var bs = d.querySelectorAll('[data-theme-set]');
    for (var i = 0; i < bs.length; i++) {
      var b = bs[i];
      b.setAttribute(b.getAttribute('role') === 'radio' ? 'aria-checked' : 'aria-pressed', String(toMode(b.getAttribute('data-theme-set')) === mode));
    }
  }
  function apply(mode) {
    if (mode === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
    root.setAttribute('data-theme-mode', mode);
    // theme-color: a manual choice puts its own meta ahead of the two media ones (as /theme-init.js does)
    var own = d.querySelector('meta[name="theme-color"][data-theme-color]');
    if (mode === 'auto') {
      if (own) own.remove();
    } else {
      if (!own) {
        own = d.createElement('meta');
        own.setAttribute('name', 'theme-color');
        own.setAttribute('data-theme-color', '');
        d.head.insertBefore(own, d.head.querySelector('meta[name="theme-color"]'));
      }
      own.setAttribute('content', PAPER[mode]);
    }
    sync(mode);
  }

  d.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('[data-theme-set]') : null;
    if (!b) return;
    var mode = toMode(b.getAttribute('data-theme-set'));
    write(mode);
    apply(mode);
  });
  // another tab changed the theme, or the page came back from the back/forward cache after a change on the site
  window.addEventListener('storage', function (ev) {
    if (ev.key === null || ev.key === KEY) apply(read());
  });
  window.addEventListener('pageshow', function (ev) {
    if (ev.persisted) apply(read());
  });
  // the language switch redraws the bar and the footer
  if (typeof MutationObserver === 'function') {
    var mo = new MutationObserver(function () {
      sync(read());
    });
    var bar = d.getElementById('bar');
    var foot = d.getElementById('foot');
    if (bar) mo.observe(bar, { childList: true });
    if (foot) mo.observe(foot, { childList: true });
  }
  apply(read());
})();
