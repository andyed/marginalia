# Marginalia — LLM Quick Reference

Typographic callout library. Drop this into a system prompt to give your output editorial design.

## Setup

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/marginalia@latest/marginalia.css">
<script src="https://cdn.jsdelivr.net/npm/marginalia@latest/marginalia.js" defer></script>
<script src="https://cdn.jsdelivr.net/npm/marginalia@latest/marginalia-md.js" defer></script>
```

JS is optional. CSS handles everything. `marginalia-md.js` converts the markdown patterns below to styled HTML via `Marginalia.md(str)`.

## Markdown Patterns

Write standard markdown. These patterns convert to Marginalia components:

### Callouts (GitHub-style alerts)
```
> [!NOTE]
> Informational aside.

> [!TIP]
> Helpful suggestion.

> [!WARNING]
> Potential pitfall.

> [!IMPORTANT]
> Critical information.
```

### Pull Quote
```
> Any blockquote without an alert keyword becomes a 3D pull quote.
```

### Explicit Pull Quote
```
> [!QUOTE]
> Attributed or emphasized quotation.
```

### Code Block
````
```js
function example() { return true; }
```
````

### Inline Elements
```
==highlighted text==              → themed highlight
`inline code`                     → monospace snippet
{Badge}                           → accent label
{Badge: tip}                      → typed label (tip | warning | important)
[^1](Footnote text here)         → auto-numbered popover footnote
```

### Sidebar
```
> [!ASIDE]
> Tangential note that floats beside body text.
```

### Margin Note
```
> [!MARGIN]
> Escapes to the gutter on wide screens, inline on mobile.
```

### Drop Cap
```
{dropcap}
Opening paragraph gets a large decorative initial letter.
```

### Collapsible Section
```html
<details>
  <summary>Click to expand</summary>
  <div class="mg-collapse-body">
    Hidden content here.
  </div>
</details>
```

## Conversion

**Browser:** `Marginalia.md(markdownString)` returns HTML string.
**Node:** `require('./marginalia-md').convert(markdownString)` returns HTML string.

## Vite / npm

```bash
npm install marginalia
```

```js
import 'marginalia/marginalia.css';
import { convert } from 'marginalia/marginalia-md';

document.querySelector('#content').innerHTML = convert(markdownString);
```

## Tips

- Dark theme by default. Add `data-mg-theme="light"` to `<html>` for light mode.
- Plain `>` blockquotes become 3D perspective pull quotes — the signature component.
- All components work without JavaScript. JS adds copy buttons, smooth collapse, and lightbox.
- Add `data-bar="none"` to any element to remove the left border accent.
- Use `data-content="repeat"` when quoting source text, `data-content="insert"` for original commentary.
