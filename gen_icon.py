#!/usr/bin/env python3
"""Generates a DOOM NEWS icon PNG using only Python stdlib (struct + zlib)."""
import struct, zlib

def png(w, h, rows_rgb):
    def chunk(tag, data):
        c = zlib.crc32(tag + data) & 0xffffffff
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', c)
    sig = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', w, h, 8, 2, 0, 0, 0))
    raw = b''.join(b'\x00' + bytes(row) for row in rows_rgb)
    idat = chunk(b'IDAT', zlib.compress(raw))
    iend = chunk(b'IEND', b'')
    return sig + ihdr + idat + iend

size = 256
rows = []
cx, cy = size // 2, size // 2

for y in range(size):
    row = []
    for x in range(size):
        dx, dy = x - cx, y - cy
        dist = (dx*dx + dy*dy) ** 0.5
        angle = 0
        import math
        angle = math.atan2(dy, dx)

        # Background
        r, g, b = 2, 10, 4

        # Grid lines
        if x % 32 == 0 or y % 32 == 0:
            r, g, b = 5, 30, 10

        # Outer ring
        if 110 < dist < 118:
            t = max(0, 1 - abs(dist - 114) / 4)
            r = int(r + t * 0)
            g = int(g + t * 200)
            b = int(b + t * 40)

        # Cross hairs
        if abs(dx) < 2 and dist < 115:
            r, g, b = 0, 180, 50
        if abs(dy) < 2 and dist < 115:
            r, g, b = 0, 180, 50

        # Inner circle
        if 40 < dist < 50:
            t = max(0, 1 - abs(dist - 45) / 5)
            r = int(r + t * 0)
            g = int(g + t * 255)
            b = int(b + t * 65)

        # D letter (simplified as pixel art)
        lx, ly = x - (cx - 28), y - (cy - 30)
        if 0 <= lx <= 50 and 0 <= ly <= 60:
            # D shape
            in_d = (lx < 6 and 0 <= ly <= 60) or \
                   (ly < 6 and 6 <= lx <= 32) or \
                   (ly > 54 and 6 <= lx <= 32) or \
                   (lx > 44 and 20 <= ly <= 40) or \
                   (36 <= lx <= 46 and (ly < 20 or ly > 40))
            if in_d:
                r, g, b = 0, 255, 65

        # Glow bloom
        if dist < 10:
            r, g, b = 0, 255, 65

        row.extend([min(255,r), min(255,g), min(255,b)])
    rows.append(row)

data = png(size, size, rows)
with open('icon.png', 'wb') as f:
    f.write(data)
print(f"Generated icon.png ({len(data)} bytes)")
