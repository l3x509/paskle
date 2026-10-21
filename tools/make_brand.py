"""Draw the Paskle logo (the k in Paskle is a key) and every icon and store graphic made from it.
Usage (from the repo root): python3 tools/make_brand.py
Needs: fonttools + brotli (pip), Playwright with Chromium (for the PNG files).
Writes:
  brand/paskle-wordmark-dark.svg, brand/paskle-wordmark-light.svg, brand/paskle-k.svg, brand/paskle-icon.svg
  icons/icon.svg, icons/icon-192.png, icons/icon-512.png, icons/icon-maskable-512.png
  android-app/assets/icon-only.png, icon-foreground.png, icon-background.png, splash.png, splash-dark.png
  android-app/store-assets/play-icon-512.png, feature-graphic.png
and prints the inline SVG used in the index.html header."""
import asyncio, os
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FONT = os.path.join(ROOT, "fonts", "atkinson-hyperlegible-latin-700-normal.woff2")
NAVY, BRASS, BRASS_DARK, WHITE = "#13213D", "#E3A83A", "#C88A12", "#F0F4FC"

# Units: font size 1000, baseline at y=1000 (SVG y grows downward).
S = 130                     # stroke width of the key-k, matched to the letters
font = TTFont(FONT); gs = font.getGlyphSet(); cmap = font.getBestCmap(); hmtx = font["hmtx"]

def glyphs(text, x0):
    """Path data for text set at x0 on the baseline, and the x after the last letter."""
    out, x = [], x0
    for ch in text:
        name = cmap[ord(ch)]
        pen = SVGPathPen(gs); gs[name].draw(pen)
        out.append(f'<path transform="translate({x} 1000) scale(1 -1)" d="{pen.getCommands()}"/>')
        x += hmtx[name][0]
    return "".join(out), x

def key_k(cx, cls_attr):
    """The k drawn as a key: round bow with a hole on top of the stem, arms as the key's bit."""
    r, hole, cy = S * 1.25, S * 0.42, 150
    bow = (f'M{cx - r},{cy}a{r},{r} 0 1,0 {2 * r},0a{r},{r} 0 1,0 {-2 * r},0z'
           f'M{cx - hole},{cy}a{hole},{hole} 0 1,1 {2 * hole},0a{hole},{hole} 0 1,1 {-2 * hole},0z')
    return (f'<g {cls_attr}><path fill-rule="evenodd" d="{bow}"/>'
            f'<g fill="none" stroke-width="{S}" stroke-linecap="round" stroke-linejoin="round">'
            f'<path d="M{cx},990V300"/><path d="M{cx + 0.3 * S},760L{cx + 2.55 * S},510"/><path d="M{cx + 0.95 * S},710L{cx + 2.65 * S},990"/></g></g>')

K_LEFT, K_RIGHT = S * 1.25, S * 2.65 + S / 2     # extent of the key-k around its stem centre
K_TOP, K_BOTTOM = 150 - S * 1.25, 990 + S / 2

def wordmark(letters, key, key_attr=None):
    pas, x = glyphs("Pas", 0)
    cx = x + 135
    le, end = glyphs("le", cx + K_RIGHT + 10)
    w = end + 20
    k = key_k(cx, key_attr or f'fill="{key}" stroke="{key}"')
    vb = f"-10 {K_TOP - 10:.0f} {w + 20:.0f} {K_BOTTOM - K_TOP + 20:.0f}"
    return vb, f'<g fill="{letters}">{pas}{le}</g>{k}'

def k_mark(size, frac, bg, color=BRASS, cx_shift=0):
    """The key-k alone, centred in a size x size square, its height = frac of the square."""
    h = K_BOTTOM - K_TOP; sc = size * frac / h
    w = (K_LEFT + K_RIGHT) * sc
    tx = (size - w) / 2 + K_LEFT * sc + cx_shift * size; ty = (size - h * sc) / 2 - K_TOP * sc
    back = f'<rect width="{size}" height="{size}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" width="{size}" height="{size}">{back}'
            f'<g transform="translate({tx:.2f} {ty:.2f}) scale({sc:.5f})">{key_k(0, f"fill={chr(34)}{color}{chr(34)} stroke={chr(34)}{color}{chr(34)}")}</g></svg>')

