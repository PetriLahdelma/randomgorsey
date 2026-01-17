# Roadmap

**Project:** Random Gorsey - Bold/Experimental Creative Transformation
**Created:** 2026-01-17
**Phases:** 9

## Overview

This roadmap transforms a functional React 19 portfolio into a bold, design-forward creative showcase. The structure follows natural dependencies: Tailwind/shadcn migration enables the token architecture, which enables typography and motion systems, which enable layouts and effects, which enable the final page experiences. Each phase delivers a verifiable capability that unblocks subsequent work.

## Phases

### Phase 1: Tailwind Migration

**Goal:** Replace CSS Modules foundation with shadcn/ui v2 + Tailwind CSS + Radix primitives
**Depends on:** Nothing (first phase)
**Requirements:** FOUND-05

**Success Criteria:**
1. User can view the site with Tailwind CSS serving all existing styles
2. User sees shadcn/ui components rendering correctly where implemented
3. User experiences no visual regressions from the CSS Modules version
4. Developer can import Radix primitives and shadcn components in any file

**Plans:** 7 plans

Plans:
- [x] 01-01-PLAN.md — Migrate from CRA to Vite build system
- [x] 01-02-PLAN.md — Install Tailwind CSS v4 and shadcn/ui foundation
- [x] 01-03-PLAN.md — Migrate design system primitives (Heading, Text, Surface)
- [x] 01-04-PLAN.md — Migrate form components (Button, Input, TextArea, Select, Checkbox, Label)
- [x] 01-05-PLAN.md — Migrate feedback components (Alert, Badge, Modal, Spinner, Avatar, Caption)
- [x] 01-06-PLAN.md — Migrate layout patterns (Header, Footer, App) and verify
- [x] 01-07-PLAN.md — Update Storybook and cleanup CSS Modules

---

### Phase 2: Token Architecture

**Goal:** Establish three-layer token system with section personality foundation
**Depends on:** Phase 1
**Requirements:** FOUND-01, FOUND-02, FOUND-04

**Success Criteria:**
1. User sees consistent color/spacing across the site via semantic tokens
2. User sees different visual personalities when navigating between sections (hero vs gallery vs listen)
3. Developer can override semantic tokens at section level via data-section attributes
4. Developer can trace cascade behavior predictably via @layer organization

**Plans:** (created by /gsd:plan-phase)

---

### Phase 3: Typography System

**Goal:** Implement variable fonts with fluid sizing and expressive hierarchy
**Depends on:** Phase 2
**Requirements:** FOUND-03

**Success Criteria:**
1. User sees typography scale fluidly from mobile to desktop without breakpoint jumps
2. User sees bold, editorial-style headings that establish visual hierarchy
3. User experiences smooth font rendering with no layout shift on load
4. Developer can use clamp()-based sizing for any text element

**Plans:** (created by /gsd:plan-phase)

---

### Phase 4: Motion Foundation

**Goal:** Centralize motion configuration with accessibility-first reduced-motion handling
**Depends on:** Phase 2
**Requirements:** MOTN-01

**Success Criteria:**
1. User with prefers-reduced-motion enabled sees minimal/no animation across entire site
2. User sees consistent spring physics and timing across all animated elements
3. Developer can import motion presets (springs, durations, variants) from central config
4. Developer can wrap components in AnimationProvider for global motion context

**Plans:** (created by /gsd:plan-phase)

---

### Phase 5: Smooth Scroll Integration

**Goal:** Implement Lenis smooth scroll with scroll-driven animations
**Depends on:** Phase 4
**Requirements:** MOTN-02, MOTN-04

**Success Criteria:**
1. User experiences buttery-smooth scroll behavior on desktop browsers
2. User sees elements reveal/animate as they scroll into view
3. User on mobile gets native scroll behavior (no scroll-jacking)
4. User with reduced-motion preference sees instant reveals without animation

**Plans:** (created by /gsd:plan-phase)

---

### Phase 6: Layout Primitives

**Goal:** Build layout components with intentional grid breaks and container queries
**Depends on:** Phase 3
**Requirements:** LAYT-01, LAYT-02, LAYT-03

**Success Criteria:**
1. User sees full-bleed sections breaking out of contained layouts intentionally
2. User sees responsive grid adjustments based on component container size (not viewport)
3. Developer can compose pages using Stack, Cluster, Grid, and Bleed components
4. Developer can create intentional asymmetric layouts without custom CSS
5. All layout primitives have 1:1 Storybook stories with interactive controls

**Plans:** (created by /gsd:plan-phase)

---

### Phase 7: Visual Effects Foundation

**Goal:** Implement full-bleed media backgrounds and performance-tiered WebGL/3D effects
**Depends on:** Phase 6
**Requirements:** VSFX-01, VSFX-02, VSFX-03, VSFX-04

**Success Criteria:**
1. User sees edge-to-edge hero images and video backgrounds on desktop
2. User on mobile sees optimized poster images instead of video (battery-conscious)
3. User on high-powered devices sees WebGL particle effects; low-powered devices get graceful fallback
4. User sees 3D elements via React Three Fiber that degrade gracefully on mobile/low-power
5. All visual effects components have 1:1 Storybook stories with device/performance controls

**Plans:** (created by /gsd:plan-phase)

---

### Phase 8: Page Transitions

**Goal:** Choreograph page transitions with custom cursor and kinetic typography
**Depends on:** Phase 5, Phase 7
**Requirements:** EXPN-01, EXPN-02, MOTN-03

**Success Criteria:**
1. User sees coordinated exit/enter animations when navigating between pages
2. User on desktop sees custom cursor that reflects site personality
3. User on mobile/touch gets appropriate cursor fallback (no broken experience)
4. User sees kinetic typography effects (text splitting, character animation) on key headings
5. Cursor and kinetic typography components have 1:1 Storybook stories

**Plans:** (created by /gsd:plan-phase)

---

### Phase 9: Section Experiences

**Goal:** Apply distinct visual identities and experiences to each page section
**Depends on:** Phase 8
**Requirements:** EXPN-03

**Success Criteria:**
1. User perceives Home hero, Gallery, Listen, About, and Contact as having distinct personalities
2. User experiences each section's unique character while feeling cohesion across the site
3. User on mobile gets full section personality experience (not stripped-down version)
4. Design-literate peer would describe the site as "intentionally designed" not "assembled from templates"

**Plans:** (created by /gsd:plan-phase)

---

## Progress

| Phase | Status | Completed |
|-------|--------|-----------|
| 1 - Tailwind Migration | Complete | 2026-01-17 |
| 2 - Token Architecture | Not started | - |
| 3 - Typography System | Not started | - |
| 4 - Motion Foundation | Not started | - |
| 5 - Smooth Scroll Integration | Not started | - |
| 6 - Layout Primitives | Not started | - |
| 7 - Visual Effects Foundation | Not started | - |
| 8 - Page Transitions | Not started | - |
| 9 - Section Experiences | Not started | - |

---

*Roadmap for milestone: v1.0*
