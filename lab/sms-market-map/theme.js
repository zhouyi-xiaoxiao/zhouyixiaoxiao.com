/*! SMS market map · theme control (MD-04, AMENDMENT 9-B).
 * The same Light / Dark / Auto choice as the rest of zhouyixiaoxiao.com, kept in the same place:
 * localStorage "fp:v1" → { v: 1, theme: "light" | "dark" } (Auto = no theme key). /theme-init.js applies
 * a saved choice before first paint; this file adds the switch to the bar, next to EN / 中.
 * app.js re-renders the bar when the language changes, so the button is put back (in the new
 * language) whenever the bar is redrawn. Storage can be blocked: the page then simply follows the
 * device, and the button still works for this visit. */
(function () {
  'use strict';
  var d = document;
  var root = d.documentElement;
  var KEY = 'fp:v1';
  var PAPER = { light: '#EEE8DC', dark: '#12110E' };
  var WORDS = {
    en: { theme: 'Theme', auto: 'Auto', light: 'Light', dark: 'Dark', autoTip: 'follows this device’s light or dark setting', next: 'switch to' },
    zh: { theme: '主题', auto: '跟随系统', light: '浅色', dark: '深色', autoTip: '跟随这台设备的浅色或深色设置', next: '切换为' },
  };
  var ICONS = {
    auto: '<circle cx="10" cy="10" r="6.6"/><path d="M10 3.4a6.6 6.6 0 0 1 0 13.2z" fill="currentColor" stroke="none"/>',
    light: '<circle cx="10" cy="10" r="3.3"/><path d="M10 1.8v2.4M10 15.8v2.4M1.8 10h2.4M15.8 10h2.4M4.2 4.2l1.7 1.7M14.1 14.1l1.7 1.7M4.2 15.8l1.7-1.7M14.1 5.9l1.7-1.7"/>',
    dark: '<path d="M16.4 12.2A6.7 6.7 0 0 1 7.8 3.6a6.7 6.7 0 1 0 8.6 8.6z"/>',
  };
  var memo = null; // the choice for this visit when storage is unavailable

  function read() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY) || 'null');
      var t = s && s.v === 1 && s.theme;
      return t === 'light' || t === 'dark' ? t : 'auto';
    } catch (e) {
      return memo || 'auto';
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
      if (!s || typeof s !== 'object' || s.v !== 1) s = { v: 1 };
      if (mode === 'auto') delete s.theme;
      else s.theme = mode;
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch (e) {
      /* blocked storage: this visit only */
    }
  }
  function apply(mode) {
    if (mode === 'auto') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', mode);
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
  }
  // the first tap from Auto always changes what you see (R2-08): it goes to the opposite of the theme
  // the device is showing now; the next tap to the other one; the third back to Auto
  function sysDark() {
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (e) {
      return false;
    }
  }
  function nextMode(mode) {
    var first = sysDark() ? 'light' : 'dark';
    if (mode === 'auto') return first;
    return mode === first ? (first === 'light' ? 'dark' : 'light') : 'auto';
  }
  function words() {
    return root.getAttribute('data-lang') === 'zh' ? WORDS.zh : WORDS.en;
  }
  function paint(btn) {
    var mode = read();
    var w = words();
    var next = nextMode(mode);
    var now = w.theme + (root.getAttribute('data-lang') === 'zh' ? '：' : ': ') + w[mode] + (mode === 'auto' ? (root.getAttribute('data-lang') === 'zh' ? '（' + w.autoTip + '）' : ' (' + w.autoTip + ')') : '');
    var label = now + (root.getAttribute('data-lang') === 'zh' ? '。轻点' + w.next + w[next] : ' — ' + w.next + ' ' + w[next]);
    btn.setAttribute('data-mode', mode);
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
    btn.innerHTML =
      '<svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">' + ICONS[mode] + '</svg><span class="theme-b__w" aria-hidden="true">' + w[mode] + '</span>';
  }
  function mount() {
    var bar = d.getElementById('bar');
    if (!bar) return;
    var btn = bar.querySelector('[data-smm-theme]');
    if (!btn) {
      btn = d.createElement('button');
      btn.type = 'button';
      btn.className = 'theme-b';
      btn.setAttribute('data-smm-theme', '');
      var lang = bar.querySelector('.lang');
      if (lang && lang.nextSibling) bar.insertBefore(btn, lang.nextSibling);
      else bar.appendChild(btn);
    }
    paint(btn);
  }

  d.addEventListener('click', function (ev) {
    var btn = ev.target && ev.target.closest ? ev.target.closest('[data-smm-theme]') : null;
    if (!btn) return;
    var mode = nextMode(read());
    write(mode);
    apply(mode);
    paint(btn);
  });
  // another tab changed the theme, or the page came back from the back/forward cache
  window.addEventListener('storage', function (ev) {
    if (ev.key && ev.key !== KEY) return;
    apply(read());
    mount();
  });
  // the device switched light/dark: what the next tap does has changed with it
  try {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var repaint = function () {
      var b = d.querySelector('[data-smm-theme]');
      if (b) paint(b);
    };
    if (mq.addEventListener) mq.addEventListener('change', repaint);
    else if (mq.addListener) mq.addListener(repaint);
  } catch (e) {
    /* no matchMedia */
  }
  window.addEventListener('pageshow', function () {
    apply(read());
    mount();
  });

  var bar = d.getElementById('bar');
  if (bar && typeof MutationObserver === 'function') {
    // the language switch redraws the bar: put the button back, in the new language
    new MutationObserver(function () {
      if (!bar.querySelector('[data-smm-theme]')) mount();
    }).observe(bar, { childList: true });
    new MutationObserver(function () {
      var b = bar.querySelector('[data-smm-theme]');
      if (b) paint(b);
    }).observe(root, { attributes: true, attributeFilter: ['data-lang'] });
  }
  mount();
})();
