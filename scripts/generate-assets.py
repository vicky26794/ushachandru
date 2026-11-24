import math
import struct
import subprocess
import sys
import wave
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFilter, ImageFont
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow", "-q"])
    from PIL import Image, ImageDraw, ImageFilter, ImageFont

root = Path(__file__).resolve().parents[1] / "public"
img_dir = root / "images"
music_dir = root / "music"
img_dir.mkdir(parents=True, exist_ok=True)
music_dir.mkdir(parents=True, exist_ok=True)

palettes = [
    [(48, 10, 70), (255, 40, 160), (255, 180, 220), "Usha"],
    [(30, 8, 55), (180, 40, 255), (255, 120, 200), "Chandru"],
    [(55, 12, 80), (255, 90, 180), (255, 210, 120), "Celebrate"],
]


def make_photo(path, bg, accent, soft, label):
    w, h = 900, 1100
    img = Image.new("RGB", (w, h), bg)
    draw = ImageDraw.Draw(img)
    for i in range(18, 0, -1):
        r = int(220 + i * 18)
        color = (
            int(bg[0] * 0.4 + accent[0] * 0.6 * (i / 18)),
            int(bg[1] * 0.4 + accent[1] * 0.6 * (i / 18)),
            int(bg[2] * 0.4 + accent[2] * 0.6 * (i / 18)),
        )
        draw.ellipse([w / 2 - r, h / 2 - r - 40, w / 2 + r, h / 2 + r - 40], fill=color)

    cx, cy = w // 2, h // 2 - 30
    pts = []
    for t in range(0, 360, 2):
        rad = math.radians(t)
        x = 16 * math.sin(rad) ** 3
        y = -(
            13 * math.cos(rad)
            - 5 * math.cos(2 * rad)
            - 2 * math.cos(3 * rad)
            - math.cos(4 * rad)
        )
        pts.append((cx + x * 18, cy + y * 18))
    draw.polygon(pts, fill=soft)

    pts2 = []
    for t in range(0, 360, 2):
        rad = math.radians(t)
        x = 16 * math.sin(rad) ** 3
        y = -(
            13 * math.cos(rad)
            - 5 * math.cos(2 * rad)
            - 2 * math.cos(3 * rad)
            - math.cos(4 * rad)
        )
        pts2.append((cx + x * 12, cy + y * 12))
    draw.polygon(pts2, fill=(255, 245, 250))

    for sx, sy, sr in [
        (120, 180, 8),
        (760, 220, 6),
        (150, 900, 7),
        (780, 850, 9),
        (450, 120, 5),
    ]:
        draw.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=(255, 230, 160))

    try:
        font = ImageFont.truetype("arial.ttf", 54)
        small = ImageFont.truetype("arial.ttf", 28)
    except Exception:
        font = ImageFont.load_default()
        small = font

    draw.text((w / 2, h - 160), label, fill=accent, font=font, anchor="mm")
    draw.text((w / 2, h - 100), "Happy Birthday", fill=soft, font=small, anchor="mm")
    img = img.filter(ImageFilter.SMOOTH_MORE)
    img.save(path, quality=92)


for i, (bg, accent, soft, label) in enumerate(palettes, 1):
    make_photo(img_dir / f"photo-{i}.jpg", bg, accent, soft, label)


def synth_melody(path, melody, tempo=0.28, volume=0.28):
    sr = 44100
    frames = []
    notes = {
        "C4": 261.63,
        "D4": 293.66,
        "E4": 329.63,
        "F4": 349.23,
        "G4": 392.00,
        "A4": 440.00,
        "B4": 493.88,
        "C5": 523.25,
        "D5": 587.33,
        "E5": 659.25,
        "F5": 698.46,
        "G5": 783.99,
        "R": 0.0,
    }
    for note, beats in melody:
        freq = notes[note]
        dur = tempo * beats
        n = int(sr * dur)
        for i in range(n):
            t = i / sr
            env = min(1.0, i / (0.02 * sr)) * max(0.0, 1 - i / n)
            if freq == 0:
                sample = 0.0
            else:
                sample = math.sin(2 * math.pi * freq * t) * 0.65
                sample += 0.25 * math.sin(2 * math.pi * freq * 2 * t)
                sample += 0.1 * math.sin(2 * math.pi * freq * 3 * t)
                sample *= env * volume
            frames.append(int(max(-1, min(1, sample)) * 32767))
    frames.extend([0] * int(sr * 0.15))
    with wave.open(str(path), "w") as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(sr)
        wf.writeframes(b"".join(struct.pack("<h", s) for s in frames))


m1 = [
    ("C4", 1), ("C4", 1), ("D4", 2), ("C4", 2), ("F4", 2), ("E4", 4),
    ("C4", 1), ("C4", 1), ("D4", 2), ("C4", 2), ("G4", 2), ("F4", 4),
    ("C4", 1), ("C4", 1), ("C5", 2), ("A4", 2), ("F4", 2), ("E4", 2), ("D4", 4),
    ("A4", 1), ("A4", 1), ("G4", 2), ("F4", 2), ("G4", 2), ("F4", 4),
]
m2 = [
    ("E4", 2), ("G4", 2), ("A4", 2), ("G4", 2), ("E4", 2), ("D4", 2), ("C4", 4),
    ("E4", 2), ("G4", 2), ("A4", 2), ("B4", 2), ("C5", 4), ("G4", 4),
    ("A4", 2), ("C5", 2), ("D5", 2), ("C5", 2), ("A4", 2), ("G4", 2), ("E4", 4),
    ("F4", 2), ("A4", 2), ("G4", 2), ("E4", 2), ("D4", 2), ("C4", 4),
]
m3 = [
    ("G4", 2), ("E4", 2), ("G4", 2), ("C5", 4), ("B4", 2), ("A4", 2), ("G4", 4),
    ("F4", 2), ("D4", 2), ("F4", 2), ("B4", 4), ("A4", 2), ("G4", 2), ("E4", 4),
    ("G4", 2), ("C5", 2), ("E5", 2), ("D5", 2), ("C5", 2), ("A4", 2), ("G4", 4),
    ("A4", 2), ("F4", 2), ("G4", 2), ("E4", 2), ("D4", 2), ("C4", 4),
]

# WAV files play in all modern browsers (starter template expected .mp3 names)
synth_melody(music_dir / "tamil-birthday-1.wav", m1, 0.26, 0.3)
synth_melody(music_dir / "tamil-birthday-2.wav", m2, 0.24, 0.28)
synth_melody(music_dir / "favourite-melody.wav", m3, 0.27, 0.3)

print("photos:", [p.name for p in img_dir.glob("photo-*.jpg")])
print("music:", [p.name for p in music_dir.glob("*")])
print("done")
