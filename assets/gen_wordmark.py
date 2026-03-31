"""
Marginalia wordmark generator.
Renders the library name with its signature design elements:
  - Left-border accent line (3px universal callout indicator)
  - 3D perspective tilt (the pull-quote signature)
  - Dark theme with cyan-teal accent (#50b4c8)

Outputs:
  github-social-1280x640.png  — GitHub social preview / OG image
  wordmark-800x200.png        — Smaller wordmark for README headers
"""

from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, math

# ── Colors ──────────────────────────────────────────────────────────────────
BG = (10, 10, 15)            # Near-black (matches --mg-bg)
ACCENT = (80, 180, 200)      # #50b4c8 cyan-teal
ACCENT_DIM = (50, 110, 125)  # Dimmed accent for subtitle
TEXT_CREAM = (230, 228, 210)  # Cream — softer than pure white on OLED
BORDER_COLOR = ACCENT

# ── Fonts ───────────────────────────────────────────────────────────────────
FONT_PATHS = [
    '/System/Library/Fonts/Helvetica.ttc',
    '/System/Library/Fonts/SFCompact.ttf',
    '/Library/Fonts/Arial Bold.ttf',
    '/System/Library/Fonts/Supplemental/Arial Bold.ttf',
]

def find_font(size, bold=True):
    for p in FONT_PATHS:
        if os.path.exists(p):
            idx = 1 if (bold and p.endswith('.ttc')) else 0
            return ImageFont.truetype(p, size, index=idx)
    return ImageFont.load_default()


def luminance(rgb):
    r, g, b = [c / 255.0 for c in rgb]
    r = r / 12.92 if r <= 0.03928 else ((r + 0.055) / 1.055) ** 2.4
    g = g / 12.92 if g <= 0.03928 else ((g + 0.055) / 1.055) ** 2.4
    b = b / 12.92 if b <= 0.03928 else ((b + 0.055) / 1.055) ** 2.4
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def contrast_ratio(fg, bg):
    l1, l2 = luminance(fg), luminance(bg)
    if l1 < l2:
        l1, l2 = l2, l1
    return (l1 + 0.05) / (l2 + 0.05)


def perspective_transform(img, skew=0.04):
    """Apply a subtle Y-axis perspective tilt (like rotateY(-14deg)).
    skew > 0 means the left edge recedes, right edge comes forward."""
    w, h = img.size
    # Perspective coefficients: shrink left edge, keep right edge full
    d = int(h * skew)
    # Map: (0,d) (w,0) (w,h) (0,h-d) → (0,0) (w,0) (w,h) (0,h)
    coeffs = self_find_coeffs(
        [(0, d), (w, 0), (w, h), (0, h - d)],
        [(0, 0), (w, 0), (w, h), (0, h)]
    )
    return img.transform((w, h), Image.PERSPECTIVE, coeffs, Image.BICUBIC,
                          fillcolor=(0, 0, 0, 0))


def self_find_coeffs(source, target):
    """Find perspective transform coefficients (no numpy needed).
    Solves 8x8 linear system via Gaussian elimination."""
    matrix = []
    for s, t in zip(source, target):
        matrix.append([t[0], t[1], 1, 0, 0, 0, -s[0]*t[0], -s[0]*t[1], s[0]])
        matrix.append([0, 0, 0, t[0], t[1], 1, -s[1]*t[0], -s[1]*t[1], s[1]])
    # Gaussian elimination with partial pivoting
    n = 8
    for col in range(n):
        # Find pivot
        max_row = max(range(col, n), key=lambda r: abs(matrix[r][col]))
        matrix[col], matrix[max_row] = matrix[max_row], matrix[col]
        pivot = matrix[col][col]
        if abs(pivot) < 1e-10:
            continue
        for row in range(col + 1, n):
            factor = matrix[row][col] / pivot
            for j in range(n + 1):
                matrix[row][j] -= factor * matrix[col][j]
    # Back substitution
    coeffs = [0.0] * n
    for row in range(n - 1, -1, -1):
        val = matrix[row][n]
        for j in range(row + 1, n):
            val -= matrix[row][j] * coeffs[j]
        coeffs[row] = val / matrix[row][row]
    return coeffs


