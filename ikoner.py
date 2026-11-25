#!/usr/bin/env python3
"""Genererar appens ikoner helt i kod – ingen import av bildfiler."""
from PIL import Image, ImageDraw

PAPPER = (250, 248, 243, 255)
DROPP = (47, 134, 176, 255)
SKEN = (207, 234, 246, 255)

def droppen(dr, S):
    """Droppsformen centrerad i en kvadrat av sida S (kan vara 4x undersampling)."""
    cx, cy = S / 2, S * 0.60
    r = S * 0.26
    topp = cy - S * 0.40
    dr.polygon([(cx, topp), (cx + r * 0.80, cy), (cx - r * 0.80, cy)], fill=DROPP)
    dr.ellipse([cx - r, cy - r, cx + r, cy + r], fill=DROPP)
    dr.ellipse([cx - r * 0.46, cy - r * 0.62, cx - r * 0.10, cy - r * 0.36], fill=SKEN)

def rendra(N, path, hgr=22, fyll_pa_kant=True):
    """22 = rundad hörnradie i procent av sidan."""
    s = 4
    S = N * s
    img = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    dr = ImageDraw.Draw(img)
    dr.rounded_rectangle([0, 0, S - 1, S - 1], radius=int(S * hgr / 100), fill=PAPPER)
    droppen(dr, S * 0.94)
    if N == 48:
        img = img.resize((N, N), Image.LANCZOS)   # favicon utan understack
    else:
        img = img.resize((N, N), Image.LANCZOS)
    img.save(path)

rendra(48, "public/favicon-48.png", hgr=20)
rendra(192, "public/icon-192.png", hgr=21)
rendra(512, "public/icon-512.png", hgr=21)

# maskabel variant: droppen sitter inom den centrala 80 % (tryckzon)
s = 4
N = 512
img = Image.new("RGBA", (N * s, N * s), PAPPER)
dr = ImageDraw.Draw(img)
S = N * s
cx, cy = S / 2, S * 0.54
r = S * 0.20
dr.polygon([(cx, cy - S * 0.31), (cx + r * 0.8, cy), (cx - r * 0.8, cy)], fill=DROPP)
dr.ellipse([cx - r, cy - r, cx + r, cy + r], fill=DROPP)
img.resize((N, N), Image.LANCZOS).save("public/icon-maskable-512.png")

# apple-touch-icon: heltäckande, inga rundade hörn
s = 4
N = 180
img = Image.new("RGBA", (N * s, N * s), PAPPER)
dr = ImageDraw.Draw(img)
droppen(dr, N * s * 0.94)
img.resize((N, N), Image.LANCZOS).save("public/apple-touch-icon.png")

print("ikoner klara")