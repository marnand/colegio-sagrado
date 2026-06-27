# Design

## Visual Theme

**Theme:** Light. Parents browse this site during daytime hours on their phones or at home — the warm off-white and deep crimson read as credible, authoritative, and inviting under normal ambient light. The dark charcoal sections (Footer) provide dramatic contrast and rhythm, not a full dark UI.

**Mood:** Institutional prestige with genuine warmth. Serious without being cold. The crimson carries authority and Catholic tradition; the gold carries warmth and celebration.

**Color strategy:** Committed. The crimson carries 30–60% of key surfaces (Hero overlay, CTA section, active states, CTAs). Gold plays a supporting accent role — not a second primary.

## Color Palette

| Role | CSS Variable | HSL | Hex Approx | Usage |
|---|---|---|---|---|
| Primary | `--primary` | `355 86% 33%` | `#9c0d12` | CTAs, active states, section accents, crimson overlay |
| Primary Foreground | `--primary-foreground` | `0 0% 100%` | `#ffffff` | Text on primary |
| Secondary / Accent | `--secondary` / `--accent` | `44 75% 62%` | `#e4c856` | Badge highlights, marquee text, icon accents, CTA hover |
| Secondary Foreground | `--secondary-foreground` | `355 86% 20%` | `#5e080c` | Text on gold elements |
| Background | `--background` | `0 0% 100%` | `#ffffff` | Page background (white sections) |
| Foreground | `--foreground` | `0 0% 10%` | `#1a1a1a` | Body text, charcoal dark sections |
| Muted | `--muted` | `0 0% 96%` | `#f5f5f5` | Light section backgrounds |
| Muted Foreground | `--muted-foreground` | `0 0% 45%` | `#737373` | Secondary text, captions |
| Border | `--border` | `0 0% 90%` | `#e6e6e6` | Dividers, card borders |

**Named hardcoded values in use (not yet tokenized):**

- `#7a0a0e` — darkest red hover (primary hover variant, only in Hero/Header)
- `#8a0b10` — mid-dark red (only in `.striped-bg` gradient pattern)
- `#FAF8F5` — warm parchment (Testimonials section background)
- `#f8f9fa` — cool off-white (QuickLinks background, Calendar section)
- `#f9fafb` — near-equivalent to above (Calendar section)

## Typography

### Fonts

| Role | Font | Weights | Source |
|---|---|---|---|
| Headings / Pull quotes | Playfair Display | 700, 800 (bold/extrabold), 400 italic | Google Fonts |
| Body / UI / Labels | Poppins | 300, 400, 500, 600, 700 | Google Fonts |

### Scale (in use)

| Label | Size | Weight | Font | Usage |
|---|---|---|---|---|
| Hero H1 | `4xl`–`7xl` (clamp) | 700 | Playfair Display | Hero headline |
| Section H2 | `4xl`–`5xl` | 700 | Playfair Display | Section headings |
| Section H3 | `3xl` | 700 | Playfair Display | Subsection / tab headings |
| Card H3 | `xl` | 700 | Playfair Display | Card headings in WhyUs |
| Eyebrow label | `sm` | 600 | Poppins | `uppercase tracking-wider` category labels |
| Body large | `lg`–`xl` | 300–400 | Poppins | Section descriptive text |
| Body default | `base` | 400 | Poppins | General body text |
| Small / caption | `sm`–`xs` | 400–600 | Poppins | Footer links, captions, dates |
| Stat numbers | `4xl` | 700 | Playfair Display | "+38", "100%" stats |

**Leading:** `leading-tight` (1.1) for large display headlines; `leading-relaxed` (~1.625) for body text.

**Tracking:** `tracking-wider` + `uppercase` for eyebrow labels; `tracking-widest` for nav items and CTA buttons.

## Spacing

Tailwind's default spacing scale throughout. No custom spacing tokens defined.

| Context | Padding / Gap |
|---|---|
| Section vertical rhythm | `py-24` (96px top + bottom) |
| Compact sections (QuickLinks, Marquee) | `py-16` |
| CTA section | `py-32` |
| Content containers | `px-4 sm:px-6 lg:px-8` |
| Card padding | `p-6` – `p-10` |
| Section max-width | `max-w-7xl mx-auto` |

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `--radius` (base) | `0.5rem` (8px) | Default |
| Buttons / CTAs | `rounded` (4px) or `rounded-full` | Depends on context |
| Cards | `rounded-xl` (12px) or `rounded-2xl` (16px) | Content cards |
| Badges / pills | `rounded-full` | Eyebrow labels, chip elements |
| Calendar navigation | `rounded` (4px) | Mini buttons |

## Elevation / Shadow

