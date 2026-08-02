#!/usr/bin/env python3
"""
Generates the Olive Foods bi-fold leaflet — A4 folded in half → 4 A5 panels.

Panels (reading order): Cover · About + Services · Our Brands (logos) ·
Contact + QR. Reuses the brand system (colours, logo, gradients) so it matches
the site + brand guidelines. Brand logos are read from BRAND_LOGO_DIR.

    BRAND_LOGOS=/path/to/logos python3 scripts/generate-leaflet.py [output.pdf]

Requires: reportlab, svglib, qrcode, pillow
"""
import colorsys
import os
import sys

from reportlab.lib.units import mm
from reportlab.lib.colors import Color
from reportlab.lib.utils import ImageReader
from reportlab.pdfgen import canvas
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPDF
import qrcode

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
LOGO_FULL = os.path.join(ROOT, "src/assets/olive-foods-logo.svg")
# Brand logos aren't in the repo — point BRAND_LOGOS at a folder of <slug>.png
# files (download them from the brands' image_url), else it falls back to names.
BRAND_LOGO_DIR = os.environ.get("BRAND_LOGOS", os.path.join(HERE, "brand-logos"))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, "public/olive-foods-leaflet.pdf")

PW, PH = 148.5 * mm, 210 * mm  # one A5 panel (A4 folded in half)
MX = 13 * mm
CW = PW - 2 * MX
SITE = "https://www.olivefoods.lk"

BRANDS = ["Acroyali", "Albertos", "Azizaa", "Bon Vegato", "Daily Dairy", "Damaco",
          "Dedicato", "Dira", "Donna Chiara", "Hungritos", "Mae Ploy", "Mahachai",
          "Royal Arm", "Tabasco", "Tiparos", "Wai Wai"]


# ── colour ──
def hsl(h, s, l, a=1.0):
    r, g, b = colorsys.hls_to_rgb(h / 360.0, l / 100.0, s / 100.0)
    return Color(r, g, b, a)


def mix(c1, c2, t):
    return Color(c1.red + (c2.red - c1.red) * t, c1.green + (c2.green - c1.green) * t,
                 c1.blue + (c2.blue - c1.blue) * t, c1.alpha + (c2.alpha - c1.alpha) * t)


def alpha(c, a):
    return Color(c.red, c.green, c.blue, a)


C_FOREST_DEEP = hsl(150, 40, 10)
C_FOREST_MID = hsl(140, 50, 19)
C_CREAM = hsl(42, 50, 96)
C_GOLD = hsl(75, 38, 45)
C_GOLD_LIGHT = hsl(75, 40, 60)
C_GOLD_DEEP = hsl(75, 50, 32)
C_INK = hsl(140, 30, 10)
C_MUTED = hsl(140, 10, 45)
C_BORDER = hsl(80, 15, 88)
WHITE = Color(1, 1, 1)

GRAD_TEXT_LIGHT = [(0.0, hsl(140, 50, 20)), (0.5, hsl(112, 45, 24)), (1.0, hsl(82, 50, 28))]
GRAD_TEXT_DARK = [(0.0, hsl(82, 52, 58)), (0.5, hsl(110, 42, 60)), (1.0, hsl(140, 42, 58))]

DISPLAY, BODY = "Helvetica-Bold", "Helvetica"
c = canvas.Canvas(OUT, pagesize=(PW, PH))
c.setTitle("Olive Foods — Leaflet")
c.setAuthor("Olive Foods (Pvt) Ltd")


# ── helpers ──
def draw_svg(path, x, y, target_w=None, target_h=None):
    d = svg2rlg(path)
    s = (target_w / d.width) if target_w else (target_h / d.height)
    d.scale(s, s)
    d.width *= s
    d.height *= s
    renderPDF.draw(d, c, x, y)


def color_at(stops, f):
    if f <= stops[0][0]:
        return stops[0][1]
    if f >= stops[-1][0]:
        return stops[-1][1]
    for i in range(len(stops) - 1):
        p0, c0 = stops[i]
        p1, c1 = stops[i + 1]
        if p0 <= f <= p1:
            return mix(c0, c1, (f - p0) / (p1 - p0) if p1 > p0 else 0)
    return stops[-1][1]


def grad_rect(x, y, w, h, stops, horizontal=True, n=120):
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


def grad_text(text, x, y, size, stops, font=DISPLAY):
    c.saveState()
    t = c.beginText(x, y)
    t.setFont(font, size)
    t.setCharSpace(0)
    t.setTextRenderMode(7)
    t.textOut(text)
    c.drawText(t)
    grad_rect(x, y - 0.26 * size, c.stringWidth(text, font, size), 1.08 * size, stops)
    c.restoreState()


def tw(text, font, size, tr):
    return c.stringWidth(text, font, size) + tr * max(0, len(text) - 1)