def render_callout_block(width, height, title, subtitle, title_size, sub_size,
                         border_w=5, padding_left=40, tilt=True):
    """Render a perspective-tilted callout block with left-border accent."""
    # Work on a larger canvas for the tilt (we'll crop later)
    pad = 60
    cw, ch = width + pad * 2, height + pad * 2
    block = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    draw = ImageDraw.Draw(block)

    # Callout background panel
    panel_x = pad
    panel_y = pad
    panel_w = width
    panel_h = height
    # Rounded rect fill (dark panel, slightly lighter than bg)
    draw.rounded_rectangle(
        [panel_x, panel_y, panel_x + panel_w, panel_y + panel_h],
        radius=8,
        fill=(18, 20, 28, 230)
    )
    # Left border accent
    draw.rectangle(
        [panel_x, panel_y, panel_x + border_w, panel_y + panel_h],
        fill=BORDER_COLOR + (255,)
    )

    # Title text — drop cap "M" with "arginalia" and subtitle wrapping beside it
    drop_size = int(title_size * 2.4)
    font_drop = find_font(drop_size, bold=True)
    font_rest = find_font(title_size, bold=True)
    font_sub = find_font(sub_size, bold=False) if subtitle else None

    tx = panel_x + padding_left

    # Measure drop cap "M"
    m_bbox = draw.textbbox((0, 0), "M", font=font_drop)
    m_w = m_bbox[2] - m_bbox[0]
    m_h = m_bbox[3] - m_bbox[1]

    # Measure "arginalia"
    rest_bbox = draw.textbbox((0, 0), "arginalia", font=font_rest)
    rest_h = rest_bbox[3] - rest_bbox[1]

    # Measure subtitle
    sub_h = 0
    if font_sub and subtitle:
        sub_bbox = draw.textbbox((0, 0), subtitle, font=font_sub)
        sub_h = sub_bbox[3] - sub_bbox[1]

    # Layout: M spans two lines. Line 1 = "arginalia", Line 2 = subtitle.
    # Both lines sit to the right of M.
    line_gap = 10
    two_line_h = rest_h + line_gap + sub_h
    # Vertically center the whole block in the panel
    block_h = max(m_h, two_line_h)
    ty_base = panel_y + (panel_h - block_h) // 2

    # M top-aligns with the block
    m_y = ty_base

    # "arginalia" top-aligns with M (sits beside top of drop cap)
    rest_y = ty_base + 6  # small optical nudge down to align with M cap height

    # Subtitle sits below "arginalia", still beside M
    sy = rest_y + rest_h + line_gap

    # X position for text beside M
    gap = -2  # tight kern
    rx = tx + m_w + gap

    # Draw drop cap glow + text
    glow_color = ACCENT + (60,)
    for dx in range(-3, 4):
        for dy in range(-3, 4):
            if dx == 0 and dy == 0:
                continue
            draw.text((tx + dx, m_y + dy), "M", fill=glow_color, font=font_drop)
    draw.text((tx, m_y), "M", fill=ACCENT, font=font_drop)

    # Draw "arginalia" glow + text
    for dx in range(-3, 4):
        for dy in range(-3, 4):
            if dx == 0 and dy == 0:
                continue
            draw.text((rx + dx, rest_y + dy), "arginalia", fill=glow_color, font=font_rest)
    draw.text((rx, rest_y), "arginalia", fill=ACCENT, font=font_rest)

    # Draw subtitle beside M, below "arginalia"
    if font_sub and subtitle:
        draw.text((rx, sy), subtitle, fill=ACCENT_DIM + (200,), font=font_sub)

    # Apply perspective tilt if requested
    if tilt:
        block = perspective_transform(block, skew=0.035)

    return block


def gen_social_preview(out_path):
    """GitHub social preview: 1280x640."""
    W, H = 1280, 640
    img = Image.new('RGB', (W, H), BG)

    # Render the callout block
    block = render_callout_block(
        width=720, height=280,
        title="Marginalia",
        subtitle="typographic callouts for editorial HTML",
        title_size=96, sub_size=28,
        border_w=6, padding_left=50
    )

    # Center the block on canvas
    bw, bh = block.size
    x = (W - bw) // 2
    y = (H - bh) // 2 - 20
    img.paste(block, (x, y), block)

    # Component hints — small labels scattered around the block
    draw = ImageDraw.Draw(img)
    hint_font = find_font(16, bold=False)
    hints = [
        ("mg-pull", (180, 480)),
        ("mg-margin", (900, 120)),
        ("mg-callout", (160, 140)),
        ("mg-dropcap", (880, 490)),
        ("mg-spread", (540, 540)),
    ]
    for label, (hx, hy) in hints:
        draw.text((hx, hy), label, fill=(80, 180, 200, 80), font=hint_font)

    # Subtle grid dots (editorial feel)
    for gx in range(40, W, 80):
        for gy in range(40, H, 80):
            # Fade toward edges
            dx = abs(gx - W/2) / (W/2)
            dy = abs(gy - H/2) / (H/2)
            dist = math.sqrt(dx*dx + dy*dy)
            if dist > 0.6:
                alpha = max(0, int(20 * (1 - (dist - 0.6) / 0.4)))
                if alpha > 0:
                    draw.ellipse([gx-1, gy-1, gx+1, gy+1],
                                 fill=(80, 180, 200, alpha))

    # Convert to RGB for PNG save (flatten alpha)
    final = Image.new('RGB', (W, H), BG)
    final.paste(img)

    ratio = contrast_ratio(ACCENT, BG)
    print(f"Title contrast: {ratio:.1f}:1 {'PASS' if ratio >= 3.0 else 'FAIL'}")

    final.save(out_path, 'PNG')
    print(f"Saved: {out_path} ({W}x{H})")


