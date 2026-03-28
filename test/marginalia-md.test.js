'use strict';

var test = require('node:test');
var assert = require('node:assert/strict');
var mg = require('../marginalia-md.js');

/* ── Callout alerts ───────────────────────────────────────────────────── */

test('callout: note', function () {
  var html = mg.convert('> [!NOTE]\n> This is a note.');
  assert.match(html, /class="mg-callout" data-type="note"/);
  assert.match(html, /<strong>Note:<\/strong> This is a note\./);
});

test('callout: tip', function () {
  var html = mg.convert('> [!TIP]\n> Helpful hint.');
  assert.match(html, /data-type="tip"/);
  assert.match(html, /<strong>Tip:<\/strong>/);
});

test('callout: warning', function () {
  var html = mg.convert('> [!WARNING]\n> Be careful.');
  assert.match(html, /data-type="warning"/);
  assert.match(html, /<strong>Warning:<\/strong>/);
});

test('callout: important', function () {
  var html = mg.convert('> [!IMPORTANT]\n> Critical info.');
  assert.match(html, /data-type="important"/);
  assert.match(html, /<strong>Important:<\/strong>/);
});

test('callout: multi-line content joins', function () {
  var html = mg.convert('> [!NOTE]\n> Line one.\n> Line two.');
  assert.match(html, /Line one\. Line two\./);
});

/* ── Pull quotes ──────────────────────────────────────────────────────── */

test('plain blockquote becomes pull quote', function () {
  var html = mg.convert('> The retina is not a camera.');
  assert.match(html, /class="mg-pull"/);
  assert.match(html, /<blockquote>/);
});

test('explicit [!QUOTE] becomes pull quote', function () {
  var html = mg.convert('> [!QUOTE]\n> Words of wisdom.');
  assert.match(html, /class="mg-pull"/);
  assert.match(html, /Words of wisdom/);
});

/* ── Code blocks ──────────────────────────────────────────────────────── */

test('fenced code block with language', function () {
  var html = mg.convert('```js\nvar x = 1;\n```');
  assert.match(html, /class="mg-code" data-lang="js"/);
  assert.match(html, /<code>var x = 1;<\/code>/);
});

test('fenced code block without language', function () {
  var html = mg.convert('```\nplain code\n```');
  assert.match(html, /class="mg-code"/);
  assert.ok(!html.includes('data-lang'));
});

test('code block escapes HTML', function () {
  var html = mg.convert('```html\n<div class="test">&amp;</div>\n```');
  assert.match(html, /&lt;div class="test"&gt;/);
  assert.match(html, /&amp;amp;/);
});

/* ── Inline elements ──────────────────────────────────────────────────── */

test('highlight: ==text==', function () {
  var html = mg.convert('Some ==highlighted== text.');
  assert.match(html, /<mark class="mg-mark">highlighted<\/mark>/);
});

test('inline code: `code`', function () {
  var html = mg.convert('Use `foo()` here.');
  assert.match(html, /<code class="mg-inline-code">foo\(\)<\/code>/);
});

test('bold: **text**', function () {
  var html = mg.convert('This is **bold** text.');
  assert.match(html, /<strong>bold<\/strong>/);
});

test('italic: *text*', function () {
  var html = mg.convert('This is *italic* text.');
  assert.match(html, /<em>italic<\/em>/);
});

test('link: [text](url)', function () {
  var html = mg.convert('See [docs](https://example.com) here.');
  assert.match(html, /<a href="https:\/\/example\.com">docs<\/a>/);
});

test('image: ![alt](src)', function () {
  var html = mg.convert('![photo](img.png)');
  assert.match(html, /<img src="img\.png" alt="photo">/);
});

/* ── Badges ───────────────────────────────────────────────────────────── */

test('plain badge: {text}', function () {
  var html = mg.convert('Status {New} here.');
  assert.match(html, /<span class="mg-badge">New<\/span>/);
});

test('typed badge: {text: type}', function () {
  var html = mg.convert('Alert {Critical: warning} flag.');
  assert.match(html, /<span class="mg-badge" data-type="warning">Critical<\/span>/);
});

test('typed badge before plain badge', function () {
  var html = mg.convert('{A: tip} and {B} together.');
  assert.match(html, /data-type="tip">A</);
  assert.match(html, /<span class="mg-badge">B<\/span>/);
});

