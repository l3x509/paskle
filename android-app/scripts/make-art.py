"""Draw Paskle's app icon, adaptive-icon layers, splash screens and Play feature graphic.
Usage (from android-app/): python3 scripts/make-art.py   (needs Pillow and the DejaVu Serif Bold font)"""
import os
from PIL import Image, ImageDraw, ImageFont
NAVY, BRASS, WHITE = (19, 33, 61), (227, 168, 58), (240, 244, 252)
HERE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = next(p for p in ("/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf", "/Library/Fonts/DejaVuSerif-Bold.ttf", "C:/Windows/Fonts/DejaVuSerif-Bold.ttf") if os.path.exists(p))

def mark(draw, cx, cy, size):
    """The 'P.' mark centred on (cx, cy); size = height of the letter."""
    f = ImageFont.truetype(FONT, int(size * 1.38))
    l, t, r, b = draw.textbbox((0, 0), "P", font=f)
    w, h = r - l, b - t
    dot = size * 0.13
    total = w + size * 0.06 + dot * 2
    x0 = cx - total / 2
    draw.text((x0 - l, cy - h / 2 - t), "P", font=f, fill=WHITE)
    dx, dy = x0 + w + size * 0.06 + dot, cy + h / 2 - dot
    draw.ellipse((dx - dot, dy - dot, dx + dot, dy + dot), fill=BRASS)

def square(n, size_frac, bg=NAVY):
    im = Image.new("RGBA", (n, n), bg)
    mark(ImageDraw.Draw(im), n / 2, n / 2, n * size_frac)
    return im

out = lambda *p: os.path.join(HERE, *p)
square(1024, 0.41).save(out("assets", "icon-only.png"))
Image.new("RGBA", (1024, 1024), NAVY).save(out("assets", "icon-background.png"))
square(1024, 0.30, (0, 0, 0, 0)).save(out("assets", "icon-foreground.png"))  # inside the adaptive-icon safe zone
for name in ("splash.png", "splash-dark.png"):
    square(2732, 0.13).save(out("assets", name))
square(512, 0.41).convert("RGB").save(out("store-assets", "play-icon-512.png"))

# Feature graphic 1024x500
fg = Image.new("RGB", (1024, 500), NAVY); d = ImageDraw.Draw(fg)
mark(d, 190, 250, 170)
title = ImageFont.truetype(FONT, 92); sub = ImageFont.truetype(FONT.replace("Serif-Bold", "Sans"), 30) if os.path.exists(FONT.replace("Serif-Bold", "Sans")) else ImageFont.truetype(FONT, 28)
d.text((370, 120), "Paskle", font=title, fill=WHITE)
d.rectangle((372, 236, 452, 242), fill=BRASS)
d.text((372, 268), "CNA · HHA · Driver's permit", font=sub, fill=WHITE)
d.text((372, 316), "Kreyòl · English · Français · Español", font=sub, fill=(200, 210, 230))
fg.save(out("store-assets", "feature-graphic.png"))
print("art written")
