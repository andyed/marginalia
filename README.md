# Marginalia

Typographic callout library. 15 components, CSS custom properties, zero dependencies.

Extracted from [Inside the Math](https://andyed.github.io/psychodeli-webgl-port/inside_the_math/) and [Scrutinizer](https://andyed.github.io/scrutinizer-www/) blog posts. Inspired by the editorial layouts of Rolling Stone and early Wired.

![Marginalia showcase](images/showcase_03072026.png)

**[Live Demo & Documentation](https://andyed.github.io/marginalia/)**

## Install

```html
<link rel="stylesheet" href="marginalia.css">
<script src="marginalia.js" defer></script>
```

JS is optional. All components work without it.

### Vite / npm

```bash
npm install marginalia
```

```js
import 'marginalia/marginalia.css';
import { convert } from 'marginalia/md';

document.querySelector('#content').innerHTML = convert(markdownString);
```

## Markdown Converter

`marginalia-md.js` converts a markdown subset into Marginalia-classed HTML. Write standard markdown — GitHub-style alerts, fenced code blocks, `==highlights==`, `{badges}` — and get styled components out.

```html
<script src="marginalia-md.js" defer></script>
<script>
  document.querySelector('#content').innerHTML = Marginalia.md(markdownString);
</script>
```

See [`llm.md`](llm.md) for the full pattern reference, designed to drop into an LLM system prompt.

## Components

| Component | Element | Key feature |
|-----------|---------|-------------|
| Callout | `<div class="mg-callout" data-type="note">` | 4 semantic variants, left-border indicator |
| Pull quote | `<aside class="mg-pull">` | 3D perspective tilt, `shape-outside` text wrapping |
| Code block | `<pre class="mg-code" data-lang="js">` | Language label, copy button (JS) |
| Badge | `<span class="mg-badge">` | Small caps, inline label |
| Collapse | `<details class="mg-collapse">` | Native `<details>`, smooth animation (JS) |
| Highlight | `<mark class="mg-mark">` | Theme-aware inline highlight |
| Drop Cap | `<p class="mg-dropcap">` | `::first-letter` large initial, ornate variant |
| Lead-in | `<span class="mg-lede">` | Rubricated opening words, small-caps variant |
| Footnotes | `<span class="mg-fn">` | Auto-numbered popover, tap-to-toggle |
| Gallery | `<figure class="mg-gallery">` | Click-to-expand lightbox, side-by-side compare |
| Inline Skew | `<div class="mg-callout mg-skew">` | Perspective-tilted block callout |
| Sidebar | `<aside class="mg-sidebar">` | Float-right body-copy tangential note |
| Margin Note | `<div class="mg-margin">` | Escapes into gutter on wide screens, inline on mobile |
| Content Mode | `data-content="repeat\|insert"` | Signals duplicated body text vs new standalone content |
| Spread | `<div class="mg-spread">` | Two-column magazine layout, callouts bridge columns |

## Usage Examples

```html
<!-- Drop cap -->
<p class="mg-dropcap">Your opening paragraph.</p>
<p class="mg-dropcap" data-type="ornate">Ornate variant with border accent.</p>
```

## Theming

Dark by default. Override via CSS custom properties (`--mg-*`). Light theme via `data-mg-theme="light"` or `prefers-color-scheme`.

## License

MIT
