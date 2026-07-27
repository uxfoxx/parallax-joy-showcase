#!/usr/bin/env python3
"""
Generates the Olive Foods brand guidelines & support document (PDF).

Everything in here is derived from the SITE itself so the document always
reflects the real brand:
  • Logos ....... the actual SVGs in src/assets (olive-foods-logo.svg,
                  olive-mark.svg), embedded as crisp vectors.
  • Colours ..... the design tokens in src/index.css (:root).
  • Gradients ... the signature .text-gradient-gold treatment + the forest
                  section washes and accent CTA, verbatim from index.css.
  • Type ........ Sora (display) / Inter (body).

Re-run after any rebrand:
    python3 scripts/generate-brand-guidelines.py

Output:   public/olive-foods-brand-guidelines.pdf
Requires: reportlab, pillow, svglib   (pip install --user reportlab pillow svglib)
"""
import colorsys
import os

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import Color
from reportlab.pdfgen import canvas
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LOGO_FULL = os.path.join(ROOT, "src/assets/olive-foods-logo.svg")   # illustrated wordmark
LOGO_MARK = os.path.join(ROOT, "src/assets/olive-mark.svg")         # compact branch mark
OUT = os.path.join(ROOT, "public/olive-foods-brand-guidelines.pdf")

W, H = A4  # 595.3 x 841.9 pt (portrait)
MX = 20 * mm  # page margin


# ─────────────────────────── colour helpers ───────────────────────────
def hsl(h, s, l, a=1.0):
    """CSS hsl() (deg, %, %) -> reportlab Color."""
    r, g, b = colorsys.hls_to_rgb(h / 360.0, l / 100.0, s / 100.0)
    return Color(r, g, b, a)


def hex_of(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h / 360.0, l / 100.0, s / 100.0)
    return "#%02X%02X%02X" % (round(r * 255), round(g * 255), round(b * 255))


def mix(c1, c2, t):
    return Color(c1.red + (c2.red - c1.red) * t,
                 c1.green + (c2.green - c1.green) * t,
                 c1.blue + (c2.blue - c1.blue) * t,
                 c1.alpha + (c2.alpha - c1.alpha) * t)


def alpha(c, a):
    return Color(c.red, c.green, c.blue, a)


# ── Brand tokens (mirror src/index.css :root) ──
FOREST_DEEP = (150, 40, 10)
FOREST_MID = (140, 50, 19)     # --primary
FOREST_LIGHT = (80, 50, 31)
CREAM = (42, 50, 96)
GOLD = (75, 38, 45)            # --accent / --gold
GOLD_LIGHT = (75, 40, 60)
GOLD_DEEP = (75, 50, 32)
INK = (140, 30, 10)           # --foreground
MUTED = (140, 10, 45)
BORDER = (80, 15, 88)
DARK_BG = (150, 40, 6)        # dark theme --background

C_FOREST_DEEP = hsl(*FOREST_DEEP)
C_FOREST_MID = hsl(*FOREST_MID)
C_FOREST_LIGHT = hsl(*FOREST_LIGHT)
C_CREAM = hsl(*CREAM)
C_GOLD = hsl(*GOLD)
C_GOLD_LIGHT = hsl(*GOLD_LIGHT)
C_GOLD_DEEP = hsl(*GOLD_DEEP)
C_INK = hsl(*INK)
C_MUTED = hsl(*MUTED)
C_BORDER = hsl(*BORDER)
C_DARK = hsl(*DARK_BG)
WHITE = Color(1, 1, 1)

