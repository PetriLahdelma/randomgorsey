# Random Gorsey

## What This Is

A bold, design-forward creative showcase built on React 19 with modern Tailwind CSS, three-layer token architecture, fluid typography, and performance-tiered visual effects. Each page has distinct motion personality while maintaining cohesive site identity.

## Core Value

**Ship something you'd be proud to show design-literate peers** — every decision should feel intentional, not safe.

## Requirements

### Validated

- ✓ React 19 SPA with client-side routing — existing
- ✓ 7 pages (Home, About, Contact, Gallery, Discography, Listen, 404) — existing
- ✓ Contact form with validation and email sending — existing
- ✓ Framer Motion animation infrastructure — existing
- ✓ SEO with react-helmet-async and static generation — existing
- ✓ TypeScript throughout — existing
- ✓ Three-layer token architecture (primitives -> semantics -> sections) — v1.0
- ✓ Section personality system via data-section attributes — v1.0
- ✓ Variable fonts with fluid clamp() sizing — v1.0
- ✓ CSS @layer cascade organization — v1.0
- ✓ shadcn/ui v2 + Tailwind CSS + Radix primitives — v1.0
- ✓ Centralized motion config with springs, variants, reduced-motion — v1.0
- ✓ Lenis smooth scroll integration — v1.0
- ✓ Kinetic typography with SplitType — v1.0
- ✓ Scroll-driven reveal animations — v1.0
- ✓ Layout primitives (Stack, Cluster, Grid, Bleed, Container) — v1.0
- ✓ Intentional grid breaks — v1.0
- ✓ Container queries for component-level responsiveness — v1.0
- ✓ Custom cursor with personality — v1.0
- ✓ Choreographed page transitions — v1.0
- ✓ Section-specific visual identities per page — v1.0
- ✓ Full-bleed video backgrounds with mobile fallbacks — v1.0
- ✓ Full-bleed hero images — v1.0
- ✓ WebGL particle effects (performance-tiered) — v1.0
- ✓ 3D elements via React Three Fiber — v1.0
- ✓ Storybook component documentation — v1.0

### Active

- [ ] Sound design / audio feedback on interactions
- [ ] Custom audio player with visualizations
- [ ] Ambient soundscapes per section
- [ ] Horizontal scroll sections
- [ ] Drag-based gallery navigation
- [ ] Gesture-driven mobile interactions

### Out of Scope

- Lighthouse score maxing — performance matters but isn't the lens
- Enterprise UX patterns — this is explicitly experimental
- Mobile app framing — web-first
- Conservative/safe design — allowed to be bold
- Startup cliches — no hero illustrations, bento grids

## Context

**What exists:** A bold creative showcase with 11,361 lines of TypeScript, modern Tailwind CSS v4, shadcn/ui components, fluid typography, centralized motion system, performance-tiered visual effects, and distinct page personalities.

**Tech stack:** React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Radix, Framer Motion, Lenis, React Three Fiber

**Deployment:** GitHub Pages static hosting

**v1.0 shipped:** 2026-01-24 (9 phases, 43 plans, 19 requirements)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Tailwind v4 migration from CSS Modules | Modern tooling, CSS-first config, better DX | ✓ Good |
| Three-layer token architecture | Primitives → Semantics → Sections enables personality | ✓ Good |
| oklch color format | Perceptual uniformity, modern color handling | ✓ Good |
| Spring-based animations | Physics-based motion feels natural | ✓ Good |
| GPU tier detection | Graceful degradation, battery-conscious | ✓ Good |
| Lenis disabled on mobile | Native scroll UX preferred, no scroll-jacking | ✓ Good |
| AnimatePresence mode='wait' | Exit completes before enter for clean transitions | ✓ Good |
| Section-specific variants | Each page has distinct motion personality | ✓ Good |

---
*Last updated: 2026-01-24 after v1.0 milestone*
