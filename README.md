# Colégio Sagrado do Coração de Jesus

Landing page institucional do Colégio Sagrado, escola católica com mais de 25 anos de tradição em São Luís, MA. Site estático de página única com navegação por âncoras, desenvolvido para conversão de matrículas (visitas agendadas e contato via WhatsApp).

## Stack

- **Astro** 6 — gerador de site estático
- **React** 19 — componentes interativos (Header, AcademicJourney)
- **Tailwind CSS** 4 — estilização via `@tailwindcss/vite`
- **TypeScript** — tipagem estrita (`astro/tsconfigs/strict`)

## Pré-requisitos

- Node.js >= 22.12.0

## Comandos

| Comando | Ação |
|---|---|
| `npm install` | Instala dependências |
| `npm run dev` | Servidor de desenvolvimento em `localhost:4321` |
| `npm run build` | Build de produção para `./dist/` |
| `npm run preview` | Pré-visualização local do build |

> **Nota:** Não há scripts de teste, lint ou typecheck. O comando `npm run build` é a única etapa de verificação.

## Estrutura

```
├── public/              # Assets estáticos (logo, favicon, opengraph)
├── src/
│   ├── assets/          # Imagens processadas (mascote, background)
│   ├── components/      # Seções da landing page (.astro e .tsx)
│   ├── layouts/         # Layout.astro — shell HTML compartilhado
│   ├── pages/           # index.astro — página única
│   └── global.css       # Entrada do Tailwind v4, tema e animações
├── DESIGN.md            # Design system: cores, tipografia, componentes
├── PRODUCT.md           # Brand personality, personas, anti-referências
└── proposta.md          # Estrutura institucional e copy aprovados (source of truth)
```

## Design System

- **Cores principais:**
  - Crimson `#9c0d12` (`var(--primary)`) — CTAs, estados ativos, sobreposições
  - Gold `#e4c856` (`var(--secondary)`) — destaques, acentos, hover de CTA
  - Dark `#1a1a1a` (`var(--surface-dark)`) — seções de contraste (WhyUs, Footer)

- **Tipografia:**
  - **Playfair Display** (serif) — títulos, destaques
  - **Poppins** (sans-serif) — corpo, labels, UI

- **Animações:** `tw-animate-css` para entradas (`animate-in`, `fade-in`, `slide-in-from-bottom-*`) e keyframe customizado `marquee` com respeito a `prefers-reduced-motion`.

## Fontes de Conteúdo

- **`proposta.md`** — estrutura institucional, copy, headlines e CTAs aprovados. É a única fonte de verdade para conteúdo.
- **`DESIGN.md`** — especificações visuais (hex exatos, escala tipográfica, espaçamento, raios de borda, sombras).
- **`PRODUCT.md`** — diretrizes de marca, público-alvo e acessibilidade.

## Acessibilidade

- Meta: **WCAG 2.1 AA**
- Contraste mínimo 4.5:1 para texto corrido; 3:1 para texto grande
- Touch targets >= 44×44px
- Animações respeitam `prefers-reduced-motion`
- Idioma da página: `lang="pt-BR"`

## Notas de Desenvolvimento

- **Tailwind CSS v4:** usa sintaxe `@import "tailwindcss"` e `@theme inline` em `global.css`. Não use as diretivas v3 (`@tailwind base/components/utilities`).
- **Navegação:** todas as âncoras internas usam `scrollIntoView({ behavior: "smooth" })`. Não há rotas adicionais.
- **Modo escuro:** o site é **exclusivamente light**. Não adicione toggle de dark mode ou classes `.dark`.
- **Otimização de fontes:** as fontes do Google são carregadas com `media="print"` + `onload="this.media='all'"` no `Layout.astro`. Preserve essa técnica se for alterar o carregamento.
