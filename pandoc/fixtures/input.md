---
title: Marginalia + Pandoc Round-trip Test
author: Test Fixture
date: 2026-04-12
---

# Marginalia + Pandoc

End-to-end test for the marginalia Lua filter and HTML template.

{dropcap}
Opening paragraph should get a large decorative initial letter. The remainder
of the paragraph flows normally with **bold** and *italic* preserved, and
`inline code` styled as `mg-inline-code`.

## Callouts (GitHub-style alerts)

> [!NOTE]
> This becomes an `mg-callout` with `data-type="note"` and a bold "Note:"
> prefix.

> [!TIP]
> Tips get the green accent via marginalia's data-type styling.

> [!WARNING]
> Warnings get the amber accent.

> [!IMPORTANT]
> Important gets the red accent.

## Extended alerts

> [!ASIDE]
> This sidebar floats beside the body on wide screens.

> [!MARGIN]
> A margin note — escapes to the gutter on wide viewports, inline on mobile.

> [!QUOTE]
> Explicit pull quote wrapped in `mg-pull` around a blockquote.

## Plain blockquote

> A plain blockquote with no marker becomes a 3D perspective pull quote — the
> signature marginalia component. Text auto-aligns toward the border accent.

## Inline elements

Inline ==highlighted text== becomes a `mg-mark` span. A {Badge} and a
{Important Thing: important} appear inline with `mg-badge` styling. Mix with
*italic* and **bold** and `code` in one sentence.

## Code block

```python
def hello():
    return "world"
```

## Footnotes

A sentence with a footnote reference[^1] should render as an `mg-fn` popover.

[^1]: The footnote content can contain **bold**, *italic*, and `code` — all
    preserved by the filter.

## Closing

The same source renders to HTML, PDF (via weasyprint or LaTeX), DOCX, or EPUB
without losing marginalia's typographic affordances.
