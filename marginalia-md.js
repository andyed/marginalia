/* ═══════════════════════════════════════════════════════════════════════════
   Marginalia — Markdown Converter
   Transforms a markdown subset into Marginalia-classed HTML.
   No dependencies. Pairs with marginalia.css.
   ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  var ALERT_MAP = {
    NOTE: 'note', TIP: 'tip', WARNING: 'warning', IMPORTANT: 'important'
  };

  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ── Inline transforms ──────────────────────────────────────────────── */

  function inlines(line) {
    // Badges with type: {text: type}
    line = line.replace(/\{([^:}]+):\s*([^}]+)\}/g, function (_, text, type) {
      return '<span class="mg-badge" data-type="' + type.trim() + '">' + text.trim() + '</span>';
    });
    // Badges plain: {text}
    line = line.replace(/\{([^}]+)\}/g, '<span class="mg-badge">$1</span>');
    // Highlights: ==text==
    line = line.replace(/==(.*?)==/g, '<mark class="mg-mark">$1</mark>');
    // Inline footnotes: [^N](text)
    line = line.replace(/\[\^(\w+)\]\(([^)]+)\)/g,
      '<span class="mg-fn"><a class="mg-fn-ref" tabindex="0"></a><span class="mg-fn-body">$2</span></span>');
    // Images: ![alt](src)
    line = line.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
    // Links: [text](url)
    line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
    // Bold: **text**
    line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    line = line.replace(/\*(.+?)\*/g, '<em>$1</em>');
    // Inline code: `code`
    line = line.replace(/`([^`]+)`/g, '<code class="mg-inline-code">$1</code>');
    return line;
  }

  /* ── Block-level converter ──────────────────────────────────────────── */

  function convert(md) {
    var lines = md.split('\n');
    var out = [];
    var i = 0;
    var para = [];
    var dropcap = false;

    function flushPara() {
      if (!para.length) return;
      var cls = dropcap ? ' class="mg-dropcap"' : '';
      out.push('<p' + cls + '>' + para.join(' ') + '</p>');
      para = [];
      dropcap = false;
    }

    while (i < lines.length) {
      var line = lines[i];

      // Fenced code block
      var fenceMatch = line.match(/^```(\w*)$/);
      if (fenceMatch) {
        flushPara();
        var lang = fenceMatch[1];
        var code = [];
        i++;
        while (i < lines.length && !lines[i].match(/^```\s*$/)) {
          code.push(escapeHtml(lines[i]));
          i++;
        }
        var langAttr = lang ? ' data-lang="' + lang + '"' : '';
        out.push('<pre class="mg-code"' + langAttr + '><code>' + code.join('\n') + '</code></pre>');
        i++; // skip closing fence
        continue;
      }

      // Headings
      var headMatch = line.match(/^(#{1,6})\s+(.+)$/);
      if (headMatch) {
        flushPara();
        var level = headMatch[1].length;
        out.push('<h' + level + '>' + inlines(headMatch[2]) + '</h' + level + '>');
        i++;
        continue;
      }

      // Horizontal rule
      if (/^(---|\*\*\*|___)\s*$/.test(line)) {
        flushPara();
        out.push('<hr>');
        i++;
        continue;
      }

      // Dropcap marker
      if (/^\{dropcap\}\s*$/.test(line)) {
        flushPara();
        dropcap = true;
        i++;
        continue;
      }

      // Details / collapse passthrough
      if (/^<details/.test(line)) {
        flushPara();
        var detailLines = [];
        while (i < lines.length) {
          var dl = lines[i];
          if (!detailLines.length) {
            // Inject mg-collapse if not present
            if (dl.indexOf('mg-collapse') === -1) {
              dl = dl.replace('<details', '<details class="mg-collapse"');
            }
          }
          detailLines.push(dl);
          if (/<\/details>/.test(lines[i])) { i++; break; }
          i++;
        }
        out.push(detailLines.join('\n'));
        continue;
      }

      // Blockquote / alert block
      if (/^>\s/.test(line)) {
        flushPara();
        var bqLines = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) {
          bqLines.push(lines[i].replace(/^>\s?/, ''));
          i++;
        }
        emitBlockquote(bqLines, out);
        continue;
      }

      // Blank line — flush paragraph
      if (/^\s*$/.test(line)) {
        flushPara();
        i++;
        continue;
      }

      // Paragraph text
      para.push(inlines(line));
      i++;
    }
    flushPara();
    return out.join('\n');
  }

  /* ── Blockquote dispatch ────────────────────────────────────────────── */

  function emitBlockquote(bqLines, out) {
    var first = bqLines[0] || '';
    var alertMatch = first.match(/^\[!(\w+)\]\s*$/);
    var content;

    if (alertMatch) {
      var keyword = alertMatch[1].toUpperCase();
      content = bqLines.slice(1).map(inlines);

      // Callout variants
      if (ALERT_MAP[keyword]) {
        var type = ALERT_MAP[keyword];
        var label = keyword.charAt(0) + keyword.slice(1).toLowerCase();
        var body = content.length
          ? '<p><strong>' + label + ':</strong> ' + content.join(' ') + '</p>'
          : '';
        out.push('<div class="mg-callout" data-type="' + type + '">' + body + '</div>');
        return;
      }

      // Sidebar
      if (keyword === 'ASIDE') {
        out.push('<aside class="mg-sidebar"><p>' + content.join(' ') + '</p></aside>');
        return;
      }

      // Margin note
      if (keyword === 'MARGIN') {
        out.push('<div class="mg-margin"><p>' + content.join(' ') + '</p></div>');
        return;
      }

      // Explicit pull quote
      if (keyword === 'QUOTE') {
        out.push('<aside class="mg-pull"><blockquote>' + content.join(' ') + '</blockquote></aside>');
        return;
      }
    }

    // Plain blockquote → pull quote
    content = bqLines.map(inlines);
    out.push('<aside class="mg-pull"><blockquote>' + content.join(' ') + '</blockquote></aside>');
  }

  /* ── Export ──────────────────────────────────────────────────────────── */

  if (typeof window !== 'undefined') {
    window.Marginalia = window.Marginalia || {};
    window.Marginalia.md = convert;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { convert: convert };
  }
})();