def gen_wordmark(out_path):
    """Smaller wordmark for README / favicon context: 800x200."""
    W, H = 800, 200
    img = Image.new('RGBA', (W, H), BG + (255,))
    draw = ImageDraw.Draw(img)

    border_w = 4
    border_x = 60
    border_top = 30
    border_bot = H - 30

    # Left border accent line
    draw.rectangle([border_x, border_top, border_x + border_w, border_bot],
                   fill=BORDER_COLOR)

    # Drop cap "M" with "arginalia" and subtitle wrapping beside it
    drop_size = 140
    rest_size = 56
    sub_size = 20
    font_drop = find_font(drop_size, bold=True)
    font_rest = find_font(rest_size, bold=True)
    font_sub = find_font(sub_size, bold=False)
    subtitle = "typographic callouts for editorial HTML"

    tx = border_x + border_w + 16

    # Measure
    m_bbox = draw.textbbox((0, 0), "M", font=font_drop)
    m_w = m_bbox[2] - m_bbox[0]
    m_h = m_bbox[3] - m_bbox[1]
    rest_bbox = draw.textbbox((0, 0), "arginalia", font=font_rest)
    rest_h = rest_bbox[3] - rest_bbox[1]
    sub_bbox = draw.textbbox((0, 0), subtitle, font=font_sub)
    sub_h = sub_bbox[3] - sub_bbox[1]

    # Two lines beside M: "arginalia" + subtitle
    line_gap = 6
    two_line_h = rest_h + line_gap + sub_h
    block_h = max(m_h, two_line_h)
    ty_base = (H - block_h) // 2

    m_y = ty_base
    rest_y = ty_base + 4  # optical nudge
    sy = rest_y + rest_h + line_gap

    gap = -2
    rx = tx + m_w + gap

    # Drop cap glow + text
    for dx in range(-2, 3):
        for dy in range(-2, 3):
            if dx == 0 and dy == 0:
                continue
            draw.text((tx + dx, m_y + dy), "M", fill=ACCENT_DIM + (40,), font=font_drop)
    draw.text((tx, m_y), "M", fill=ACCENT, font=font_drop)

    # "arginalia" glow + text
    for dx in range(-2, 3):
        for dy in range(-2, 3):
            if dx == 0 and dy == 0:
                continue
            draw.text((rx + dx, rest_y + dy), "arginalia", fill=ACCENT_DIM + (40,), font=font_rest)
    draw.text((rx, rest_y), "arginalia", fill=ACCENT, font=font_rest)

    # Subtitle beside M, below "arginalia"
    draw.text((rx, sy), subtitle, fill=ACCENT_DIM + (200,), font=font_sub)

    # Apply perspective tilt to the whole image
    tilted = perspective_transform(img, skew=0.025)

    # Flatten to RGB
    final = Image.new('RGB', (W, H), BG)
    final.paste(tilted, (0, 0), tilted)

    ratio = contrast_ratio(ACCENT, BG)
    print(f"Wordmark contrast: {ratio:.1f}:1 {'PASS' if ratio >= 3.0 else 'FAIL'}")

    final.save(out_path, 'PNG')
    print(f"Saved: {out_path} ({W}x{H})")


if __name__ == '__main__':
    out_dir = os.path.dirname(os.path.abspath(__file__))
    gen_social_preview(os.path.join(out_dir, 'github-social-1280x640.png'))
    gen_wordmark(os.path.join(out_dir, 'wordmark-800x200.png'))