# ── Signature gradients (verbatim from index.css) ──
# .text-gradient-gold  (headline on light) — forest → olive
GRAD_TEXT_LIGHT = [(0.0, hsl(140, 50, 20)), (0.5, hsl(112, 45, 24)), (1.0, hsl(82, 50, 28))]
# .text-gradient-gold-dark (headline on dark) — light olive → forest
GRAD_TEXT_DARK = [(0.0, hsl(82, 52, 58)), (0.5, hsl(110, 42, 60)), (1.0, hsl(140, 42, 58))]
# forest section wash — forest-deep → forest-mid → accent
GRAD_FOREST = [(0.0, C_FOREST_DEEP), (0.5, C_FOREST_MID), (1.0, C_GOLD)]
# accent CTA — accent → gold-light
GRAD_ACCENT = [(0.0, C_GOLD), (1.0, C_GOLD_LIGHT)]

DISPLAY = "Helvetica-Bold"
BODY = "Helvetica"

c = canvas.Canvas(OUT, pagesize=A4)
c.setTitle("Olive Foods — Brand Guidelines & Support Document")
c.setAuthor("Olive Foods (Pvt) Ltd")
c.setSubject("Brand guidelines and support document")


# ─────────────────────────── draw helpers ───────────────────────────
def draw_svg(path, x, y, target_w=None, target_h=None):
    """Embed an SVG as a crisp vector, scaled to target size, at (x, y) bottom-left."""
    d = svg2rlg(path)
    s = 1.0
    if target_w:
        s = target_w / d.width
    elif target_h:
        s = target_h / d.height
    d.scale(s, s)
    d.width *= s
    d.height *= s
    renderPDF.draw(d, c, x, y)
    return d.width, d.height


def color_at(stops, f):
    if f <= stops[0][0]:
        return stops[0][1]
    if f >= stops[-1][0]:
        return stops[-1][1]
    for i in range(len(stops) - 1):
        p0, c0 = stops[i]
        p1, c1 = stops[i + 1]
        if p0 <= f <= p1:
            t = (f - p0) / (p1 - p0) if p1 > p0 else 0
            return mix(c0, c1, t)
    return stops[-1][1]


def grad_rect(x, y, w, h, stops, horizontal=True, n=140):
    """Fill a rectangle with a multi-stop linear gradient (strip approximation)."""
    if horizontal:
        step = w / n
        for i in range(n):
            c.setFillColor(color_at(stops, i / (n - 1)))
            c.rect(x + i * step, y, step + 0.7, h, fill=1, stroke=0)
    else:
        step = h / n
        for i in range(n):
            c.setFillColor(color_at(stops, i / (n - 1)))
            c.rect(x, y + i * step, w, step + 0.7, fill=1, stroke=0)


def grad_roundrect(x, y, w, h, r, stops, horizontal=True):
    c.saveState()
    p = c.beginPath()
    p.roundRect(x, y, w, h, r)
    c.clipPath(p, stroke=0, fill=0)
    grad_rect(x, y, w, h, stops, horizontal)
    c.restoreState()


def grad_text(text, x, y, size, stops, font=DISPLAY):
    """Gradient-filled text — the site's signature headline treatment."""
    c.saveState()
    t = c.beginText(x, y)
    t.setFont(font, size)
    t.setCharSpace(0)  # defensive: don't inherit a leaked Tc
    t.setTextRenderMode(7)  # add glyph outlines to the clip path
    t.textOut(text)
    c.drawText(t)
    tw = c.stringWidth(text, font, size)
    grad_rect(x, y - 0.26 * size, tw, 1.08 * size, stops, horizontal=True)
    c.restoreState()
    return tw


def tracked_width(text, font, size, tracking):
    return c.stringWidth(text, font, size) + tracking * max(0, len(text) - 1)


def mono(text, x, y, size, color, tracking=1.6, font=BODY, align="left"):
    """Tracked uppercase label — the site's 'eyebrow' style."""
    text = text.upper()
    if align == "right":
        x -= tracked_width(text, font, size, tracking)
    elif align == "center":
        x -= tracked_width(text, font, size, tracking) / 2
    t = c.beginText(x, y)
    t.setFont(font, size)
    t.setFillColor(color)
    t.setCharSpace(tracking)
    t.textOut(text)
    t.setCharSpace(0)  # reset — PDF Tc persists across text objects otherwise
    c.drawText(t)


