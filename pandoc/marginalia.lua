-- marginalia.lua — Pandoc Lua filter for marginalia-styled HTML output.
--
-- Transforms the Pandoc AST so that the HTML writer emits marginalia classes.
-- Pair with template.html, which loads the marginalia CDN assets.
--
-- Usage:
--   pandoc input.md \
--     --from markdown+mark+alerts \
--     --lua-filter marginalia.lua \
--     --template template.html \
--     --standalone \
--     -o output.html
--
-- Reader extensions required:
--   +alerts  → parses GitHub-style > [!NOTE] blocks into Div with class
--              "note"/"tip"/"warning"/"important"/"caution"
--   +mark    → parses ==text== into Span with class "mark"
--
-- Covers:
--   GitHub alerts (+alerts)                    → mg-callout[data-type]
--   Extended alerts ASIDE / MARGIN / QUOTE     → mg-sidebar / mg-margin / mg-pull
--   Plain blockquotes                          → mg-pull pull quote
--   ==text== (+mark)                           → mg-mark span
--   {Badge} and {Badge: type} (multi-word ok)  → mg-badge span
--   Footnotes                                  → mg-fn popover structure
--   Inline code                                → mg-inline-code
--   Fenced code                                → mg-code pre with data-lang
--   {dropcap} line marker                      → mg-dropcap wrapper on next para

-- Pandoc's +alerts extension emits Div with one of these classes (no prefix).
local ALERT_TYPES = {
  ["note"]      = "note",
  ["tip"]       = "tip",
  ["warning"]   = "warning",
  ["important"] = "important",
  ["caution"]   = "warning",  -- marginalia has no caution; fold into warning
}

local ALERT_LABELS = {
  note = "Note", tip = "Tip", warning = "Warning", important = "Important",
}

-- Prepend "<strong>Label:</strong> " to the first paragraph of a callout body,
-- matching marginalia-md.js behavior.
local function prepend_label(blocks, label)
  if #blocks == 0 then
    return { pandoc.Para({ pandoc.Strong({ pandoc.Str(label .. ":") }) }) }
  end
  local first = blocks[1]
  if first.t == "Para" or first.t == "Plain" then
    local new_inlines = { pandoc.Strong({ pandoc.Str(label .. ":") }), pandoc.Space() }
    for _, inl in ipairs(first.content) do
      table.insert(new_inlines, inl)
    end
    first.content = new_inlines
  else
    table.insert(blocks, 1,
      pandoc.Para({ pandoc.Strong({ pandoc.Str(label .. ":") }) }))
  end
  return blocks
end

-- ── Pass 1: inline transforms ────────────────────────────────────────────────

-- Split a Str on {...} patterns and emit mg-badge spans for each match.
local function split_badges(text)
  local result = {}
  local i = 1
  while i <= #text do
    local brace_start, brace_end = text:find("{[^}]+}", i)
    if not brace_start then
      if i <= #text then
        table.insert(result, pandoc.Str(text:sub(i)))
      end
      break
    end
    if brace_start > i then
      table.insert(result, pandoc.Str(text:sub(i, brace_start - 1)))
    end
    local content = text:sub(brace_start + 1, brace_end - 1)
    local text_part, type_part = content:match("^(.-):%s*(.+)$")
    if text_part and type_part then
      local trimmed = text_part:match("^%s*(.-)%s*$")
      table.insert(result, pandoc.Span(
        { pandoc.Str(trimmed) },
        pandoc.Attr("", { "mg-badge" }, { ["data-type"] = type_part })))
    else
      table.insert(result, pandoc.Span(
        { pandoc.Str(content) },
        pandoc.Attr("", { "mg-badge" })))
    end
    i = brace_end + 1
  end
  return result
end