def svg(vb, body, w=None, h=None):
    dims = f' width="{w}" height="{h}"' if w else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb}"{dims}>{body}</svg>'

def write(rel, text):
    p = os.path.join(ROOT, rel); os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "w", encoding="utf-8").write(text)

def main():
    vb, dark = wordmark(WHITE, BRASS); _, light = wordmark(NAVY, BRASS_DARK)
    write("brand/paskle-wordmark-dark.svg", svg(vb, dark))
    write("brand/paskle-wordmark-light.svg", svg(vb, light))
    write("brand/paskle-k.svg", k_mark(1000, 0.9, None))
    icon_svg = k_mark(1000, 0.66, NAVY)
    write("brand/paskle-icon.svg", icon_svg); write("icons/icon.svg", icon_svg)

    # Inline header logo: letters take the text colour, the key takes the brass colour.
    _, head = wordmark("currentColor", None, 'class="k"')
    header = f'<svg class="logo" viewBox="{vb}" role="img" aria-label="Paskle">{head}</svg>'
    write("brand/header-logo.svg.txt", header)

    vbw = [float(v) for v in vb.split()]
    def wm_html(width, color_letters=WHITE, color_key=BRASS):
        h = width * vbw[3] / vbw[2]
        return svg(vb, wordmark(color_letters, color_key)[1], f"{width:.0f}", f"{h:.0f}")

    pngs = {
        "icons/icon-192.png": (192, k_mark(192, 0.66, NAVY)),
        "icons/icon-512.png": (512, k_mark(512, 0.66, NAVY)),
        "icons/icon-maskable-512.png": (512, k_mark(512, 0.5, NAVY)),
        "android-app/store-assets/play-icon-512.png": (512, k_mark(512, 0.66, NAVY)),
        "android-app/assets/icon-only.png": (1024, k_mark(1024, 0.66, NAVY)),
        "android-app/assets/icon-background.png": (1024, f'<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><rect width="1024" height="1024" fill="{NAVY}"/></svg>'),
        "android-app/assets/icon-foreground.png": (1024, k_mark(1024, 0.44, None)),
    }
    splash = (f'<div style="width:2732px;height:2732px;background:{NAVY};display:flex;align-items:center;justify-content:center">{wm_html(980)}</div>')
    feature = (f'<div style="width:1024px;height:500px;background:{NAVY};display:flex;flex-direction:column;justify-content:center;padding-left:96px;box-sizing:border-box;font-family:AH;color:{WHITE}">'
               f'{wm_html(470)}<div style="width:84px;height:7px;background:{BRASS};margin:30px 0 26px"></div>'
               f'<div style="font-size:34px;font-weight:700">CNA · HHA · Driver\'s permit</div>'
               f'<div style="font-size:28px;color:#C8D2E6;margin-top:10px">Kreyòl · English · Français · Español</div></div>')

    async def render():
        from playwright.async_api import async_playwright
        import base64
        fonturl = "data:font/woff2;base64," + base64.b64encode(open(FONT, "rb").read()).decode()
        css = f'<style>@font-face{{font-family:AH;font-weight:700;src:url({fonturl})}}body{{margin:0}}</style>'
        async with async_playwright() as p:
            b = await p.chromium.launch()
            for rel, (n, body) in pngs.items():
                pg = await b.new_page(viewport={"width": n, "height": n})
                await pg.set_content(css + body); out = os.path.join(ROOT, rel)
                await pg.screenshot(path=out, omit_background=True, clip={"x": 0, "y": 0, "width": n, "height": n}); await pg.close()
            for rel, (w, h, body) in {"android-app/assets/splash.png": (2732, 2732, splash), "android-app/assets/splash-dark.png": (2732, 2732, splash),
                                      "android-app/store-assets/feature-graphic.png": (1024, 500, feature)}.items():
                pg = await b.new_page(viewport={"width": w, "height": h})
                await pg.set_content(css + body); await pg.wait_for_timeout(300)
                await pg.screenshot(path=os.path.join(ROOT, rel), clip={"x": 0, "y": 0, "width": w, "height": h}); await pg.close()
            await b.close()
    asyncio.run(render())
    print("brand files written")

if __name__ == "__main__":
    main()