/* ── Footnotes ────────────────────────────────────────────────────────── */

test('inline footnote: [^N](text)', function () {
  var html = mg.convert('Word[^1](Footnote content) continues.');
  assert.match(html, /class="mg-fn"/);
  assert.match(html, /class="mg-fn-ref"/);
  assert.match(html, /class="mg-fn-body">Footnote content</);
});

/* ── Sidebar and margin ───────────────────────────────────────────────── */

test('sidebar: [!ASIDE]', function () {
  var html = mg.convert('> [!ASIDE]\n> Side note.');
  assert.match(html, /class="mg-sidebar"/);
  assert.match(html, /Side note\./);
});

test('margin note: [!MARGIN]', function () {
  var html = mg.convert('> [!MARGIN]\n> Gutter note.');
  assert.match(html, /class="mg-margin"/);
  assert.match(html, /Gutter note\./);
});

/* ── Headings ─────────────────────────────────────────────────────────── */

test('headings h1-h3', function () {
  var html = mg.convert('# Title\n\n## Subtitle\n\n### Section');
  assert.match(html, /<h1>Title<\/h1>/);
  assert.match(html, /<h2>Subtitle<\/h2>/);
  assert.match(html, /<h3>Section<\/h3>/);
});

test('heading with inline formatting', function () {
  var html = mg.convert('## A **bold** heading');
  assert.match(html, /<h2>A <strong>bold<\/strong> heading<\/h2>/);
});

/* ── Horizontal rule ──────────────────────────────────────────────────── */

test('horizontal rule', function () {
  var html = mg.convert('Above\n\n---\n\nBelow');
  assert.match(html, /<hr>/);
});

/* ── Drop cap ─────────────────────────────────────────────────────────── */

test('dropcap marker', function () {
  var html = mg.convert('{dropcap}\nOpening paragraph.');
  assert.match(html, /class="mg-dropcap"/);
  assert.match(html, /Opening paragraph\./);
});

test('dropcap only applies to next paragraph', function () {
  var html = mg.convert('{dropcap}\nFirst paragraph.\n\nSecond paragraph.');
  assert.match(html, /<p class="mg-dropcap">First paragraph\.<\/p>/);
  assert.match(html, /<p>Second paragraph\.<\/p>/);
});

/* ── Collapse passthrough ─────────────────────────────────────────────── */

test('details gets mg-collapse class', function () {
  var html = mg.convert('<details>\n<summary>Toggle</summary>\n<div class="mg-collapse-body">Content</div>\n</details>');
  assert.match(html, /class="mg-collapse"/);
  assert.match(html, /<summary>Toggle<\/summary>/);
});

test('details preserves existing mg-collapse', function () {
  var html = mg.convert('<details class="mg-collapse">\n<summary>Toggle</summary>\n</details>');
  // Should not double the class
  assert.ok(!html.includes('mg-collapse" class="mg-collapse'));
});

/* ── Paragraphs ───────────────────────────────────────────────────────── */

test('consecutive lines form one paragraph', function () {
  var html = mg.convert('Line one.\nLine two.\nLine three.');
  assert.match(html, /<p>Line one\. Line two\. Line three\.<\/p>/);
});

test('blank line splits paragraphs', function () {
  var html = mg.convert('First.\n\nSecond.');
  assert.match(html, /<p>First\.<\/p>/);
  assert.match(html, /<p>Second\.<\/p>/);
});

/* ── Combined / integration ───────────────────────────────────────────── */

test('full document with multiple components', function () {
  var md = [
    '# Title',
    '',
    '{dropcap}',
    'Opening with ==highlight== and {New} badge.',
    '',
    '> [!NOTE]',
    '> Important information.',
    '',
    '```js',
    'var x = 1;',
    '```',
    '',
    '> A memorable quote.',
  ].join('\n');

  var html = mg.convert(md);
  assert.match(html, /<h1>Title<\/h1>/);
  assert.match(html, /class="mg-dropcap"/);
  assert.match(html, /class="mg-mark"/);
  assert.match(html, /class="mg-badge"/);
  assert.match(html, /class="mg-callout"/);
  assert.match(html, /class="mg-code"/);
  assert.match(html, /class="mg-pull"/);
});