| Level | Tailwind | Usage |
|---|---|---|
| Card resting | `shadow-sm` | Default card state |
| Card hover | `shadow-xl` | Hover state lift |
| CTA button | `shadow-2xl shadow-[#e4c856]/20` | Gold CTA button |
| Header | `shadow-md` | Scrolled header |
| About image | `shadow-2xl` | Hero image with offset gold backing |
| Calendar container | `shadow-xl border border-gray-100` | Full calendar component |

## Components

### Header

Fixed top, white background, transparent pre-scroll to white+shadow on scroll. Logo left, nav center, language switcher + "Portal do Aluno" CTA right. Mobile: hamburger menu expanding below header.

CTA button style: `bg-[#9c0d12] text-white px-6 py-2.5 rounded font-semibold shadow-lg shadow-[#9c0d12]/30`.

### Hero

Full-viewport section with local WebP background image (`/hero.webp`), preloaded in `<head>`. Crimson-to-transparent gradient overlay using Tailwind v4 syntax (`bg-linear-to-r from-primary via-primary/50 to-transparent`) plus subtle `bg-black/20`. Left-aligned content. H1 in gold (`text-secondary`) Playfair Display. Interactive ValueSpotlight React component (`client:load`) below the subtitle. Ken Burns hover effect on background image (20s transition).

### Section Eyebrow

```html
<div class="flex items-center gap-4 mb-4">
  <div class="h-px w-12 bg-[#e4c856]"></div>
  <span class="text-[#9c0d12] font-semibold tracking-wider text-sm uppercase">Label</span>
</div>
```

Or simple: `<span class="text-[#9c0d12] font-semibold tracking-wider text-sm uppercase mb-2 block">Label</span>`

### Feature Cards (WhyUs)

Light off-white section (`bg-[#f8f9fa]`) with a subtle dot-pattern texture. Centered school mascot floats over a soft gold-tinted rounded backdrop. Feature cards are white, `rounded-2xl`, with a light border and soft shadow; each card shows a circular icon on the left and a bold title + description on the right. On desktop the cards are absolutely positioned in a constellation around the mascot; on mobile they stack vertically below the mascot. Hover: card lifts slightly and shadow deepens; icon background fills with primary crimson and turns white.

### Quick-Link Cards

White cards on gray background. Center-aligned: large circular icon (red tint → crimson fill on hover), bold title, pill button (border-crimson → filled on hover). Hover: shadow-xl + lift.

### Testimonial Cards

White card on parchment (`#FAF8F5`) section. Giant quotation mark (crimson at 20% opacity). Italic body text. Divider line + avatar initials circle + name/role.

### Marquee Belt

Full-width striped crimson diagonal background. Gold Playfair Display bold text with `✦` decorators. Infinite CSS animation, `aria-hidden` duplicate for seamless loop.

### Academic Journey (Tabbed)

Tab buttons: inactive = `bg-gray-100 text-gray-500`; active = `bg-[#9c0d12] text-white shadow-lg scale-105`. Content: two-column image + text on gray card. Age badge in gold on image. Checklist with circular crimson checkmarks.

### CTA Section

Dark `bg-[#1a1a1a]` with grayscale image overlay + crimson/dark gradient. Center-aligned. Gold pill badge, white Playfair Display headline, light body text, gold pill CTA button.

### Footer

`bg-[#1a1a1a]` with `border-t-4 border-[#9c0d12]`. 4-column grid. Logo inverted white. Link hover: gold. Contact icons in gold.

## Motion

| Element | Animation | Notes |
|---|---|---|
| Hero H1 / CTAs | `animate-in fade-in slide-in-from-bottom-8 duration-700` | tw-animate-css entry |
| Marquee | `marquee 20s linear infinite` | CSS keyframe, custom |
| Tab content | `animate-in fade-in zoom-in-95 duration-500` | On tab switch |
| Hero background image | `transition-transform duration-[20s] ease-out` | Slow 20s Ken Burns |
| Scroll indicator | `animate-bounce` | Bounce (present, but banned) |
| Card hover | `transition-all duration-300` | Lift + shadow |
| Image hover | `transition-all duration-700` | Opacity + scale |

| WhyUs mascot | `float-mascote 8s ease-in-out infinite` | Custom keyframe, vertical float |
| WhyUs mascot (mobile) | `float-soft 6s ease-in-out infinite` | Custom keyframe, softer float |
| WhyUs dot pattern | `radial-gradient` static background | 28px grid, 4% opacity |

`prefers-reduced-motion` media query in `global.css` disables marquee, bounce, and collapses all transitions/animations to near-zero for users who prefer reduced motion.

## Image Assets

All non-SVG imagery (`.webp`, `.png`, `.jpg`) in `.astro` components uses `<Image />` from `astro:assets` for automatic optimization, responsive sizing, and lazy loading. SVGs (e.g., `mascote.svg`) must use a regular `<img>` tag — Astro's `<Image />` does not handle SVG files. In React/TSX components (`client:load`), use standard `<img>` tags since `<Image />` is Astro-only.