def running_head(section, folio, dark=False):
    col = WHITE if dark else C_INK
    faint = alpha(col, 0.45)
    mono("Olive Foods · Brand Guide", MX, H - 20 * mm, 6.5, faint)
    mono(section, W / 2, H - 20 * mm, 6.5, faint, align="center")
    mono(folio, W - MX, H - 20 * mm, 6.5, faint, align="right")
    c.setStrokeColor(alpha(col, 0.18))
    c.setLineWidth(0.6)
    c.line(MX, H - 23 * mm, W - MX, H - 23 * mm)


def section_head(no, title, headline):
    """Standard interior header: eyebrow + gradient headline."""
    mono("§ %s — %s" % (no, title), MX, H - 36 * mm, 8, C_GOLD_DEEP, 2)
    grad_text(headline, MX, H - 52 * mm, 27, GRAD_TEXT_LIGHT)


def accent_rule(x, y, w):
    """The site's accent divider — accent → transparent."""
    grad_rect(x, y, w, 1.4, [(0.0, C_GOLD), (1.0, alpha(C_GOLD, 0))])


# ════════════════════════ PAGE 1 — COVER ════════════════════════
def page_cover():
    grad_rect(0, 0, W, H, [(0.0, C_FOREST_DEEP), (1.0, hsl(150, 42, 8))], horizontal=False)
    # warm olive glow, top-right (echoes the site's hero lighting)
    for i, a in enumerate((0.06, 0.04, 0.025)):
        c.setFillColor(alpha(C_GOLD_LIGHT, a))
        c.circle(W - 60, H - 130, 80 + i * 42, fill=1, stroke=0)
    # accent hairline
    c.setStrokeColor(C_GOLD)
    c.setLineWidth(2)
    c.line(MX, H - 30 * mm, MX + 46, H - 30 * mm)
    mono("Olive Foods (Pvt) Ltd", MX, H - 40 * mm, 8, C_GOLD_LIGHT, 2.4)

    # title with the dark gradient headline treatment
    grad_text("Brand", MX - 1, H - 92 * mm, 60, GRAD_TEXT_DARK)
    grad_text("Guidelines", MX - 1, H - 118 * mm, 60, GRAD_TEXT_DARK)
    c.setFillColor(alpha(WHITE, 0.65))
    c.setFont(BODY, 12.5)
    c.drawString(MX, H - 131 * mm, "& Support Document — the marks, colour, gradients, type and voice.")

    # olive mark on a cream chip
    chip_w, chip_h = 86 * mm, 60 * mm
    cx, cy = MX, 80 * mm
    c.setFillColor(C_CREAM)
    c.roundRect(cx, cy, chip_w, chip_h, 12, fill=1, stroke=0)
    draw_svg(LOGO_MARK, cx + (chip_w - 40 * mm) / 2, cy + (chip_h - 40 * mm) / 2, target_w=40 * mm)

    c.setStrokeColor(alpha(WHITE, 0.15))
    c.setLineWidth(0.6)
    c.line(MX, 42 * mm, W - MX, 42 * mm)
    mono("Vol. I — MMXXVI", MX, 34 * mm, 7.5, alpha(WHITE, 0.5))
    mono("olivefoods.lk", W - MX, 34 * mm, 7.5, alpha(WHITE, 0.5), align="right")
    c.showPage()


