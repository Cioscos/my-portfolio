# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio for Claudio Ciccarone — a single-page React app deployed to GitHub Pages. Dark-themed with glassmorphism design and neon accent colors.

## Commands

```bash
npm run dev        # Start Vite dev server
npm run build      # TypeScript check + Vite production build (output: dist/)
npm run preview    # Preview production build locally
npm run lint       # ESLint
npm run format     # Prettier (src/**/*.{ts,tsx,css,json})
```

No test framework is configured. Deploy happens automatically via GitHub Actions on push to `main` (`.github/workflows/deploy.yml`).

## Architecture

**Single-page app** — `App.tsx` renders `ParticleBackground`, a fixed `Navbar`, six section components in order (Hero → About → Projects → Skills → Experience → Contact), and a `Footer`. Navigation is scroll-to-section via `react-scroll`, not a router. App includes a skip-to-content link and syncs `document.documentElement.lang` with the active i18n language.

**Key patterns:**
- **Sections** (`src/sections/`) are full-page blocks; **components** (`src/components/`) are reusable UI pieces (Navbar, Footer, GlassPanel, LanguageSwitcher, ParticleBackground)
- **Particle background** (`src/components/ParticleBackground.tsx`) — vanilla Canvas API animation (zero dependencies) rendering a connected particle network behind all content. Uses neon-cyan/magenta/green colors, mouse repulsion on desktop, responsive particle count (60/30/15), `prefers-reduced-motion` support, and visibility-based pausing. Layered at `z-0` fixed; GlassPanel `backdrop-blur` naturally frosts the particles behind panels
- **Contact form** (`src/sections/Contact.tsx`) — POST to Formspree with loading/success/error states. Social links above, form in a GlassPanel below
- **About section** (`src/sections/About.tsx`) — multi-paragraph bio (split on `\n\n` from i18n) with highlight badges rendered as neon-cyan chips
- **Hero section** (`src/sections/Hero.tsx`) — typing animation, CTA button, and outline-style Download CV button linking to `public/cv/Claudio_Ciccarone_CV.pdf`
- **GitHub repos** are fetched live from the GitHub API in `src/hooks/useGitHubRepos.ts` — the Projects section displays them with language filtering
- **Blog** — content lives in a separate repo (`Cioscos/blog-content`) and is fetched at runtime from `raw.githubusercontent.com`. `useBlogIndex.ts` fetches `index.json` (post metadata), `useBlogPost.ts` fetches individual `.md` files. Both use in-memory caching via `blogLoader.ts`. Adding a new post only requires a commit to the blog-content repo — no portfolio rebuild needed
- **i18n** uses `react-i18next` with bundled JSON translations (`src/i18n/it.json`, `src/i18n/en.json`). Italian is the fallback language. All user-facing strings must exist in both translation files
- **Animations** use the `motion` package (Framer Motion v12+). Sections animate on viewport entry
- **Styling** uses Tailwind CSS v4 via `@tailwindcss/vite` plugin. Custom theme tokens (colors, fonts) are defined in `src/index.css` under `@theme`

## Accessibility

- Skip-to-content link as first focusable element in `App.tsx`
- `*:focus-visible` global outline (`neon-cyan`, 2px, offset 2px) in `index.css`
- Navbar: `aria-expanded`, `aria-controls="mobile-menu"` on hamburger button; Escape key closes mobile menu

## Security

- **CSP** — `Content-Security-Policy` meta tag in `index.html` restricts sources: scripts to `'self'`, styles to `'self'`/`'unsafe-inline'`/Google Fonts, connections to GitHub API, Formspree & `raw.githubusercontent.com`, no frames/objects. Also includes `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin`
- **Markdown sanitization** — `rehype-sanitize` in `BlogPostPage.tsx` strips raw HTML/script tags from blog markdown. Custom schema allows `language-*` and `hljs*` classes for syntax highlighting
- **GitHub Actions pinned to SHAs** — `.github/workflows/deploy.yml` uses full commit SHAs (not version tags) to prevent supply chain attacks. When updating actions, look up the new SHA and keep the `# vN` comment
- **Contact form constraints** — client-side `maxLength`/`minLength` on name (100), email (254), message (10–2000)
- `escapeValue: false` in i18next config is intentional — React/JSX already escapes output

## SEO

- `public/robots.txt` and `public/sitemap.xml` — canonical URL: `https://claudiociccarone.com/my-portfolio/`
- `index.html` includes canonical link, Open Graph (`og:title`, `og:description`, `og:type`, `og:url`, `og:image`) and Twitter Card meta tags
- OG image expected at `public/og-image.jpg` (1200×630px)

## Design Tokens (defined in `src/index.css`)

- **Backgrounds**: `bg-primary` (#0a0a0f), `bg-secondary` (#12121a), `bg-glass` (rgba translucent)
- **Accents**: `neon-cyan` (#00f0ff), `neon-magenta` (#ff00e5), `neon-green` (#39ff14)
- **Fonts**: `font-heading` (Space Grotesk), `font-body` (Inter), `font-mono` (Fira Code)

Use these tokens via Tailwind classes (e.g., `text-neon-cyan`, `bg-bg-primary`, `font-heading`).

## TypeScript

Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`. The build will fail on type errors (`tsc -b` runs before `vite build`).

## Vite Config

`base: '/my-portfolio/'` is set for GitHub Pages subpath hosting. All asset references must work with this base path.

## General instructions

- Always create a new brench before editing the code
- Always use Context7 mcp if it makes sense
