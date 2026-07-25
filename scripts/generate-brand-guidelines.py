#!/usr/bin/env python3
"""
Generates the Olive Foods brand guidelines PDF served in the admin panel.

Colours + tokens are taken verbatim from src/index.css so the document stays
in sync with the site's design system. Re-run after a rebrand:

    python3 scripts/generate-brand-guidelines.py

Output: public/olive-foods-brand-guidelines.pdf
Requires: reportlab, pillow  (pip install --user reportlab pillow)
"""
import colorsys
import os

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.lib.colors import Color

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LOGO = os.path.join(ROOT, "src/assets/olive-foods-logo.png")
OUT = os.path.join(ROOT, "public/olive-foods-brand-guidelines.pdf")

W, H = A4  # 595 x 842 pt (portrait)


def hsl(h, s, l):
    """CSS hsl() (deg, %, %) -> reportlab Color."""
    r, g, b = colorsys.hls_to_rgb(h / 360.0, l / 100.0, s / 100.0)
    return Color(r, g, b)


def hex_of(h, s, l):
    r, g, b = colorsys.hls_to_rgb(h / 360.0, l / 100.0, s / 100.0)
    return "#%02X%02X%02X" % (round(r * 255), round(g * 255), round(b * 255))


# ── Brand tokens (mirrors src/index.css :root) ──
FOREST_DEEP = (150, 40, 10)
FOREST_MID = (140, 50, 19)
FOREST_LIGHT = (80, 50, 31)
OLIVE = (75, 38, 45)          # accent / gold
GOLD_LIGHT = (75, 40, 60)
GOLD_DEEP = (75, 50, 32)
CREAM = (42, 50, 96)
INK = (140, 30, 10)           # foreground text
MUTED = (140, 10, 45)

C_FOREST_DEEP = hsl(*FOREST_DEEP)
C_FOREST_MID = hsl(*FOREST_MID)
C_OLIVE = hsl(*OLIVE)
C_GOLD_LIGHT = hsl(*GOLD_LIGHT)
C_CREAM = hsl(*CREAM)
C_INK = hsl(*INK)
C_MUTED = hsl(*MUTED)
WHITE = Color(1, 1, 1)

DISPLAY = "Helvetica-Bold"
BODY = "Helvetica"

c = canvas.Canvas(OUT, pagesize=A4)
c.setTitle("Olive Foods — Brand Guidelines")
c.setAuthor("Olive Foods (Pvt) Ltd")


def tracked_width(text, font, size, tracking):
    return c.stringWidth(text, font, size) + tracking * max(0, len(text) - 1)


def mono(cnv, text, x, y, size, color, tracking=1.6, font=BODY, align="left"):
    """Tracked uppercase label, like the site's eyebrows."""
    text = text.upper()
    if align == "right":
        x = x - tracked_width(text, font, size, tracking)
    elif align == "center":
        x = x - tracked_width(text, font, size, tracking) / 2
    t = cnv.beginText(x, y)
    t.setFont(font, size)
    t.setFillColor(color)
    t.setCharSpace(tracking)
    t.textOut(text)
    cnv.drawText(t)


def running_head(cnv, section, folio, dark=False):
    col = WHITE if dark else C_INK
    faint = Color(col.red, col.green, col.blue, 0.45)
    mono(cnv, "Olive Foods · Brand Guidelines", 20 * mm, H - 20 * mm, 6.5, faint)
    mono(cnv, folio, W - 20 * mm, H - 20 * mm, 6.5, faint, align="right")
    mono(cnv, section, W / 2, H - 20 * mm, 6.5, faint, align="center")
    cnv.setStrokeColor(Color(col.red, col.green, col.blue, 0.18))
    cnv.setLineWidth(0.6)
    cnv.line(20 * mm, H - 23 * mm, W - 20 * mm, H - 23 * mm)


# ════════════════ PAGE 1 — COVER ════════════════
c.setFillColor(C_FOREST_DEEP)
c.rect(0, 0, W, H, fill=1, stroke=0)
# warm glow (approximated with faint olive rects)
for i, a in enumerate((0.05, 0.035, 0.02)):
    c.setFillColor(Color(C_GOLD_LIGHT.red, C_GOLD_LIGHT.green, C_GOLD_LIGHT.blue, a))
    r = 90 + i * 34
    c.circle(W - 70, H - 120, r, fill=1, stroke=0)
# gold hairline
c.setStrokeColor(C_OLIVE)
c.setLineWidth(2)
c.line(20 * mm, H - 30 * mm, 20 * mm + 46, H - 30 * mm)

mono(c, "Olive Foods (Pvt) Ltd", 20 * mm, H - 40 * mm, 8, C_OLIVE, 2.4)

c.setFillColor(WHITE)
c.setFont(DISPLAY, 62)
c.drawString(20 * mm - 2, H - 92 * mm, "Brand")
c.drawString(20 * mm - 2, H - 118 * mm, "Guidelines")