def mono(text, x, y, size, color, tr=1.6, font=BODY, align="left"):
    text = text.upper()
    if align == "right":
        x -= tw(text, font, size, tr)
    elif align == "center":
        x -= tw(text, font, size, tr) / 2
    t = c.beginText(x, y)
    t.setFont(font, size)
    t.setFillColor(color)
    t.setCharSpace(tr)
    t.textOut(text)
    t.setCharSpace(0)
    c.drawText(t)


def wrap(text, font, size, max_w):
    words, lines, cur = text.split(), [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if c.stringWidth(trial, font, size) <= max_w:
            cur = trial
        else:
            lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    return lines


def paragraph(text, x, y, size, color, max_w, leading, font=BODY):
    c.setFillColor(color)
    c.setFont(font, size)
    for line in wrap(text, font, size, max_w):
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_qr(data, x, y, size, dark=C_FOREST_DEEP):
    q = qrcode.QRCode(border=0, error_correction=qrcode.constants.ERROR_CORRECT_M)
    q.add_data(data)
    q.make()
    m = q.get_matrix()
    n = len(m)
    cell = size / n
    c.setFillColor(dark)
    for r in range(n):
        for col in range(n):
            if m[r][col]:
                c.rect(x + col * cell, y + (n - 1 - r) * cell, cell + 0.4, cell + 0.4, fill=1, stroke=0)


def eyebrow_head(label, headline, y_eb=PH - 24 * mm, y_head=PH - 36 * mm):
    mono(label, MX, y_eb, 8, C_GOLD_DEEP, 2)
    c.setStrokeColor(C_GOLD)
    c.setLineWidth(1.6)
    c.line(MX, y_eb - 3 * mm, MX + 30, y_eb - 3 * mm)
    grad_text(headline, MX, y_head, 23, GRAD_TEXT_LIGHT)


def brand_logo_path(name):
    slug = name.lower().replace(" ", "-")
    p = os.path.join(BRAND_LOGO_DIR, slug + ".png")
    return p if os.path.exists(p) else None


# ════ PANEL 1 — COVER ════
def panel_cover():
    grad_rect(0, 0, PW, PH, [(0.0, C_FOREST_DEEP), (1.0, hsl(150, 42, 8))], horizontal=False)
    for i, a in enumerate((0.06, 0.04, 0.025)):
        c.setFillColor(alpha(C_GOLD_LIGHT, a))
        c.circle(PW - 34, PH - 78, 70 + i * 34, fill=1, stroke=0)
    c.setStrokeColor(C_GOLD)
    c.setLineWidth(2)
    c.line(MX, PH - 30 * mm, MX + 44, PH - 30 * mm)
    mono("Olive Foods (Pvt) Ltd", MX, PH - 38 * mm, 8, C_GOLD_LIGHT, 2.4)

    chip_w, chip_h = CW, 68 * mm
    cx, cy = MX, PH - 128 * mm
    c.setFillColor(C_CREAM)
    c.roundRect(cx, cy, chip_w, chip_h, 12, fill=1, stroke=0)
    draw_svg(LOGO_FULL, cx + (chip_w - 44 * mm) / 2, cy + 7 * mm, target_h=chip_h - 14 * mm)

    grad_text("Premium food,", MX, 70 * mm, 27, GRAD_TEXT_DARK)
    grad_text("delivered.", MX, 58 * mm, 27, GRAD_TEXT_DARK)
    c.setFillColor(alpha(WHITE, 0.7))
    c.setFont(BODY, 11)
    c.drawString(MX, 47 * mm, "Importer & distributor of premium")
    c.drawString(MX, 41.5 * mm, "food brands across Sri Lanka.")

    c.setStrokeColor(alpha(WHITE, 0.15))
    c.setLineWidth(0.6)
    c.line(MX, 22 * mm, PW - MX, 22 * mm)
    mono("Quality you can trust", MX, 16 * mm, 7, alpha(WHITE, 0.5), 1.6)
    mono("olivefoods.lk", PW - MX, 16 * mm, 7, alpha(WHITE, 0.5), align="right")
    c.showPage()


# ════ PANEL 2 — ABOUT + SERVICES ════
def panel_about_services():
    c.setFillColor(WHITE)
    c.rect(0, 0, PW, PH, fill=1, stroke=0)
    eyebrow_head("About Us", "Who we are.")
    y = paragraph(
        "Olive Foods (Pvt) Ltd imports and distributes premium food and consumer "
        "brands across Sri Lanka. For over thirty years we've supplied hotels, "
        "restaurants, cafes, caterers and supermarkets island-wide, importing, "
        "warehousing and delivering from our Colombo base. We work as a long-term "
        "partner to the businesses we supply, not a one-off vendor.",
        MX, PH - 48 * mm, 10, C_MUTED, CW, 5.6 * mm)

    # divider
    c.setStrokeColor(C_BORDER)
    c.setLineWidth(0.8)
    c.line(MX, y - 4 * mm, PW - MX, y - 4 * mm)

    mono("What we do", MX, y - 14 * mm, 8, C_GOLD_DEEP, 2)
    services = [
        ("Importing & sourcing", "Quality lines through our global supplier network."),
        ("Bonded warehousing", "Secure storage, ready for island-wide dispatch."),
        ("Cold-chain storage", "Frozen lines kept at -18C from port to delivery."),
        ("Island-wide distribution", "Delivered to your door, anywhere in Sri Lanka."),
        ("Trade supply", "Hotels, restaurants, cafes, caterers, supermarkets."),
        ("Special sourcing", "We'll track down products you can't find locally."),
    ]
    sy = y - 22 * mm
    for title, body in services:
        c.setFillColor(C_GOLD)
        c.circle(MX + 2, sy + 1.4, 2, fill=1, stroke=0)
        c.setFillColor(C_INK)
        c.setFont(DISPLAY, 10.5)
        c.drawString(MX + 7 * mm, sy, title)
        c.setFillColor(C_MUTED)
        c.setFont(BODY, 9)
        c.drawString(MX + 7 * mm, sy - 4.6 * mm, body)
        sy -= 11.5 * mm
    c.showPage()


# ════ PANEL 3 — BRANDS (LOGO GRID) ════
def panel_brands():
    c.setFillColor(WHITE)
    c.rect(0, 0, PW, PH, fill=1, stroke=0)
    eyebrow_head("Our Brands", "Brands we carry.")
    paragraph("A selection of the international brands we import and represent in "
              "Sri Lanka, sourced from producers across Europe, Asia and the "
              "Middle East.",
              MX, PH - 48 * mm, 10, C_MUTED, CW, 5.6 * mm)

    cols, rows = 4, 4
    gap = 4 * mm
    cell_w = (CW - (cols - 1) * gap) / cols
    cell_h = 24 * mm
    x0 = MX
    y0 = PH - 74 * mm
    for i, name in enumerate(BRANDS):
        r, col = divmod(i, cols)
        x = x0 + col * (cell_w + gap)
        y = y0 - r * (cell_h + gap) - cell_h
        # card
        c.setFillColor(WHITE)
        c.setStrokeColor(C_BORDER)
        c.setLineWidth(0.8)
        c.roundRect(x, y, cell_w, cell_h, 6, fill=1, stroke=1)
        p = brand_logo_path(name)
        if p:
            pad = 3.5 * mm
            box = min(cell_w, cell_h) - 2 * pad
            c.drawImage(ImageReader(p), x + (cell_w - box) / 2, y + (cell_h - box) / 2,
                        box, box, mask="auto", preserveAspectRatio=True)
        else:
            c.setFillColor(C_INK)
            c.setFont(DISPLAY, 8)
            c.drawCentredString(x + cell_w / 2, y + cell_h / 2 - 3, name)
    c.showPage()


# ════ PANEL 4 — CONTACT + QR ════
def panel_contact():
    grad_rect(0, 0, PW, PH, [(0.0, C_FOREST_DEEP), (1.0, hsl(150, 42, 8))], horizontal=False)
    mono("Get in touch", MX, PH - 26 * mm, 8, C_GOLD_LIGHT, 2)
    grad_text("Let's talk.", MX, PH - 42 * mm, 27, GRAD_TEXT_DARK)

    rows = [
        ("Address", ["292 Sea Street, Colombo 11", "Colombo, Sri Lanka 01100"]),
        ("Phone", ["+94 11 207 1717"]),
        ("Email", ["info@olivefoods.lk"]),
        ("Web", ["www.olivefoods.lk"]),
    ]
    y = PH - 58 * mm
    for label, lines in rows:
        mono(label, MX, y, 7, C_GOLD_LIGHT, 1.6)
        c.setFillColor(WHITE)
        c.setFont(BODY, 11)
        for i, line in enumerate(lines):
            c.drawString(MX, y - 6 * mm - i * 5.4 * mm, line)
        y -= 6 * mm + len(lines) * 5.4 * mm + 6 * mm

    qz = 40 * mm
    chip_w, chip_h = CW, qz + 24 * mm
    cx, cy = MX, 26 * mm
    c.setFillColor(C_CREAM)
    c.roundRect(cx, cy, chip_w, chip_h, 12, fill=1, stroke=0)
    draw_qr(SITE, cx + (chip_w - qz) / 2, cy + 13 * mm, qz)
    mono("Scan to visit olivefoods.lk", PW / 2, cy + 6 * mm, 7, C_GOLD_DEEP, 1.4, align="center")
    c.showPage()


panel_cover()
panel_about_services()
panel_brands()
panel_contact()
c.save()
print("wrote %s (%d KB, 4 panels A5)" % (OUT, os.path.getsize(OUT) // 1024))
