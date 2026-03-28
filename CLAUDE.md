# Marginalia — AI Contributor Guide

Design system contract for AI tools extending or modifying Marginalia.

## Project

Typographic callout library. 14 components, CSS custom properties, zero dependencies. Extracted from [Inside the Math](https://andyed.github.io/psychodeli-webgl-port/inside_the_math/) and [Scrutinizer](https://andyed.github.io/scrutinizer-www/).

## Rules

### Namespace
- All CSS classes use `mg-` prefix. No exceptions.
- JS attaches to `window.Marginalia`.

### Theming
- CSS custom properties (`--mg-*`) are the theming API. Never hardcode colors.
- Light theme via `[data-mg-theme="light"]` or `@media (prefers-color-scheme: light)`.
- New color tokens go in the `:root` block alongside existing ones.

### Progressive Enhancement
- Every component must be fully functional with CSS only. JS enhances (animations, copy buttons).
- `marginalia.js` is optional. If it's not loaded, everything still works.

### Responsive
- 3D transforms (pull quotes) removed at `max-width: 720px`.
- All components must be readable on 320px viewports.

### Variants
- Add new semantic variants via `data-type` attributes, not new class names.
  - Good: `<div class="mg-callout" data-type="danger">`
  - Bad: `<div class="mg-callout-danger">`

### Design Language
- Left border (3px) is the universal callout indicator.
- Rounded right corners (`border-radius: 0 var(--mg-radius) var(--mg-radius) 0`) on bordered elements.
- Font stack inherits from host page. Library only sets `font-family` on monospace elements via `--mg-font-mono`.
- The 3D perspective pull quote is the signature component. Preserve: `perspective(600px) rotateY(14deg) scale(0.92)` and `shape-outside` polygon.

### Code Quality
- No build step. Ship raw CSS and JS.
- No dependencies.
- JS uses `'use strict'` and works in all browsers supporting `<details>` and `navigator.clipboard`.
- Keep `marginalia.css` under 700 lines and `marginalia.js` under 200 lines.

### Adding Components
1. Add CSS in `marginalia.css` under a labeled section comment.
2. If JS enhancement needed, add in `marginalia.js` and call from `init()`.
3. Add demo in `index.html` under a new `<section class="demo-section">`.
4. Update README component count and usage examples.

## File Structure
```
marginalia.css      Core styles + custom properties
marginalia.js       Optional: collapse animation, code copy, gallery lightbox
marginalia-md.js    Optional: markdown subset → Marginalia HTML converter
llm.md              LLM system prompt cheat sheet (markdown patterns reference)
index.html           Live demo (GitHub Pages)
screenshots/        README visuals
```
