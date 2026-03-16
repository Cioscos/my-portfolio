---
title: "Hello World: Building My Portfolio"
date: "2026-03-17"
excerpt: "How I built this portfolio with React, Tailwind CSS, and Framer Motion — and the choices behind the stack."
tags: ["react", "tailwind", "portfolio"]
readTime: 3
---

## Why Build a Portfolio?

As a developer, having a portfolio is more than a showcase — it's a playground. A place where you can experiment freely, try new libraries, and refine your craft without deadlines or constraints.

## The Stack

I chose a modern stack that balances **developer experience** with **performance**:

- **React 18** with TypeScript for type-safe UI components
- **Vite** for lightning-fast builds and HMR
- **Tailwind CSS v4** for utility-first styling with custom theme tokens
- **Framer Motion** for smooth, physics-based animations
- **react-i18next** for Italian/English internationalization

## Key Design Decisions

### Glassmorphism

The dark theme with translucent glass panels creates depth without sacrificing readability. Each `GlassPanel` uses `backdrop-blur-xl` combined with a subtle border and shadow.

### Particle Background

The animated particle network in the background is built with vanilla Canvas API — zero dependencies. It responds to mouse movement on desktop and adapts particle count based on screen size.

```typescript
// Responsive particle count
const count = width > 1024 ? 60 : width > 768 ? 30 : 15;
```

### Live GitHub Data

Instead of manually listing projects, I fetch repos directly from the GitHub API. This keeps the portfolio always up-to-date.

## What's Next?

I'm planning to add more sections and features. Stay tuned!
