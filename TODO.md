# Marginalia TODO

## Features

- [x] **Callout system** — six layout positions shipped as components 10-13:
  - **inline** — `mg-callout` (existed)
  - **inline with skew** — `mg-callout mg-skew` (4° perspective tilt)
  - **nestled edge, big font** — `mg-pull` (existed, with `mg-flat`/`mg-flip` modifiers)
  - **nestled edge, sidebar** — `mg-sidebar` (body-copy sized float, `mg-wide` variant)
  - **margin note** — `mg-margin` in `mg-margin-scope` (gutter on ≥1200px, inline fallback)
  - **content mode** — `data-content="repeat|insert"` on any callout
- [x] **Two-column spread** — `mg-spread` uses `column-count: 2` + `column-span: all` for magazine-style layout (component 14)
- [ ] **Pillow renderer** — Python module (`marginalia_render.py`) that takes marginalia markdown and outputs static images via Pillow. Same `llm.md` patterns, rendered as raster graphics for social cards, OG images, email newsletters, anywhere CSS can't reach. Key challenges: perspective transform for pull quote skew, text wrapping/flow for two-column spreads, accent color palette from CSS tokens. Could share the typographer's font stack and contrast verification. Entry point: `render(md_string, width=1200, height=630) → PIL.Image`
- [ ] **Image annotation overlays** — SVG overlays on `<figure>` images for arrows, labels, region markers. The v2.6 blog hand-rolls `position:absolute` SVGs for eccentricity arrows and fovea markers. Should be a `mg-annotated-image` component with declarative annotation data.

## Logo & Branding

- [ ] Generate logo candidates with Nano Banana 2 using prompts below
- [ ] Pick winner, refine if needed
- [ ] Export favicon.ico (16x16 + 32x32), favicon.svg, apple-touch-icon.png (180x180), og-image.png (1200x630)
- [ ] Wire favicon + OG tags into index.html `<head>`
- [ ] Set GitHub repo social preview

### Logo Prompts (Nano Banana 2)

**Identity**: Typographic callout library. Left-border accents, 3D perspective tilt, dark theme, cyan-teal accent `#50b4c8`.

#### Approach 1: Tilted Page (signature 3D effect)

```
Minimal geometric logo on pure black background. A single rectangle representing a
page, tilted in 3D perspective (rotated ~14 degrees on vertical axis), with a bold
cyan-teal vertical stripe along its left edge. The page surface is dark charcoal.
Clean vector style, no text, no gradients, no shadows. Flat geometric, suitable for
a 32px favicon. Color palette: #50b4c8 cyan stripe, #0f1117 page, #0a0a0f background.
```

#### Approach 2: Margin Annotation Mark

```
Minimal logo on black background. A vertical thin line (representing a page margin)
in dark gray, with a small hand-drawn annotation mark or asterisk-like glyph next to
it in cyan-teal (#50b4c8). The mark suggests a reader's marginal note — a scribbled
reference symbol. Geometric but slightly organic, like a careful pen stroke. No text.
Vector style, works at 16px. Background #0a0a0f.
```

#### Approach 3: Callout Stack (component colors)

```
Minimal abstract logo on black (#0a0a0f) background. Three short horizontal rounded
rectangles stacked vertically with small gaps, each with a bright left-edge accent:
top bar cyan (#50b4c8), middle bar green (#4caf50), bottom bar amber (#e6a817). The
bars are dark charcoal (#0f1117) fill. Clean flat vector, no text, no shadows.
Geometric and precise, like a tiny UI component diagram. Must read clearly at 16x16px.
```

### Head Tags (once assets ready)

```html
<link rel="icon" href="favicon.ico" sizes="32x32">
<link rel="icon" href="favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="apple-touch-icon.png">
<meta property="og:image" content="og-image.png">
```
