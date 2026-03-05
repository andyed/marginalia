# Marginalia

Typographic callout library. 6 components, CSS custom properties, zero dependencies.

Extracted from [Inside the Math](https://andyed.github.io/psychodeli-webgl-port/inside_the_math/) and [Scrutinizer](https://andyed.github.io/scrutinizer-www/) blog posts.

**[Live Demo](https://andyed.github.io/marginalia/demo.html)**

## Components

### 1. Callout
Left-border callouts with semantic variants.
```html
<div class="mg-callout" data-type="note">
  <p><strong>Note:</strong> Content here.</p>
</div>
```
Variants: `note` `tip` `warning` `important`

### 2. Pull Quote
3D perspective-tilted aside with `shape-outside` text wrapping.
```html
<aside class="mg-pull">Quote text.</aside>
<aside class="mg-pull mg-flip">Left-floated variant.</aside>
```
Flattens to static on viewports below 720px.

<!-- Screenshot: 3D pull quote with body text wrapping -->

### 3. Code Block
Monospace block with language label and optional copy button (JS).
```html
<pre class="mg-code" data-lang="js">const x = 42;</pre>
```

### 4. Badge
Inline label, small caps.
```html
<span class="mg-badge">Default</span>
<span class="mg-badge" data-type="warning">Warning</span>
```

### 5. Collapse
Native `<details>` with styled header and smooth animation (JS).
```html
<details class="mg-collapse">
  <summary>Title</summary>
  <div class="mg-collapse-body">Content</div>
</details>
```

### 6. Highlight
Inline text highlight.
```html
<mark class="mg-mark">highlighted text</mark>
```

## Install

```html
<link rel="stylesheet" href="marginalia.css">
<script src="marginalia.js" defer></script>
```

JS is optional. All components work without it.

## Theming

Override CSS custom properties:

```css
:root {
  --mg-accent: #50b4c8;
  --mg-accent-rgb: 80, 180, 200;
  --mg-bg2: #0f1117;
  /* ... see marginalia.css for full token list */
}
```

Dark by default. Light theme activates via:
- `data-mg-theme="light"` on any ancestor
- `@media (prefers-color-scheme: light)` automatically

## Design Decisions

- **Left border = callout**. The 3px left border is the universal indicator across all components.
- **3D pull quote** is the signature piece: `perspective(600px) rotateY(14deg) scale(0.92)` with `shape-outside` polygon wrapping. Inspired by physical marginalia — notes that tilt away from the main text as if pinned to the page edge.
- **Progressive enhancement**. CSS-only base. JS adds animations and copy buttons.
- **`mg-` namespace**. All classes prefixed to avoid collisions.
- **Variants via `data-type`**, not extra class names.

## License

MIT