# ════════════════════════ PAGE 2 — AT A GLANCE ════════════════════════
def page_glance():
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    running_head("At a Glance", "01 / 07")
    section_head("01", "At a Glance", "One brand, quietly premium.")

    c.setFillColor(C_MUTED)
    c.setFont(BODY, 11)
    c.drawString(MX, H - 66 * mm,
                 "Olive Foods imports and distributes quality food and consumer brands across Sri Lanka.")
    c.drawString(MX, H - 72 * mm,
                 "The identity is warm and grounded: deep forest greens, an olive gold, and confident type.")

    # tagline band with forest gradient
    by = H - 118 * mm
    grad_roundrect(MX, by, W - 2 * MX, 30 * mm, 12, GRAD_FOREST)
    mono("Tagline", MX + 8 * mm, by + 30 * mm - 9 * mm, 7, alpha(WHITE, 0.6), 2)
    c.setFillColor(WHITE)
    c.setFont(DISPLAY, 15)
    c.drawString(MX + 8 * mm, by + 11 * mm, "Quality You Can Trust. Excellence You Can Taste.")

    # what's inside — mini contents
    mono("Inside this document", MX, by - 14 * mm, 8, C_GOLD_DEEP, 2)
    items = [
        ("02", "The Logo", "Marks, clear space, misuse"),
        ("03", "Colour", "Forest greens & olive gold"),
        ("04", "Gradients", "The signature headline wash"),
        ("05", "Typography", "Sora & Inter"),
        ("06", "UI & Style", "Buttons, cards, dividers"),
        ("07", "Voice & Support", "Tone, assets, how to update"),
    ]
    iy = by - 24 * mm
    for no, title, desc in items:
        mono(no, MX, iy, 9, C_GOLD, 1.2, font=DISPLAY)
        c.setFillColor(C_INK)
        c.setFont(DISPLAY, 11)
        c.drawString(MX + 12 * mm, iy, title)
        c.setFillColor(C_MUTED)
        c.setFont(BODY, 10)
        c.drawString(MX + 52 * mm, iy, desc)
        c.setStrokeColor(alpha(C_INK, 0.08))
        c.setLineWidth(0.5)
        c.line(MX, iy - 4 * mm, W - MX, iy - 4 * mm)
        iy -= 11 * mm
    c.showPage()


# ════════════════════════ PAGE 3 — THE LOGO ════════════════════════
def page_logo():
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    running_head("The Logo", "02 / 07")
    section_head("02", "The Logo", "The mark, room to breathe.")

    # Primary logo on a cream panel
    panel_x, panel_y = MX, H - 150 * mm
    panel_w, panel_h = W - 2 * MX, 78 * mm
    c.setFillColor(C_CREAM)
    c.roundRect(panel_x, panel_y, panel_w, panel_h, 12, fill=1, stroke=0)
    draw_svg(LOGO_FULL, panel_x + (panel_w - 46 * mm) / 2, panel_y + 8 * mm, target_h=panel_h - 16 * mm)
    mono("Primary logo — olive-foods-logo.svg", panel_x + 8 * mm, panel_y + 6 * mm, 6.5, alpha(C_INK, 0.4), 1.4)

    # The compact mark, small card beside a note
    mark_y = panel_y - 46 * mm
    c.setFillColor(C_FOREST_DEEP)
    c.roundRect(MX, mark_y, 52 * mm, 40 * mm, 10, fill=1, stroke=0)
    draw_svg(LOGO_MARK, MX + (52 * mm - 26 * mm) / 2, mark_y + 7 * mm, target_w=26 * mm)
    mono("The mark", MX + 60 * mm, mark_y + 33 * mm, 8, C_GOLD_DEEP, 1.6)
    c.setFillColor(C_MUTED)
    c.setFont(BODY, 10)
    c.drawString(MX + 60 * mm, mark_y + 26 * mm, "olive-mark.svg — the compact olive-branch icon.")
    c.drawString(MX + 60 * mm, mark_y + 20 * mm, "Used in the nav bar, favicon and business cards")
    c.drawString(MX + 60 * mm, mark_y + 14 * mm, "where the full wordmark won't fit.")

    # usage notes
    notes = [
        ("Clear space", "Keep clear space around the logo — the mark's height."),
        ("Minimum size", "Never place the mark below 14 mm / 40 px wide."),
        ("Backgrounds", "Cream or white; on forest grounds, use a cream chip."),
        ("Don't", "Recolour, stretch, rotate, add effects, or box it in."),
    ]
    ny = mark_y - 12 * mm
    for label, body in notes:
        mono(label, MX, ny, 8, C_GOLD_DEEP, 1.6)
        c.setFillColor(C_MUTED)
        c.setFont(BODY, 10)
        c.drawString(58 * mm, ny, body)
        c.setStrokeColor(alpha(C_INK, 0.08))
        c.setLineWidth(0.5)
        c.line(MX, ny - 4.5 * mm, W - MX, ny - 4.5 * mm)
        ny -= 11 * mm
    c.showPage()


