# AGENTS.md — Colégio Sagrado

## Project

Static institutional landing page for a Brazilian Catholic school. Single-page site with in-page anchor navigation.

- **Stack**: Astro 6 + React 19 + Tailwind CSS 4 (via `@tailwindcss/vite`)
- **Node**: >=22.12.0
- **Language**: Portuguese (pt-BR)
- **Build output**: `dist/` via `@astrojs/cloudflare` adapter (static output with on-demand rendering support)

## Developer Commands

| Command | Action |
|---|---|
| `npm run dev` | Dev server at `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview built site locally |

**No test, lint, or typecheck scripts are defined.** `npm run build` is the only verification step.

## Form Submission (Web3Forms)

The contact form submits natively via HTML `POST` to `https://api.web3forms.com/submit`. There is no custom fetch handler and no backend endpoint in this repository.

- The Web3Forms access key is exposed in the public HTML by design. It is injected at build time from `PUBLIC_WEB3FORMS_ACCESS_KEY` (Astro exposes `PUBLIC_*` variables to the client bundle). The value is **not a secret**.
- `PUBLIC_WEB3FORMS_REDIRECT` and `PUBLIC_WEB3FORMS_SUBJECT` configure the post-submit redirect and the e-mail subject. Defaults: `/obrigado/` and `Novo contato via site do Colégio Sagrado`.
- hCaptcha is enabled in the Web3Forms dashboard for the form. The site loads the official `web3forms.com/client/script.js`.
- Date and time fields are visit preferences only; the school confirms by phone or WhatsApp.

## Deployment (Cloudflare Workers)

The site is deployed as a Cloudflare Worker. The build is triggered automatically on pushes to `main` by the Cloudflare Workers build system, which runs `npm run build` and then `npx wrangler deploy` using `wrangler.jsonc`.

- Worker name: `colegio-sagrado`
- Entrypoint: `@astrojs/cloudflare/entrypoints/server` (provided by `@astrojs/cloudflare`)
- Required GitHub secrets (if using GitHub Actions): `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `PUBLIC_WEB3FORMS_ACCESS_KEY`.
- Optional GitHub variables: `PUBLIC_WEB3FORMS_REDIRECT` and `PUBLIC_WEB3FORMS_SUBJECT`.
- Historical Resend/Worker plans (`docs/plans/2026-07-12-001-feat-resend-email-migration-plan.md`, `docs/brainstorms/switch-form-email-to-resend-requirements.md`, `FULLSTACK.md`, `FORM-EMAIL-PLAN.md`) are superseded and must not be treated as instructions.

## Architecture

- **Entry**: `src/pages/index.astro` — single page importing all section components.
- **Layout**: `src/layouts/Layout.astro` — shared HTML shell, Google Fonts, floating back-to-top + WhatsApp buttons.
- **Components**: Mostly `.astro` files; interactive ones (`Header.tsx`, `AcademicJourney.tsx`) use React with `client:load`.
- **Assets**: `public/` for static files served as-is (favicon, opengraph.webp, hero.webp); `src/assets/` for images imported in components (e.g., `mascote.svg`).
- **Styling**: `src/global.css` — Tailwind v4 entry with `@theme inline`, CSS variables, custom `@keyframes marquee`, and `prefers-reduced-motion` overrides.
- **Adapter**: `@astrojs/cloudflare` for Cloudflare Workers deployment.

## Tailwind CSS 4 Quirks

- Uses v4 syntax: `@import "tailwindcss"` and `@theme inline` in `global.css`, NOT the v3 `@tailwind` directives.
- Plugin loaded via Vite (`@tailwindcss/vite`) in `astro.config.mjs`.
- `tw-animate-css` dependency provides `animate-in`, `fade-in`, `slide-in-from-bottom-*`, etc.
- Custom theme tokens map to CSS variables (e.g., `--color-primary` → `hsl(var(--primary))`).

## Content Source of Truth

- **`proposta.md`** contains the approved institutional structure, copy, and content for the website. It is the ground truth for headlines, testimonials, section text, and CTA wording.
- **`DESIGN.md`** is the living design system reference: exact hex values, typography scale (Playfair Display + Poppins), spacing, border-radius, shadows, and component specs.
- **`PRODUCT.md`** defines brand personality, target audience, anti-references, and accessibility targets.

## Important Conventions

- **Fonts**: Playfair Display (serif, headings) and Poppins (sans, body) are loaded from Google Fonts with a `media="print"` + `onload` optimization in `Layout.astro`. Do not switch to JS font loaders without preserving the print-media trick.
- **Navigation**: All nav links are in-page anchor scrolls (e.g., `#sobre-nos`, `#contato`). The Header uses `scrollIntoView({ behavior: "smooth" })`.
- **Hero image**: Local `/hero.webp` imported via `<Image />` from `astro:assets` with `fetchpriority="high"` and preloaded in `<head>`.
- **Images**: Use `<Image />` from `astro:assets` for all non-SVG images in `.astro` files (local or from `public/`). SVG images must use a regular `<img>` tag — the Astro `<Image />` component does not handle SVGs. React/TSX components (`client:load`) cannot use `<Image />` (Astro-only), so `<img>` or `getImage` + `<img>` is acceptable there.
- **Accessibility target**: WCAG 2.1 AA (documented in `PRODUCT.md`). Touch targets should be >=44×44px. Animations respect `prefers-reduced-motion` via `global.css`.
- **Color palette**:
  - Primary crimson: `#9c0d12` (CSS `var(--primary)`)
  - Secondary gold: `#e4c856` (CSS `var(--secondary)`)
  - Dark charcoal: `#1a1a1a` (CSS `var(--surface-dark)`)

## What Not to Do

- Do not add a dark mode toggle or `.dark` class theme — the site is explicitly light-only with dark sections as contrast accents.
- Do not replace the institutional tone with playful or startup-style UI (see `PRODUCT.md` anti-references).
- Do not delete or ignore `proposta.md` — it is the only approved copy source.
