# Marginalia — AI Contributor Guide

Design system contract for AI tools extending or modifying Marginalia.

## Project

Typographic callout library. 15 components, CSS custom properties, zero dependencies. Extracted from [Inside the Math](https://andyed.github.io/psychodeli-webgl-port/inside_the_math/) and [Scrutinizer](https://andyed.github.io/scrutinizer-www/).

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
- **Perspective text alignment rule:** text aligns toward the border accent. If the element has `border-left`, use `text-align: left`; if `border-right`, use `text-align: right`. The border is the visual anchor. Applies to pull quotes, margin notes, and any future perspective components.

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
pandoc/             Lua filter + HTML template + Constitution example
```

## Dead ends — things that were tried and abandoned

These sections are here so future contributors (human or AI) don't
reinvent dead ends or wonder why an obvious-looking approach isn't
already implemented.

### `.mg-center-wrap` — dual-float centered callout (removed 2026-04)

**Intent.** A callout that sits in the *center* of a column of body
text with text wrapping around it on *both* sides — left gutter and
right gutter flowing, callout floating in the middle. A magazine-spread
aesthetic.

**Approach.** Dual-float with `shape-outside`:

```css
.mg-center-wrap::before { float: left;  shape-outside: inset(...); }
.mg-center-r             { float: right; shape-outside: inset(...); }
.mg-center-wrap > .mg-callout {
  position: absolute; top: 0; left: 50%; transform: translateX(-50%);
}
```

A `::before` float on the left and a sibling `.mg-center-r` float on
the right, each with a `shape-outside` cutout on the inward-facing
edge, carving a centered rectangle out of the text flow. The callout
itself was `position: absolute` over that rectangle.

**Why it never worked.**

1. **Dual-float with matched shape-outside is fragile.** The two
   carve-outs have to align pixel-perfectly; any difference in height
   between the left and right pseudo-elements breaks the illusion. A
   `--mg-center-h` custom property was required per-callout to match
   heights manually — the opposite of "no configuration."
2. **`position: absolute` removes the callout from flow entirely.**
   Text wraps around the *floats*, not the callout. If the callout is
   taller than the floats' height, body text flows under it. If
   shorter, there's dead vertical space below the callout inside the
   carved region.
3. **Absolute positioning breaks at any responsive breakpoint.** The
   mobile fallback (`@media (max-width: 720px)`) had to tear the whole
   thing down and fall back to a plain left-bordered callout — which
   means the "magazine spread" aesthetic only existed on desktop,
   requiring a totally different mental model for two-thirds of
   viewers.
4. **Shape-outside + absolute positioning + `transform: translateX`**
   stacks fragile CSS features whose interactions are undefined in the
   spec. Browser rendering was inconsistent between Chrome and Safari.

**Alternatives that would work better if someone tries this again.**

- **CSS multi-column with `column-span: all`** — the standard way to
  interrupt a multi-column text flow with a full-width callout. Native
  browser support, predictable reflow, mobile-friendly. Requires the
  surrounding text to be in a `column-count` or `column-width`
  container, which is a bigger layout commitment.
- **CSS Grid with a named area** — if the host page uses a grid,
  define a centered column area and drop the callout into it. Works
  per-template but isn't a drop-in library component.
- **Full-bleed horizontal break** — forget centering within text.
  Interrupt the column with a block that spans the full reading
  width, bordered top and bottom (like a pull quote but horizontal).
  The signature `.mg-pull` already has the 3D perspective; this would
  be its flat cousin. Simpler and survives mobile.
- **Sidenote sidebar** — give up the "text on both sides" ambition and
  float the callout into the right (or left) margin with `.mg-margin`.
  This is what the library already does well.

**Lesson.** Fragile layout tricks that require per-instance hand-tuning
(explicit heights, manual shape coordination, breakpoint-specific
fallbacks) don't belong in a zero-configuration component library.
When the happy path needs more code than the fallback path, the happy
path is wrong.