# ════════════════════════ PAGE 4 — COLOUR ════════════════════════
def page_colour():
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    running_head("Colour", "03 / 07")
    section_head("03", "Colour", "Forest greens, an olive gold.")

    swatches = [
        ("Forest Deep", FOREST_DEEP, "Dark grounds, footers, cover"),
        ("Forest Mid", FOREST_MID, "Primary green — buttons, panels"),
        ("Forest Light", FOREST_LIGHT, "Secondary green accents"),
        ("Olive / Accent", GOLD, "Accent, links, CTAs, glow"),
        ("Gold Light", GOLD_LIGHT, "Accents on dark grounds"),
        ("Gold Deep", GOLD_DEEP, "Eyebrows, hover states"),
        ("Cream", CREAM, "Warm light surfaces"),
        ("Ink", INK, "Body text on light"),
    ]
    cols, gap = 2, 8 * mm
    cw = (W - 2 * MX - gap) / 2
    ch = 30 * mm
    x0, y0 = MX, H - 70 * mm
    for i, (name, hslv, use) in enumerate(swatches):
        col, row = i % cols, i // cols
        x = x0 + col * (cw + gap)
        y = y0 - row * (ch + gap) - ch
        c.setFillColor(hsl(*hslv))
        c.roundRect(x, y, cw, ch, 8, fill=1, stroke=0)
        if name == "Cream":
            c.setStrokeColor(alpha(C_INK, 0.12))
            c.setLineWidth(0.6)
            c.roundRect(x, y, cw, ch, 8, fill=0, stroke=1)
        label_col = C_INK if name == "Cream" else WHITE
        c.setFillColor(label_col)
        c.setFont(DISPLAY, 12)
        c.drawString(x + 6 * mm, y + ch - 9 * mm, name)
        c.setFillColor(alpha(label_col, 0.72))
        c.setFont(BODY, 8)
        c.drawString(x + 6 * mm, y + ch - 15 * mm, use)
        mono(hex_of(*hslv), x + 6 * mm, y + 5.5 * mm, 8, alpha(label_col, 0.85), 1.1)
        c.setFont(BODY, 7.5)
        c.setFillColor(alpha(label_col, 0.6))
        c.drawRightString(x + cw - 6 * mm, y + 5.5 * mm, "HSL %d %d %d" % hslv)
    c.showPage()


