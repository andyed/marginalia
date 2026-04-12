# Marginalia + Pandoc

Lua filter and HTML template that teach Pandoc to emit marginalia-styled HTML. Write standard markdown, get marginalia callouts, pull quotes, badges, and dropcaps in the output — then fan that one source out to HTML, PDF, DOCX, or EPUB.

## What it does

| Markdown input | HTML output |
|---|---|
| `> [!NOTE]` (also TIP / WARNING / IMPORTANT / CAUTION) | `<div class="mg-callout" data-type="note">` with `<strong>Note:</strong>` prefix |
| `> [!ASIDE]` | `<div class="mg-sidebar">` |
| `> [!MARGIN]` | `<div class="mg-margin">` |
| `> [!QUOTE]` | `<div class="mg-pull"><blockquote>…</blockquote></div>` |
| Plain `> blockquote` | `<div class="mg-pull"><blockquote>…</blockquote></div>` |
| `==text==` | `<span class="mg-mark">…</span>` |
| `{Badge}` / `{Multi Word Badge: type}` | `<span class="mg-badge" data-type="type">…</span>` |
| `[^1]` + `[^1]: note text` | `<span class="mg-fn"><a class="mg-fn-ref"></a><span class="mg-fn-body">…</span></span>` |
| `{dropcap}` line (form A or B) | next paragraph wrapped in `<div class="mg-dropcap">` |
| ` ``` ` fenced code block | `<pre class="mg-code" data-lang="…"><code>…</code></pre>` |
| `` `inline code` `` | `<code class="mg-inline-code">…</code>` |

## Usage

```bash
pandoc draft.md \
  --from markdown+mark+alerts \
  --lua-filter pandoc/marginalia.lua \
  --template pandoc/template.html \
  --standalone \
  -o draft.html
```

### Same source → PDF (via weasyprint)

```bash
pandoc draft.md \
  --from markdown+mark+alerts \
  --lua-filter pandoc/marginalia.lua \
  --template pandoc/template.html \
  --standalone \
  -o draft.html
weasyprint draft.html draft.pdf
```

Add `@page { size: A4; margin: 2cm }` to a custom CSS file if you need paper formatting.

### Same source → DOCX / EPUB

```bash
pandoc draft.md --from markdown+mark+alerts --lua-filter pandoc/marginalia.lua -o draft.docx
pandoc draft.md --from markdown+mark+alerts --lua-filter pandoc/marginalia.lua -o draft.epub
```

The filter still rewrites classes in these targets; visual fidelity depends on the output format's styling support.

## Requirements

- **Pandoc 3.2+** — earlier versions don't support the `+alerts` extension.
- **Reader extensions:** `+alerts` (GitHub-style callouts), `+mark` (`==highlight==`).
- **For PDF:** [`weasyprint`](https://weasyprint.org/) (pure Python, handles modern CSS) or a LaTeX distribution.

## Dropcap: two forms

Both work:

**Form A — blank line between marker and paragraph**
```markdown
{dropcap}

Opening paragraph gets the large initial letter.
```

**Form B — marker directly above paragraph**
```markdown
{dropcap}
Opening paragraph gets the large initial letter.
```

Both produce the same `<div class="mg-dropcap"><p>…</p></div>` wrapping. Marginalia's `.mg-dropcap::first-letter` rule cascades into the inner paragraph's first letter.

## Caveats

- **Pull quotes wrap in `<div>`**, not `<aside>`. Marginalia's class-based CSS selectors match either, but if you specifically need the semantic `<aside>` element, use `marginalia-md.js` in the browser instead of the pandoc path.
- **Callouts use `<div>`**, same reason.
- **Fenced code loses pandoc's syntax highlighting.** The filter emits `<pre class="mg-code">` as raw HTML to match marginalia's structure. If you want pandoc highlighting, remove the `CodeBlock` handler from `marginalia.lua`.
- **Footnotes lose block-level content.** Multi-paragraph footnotes are flattened to a single inline span. For single-paragraph footnotes (the common case), inline formatting is preserved.
- **`CAUTION` alerts map to `warning`** — marginalia has four callout types, GitHub has five.
- **`{}` patterns inside code blocks are not transformed.** Only plain text is walked.

## Testing

```bash
cd pandoc
pandoc fixtures/input.md \
  --from markdown+mark+alerts \
  --lua-filter marginalia.lua \
  --template template.html \
  --standalone \
  -o fixtures/output.html

open fixtures/output.html
```

The fixture covers every transformation. Open `output.html` in a browser — you should see marginalia's dark theme with callouts, pull quotes, badges, sidebar, margin note, mark highlight, dropcap, fenced code, and a footnote popover.

## Files

- `marginalia.lua` — the filter (~220 lines, three ordered passes)
- `template.html` — minimal standalone HTML template with marginalia CDN tags
- `fixtures/input.md` — round-trip test input
- `fixtures/output.html` — generated reference output

## Why this matters

Marginalia's browser-side `marginalia-md.js` converts markdown in the user's browser. Pandoc shifts that work to build time and unlocks the full pandoc output matrix — one source renders to web, paper, document, and ebook with the same editorial voice. Pair it with `weasyprint` and you have a complete markdown-to-PDF pipeline for paper drafts, reports, and archived blog posts without ever touching LaTeX.