c.setFillColor(Color(1, 1, 1, 0.6))
c.setFont(BODY, 13)
c.drawString(20 * mm, H - 132 * mm, "The marks, colours, and voice of Olive Foods.")

# logo on a cream chip
chip_w, chip_h = 88 * mm, 60 * mm
chip_x, chip_y = 20 * mm, 78 * mm
c.setFillColor(C_CREAM)
c.roundRect(chip_x, chip_y, chip_w, chip_h, 10, fill=1, stroke=0)
logo_s = 42 * mm
c.drawImage(LOGO, chip_x + (chip_w - logo_s) / 2, chip_y + (chip_h - logo_s) / 2,
            logo_s, logo_s, mask="auto", preserveAspectRatio=True)

# foot
c.setStrokeColor(Color(1, 1, 1, 0.15))
c.setLineWidth(0.6)
c.line(20 * mm, 42 * mm, W - 20 * mm, 42 * mm)
mono(c, "Vol. I — MMXXVI", 20 * mm, 34 * mm, 7.5, Color(1, 1, 1, 0.5))
mono(c, "olivefoods.lk", W - 20 * mm, 34 * mm, 7.5, Color(1, 1, 1, 0.5), align="right")
c.showPage()


# ════════════════ PAGE 2 — THE MARK ════════════════
c.setFillColor(WHITE)
c.rect(0, 0, W, H, fill=1, stroke=0)
running_head(c, "The Mark", "01 / 04")
mono(c, "§ 01 — The Mark", 20 * mm, H - 36 * mm, 8, C_OLIVE, 2)
c.setFillColor(C_INK)
c.setFont(DISPLAY, 30)
c.drawString(20 * mm, H - 52 * mm, "One mark, room to breathe.")

# logo on cream panel
panel_x, panel_y, panel_w, panel_h = 20 * mm, H - 150 * mm, W - 40 * mm, 78 * mm
c.setFillColor(C_CREAM)
c.roundRect(panel_x, panel_y, panel_w, panel_h, 10, fill=1, stroke=0)
ls = 52 * mm
c.drawImage(LOGO, panel_x + (panel_w - ls) / 2, panel_y + (panel_h - ls) / 2,
            ls, ls, mask="auto", preserveAspectRatio=True)

# notes
notes = [
    ("Clear space", "Leave clear space around the logo — the mark's height."),
    ("Minimum size", "Never reproduce the logo below 16 mm / 60 px wide."),
    ("Backgrounds", "Use on cream or white; on dark grounds, a cream chip."),
    ("Don't", "Recolour, stretch, rotate, add effects, or box the logo in."),
]
ny = panel_y - 16 * mm
for label, body in notes:
    mono(c, label, 20 * mm, ny, 8, C_OLIVE, 1.6)
    c.setFillColor(C_MUTED)
    c.setFont(BODY, 10.5)
    c.drawString(58 * mm, ny, body)
    c.setStrokeColor(Color(C_INK.red, C_INK.green, C_INK.blue, 0.10))
    c.setLineWidth(0.5)
    c.line(20 * mm, ny - 5 * mm, W - 20 * mm, ny - 5 * mm)
    ny -= 13 * mm
c.showPage()


# ════════════════ PAGE 3 — COLOUR ════════════════
c.setFillColor(WHITE)
c.rect(0, 0, W, H, fill=1, stroke=0)
running_head(c, "Colour", "02 / 04")
mono(c, "§ 02 — Colour", 20 * mm, H - 36 * mm, 8, C_OLIVE, 2)
c.setFillColor(C_INK)
c.setFont(DISPLAY, 30)
c.drawString(20 * mm, H - 52 * mm, "Forest greens, an olive gold.")

swatches = [
    ("Forest Deep", FOREST_DEEP, "Dark grounds, footers, cover"),
    ("Forest Mid", FOREST_MID, "Primary green, panels"),
    ("Olive Accent", OLIVE, "Accent, links, highlights"),
    ("Gold Light", GOLD_LIGHT, "Accents on dark grounds"),
    ("Cream", CREAM, "Warm light surfaces"),
    ("Ink", INK, "Body text on light"),
]
cols, ch, gap = 2, 44 * mm, 8 * mm
cw = (W - 40 * mm - gap) / 2  # exactly fills the content width
sx0, sy0 = 20 * mm, H - 74 * mm
for i, (name, hslv, use) in enumerate(swatches):
    col, row = i % cols, i // cols
    x = sx0 + col * (cw + gap)
    y = sy0 - row * (ch + gap) - ch
    c.setFillColor(hsl(*hslv))
    c.roundRect(x, y, cw, ch, 8, fill=1, stroke=0)
    # thin border for the pale cream swatch
    if name == "Cream":
        c.setStrokeColor(Color(C_INK.red, C_INK.green, C_INK.blue, 0.12))
        c.setLineWidth(0.6)
        c.roundRect(x, y, cw, ch, 8, fill=0, stroke=1)
    label_col = C_INK if name in ("Cream",) else WHITE
    c.setFillColor(label_col)
    c.setFont(DISPLAY, 13)
    c.drawString(x + 6 * mm, y + ch - 12 * mm, name)
    faint = Color(label_col.red, label_col.green, label_col.blue, 0.7)
    mono(c, hex_of(*hslv), x + 6 * mm, y + 8 * mm, 8, faint, 1.2)
    c.setFillColor(faint)
    c.setFont(BODY, 7.5)
    c.drawString(x + 6 * mm, y + 14 * mm, use)
    c.drawRightString(x + cw - 6 * mm, y + 8 * mm, "HSL %d %d %d" % hslv)
