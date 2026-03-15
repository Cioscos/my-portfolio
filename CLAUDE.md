# Portfolio — Claudio Ciccarone

## Panoramica

Portfolio personale di Claudio Ciccarone, sviluppatore Back-end presso DXC Technology. Sito statico hostato su GitHub Pages.

## Stack Tecnologico

- **Framework**: React 18+ con Vite
- **Linguaggio**: TypeScript
- **Styling**: CSS Modules o Tailwind CSS
- **Animazioni**: Framer Motion
- **i18n**: react-i18next (italiano/inglese)
- **Routing/navigazione**: scroll-to-section con navbar cliccabile (single-page)
- **Deploy**: GitHub Pages (build statica via `vite build`)
- **Linting**: ESLint + Prettier

## Struttura del Progetto

```
src/
├── assets/            # Immagini, icone, font
├── components/        # Componenti riutilizzabili (Navbar, Card, GlassPanel, Footer, LanguageSwitcher...)
├── sections/          # Sezioni principali della pagina
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Projects.tsx
│   ├── Skills.tsx
│   ├── Experience.tsx
│   └── Contact.tsx
├── hooks/             # Custom hooks (useGitHubRepos, useScrollSpy, useInView...)
├── i18n/              # Configurazione i18next e file di traduzione
│   ├── i18n.ts
│   ├── it.json
│   └── en.json
├── utils/             # Funzioni helper
├── App.tsx
├── main.tsx
└── index.css
```

## Stile Visivo

- **Design**: Moderno con effetti glassmorphism (backdrop-filter, blur, bordi semi-trasparenti)
- **Palette**: Toni scuri (sfondo `#0a0a0f` / `#12121a`) con accenti neon (ciano `#00f0ff`, magenta `#ff00e5`, verde neon `#39ff14` come accent secondario)
- **Font**:
  - Titoli: **Space Grotesk** (Google Fonts)
  - Corpo: **Inter** (Google Fonts)
  - Codice/monospace: **Fira Code** (Google Fonts)
- **Border radius**: Generoso (12-20px) per i pannelli glass
- **Ombre**: Glow neon sugli accenti, box-shadow con colori accent

## Sezioni del Sito

### 1. Hero / Intro
- Nome, titolo professionale ("Back-end Developer")
- Typing effect animato con le passioni (software, IA, videogames, hardware PC)
- CTA button verso la sezione Contatti
- Particelle animate o effetto gradient sullo sfondo

### 2. About Me
- Foto placeholder o avatar
- Bio: Claudio Ciccarone, nato a Bari nel 1998, Back-end developer presso DXC Technology
- Passioni: software, programmazione, intelligenza artificiale, videogiochi, hardware PC
- Pannello glassmorphism

### 3. Progetti
- **Fetch automatico** dai repo pubblici GitHub tramite API REST (`https://api.github.com/users/Cioscos/repos`)
- Card per ogni repo con: nome, descrizione, linguaggio principale, stelle, link al repo
- Filtro per linguaggio/tecnologia
- Animazione staggered sulle card (fade-in + slide-up)
- Gestione loading state e fallback in caso di errore API

### 4. Competenze / Skills
- Visualizzazione a icone o badge per ogni tecnologia:
  - **Java** con Spring Boot 3/4
  - **Python** con FastAPI
  - **Database**: Oracle, PostgreSQL
  - **Messaging**: Apache Kafka, RabbitMQ
- Animazione di ingresso allo scroll (scale-in o fade-in)

### 5. Esperienze Lavorative
- Timeline verticale animata
- **DXC Technology** — Back-end Developer (esperienza attuale, prima esperienza lavorativa)
- **Freelancer** — Sviluppo su fork di DeepFaceLab
- Ogni entry con: ruolo, azienda, periodo, breve descrizione

### 6. Contatti
- Email: claudiocicca98@gmail.com
- LinkedIn: https://www.linkedin.com/in/claudio-ciccarone-366b14141/
- GitHub: https://github.com/Cioscos
- Form di contatto opzionale (con servizio tipo Formspree/EmailJS per sito statico)
- Icone social animate al hover

## Navbar

- Fissa in alto con effetto glass/blur
- Link alle sezioni con smooth scroll
- Indicatore della sezione attiva (scroll spy)
- Language switcher (IT/EN) integrato
- Hamburger menu responsive per mobile

## Animazioni (Framer Motion)

- **Hero**: Typing effect sul titolo, fade-in sui CTA, particelle/gradient animato sullo sfondo
- **Sezioni**: Fade-in + slide-up all'ingresso nel viewport (useInView)
- **Card progetti**: Staggered animation, hover con scale + glow neon
- **Skills**: Scale-in o bounce-in allo scroll
- **Timeline esperienze**: Reveal progressivo degli step
- **Contatti**: Icone con bounce/pulse al hover
- **Navbar**: Blur progressivo allo scroll
- **Transizioni di pagina**: Smooth scroll con easing personalizzato
- **Parallax**: Effetto parallax leggero su sfondo Hero e decorazioni

## Multilingua (i18n)

- Lingue supportate: **Italiano** (default), **Inglese**
- Implementazione con `react-i18next`
- File di traduzione JSON separati (`it.json`, `en.json`)
- Language switcher nella navbar
- Persistenza della lingua scelta in localStorage

## GitHub Pages — Deploy

- Build output in `dist/`
- Configurare `base` in `vite.config.ts` con il nome del repo (es. `/my-portfolio/`)
- Usare `gh-pages` package o GitHub Actions per il deploy automatico
- Aggiungere file `404.html` che redirige a `index.html` per gestire il routing client-side

## Requisiti Tecnici

- **Responsive**: Mobile-first, breakpoints per tablet e desktop
- **Performance**: Lazy loading immagini, code splitting delle sezioni
- **Accessibilità**: Attributi ARIA, contrasto colori adeguato, navigazione da tastiera
- **SEO**: Meta tag, Open Graph, titolo dinamico per lingua
- **Dark mode**: Il sito è dark by default (coerente con la palette scura)

## Comandi

```bash
npm create vite@latest . -- --template react-ts   # Init progetto
npm install                                         # Installa dipendenze
npm run dev                                         # Dev server locale
npm run build                                       # Build produzione
npm run preview                                     # Preview build locale
npm run deploy                                      # Deploy su GitHub Pages
```

## Dipendenze Principali

```json
{
  "react": "^18",
  "react-dom": "^18",
  "framer-motion": "^11",
  "react-i18next": "^14",
  "i18next": "^23",
  "react-icons": "^5",
  "react-scroll": "^1"
}
```
