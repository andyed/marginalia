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

  /* ── Footnote popover positioning + tap-to-toggle ────────────────────── */

  function initFootnotes() {
    var activeFootnote = null;

    function closeActive() {
      if (activeFootnote) {
        activeFootnote.classList.remove('mg-fn-open');
        activeFootnote = null;
      }
    }

    function positionPopover(body) {
      body.classList.remove('mg-fn-anchor-left', 'mg-fn-anchor-right');
      var rect = body.getBoundingClientRect();
      if (rect.left < 8) {
        body.classList.add('mg-fn-anchor-left');
      } else if (rect.right > window.innerWidth - 8) {
        body.classList.add('mg-fn-anchor-right');
      }
    }

    document.querySelectorAll('.mg-fn').forEach(function (fn) {
      if (fn.dataset.mgFootnote) return;
      fn.dataset.mgFootnote = 'true';

      var ref = fn.querySelector('.mg-fn-ref');
      var body = fn.querySelector('.mg-fn-body');
      if (!ref || !body) return;

      // Hover positioning (desktop)
      fn.addEventListener('mouseenter', function () { positionPopover(body); });
      fn.addEventListener('focusin', function () { positionPopover(body); });

      // Tap-to-toggle (mobile + desktop click)
      ref.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (fn === activeFootnote) {
          closeActive();
        } else {
          closeActive();
          fn.classList.add('mg-fn-open');
          activeFootnote = fn;
          positionPopover(body);
        }
      });
    });

    // Dismiss on outside tap — single listener, idempotent
    if (!document.body.dataset.mgFnDismiss) {
      document.body.dataset.mgFnDismiss = 'true';
      document.addEventListener('click', function (e) {
        if (activeFootnote && !activeFootnote.contains(e.target)) {
          closeActive();
        }
      });
    }
  }

  /* ── Gallery lightbox ───────────────────────────────────────────────── */

  function initGallery() {
    var allImgs = Array.prototype.slice.call(document.querySelectorAll('.mg-gallery img'));
    var idx = 0;
    function close() {
      var lb = document.querySelector('.mg-lightbox');
      if (lb) lb.parentNode.removeChild(lb);
    }
    function open(i) {
      close(); idx = i;
      var img = allImgs[i], cap = img.parentElement.querySelector('figcaption');
      var el = document.createElement('div'); el.className = 'mg-lightbox';
      var fi = document.createElement('img'); fi.src = img.src; fi.alt = img.alt;
      el.appendChild(fi);
      if (cap) { var fc = document.createElement('figcaption'); fc.textContent = cap.textContent; el.appendChild(fc); }
      el.addEventListener('click', function (e) { if (e.target === el) close(); });
      document.body.appendChild(el);
    }
    allImgs.forEach(function (img, i) {
      if (img.dataset.mgGallery) return;
      img.dataset.mgGallery = 'true';
      img.addEventListener('click', function () { open(i); });
    });
    if (!document.body.dataset.mgGalleryKeys) {
      document.body.dataset.mgGalleryKeys = 'true';
      document.addEventListener('keydown', function (e) {
        if (!document.querySelector('.mg-lightbox')) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowRight') open((idx + 1) % allImgs.length);
        if (e.key === 'ArrowLeft') open((idx - 1 + allImgs.length) % allImgs.length);
      });
    }
  }

  /* ── Center callout auto-height ───────────────────────────────────────── */

  function initCenterWraps() {
    document.querySelectorAll('.mg-center-wrap').forEach(function (wrap) {
      var callout = wrap.querySelector('.mg-callout, .mg-pull');
      if (!callout) return;
      // Measure rendered callout height and sync float heights
      var h = callout.offsetHeight;
      wrap.style.setProperty('--mg-center-h', h + 'px');
    });
  }

  /* ── Init ─────────────────────────────────────────────────────────────── */

  function init() {
    initCopyButtons();
    initCollapseAnimation();
    initFootnotes();
    initGallery();
    initCenterWraps();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-init on dynamic content (call window.Marginalia.init() after inserting new elements)
  window.Marginalia = { init: init };
})();
