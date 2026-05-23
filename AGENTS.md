# AGENTS.md — Colégio Sagrado

## Project

Static institutional landing page for a Brazilian Catholic school. Single-page site with in-page anchor navigation.

- **Stack**: Astro 6 + React 19 + Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Node**: >=22.12.0
- **Language**: Portuguese (pt-BR)
- **Build output**: static `dist/` (default Astro static adapter)

## Developer Commands

| Command | Action |
|---|---|
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview built site locally |

**No test, lint, or typecheck scripts are defined.** `npm run build` is the only verification step.

## Architecture

- **Entry**: `src/pages/index.astro` — single page importing all section components.
- **Layout**: `src/layouts/Layout.astro` — shared HTML shell, Google Fonts, floating back-to-top + WhatsApp buttons.
- **Components**: Mostly `.astro` files; interactive ones (`Header.tsx`, `AcademicJourney.tsx`) use React with `client:load`.
- **Assets**: `public/` for static files (logo, favicon); `src/assets/` for processed images (mascot, background).
- **Styling**: `src/global.css` — Tailwind v4 entry with `@theme inline`, CSS variables, custom `@keyframes marquee`, and `prefers-reduced-motion` overrides.

## Tailwind CSS 4 Quirks

- Uses v4 syntax: `@import "tailwindcss"` and `@theme inline` in `global.css`, NOT the v3 `@tailwind` directives.
- Plugin loaded via Vite (`@tailwindcss/vite`) in `astro.config.mjs`.
- `tw-animate-css` dependency provides `animate-in`, `fade-in`, `slide-in-from-bottom-*`, etc.
- Custom theme tokens map to CSS variables (e.g., `--color-primary` → `hsl(var(--primary))`).

## Content Source of Truth

- **`textos.txt`** (gitignored but present locally) contains the canonical Portuguese copy approved by the school director. It is the ground truth for headlines, testimonials, section text, and CTA wording.
- **`DESIGN.md`** is the living design system reference: exact hex values, typography scale (Playfair Display + Poppins), spacing, border-radius, shadows, and component specs.
- **`PRODUCT.md`** defines brand personality, target audience, anti-references, and accessibility targets.

## Important Conventions

- **Fonts**: Playfair Display (serif, headings) and Poppins (sans, body) are loaded from Google Fonts with a `media="print"` + `onload` optimization in `Layout.astro`. Do not switch to JS font loaders without preserving the print-media trick.
- **Navigation**: All nav links are in-page anchor scrolls (e.g., `#sobre-nos`, `#contato`). The Header uses `scrollIntoView({ behavior: "smooth" })`.
- **Hero image**: Loaded from external Unsplash URL with `fetchpriority="high"` and preloaded in `<head>`.
- **Accessibility target**: WCAG 2.1 AA (documented in `PRODUCT.md`). Touch targets should be >=44×44px. Animations respect `prefers-reduced-motion` via `global.css`.
- **Color palette**:
  - Primary crimson: `#9c0d12` (CSS `var(--primary)`)
  - Secondary gold: `#e4c856` (CSS `var(--secondary)`)
  - Dark charcoal: `#1a1a1a` (CSS `var(--surface-dark)`)

## What Not to Do

- Do not add a dark mode toggle or `.dark` class theme — the site is explicitly light-only with dark sections as contrast accents.
- Do not replace the institutional tone with playful or startup-style UI (see `PRODUCT.md` anti-references).
- Do not delete or ignore `textos.txt` — it is the only approved copy source.
