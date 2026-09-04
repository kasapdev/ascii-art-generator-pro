/* =====================================================================
   ASCII Art Generator Pro — app.js
   Text-to-ASCII-art banner generator with 3 hand-built bitmap fonts.
   Classic script (no modules). Depends on window.WUS (core.js) and
   window.ASCII_FONTS (fonts.js).
   ===================================================================== */
(function () {
  'use strict';

  var WUS = window.WUS;
  var FONTS = window.ASCII_FONTS;
  var STORE_KEY = 'asciiart.state';
  var MAX_LEN = 40;
  var GAP = '  '; // fixed inter-letter gap, in columns

  /* ----------------------------- DOM refs ---------------------------- */
  var textInput    = document.getElementById('textInput');
  var charCount    = document.getElementById('charCount');
  var fontPicker   = document.getElementById('fontPicker');
  var bannerOutput = document.getElementById('bannerOutput');
  var bannerMeta   = document.getElementById('bannerMeta');
  var emptyState   = document.getElementById('emptyState');

  var btnCopy      = document.getElementById('btnCopy');
  var btnDownload  = document.getElementById('btnDownload');
  var btnClear     = document.getElementById('btnClear');

  /* Current state */
  var currentFont = 'block';
  var lastBanner = '';

  /* Characters we've already warned about this session, so we don't spam
     a toast on every keystroke for the same unsupported character. */
  var warnedChars = {};

  /* =================================================================
     RENDERING
     ================================================================= */
  function blankGlyph(width, height) {
    var rows = [];
    for (var i = 0; i < height; i++) rows.push(new Array(width + 1).join(' '));
    return rows;
  }

  function render(text, fontKey) {
    var font = FONTS[fontKey];
    var height = font.height;
    var width = font.width;
    var chars = text.toUpperCase().split('');

    var unsupported = [];
    var glyphs = chars.map(function (ch) {
      var g = font.glyphs[ch];
      if (!g) {
        if (ch !== ' ' && unsupported.indexOf(ch) === -1) unsupported.push(ch);
        return blankGlyph(width, height);
      }
      return g;
    });

    var lines = [];
    for (var r = 0; r < height; r++) {
      var parts = [];
      for (var c = 0; c < glyphs.length; c++) parts.push(glyphs[c][r]);
      lines.push(parts.join(GAP));
    }

    return { text: lines.join('\n'), unsupported: unsupported };
  }

  /* =================================================================
     UI helpers
     ================================================================= */
  function updateCharCount() {
    var len = textInput.value.length;
    charCount.textContent = len + ' / ' + MAX_LEN;
  }

  function setActiveFontButton(fontKey) {
    var btns = fontPicker.querySelectorAll('button[data-font]');
    for (var i = 0; i < btns.length; i++) {
      var isActive = btns[i].getAttribute('data-font') === fontKey;
      btns[i].classList.toggle('is-active', isActive);
      btns[i].setAttribute('aria-selected', isActive ? 'true' : 'false');
    }
  }

  function warnUnsupported(unsupported) {
    if (!unsupported.length) return;
    var toWarn = unsupported.filter(function (ch) { return !warnedChars[ch]; });
    if (!toWarn.length) return;
    toWarn.forEach(function (ch) { warnedChars[ch] = true; });
    var list = toWarn.map(function (ch) { return '"' + ch + '"'; }).join(', ');
    WUS.toast('Unsupported character' + (toWarn.length > 1 ? 's' : '') + ' rendered blank: ' + list, 'error', 3600);
  }

  /* =================================================================
     CORE
     ================================================================= */
  function draw() {
    var text = textInput.value;

    if (!text) {
      lastBanner = '';
      bannerOutput.textContent = '';
      emptyState.classList.remove('is-hidden');
      bannerMeta.textContent = '';
      return;
    }

    var result = render(text, currentFont);
    lastBanner = result.text;
    bannerOutput.textContent = result.text;
    emptyState.classList.add('is-hidden');

    var lineCount = result.text.split('\n').length;
    var widestLine = result.text.split('\n').reduce(function (max, l) {
      return Math.max(max, l.length);
    }, 0);
    bannerMeta.textContent = FONTS[currentFont].label + ' · ' + lineCount + ' rows · ' + widestLine + ' cols wide';

    warnUnsupported(result.unsupported);
  }

  function copyBanner() {
    if (!lastBanner) { WUS.toast('Nothing to copy yet — type something first', 'error'); return; }
    WUS.copy(lastBanner, 'Banner copied to clipboard');
  }

  function downloadBanner() {
    if (!lastBanner) { WUS.toast('Nothing to download yet — type something first', 'error'); return; }
    var name = 'ascii-banner-' + currentFont + '-' + new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-') + '.txt';
    WUS.download(name, lastBanner, 'text/plain;charset=utf-8');
    WUS.toast('Downloaded ' + name);
  }

  function clearAll() {
    textInput.value = '';
    updateCharCount();
    draw();
    WUS.store.remove(STORE_KEY);
    textInput.focus();
  }

  function selectFont(fontKey) {
    if (!FONTS[fontKey] || fontKey === currentFont) return;
    currentFont = fontKey;
    setActiveFontButton(fontKey);
    draw();
    persist();
  }

  /* =================================================================
     PERSISTENCE
     ================================================================= */
  function persist() {
    WUS.store.set(STORE_KEY, { text: textInput.value, font: currentFont });
  }
  var persistDebounced = WUS.debounce(persist, 400);

  function restore() {
    var saved = WUS.store.get(STORE_KEY, null);
    if (!saved) return;
    if (typeof saved.text === 'string') textInput.value = saved.text.slice(0, MAX_LEN);
    if (saved.font && FONTS[saved.font]) currentFont = saved.font;
    setActiveFontButton(currentFont);
    updateCharCount();
  }

  /* =================================================================
     SHORTCUTS HELP MODAL
     ================================================================= */
  var helpBackdrop = document.getElementById('helpBackdrop');
  var helpClose    = document.getElementById('helpClose');
  var shortcutRows = document.getElementById('shortcutRows');

  var SHORTCUTS = [
    { keys: ['mod', 'C'], desc: 'Copy banner to clipboard' },
    { keys: ['mod', 'S'], desc: 'Download banner as .txt' },
    { keys: ['?'], desc: 'Show this help' },
    { keys: ['Esc'], desc: 'Close dialog' }
  ];

  function buildShortcutTable() {
    var html = '';
    SHORTCUTS.forEach(function (s) {
      var kbds = s.keys.map(function (k) { return '<kbd>' + WUS.escapeHtml(k) + '</kbd>'; }).join('');
      html += '<tr><td>' + WUS.escapeHtml(s.desc) + '</td><td>' + kbds + '</td></tr>';
    });
    shortcutRows.innerHTML = html;
  }

  function openHelp() { helpBackdrop.hidden = false; helpClose.focus(); }
  function closeHelp() { helpBackdrop.hidden = true; }

  helpClose.addEventListener('click', closeHelp);
  helpBackdrop.addEventListener('click', function (e) {
    if (e.target === helpBackdrop) closeHelp();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !helpBackdrop.hidden) closeHelp();
  });

  var helpBtns = document.querySelectorAll('[data-shortcut-help]');
  for (var i = 0; i < helpBtns.length; i++) helpBtns[i].addEventListener('click', openHelp);

  /* =================================================================
     WIRING
     ================================================================= */
  textInput.addEventListener('input', function () {
    // Hard-enforce the max length even if maxlength is bypassed (paste, etc.)
    if (textInput.value.length > MAX_LEN) textInput.value = textInput.value.slice(0, MAX_LEN);
    updateCharCount();
    draw();
    persistDebounced();
  });

  fontPicker.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-font]');
    if (!btn) return;
    selectFont(btn.getAttribute('data-font'));
  });

  btnCopy.addEventListener('click', copyBanner);
  btnDownload.addEventListener('click', downloadBanner);
  btnClear.addEventListener('click', clearAll);

  WUS.registerShortcut('mod+c', function () { copyBanner(); }, 'Copy banner');
  WUS.registerShortcut('mod+s', function () { downloadBanner(); }, 'Download .txt');
  WUS.registerShortcut('?', function () { openHelp(); }, 'Show shortcuts');

  /* =================================================================
     INIT
     ================================================================= */
  buildShortcutTable();
  restore();
  if (textInput.value) {
    updateCharCount();
  } else {
    textInput.value = 'HELLO';
    updateCharCount();
  }
  draw();
})();
