#!/usr/bin/env python3
"""Generate a 1200x630 Open Graph image for Commodity Greeks Pro."""
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (29, 41, 57)        # #1D2939 dark slate
TEAL = (0, 119, 138)     # #00778A
LIGHT = (220, 233, 238)  # #DCE9EE
GREEN = (18, 183, 106)   # #12B76A
MUTED = (148, 163, 184)  # #94A3B8

img = Image.new("RGB", (W, H), BG)
d = ImageDraw.Draw(img)

# Subtle grid motif (financial chart feel)
for x in range(0, W, 60):
    d.line([(x, 0), (x, H)], fill=(38, 52, 70), width=1)
for y in range(0, H, 60):
    d.line([(0, y), (W, y)], fill=(38, 52, 70), width=1)

# Teal accent bar on the left
d.rectangle([0, 0, 14, H], fill=TEAL)

# A rising "greeks" line chart in the lower-right
pts = [(760, 470), (830, 430), (900, 450), (970, 380), (1040, 400), (1110, 320)]
d.line(pts, fill=GREEN, width=6)
for p in pts:
    d.ellipse([p[0]-5, p[1]-5, p[0]+5, p[1]+5], fill=GREEN)

# Fonts
def font(path, size):
    return ImageFont.truetype(path, size)

f_title = font("/usr/share/fonts/truetype/lato/Lato-Black.ttf", 78)
f_sub = font("/usr/share/fonts/truetype/lato/Lato-Regular.ttf", 40)
f_tag = font("/usr/share/fonts/truetype/lato/Lato-Semibold.ttf", 30)
f_small = font("/usr/share/fonts/truetype/lato/Lato-Regular.ttf", 26)

# Title
d.text((70, 150), "Commodity", font=f_title, fill=LIGHT)
d.text((70, 240), "Greeks Pro", font=f_title, fill=TEAL)

# Subtitle
d.text((70, 360), "Enterprise MCX Greeks Engine", font=f_sub, fill=LIGHT)

# Tagline
d.text((70, 430), "Black-Scholes · Scenario Simulations · MongoDB", font=f_tag, fill=MUTED)

# Small footer
d.text((70, 520), "Gold · Silver · Crude · Natural Gas · Copper · Zinc · Aluminium · Lead · Nickel",
       font=f_small, fill=MUTED)

img.save("public/og-image.png", "PNG")
print("saved public/og-image.png", img.size)