-- Walk an Inlines list, joining adjacent Str+Space tokens when needed so that
-- multi-word badges like {Important Thing: tip} match even though pandoc has
-- split them across multiple Str elements.
local function Inlines(inlines)
  -- Quick exit: no Str contains a brace → no work to do
  local has_brace = false
  for _, el in ipairs(inlines) do
    if el.t == "Str" and el.text:find("[{}]") and el.text ~= "{dropcap}" then
      has_brace = true
      break
    end
  end
  if not has_brace then return nil end

  local result = {}
  local i = 1
  local n = #inlines
  while i <= n do
    local cur = inlines[i]
    if cur.t ~= "Str" or cur.text == "{dropcap}" or not cur.text:find("{") then
      table.insert(result, cur)
      i = i + 1
    else
      -- Start of a potential badge. Accumulate Str+Space tokens until a
      -- closing brace appears (or we hit a non-text inline, in which case
      -- we abandon and treat the opener as literal text).
      local acc = cur.text
      local end_i = nil
      if acc:find("}") then
        end_i = i
      else
        local j = i + 1
        while j <= n do
          local nxt = inlines[j]
          if nxt.t == "Str" then
            acc = acc .. nxt.text
            if nxt.text:find("}") then
              end_i = j
              break
            end
          elseif nxt.t == "Space" then
            acc = acc .. " "
          else
            break
          end
          j = j + 1
        end
      end

      if end_i then
        for _, p in ipairs(split_badges(acc)) do
          table.insert(result, p)
        end
        i = end_i + 1
      else
        table.insert(result, cur)
        i = i + 1
      end
    end
  end
  return result
end

-- Inline code: add mg-inline-code class.
local function Code(el)
  table.insert(el.classes, "mg-inline-code")
  return el
end

-- ==text== → <span class="mg-mark">. Pandoc with +mark parses as Span.mark.
local function Span(el)
  for _, cls in ipairs(el.classes) do
    if cls == "mark" then
      el.classes = { "mg-mark" }
      return el
    end
  end
  return nil
end

-- Footnote → <span class="mg-fn"><a class="mg-fn-ref"></a><span class="mg-fn-body">...</span></span>
local function Note(el)
  local inlines = {}
  for _, block in ipairs(el.content) do
    if block.t == "Para" or block.t == "Plain" then
      for _, inl in ipairs(block.content) do
        table.insert(inlines, inl)
      end
    end
  end
  local body = pandoc.Span(inlines, pandoc.Attr("", { "mg-fn-body" }))
  local ref = pandoc.RawInline("html", '<a class="mg-fn-ref" tabindex="0"></a>')
  return pandoc.Span({ ref, body }, pandoc.Attr("", { "mg-fn" }))
end

-- ── Pass 2: block transforms ─────────────────────────────────────────────────

-- Pandoc's +alerts extension parses > [!NOTE] into a Div with class "note"
-- containing a nested Div with class "title" (holding the label) followed by
-- the body blocks. We strip the inner title div (marginalia prepends its own
-- bold label) and rewrap with mg-callout + data-type.
local function Div(el)
  for _, cls in ipairs(el.classes) do
    local mapped = ALERT_TYPES[cls]
    if mapped then
      local body_blocks = {}
      for _, child in ipairs(el.content) do
        local is_title = false
        if child.t == "Div" then
          for _, c in ipairs(child.classes) do
            if c == "title" then is_title = true break end
          end
        end
        if not is_title then
          table.insert(body_blocks, child)
        end
      end
      body_blocks = prepend_label(body_blocks, ALERT_LABELS[mapped])
      return pandoc.Div(body_blocks,
        pandoc.Attr("", { "mg-callout" }, { ["data-type"] = mapped }))
    end
  end
  return nil
end

-- Extract a leading [!MARKER] from a list of inlines. Returns the uppercased
-- marker and the remaining inlines with the marker + following break removed.
local function extract_marker(inlines)
  if #inlines == 0 then return nil, inlines end
  local first = inlines[1]
  if first.t ~= "Str" then return nil, inlines end
  local marker = first.text:match("^%[!(%w+)%]$")
  if not marker then return nil, inlines end
  local rest = {}
  local start_idx = 2
  if inlines[2]
     and (inlines[2].t == "SoftBreak" or inlines[2].t == "LineBreak"
          or inlines[2].t == "Space") then
    start_idx = 3
  end
  for i = start_idx, #inlines do
    table.insert(rest, inlines[i])
  end
  return marker:upper(), rest
end

