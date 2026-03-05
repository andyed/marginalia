/* ═══════════════════════════════════════════════════════════════════════════
   Marginalia — Progressive Enhancement
   Collapse animation + code copy button. Works without JS — CSS handles base.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Code copy button ────────────────────────────────────────────────── */

  function initCopyButtons() {
    document.querySelectorAll('.mg-code').forEach(function (block) {
      if (block.querySelector('.mg-copy-btn')) return;

      var btn = document.createElement('button');
      btn.className = 'mg-copy-btn';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.addEventListener('click', function () {
        var code = block.textContent.replace(/^Copy/, '').trim();
        navigator.clipboard.writeText(code).then(function () {
          btn.textContent = 'Copied';
          setTimeout(function () { btn.textContent = 'Copy'; }, 1500);
        });
      });
      block.appendChild(btn);
    });
  }

  /* ── Collapse smooth animation ───────────────────────────────────────── */

  function initCollapseAnimation() {
    document.querySelectorAll('.mg-collapse').forEach(function (details) {
      var summary = details.querySelector('summary');
      var body = details.querySelector('.mg-collapse-body');
      if (!summary || !body) return;

      // Skip if already wired
      if (details.dataset.mgAnimated) return;
      details.dataset.mgAnimated = 'true';

      summary.addEventListener('click', function (e) {
        e.preventDefault();

        if (details.open) {
          // Closing: animate height to 0, then remove open
          var height = body.scrollHeight;
          body.style.overflow = 'hidden';
          body.style.height = height + 'px';
          // Force reflow
          body.offsetHeight; // eslint-disable-line no-unused-expressions
          body.style.transition = 'height 0.2s ease';
          body.style.height = '0';
          body.addEventListener('transitionend', function handler() {
            body.removeEventListener('transitionend', handler);
            details.open = false;
            body.style.height = '';
            body.style.overflow = '';
            body.style.transition = '';
          });
        } else {
          // Opening: set open, measure, animate from 0
          details.open = true;
          var targetHeight = body.scrollHeight;
          body.style.overflow = 'hidden';
          body.style.height = '0';
          // Force reflow
          body.offsetHeight; // eslint-disable-line no-unused-expressions
          body.style.transition = 'height 0.2s ease';
          body.style.height = targetHeight + 'px';
          body.addEventListener('transitionend', function handler() {
            body.removeEventListener('transitionend', handler);
            body.style.height = '';
            body.style.overflow = '';
            body.style.transition = '';
          });
        }
      });
    });
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */

  function init() {
    initCopyButtons();
    initCollapseAnimation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init on dynamic content (call window.Marginalia.init() after inserting new elements)
  window.Marginalia = { init: init };
})();
