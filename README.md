# Usha Chandru Birthday Celebration

A responsive React + Vite birthday microsite with:
- Pink and purple romantic theme
- Photo slideshow
- Confetti/fireworks-style celebration
- CSS animated birthday cake and candle
- Personal birthday letter modal
- Tamil-song playlist player
- Responsive mobile layout

## Requirements
- Node.js 18+ recommended
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite (usually http://localhost:5173).

## Build for hosting
```bash
npm run build
npm run preview
```

### GitHub Pages
This project deploys automatically to:
`https://vicky26794.github.io/ushachandru/`

1. Push to `main`
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**
3. The workflow `.github/workflows/deploy-pages.yml` builds and publishes `dist/`

Vite `base` is set to `/ushachandru/` for this project site.

## Add photos
Put your images in `public/images/` and name them:
- `photo-1.jpg`
- `photo-2.jpg`
- `photo-3.jpg`

The project includes a placeholder image that is shown if a photo file is missing.

## Add Tamil songs
Starter melodies are included as WAV files. Replace them with your own songs in `public/music/`:
- `tamil-birthday-1.wav` (or update paths in `src/App.jsx`)
- `tamil-birthday-2.wav`
- `favourite-melody.wav`

Use music that you own or have permission to use. The site tries to autoplay on load; if the browser blocks it, tap once anywhere (or use the music button) to start.

## Personalize the message
Edit the letter text in `src/App.jsx`, in the `letterOpen` modal section.

## Notes
- The "fireworks" celebration uses canvas-confetti bursts.
- The cake and floating decorations are CSS animations.
- Photos and songs are intentionally placeholders; add your own media before publishing.