# ════════════════════════ PAGE 5 — GRADIENTS ════════════════════════
def page_gradients():
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    running_head("Gradients", "04 / 07")
    section_head("04", "Gradients", "The signature wash.")

    c.setFillColor(C_MUTED)
    c.setFont(BODY, 10.5)
    c.drawString(MX, H - 64 * mm,
                 "Headlines use a forest→olive gradient — the brand's most recognisable move. Two variants:")

    # 1. Light headline gradient — live sample + swatch
    y = H - 86 * mm
    grad_text("Excellence You Can Taste.", MX, y, 22, GRAD_TEXT_LIGHT)
    mono(".text-gradient-gold  ·  on light", MX, y - 7 * mm, 7, C_GOLD_DEEP, 1.4)
    grad_roundrect(W - MX - 44 * mm, y - 8 * mm, 44 * mm, 12 * mm, 6, GRAD_TEXT_LIGHT)

    # 2. Dark headline gradient — on a forest card
    y2 = y - 26 * mm
    c.setFillColor(C_FOREST_DEEP)
    c.roundRect(MX, y2 - 14 * mm, W - 2 * MX, 24 * mm, 10, fill=1, stroke=0)
    grad_text("Quality You Can Trust.", MX + 8 * mm, y2, 20, GRAD_TEXT_DARK)
    mono(".text-gradient-gold-dark  ·  on forest", MX + 8 * mm, y2 - 7 * mm, 7, alpha(WHITE, 0.5), 1.4)

    # 3. Surface gradients
    mono("Surface gradients", MX, y2 - 26 * mm, 8, C_GOLD_DEEP, 2)
    gy = y2 - 62 * mm
    bw = (W - 2 * MX - 8 * mm) / 2
    # forest wash
    grad_roundrect(MX, gy, bw, 30 * mm, 10, GRAD_FOREST)
    c.setFillColor(WHITE)
    c.setFont(DISPLAY, 11)
    c.drawString(MX + 6 * mm, gy + 30 * mm - 9 * mm, "Forest wash")
    c.setFillColor(alpha(WHITE, 0.75))
    c.setFont(BODY, 8.5)
    c.drawString(MX + 6 * mm, gy + 8 * mm, "forest-deep → mid → accent")
    c.drawString(MX + 6 * mm, gy + 3.5 * mm, "Section backdrops, tagline band")
    # accent CTA
    ax = MX + bw + 8 * mm
    grad_roundrect(ax, gy, bw, 30 * mm, 10, GRAD_ACCENT)
    c.setFillColor(WHITE)
    c.setFont(DISPLAY, 11)
    c.drawString(ax + 6 * mm, gy + 30 * mm - 9 * mm, "Accent CTA")
    c.setFillColor(alpha(WHITE, 0.8))
    c.setFont(BODY, 8.5)
    c.drawString(ax + 6 * mm, gy + 8 * mm, "accent → gold-light")
    c.drawString(ax + 6 * mm, gy + 3.5 * mm, "Buttons, chips, highlights")

    # CSS reference
    mono("CSS — verbatim from index.css", MX, gy - 12 * mm, 7.5, C_GOLD_DEEP, 1.6)
    c.setFillColor(C_MUTED)
    c.setFont("Courier", 8)
    css = [
        "linear-gradient(135deg, hsl(140 50% 20%), hsl(112 45% 24%) 50%, hsl(82 50% 28%))",
        "linear-gradient(135deg, hsl(82 52% 58%), hsl(110 42% 60%) 50%, hsl(140 42% 58%))",
    ]
    cyy = gy - 18 * mm
    for line in css:
        c.drawString(MX, cyy, line)
        cyy -= 5 * mm
    c.showPage()


# ════════════════════════ PAGE 6 — TYPOGRAPHY ════════════════════════
def page_type():
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    running_head("Typography", "05 / 07")
    section_head("05", "Typography", "Two families, clear roles.")

    cards = [
        ("Sora", "Display", "Headings, numerals, eyebrows. Weights 400–800.", "Sourced with intent."),
        ("Inter", "Body", "Running text, labels, UI. Weights 300–700.", "Delivered with trust."),
    ]
    cy = H - 78 * mm
    for name, role, desc, sample in cards:
        c.setFillColor(C_CREAM)
        c.roundRect(MX, cy - 32 * mm, W - 2 * MX, 34 * mm, 10, fill=1, stroke=0)
        c.setFillColor(C_INK)
        c.setFont(DISPLAY, 40)
        c.drawString(MX + 8 * mm, cy - 22 * mm, "Aa")
        c.setFont(DISPLAY, 17)
        c.drawString(MX + 44 * mm, cy - 6 * mm, name)
        mono(role, MX + 44 * mm, cy - 12 * mm, 7.5, C_GOLD_DEEP, 1.8)
        c.setFillColor(C_MUTED)
        c.setFont(BODY, 10)
        c.drawString(MX + 44 * mm, cy - 19 * mm, desc)
        c.setFillColor(C_FOREST_MID)
        c.setFont(DISPLAY, 12)
        c.drawString(MX + 44 * mm, cy - 27 * mm, sample)
        cy -= 42 * mm

    # gradient headline demo
    mono("Headline treatment", MX, cy - 2 * mm, 8, C_GOLD_DEEP, 2)
    grad_text("Premium food, delivered.", MX, cy - 14 * mm, 24, GRAD_TEXT_LIGHT)
    c.setFillColor(C_MUTED)
    c.setFont(BODY, 9.5)
    c.drawString(MX, cy - 21 * mm, "Sora, bold, with .text-gradient-gold. Reserve the gradient for hero headlines.")
    c.showPage()