-- Blockquotes: handle ASIDE / MARGIN / QUOTE, plus plain → pull quote.
-- NOTE/TIP/WARNING/IMPORTANT are already handled by the Div walker above,
-- because pandoc 3.2+ pre-parses them before the filter runs.
local function BlockQuote(el)
  if #el.content == 0 then return nil end
  local first = el.content[1]
  local marker, rest_inlines = nil, nil
  if (first.t == "Para" or first.t == "Plain") and #first.content > 0 then
    marker, rest_inlines = extract_marker(first.content)
  end

  local body = {}
  for _, b in ipairs(el.content) do table.insert(body, b) end

  if marker then
    if rest_inlines and #rest_inlines > 0 then
      body[1] = pandoc.Para(rest_inlines)
    else
      table.remove(body, 1)
    end
    if marker == "ASIDE" then
      return pandoc.Div(body, pandoc.Attr("", { "mg-sidebar" }))
    elseif marker == "MARGIN" then
      return pandoc.Div(body, pandoc.Attr("", { "mg-margin" }))
    elseif marker == "QUOTE" then
      return pandoc.Div(
        { pandoc.BlockQuote(body) },
        pandoc.Attr("", { "mg-pull" }))
    end
    -- Any other unknown marker: fall through to plain pull quote behavior.
  end

  -- Plain blockquote → pull quote
  return pandoc.Div({ el }, pandoc.Attr("", { "mg-pull" }))
end

-- Fenced code block → <pre class="mg-code" data-lang="lang"><code>...</code></pre>
local function CodeBlock(el)
  local lang = el.classes[1] or ""
  local lang_attr = lang ~= "" and (' data-lang="' .. lang .. '"') or ""
  local escaped = el.text
    :gsub("&", "&amp;")
    :gsub("<", "&lt;")
    :gsub(">", "&gt;")
  return pandoc.RawBlock("html",
    '<pre class="mg-code"' .. lang_attr .. '><code>' .. escaped .. '</code></pre>')
end

-- ── Pass 3: document-level dropcap ───────────────────────────────────────────

-- Walk top-level blocks. Two forms are supported:
--
--   Form A (blank line between marker and paragraph):
--     {dropcap}
--
--     Opening paragraph…
--   → marker is its own Para; strip it and wrap the following Para.
--
--   Form B (marker on its own line, paragraph directly below without blank):
--     {dropcap}
--     Opening paragraph…
--   → pandoc merges these into one Para where the first inline is
--     Str "{dropcap}" followed by SoftBreak/Space and the real content.
--     Strip the marker + break and wrap the paragraph.
local function Pandoc(doc)
  local new_blocks = {}
  local apply_dropcap = false

  for _, block in ipairs(doc.blocks) do
    -- Form A marker paragraph
    if block.t == "Para" and #block.content == 1
       and block.content[1].t == "Str"
       and block.content[1].text == "{dropcap}" then
      apply_dropcap = true
    -- Form A body paragraph
    elseif apply_dropcap and (block.t == "Para" or block.t == "Plain") then
      table.insert(new_blocks,
        pandoc.Div({ block }, pandoc.Attr("", { "mg-dropcap" })))
      apply_dropcap = false
    -- Form B: marker + break at start of a single Para
    elseif block.t == "Para" and #block.content >= 2
           and block.content[1].t == "Str"
           and block.content[1].text == "{dropcap}"
           and (block.content[2].t == "SoftBreak"
                or block.content[2].t == "LineBreak"
                or block.content[2].t == "Space") then
      local stripped = {}
      for i = 3, #block.content do
        table.insert(stripped, block.content[i])
      end
      table.insert(new_blocks,
        pandoc.Div({ pandoc.Para(stripped) },
          pandoc.Attr("", { "mg-dropcap" })))
    else
      if apply_dropcap then
        table.insert(new_blocks, pandoc.Para({ pandoc.Str("{dropcap}") }))
        apply_dropcap = false
      end
      table.insert(new_blocks, block)
    end
  end
  if apply_dropcap then
    table.insert(new_blocks, pandoc.Para({ pandoc.Str("{dropcap}") }))
  end
  doc.blocks = new_blocks
  return doc
end

-- ── Filter registration (ordered passes) ─────────────────────────────────────

return {
  { -- Pass 1: inline transforms
    Inlines = Inlines,
    Code = Code,
    Span = Span,
    Note = Note,
  },
  { -- Pass 2: block transforms
    CodeBlock = CodeBlock,
    Div = Div,
    BlockQuote = BlockQuote,
  },
  { -- Pass 3: document-level dropcap handler
    Pandoc = Pandoc,
  },
}
