# Requirements: Random Gorsey

**Defined:** 2026-01-17
**Core Value:** Ship something you'd be proud to show design-literate peers - every decision should feel intentional, not safe.

## v1 Requirements

Requirements for the creative transformation. Each maps to roadmap phases.

### Design Foundation

- [x] **FOUND-01**: Three-layer token architecture (primitives -> semantics -> section-scoped)
- [x] **FOUND-02**: Section personality system via `data-section` attributes
- [x] **FOUND-03**: Variable fonts with fluid clamp() sizing
- [x] **FOUND-04**: CSS `@layer` cascade organization
- [ ] **FOUND-05**: Migrate to shadcn/ui v2 + Tailwind CSS + Radix primitives

### Motion & Animation

- [x] **MOTN-01**: Centralized motion config (springs, variants, reduced-motion handling)
- [ ] **MOTN-02**: Lenis smooth scroll integration
- [ ] **MOTN-03**: Kinetic typography with SplitType
- [ ] **MOTN-04**: Scroll-driven reveal animations

### Layout

- [ ] **LAYT-01**: Layout primitives (Stack, Cluster, Grid, Bleed components)
- [ ] **LAYT-02**: Intentional grid breaks (full-width sections within contained layouts)
- [ ] **LAYT-03**: Container queries for component-level responsiveness

### Page Experience

- [ ] **EXPN-01**: Custom cursor with personality (desktop), graceful touch fallback (mobile)
- [ ] **EXPN-02**: Choreographed page transitions with AnimatePresence coordination
- [ ] **EXPN-03**: Section-specific visual identities per page

### Visual Effects

- [ ] **VSFX-01**: Full-bleed video backgrounds with mobile fallbacks (poster images, autoplay handling)
- [ ] **VSFX-02**: Full-bleed hero images (edge-to-edge, responsive)
- [ ] **VSFX-03**: WebGL particle effects (performance-tiered for mobile/low-power devices)
- [ ] **VSFX-04**: 3D elements via React Three Fiber (mobile-optimized, graceful degradation)

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Audio Experience

- **AUDIO-01**: Sound design / audio feedback on interactions
- **AUDIO-02**: Custom audio player with visualizations
- **AUDIO-03**: Ambient soundscapes per section

### Advanced Interactions

- **ADVN-01**: Horizontal scroll sections
- **ADVN-02**: Drag-based gallery navigation
- **ADVN-03**: Gesture-driven mobile interactions

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Lighthouse score maxing | Performance matters but isn't the primary lens |
| Enterprise UX patterns | This project is explicitly experimental |
| Mobile app framing | Web-first |
| Conservative/safe design | Allowed and encouraged to be bold |
| Startup cliches | No hero illustrations, "we're passionate about", bento grids |
| Client-safe decisions | Personal project, can take creative risks |

## Constraints

Hard limits that affect implementation choices.

- **Mobile**: All features must work on mobile devices — graceful degradation, not broken experiences
- **Performance**: Effects scale down on lower-powered devices automatically
- **Accessibility**: `prefers-reduced-motion` respected throughout all animations
- **Stack**: shadcn/ui v2 + Tailwind CSS + Radix primitives (migration from CSS Modules)
- **Hosting**: GitHub Pages static deployment (existing)
- **Storybook**: Every component has a 1:1 Storybook story — no component ships without documentation

## Traceability

Which phases cover which requirements. Updated by create-roadmap.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 2 | Complete |
| FOUND-02 | Phase 2 | Complete |
| FOUND-03 | Phase 3 | Complete |
| FOUND-04 | Phase 2 | Complete |
| FOUND-05 | Phase 1 | Complete |
| MOTN-01 | Phase 4 | Complete |
| MOTN-02 | Phase 5 | Pending |
| MOTN-03 | Phase 8 | Pending |
| MOTN-04 | Phase 5 | Pending |
| LAYT-01 | Phase 6 | Pending |
| LAYT-02 | Phase 6 | Pending |
| LAYT-03 | Phase 6 | Pending |
| EXPN-01 | Phase 8 | Pending |
| EXPN-02 | Phase 8 | Pending |
| EXPN-03 | Phase 9 | Pending |
| VSFX-01 | Phase 7 | Pending |
| VSFX-02 | Phase 7 | Pending |
| VSFX-03 | Phase 7 | Pending |
| VSFX-04 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 19 total
- Mapped to phases: 19
- Unmapped: 0

---
*Requirements defined: 2026-01-17*
*Last updated: 2026-01-17 after Phase 4 completion*
