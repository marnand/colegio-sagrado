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

## Formulário de contato (Web3Forms)

O formulário de contato é um POST HTML nativo para `https://api.web3forms.com/submit`, com hCaptcha gratuito ativado pelo dashboard da conta. Não há backend neste repositório.

- A chave do Web3Forms é pública e injetada no build via `PUBLIC_WEB3FORMS_ACCESS_KEY` (e não é um segredo de servidor).
- Variáveis opcionais: `PUBLIC_WEB3FORMS_REDIRECT` (padrão `/obrigado/`) e `PUBLIC_WEB3FORMS_SUBJECT`.
- Data e horário são preferências; a escola confirma a visita por telefone ou WhatsApp.
- Há uma página `/privacidade/` provisória que precisa do texto definitivo antes do lançamento em produção.

## Deploy (Cloudflare Pages)

O deploy publica o diretório `dist/` no Cloudflare Pages via GitHub Actions (`cloudflare/wrangler-action@v3` + `wrangler pages deploy dist`).

- **Secrets** do repositório: `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `PUBLIC_WEB3FORMS_ACCESS_KEY`.
- **Variables** do repositório: `CLOUDFLARE_PAGES_PROJECT` (obrigatório), `PUBLIC_WEB3FORMS_REDIRECT` e `PUBLIC_WEB3FORMS_SUBJECT` (opcionais).
- Sem Worker, sem `wrangler.jsonc` e sem credenciais do Resend.

## Estrutura

```
├── public/              # Assets estáticos servidos como estão (favicon, opengraph.webp, hero.webp)
├── src/
│   ├── assets/          # Imagens importadas em componentes (ex.: mascote.svg)
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
- **Imagens:** use `<Image />` de `astro:assets` para imagens não-SVG em arquivos `.astro`. SVGs devem usar `<img>` comum — o componente `<Image />` do Astro não suporta SVG. Em componentes React/TSX (`client:load`), use `<img>` ou `getImage` + `<img>`, pois `<Image />` é exclusivo do Astro.
