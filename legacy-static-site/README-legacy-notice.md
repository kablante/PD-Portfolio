# PD-Portfolio

Katarina Blante's portfolio — a static, bilingual (EN/PT) site built from her
"ethereal and nocturnal" brand design system.

## Structure

- `index.html` — home screen (five project cards + wordmark)
- `about.html` — about me
- `projects/` — one page per case study: `aurora-bank.html`, `petal.html`,
  `cosmos-learn.html`, `verao.html`, `nebula-studio.html`
- `css/tokens.css` — design tokens (colors, type, spacing, radii, effects)
- `css/components.css` — component styles (buttons, cards, icon buttons, the
  aurora field background, etc.)
- `css/site.css` — page layout and the EN/PT language toggle
- `js/site.js` — language toggle persistence, download-CV placeholder
- `assets/` — logo lockups and the brand's licensed fonts (MADE Sunflower,
  Promised Freedom)

## Running locally

It's a static site — no build step. Serve the folder with any static file
server, e.g.:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000/`.

## Language toggle

Every page ships both English and Portuguese copy; the EN/PT switch in the
footer swaps the visible language and remembers the choice (`localStorage`)
across pages.
