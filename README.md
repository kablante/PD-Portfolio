# PD-Portfolio

Katarina Blante's portfolio — a bilingual (EN/PT) product-designer site with
an "ethereal and nocturnal" brand design system. Built with React, TypeScript
and Vite, deployed to GitHub Pages from `main`.

Live at https://kablante.github.io/PD-Portfolio/

## Structure

- `src/pages/home/` — home screen: the project card row, the wordmark, the
  "Who" section, and the effect hooks (card spread/tilt, cursor spotlight,
  aurora parallax, sitewide grain, EN/PT language state)
- `src/pages/project/ProjectPage.tsx` — case-study page, shared across all
  projects
- `src/components/shared/AuroraBackground.tsx` — the fixed background used by
  both Home and ProjectPage
- `src/components/ui/` — small shared UI primitives (button, dynamic frame
  layout)
- `src/styles/` — design tokens, component styles and site layout CSS
- `public/assets/` — logo lockups, licensed fonts (MADE Sunflower, Promised
  Freedom) and project images

## Running locally

```
npm install
npm run dev
```

## Building

```
npm run build
```

Type-checks with `tsc -b` and builds the production bundle to `dist/` via
Vite. `npm run preview` serves that build locally.

## Deploying

Pushing to `main` triggers `.github/workflows/deploy.yml`, which builds the
app and publishes `dist/` to GitHub Pages (see that file for why `dist/index.html`
is also copied to `dist/404.html`).

## Language toggle

Every page ships both English and Portuguese copy; the EN/PT switch swaps the
visible language and remembers the choice (`localStorage`) across pages.
