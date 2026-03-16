---
title: "Hello World: Costruire il Mio Portfolio"
date: "2026-03-17"
excerpt: "Come ho costruito questo portfolio con React, Tailwind CSS e Framer Motion — e le scelte dietro lo stack."
tags: ["react", "tailwind", "portfolio"]
readTime: 3
---

## Perche Costruire un Portfolio?

Come sviluppatore, avere un portfolio e piu di una vetrina — e un playground. Un posto dove puoi sperimentare liberamente, provare nuove librerie e affinare il tuo mestiere senza scadenze o vincoli.

## Lo Stack

Ho scelto uno stack moderno che bilancia **developer experience** e **performance**:

- **React 18** con TypeScript per componenti UI type-safe
- **Vite** per build velocissime e HMR
- **Tailwind CSS v4** per styling utility-first con token tema personalizzati
- **Framer Motion** per animazioni fluide basate sulla fisica
- **react-i18next** per internazionalizzazione italiano/inglese

## Scelte di Design Chiave

### Glassmorphism

Il tema scuro con pannelli di vetro traslucido crea profondita senza sacrificare la leggibilita. Ogni `GlassPanel` usa `backdrop-blur-xl` combinato con un bordo sottile e ombra.

### Particle Background

La rete di particelle animate sullo sfondo e costruita con Canvas API puro — zero dipendenze. Risponde al movimento del mouse su desktop e adatta il numero di particelle in base alla dimensione dello schermo.

```typescript
// Numero particelle responsive
const count = width > 1024 ? 60 : width > 768 ? 30 : 15;
```

### Dati GitHub Live

Invece di elencare manualmente i progetti, recupero i repository direttamente dall'API GitHub. Cosi il portfolio e sempre aggiornato.

## Cosa c'e in Programma?

Ho in programma di aggiungere altre sezioni e funzionalita. Restate sintonizzati!