c.showPage()


# ════════════════ PAGE 4 — TYPOGRAPHY ════════════════
c.setFillColor(WHITE)
c.rect(0, 0, W, H, fill=1, stroke=0)
running_head(c, "Typography", "03 / 04")
mono(c, "§ 03 — Typography", 20 * mm, H - 36 * mm, 8, C_OLIVE, 2)
c.setFillColor(C_INK)
c.setFont(DISPLAY, 30)
c.drawString(20 * mm, H - 52 * mm, "Two families, clear roles.")

blocks = [
    ("Sora", "Display", "Headings, numerals, eyebrows. Weights 400–800.",
     "Sourced with intent."),
    ("Inter", "Body", "Running text, labels, UI. Weights 300–700.",
     "Delivered with trust."),
]
by = H - 78 * mm
for family, role, use, sample in blocks:
    c.setFillColor(C_CREAM)
    c.roundRect(20 * mm, by - 46 * mm, W - 40 * mm, 44 * mm, 8, fill=1, stroke=0)
    c.setFillColor(C_INK)
    c.setFont(DISPLAY, 44)
    c.drawString(28 * mm, by - 26 * mm, "Aa")
    c.setFont(DISPLAY, 18)
    c.drawString(60 * mm, by - 14 * mm, family)
    mono(c, role, 60 * mm, by - 21 * mm, 8, C_OLIVE, 1.6)
    c.setFillColor(C_MUTED)
    c.setFont(BODY, 10)
    c.drawString(60 * mm, by - 30 * mm, use)
    c.setFillColor(Color(C_INK.red, C_INK.green, C_INK.blue, 0.55))
    c.setFont(BODY if family == "Inter" else DISPLAY, 13)
    c.drawString(60 * mm, by - 40 * mm, sample)
    by -= 54 * mm

c.setFillColor(C_MUTED)
c.setFont(BODY, 9.5)
c.drawString(20 * mm, by - 2 * mm,
             "Both load from Google Fonts. Fall back to system sans where unavailable.")
c.showPage()


# ════════════════ PAGE 5 — VOICE ════════════════
c.setFillColor(C_FOREST_DEEP)
c.rect(0, 0, W, H, fill=1, stroke=0)
running_head(c, "Voice", "04 / 04", dark=True)
mono(c, "§ 04 — Voice", 20 * mm, H - 36 * mm, 8, C_OLIVE, 2)

c.setFillColor(WHITE)
c.setFont(DISPLAY, 26)
c.drawString(20 * mm, H - 62 * mm, "Quality You Can Trust.")
c.drawString(20 * mm, H - 78 * mm, "Excellence You Can Taste.")

c.setFillColor(Color(1, 1, 1, 0.6))
c.setFont(BODY, 13)
c.drawString(20 * mm, H - 96 * mm, "“A supply chain is really a chain of relationships.”")

principles = [
    ("Relationships, not transactions", "We write like a long-term partner, not a vendor closing a sale."),
    ("Precise, not corporate", "Concrete nouns — bonded warehouse, cold chain — not buzzwords."),
    ("Warm, not casual", "Confident and human. Never slangy, never stiff."),
]
py = H - 120 * mm
for i, (title, body) in enumerate(principles):
    c.setFillColor(C_OLIVE)
    c.setFont(DISPLAY, 12)
    c.drawString(20 * mm, py, "%02d" % (i + 1))
    c.setFillColor(WHITE)
    c.setFont(DISPLAY, 13)
    c.drawString(32 * mm, py, title)
    c.setFillColor(Color(1, 1, 1, 0.55))
    c.setFont(BODY, 10.5)
    c.drawString(32 * mm, py - 6 * mm, body)
    c.setStrokeColor(Color(1, 1, 1, 0.10))
    c.setLineWidth(0.5)
    c.line(20 * mm, py - 12 * mm, W - 20 * mm, py - 12 * mm)
    py -= 22 * mm

# colophon
c.setStrokeColor(Color(1, 1, 1, 0.15))
c.line(20 * mm, 30 * mm, W - 20 * mm, 30 * mm)
mono(c, "© Olive Foods (Pvt) Ltd · Wattala, Sri Lanka", 20 * mm, 22 * mm, 7, Color(1, 1, 1, 0.4))
mono(c, "MMXXVI", W - 20 * mm, 22 * mm, 7, Color(1, 1, 1, 0.4), align="right")
c.showPage()

c.save()
print("wrote", OUT, "(%d KB)" % (os.path.getsize(OUT) // 1024))