# ════════════════════════ PAGE 7 — UI & STYLE ════════════════════════
def page_ui():
    c.setFillColor(WHITE)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    running_head("UI & Style", "06 / 07")
    section_head("06", "UI & Style", "How the pieces feel.")

    # Buttons row
    mono("Buttons", MX, H - 64 * mm, 8, C_GOLD_DEEP, 2)
    by = H - 80 * mm
    # primary (accent gradient + glow)
    c.setFillColor(alpha(C_GOLD, 0.35))
    c.roundRect(MX + 2, by - 2, 46 * mm, 12 * mm, 20, fill=1, stroke=0)  # glow hint
    grad_roundrect(MX, by, 46 * mm, 12 * mm, 20, GRAD_ACCENT)
    c.setFillColor(WHITE)
    c.setFont(DISPLAY, 10)
    c.drawCentredString(MX + 23 * mm, by + 4.3 * mm, "Get in touch")
    # secondary (forest)
    sx = MX + 54 * mm
    c.setFillColor(C_FOREST_MID)
    c.roundRect(sx, by, 46 * mm, 12 * mm, 20, fill=1, stroke=0)
    c.setFillColor(WHITE)
    c.setFont(DISPLAY, 10)
    c.drawCentredString(sx + 23 * mm, by + 4.3 * mm, "Our products")
    # ghost
    gx = MX + 108 * mm
    c.setStrokeColor(C_BORDER)
    c.setLineWidth(1)
    c.roundRect(gx, by, 42 * mm, 12 * mm, 20, fill=0, stroke=1)
    c.setFillColor(C_INK)
    c.drawCentredString(gx + 21 * mm, by + 4.3 * mm, "Learn more")

    # Cards
    mono("Cards", MX, by - 16 * mm, 8, C_GOLD_DEEP, 2)
    cy = by - 66 * mm
    cw = (W - 2 * MX - 8 * mm) / 2
    for i, (title, body) in enumerate([("Rounded, soft", "radius 0.5rem · shadow-card"),
                                        ("Elevated", "shadow-float on hover")]):
        x = MX + i * (cw + 8 * mm)
        c.setFillColor(alpha(C_FOREST_DEEP, 0.10))
        c.roundRect(x + 3, cy - 3, cw, 42 * mm, 12, fill=1, stroke=0)  # shadow
        c.setFillColor(WHITE)
        c.roundRect(x, cy, cw, 42 * mm, 12, fill=1, stroke=0)
        c.setStrokeColor(C_BORDER)
        c.setLineWidth(0.8)
        c.roundRect(x, cy, cw, 42 * mm, 12, fill=0, stroke=1)
        # eyebrow chip
        c.setFillColor(alpha(C_GOLD, 0.15))
        c.roundRect(x + 6 * mm, cy + 42 * mm - 12 * mm, 20 * mm, 6 * mm, 3, fill=1, stroke=0)
        mono("Category", x + 8 * mm, cy + 42 * mm - 8 * mm, 6, C_GOLD_DEEP, 1.4)
        c.setFillColor(C_INK)
        c.setFont(DISPLAY, 12)
        c.drawString(x + 6 * mm, cy + 20 * mm, title)
        c.setFillColor(C_MUTED)
        c.setFont(BODY, 9)
        c.drawString(x + 6 * mm, cy + 13 * mm, body)

    # Dividers & eyebrows
    mono("Dividers & eyebrows", MX, cy - 14 * mm, 8, C_GOLD_DEEP, 2)
    accent_rule(MX, cy - 22 * mm, 70 * mm)
    mono("· Section eyebrow", MX, cy - 30 * mm, 8, C_GOLD_DEEP, 2)
    c.setFillColor(C_MUTED)
    c.setFont(BODY, 9.5)
    c.drawString(MX, cy - 40 * mm,
                 "Tracked uppercase labels in olive; accent→transparent hairline rules separate sections.")
    c.showPage()


# ════════════════════════ PAGE 8 — VOICE & SUPPORT ════════════════════════
def page_voice():
    grad_rect(0, 0, W, H, [(0.0, C_FOREST_DEEP), (1.0, hsl(150, 42, 8))], horizontal=False)
    running_head("Voice & Support", "07 / 07", dark=True)
    mono("§ 07 — Voice & Support", MX, H - 36 * mm, 8, C_GOLD_LIGHT, 2)
    grad_text("Sound like a partner.", MX, H - 54 * mm, 27, GRAD_TEXT_DARK)

    c.setFillColor(alpha(WHITE, 0.85))
    c.setFont(BODY, 11)
    c.drawString(MX, H - 68 * mm, "“A supply chain is really a chain of relationships.”")

    principles = [
        ("Relationships, not transactions", "Write like a long-term partner, not a vendor closing a sale."),
        ("Precise, not corporate", "Concrete nouns — bonded warehouse, cold chain — not buzzwords."),
        ("Warm, not casual", "Confident and human. Never slangy, never stiff."),
    ]
    py = H - 84 * mm
    for i, (title, body) in enumerate(principles):
        mono("%02d" % (i + 1), MX, py, 10, C_GOLD_LIGHT, 1.2, font=DISPLAY)
        c.setFillColor(WHITE)
        c.setFont(DISPLAY, 12)
        c.drawString(MX + 12 * mm, py, title)
        c.setFillColor(alpha(WHITE, 0.6))
        c.setFont(BODY, 9.5)
        c.drawString(MX + 12 * mm, py - 5.5 * mm, body)
        c.setStrokeColor(alpha(WHITE, 0.12))
        c.setLineWidth(0.5)
        c.line(MX, py - 10 * mm, W - MX, py - 10 * mm)
        py -= 16 * mm

    # Support / colophon
    sy = py - 6 * mm
    mono("Support — assets & upkeep", MX, sy, 8, C_GOLD_LIGHT, 2)
    lines = [
        "Logos ....... src/assets/olive-foods-logo.svg · olive-mark.svg · olive-foods-hero-logo.svg",
        "Colours ..... design tokens in src/index.css (:root) — the single source of truth",
        "Fonts ....... Sora & Inter (Google Fonts)",
        "Regenerate .. python3 scripts/generate-brand-guidelines.py",
    ]
    ly = sy - 8 * mm
    c.setFont("Courier", 8.5)
    for line in lines:
        c.setFillColor(alpha(WHITE, 0.7))
        c.drawString(MX, ly, line)
        ly -= 6 * mm

    c.setStrokeColor(alpha(WHITE, 0.15))
    c.setLineWidth(0.6)
    c.line(MX, 30 * mm, W - MX, 30 * mm)
    mono("© Olive Foods (Pvt) Ltd · Wattala, Sri Lanka", MX, 24 * mm, 7, alpha(WHITE, 0.5))
    mono("olivefoods.lk", W - MX, 24 * mm, 7, alpha(WHITE, 0.5), align="right")
    c.showPage()


page_cover()
page_glance()
page_logo()
page_colour()
page_gradients()
page_type()
page_ui()
page_voice()
c.save()

size_kb = os.path.getsize(OUT) // 1024
print("wrote %s (%d KB)" % (OUT, size_kb))
