# Project Research Summary

**Project:** Random Gorsey Artist Website - Bold/Experimental Creative Transformation
**Domain:** Creative portfolio / Artist website with experimental design direction
**Researched:** 2026-01-17
**Confidence:** HIGH

## Executive Summary

Random Gorsey is a functional React/TypeScript artist portfolio that needs transformation into a bold, experimental creative showcase. The research reveals a clear path: leverage the existing solid technical foundation (React 19, TypeScript 5.9, Framer Motion 12) while building a layered design system that enables creative expression without chaos. The core architectural insight is that **expression emerges from constraint** - a comprehensive token system, centralized motion configuration, and section-scoped CSS custom properties will channel creativity rather than restrict it.

The recommended approach is evolutionary, not revolutionary: expand the existing CSS variables into a three-layer token system (primitives, semantics, component-scoped), centralize Framer Motion configuration into reusable presets, add strategic tools (Lenis for smooth scroll, SplitType for kinetic typography), and apply section "personalities" through `data-section` attributes. This preserves code quality while enabling the bold visual identity the project requires.

The primary risks are falling into dated trend traps (bento grids, glassmorphism, Webflow sameness), animation overuse that crosses from engaging to hostile, and scroll-jacking that frustrates rather than impresses. Mitigation requires establishing durable design principles before building, implementing `prefers-reduced-motion` from the start, and testing on mid-range devices throughout. The research strongly warns against optimizing for "Awwwards aesthetic" at the expense of usability - design-literate audiences notice bad UX as quickly as they notice beautiful visuals.

## Key Findings

### Recommended Stack

The current stack (React 19, TypeScript 5.9, Framer Motion 12.23, CSS Modules) is already best-in-class for this use case. Recommended additions are minimal and strategic rather than additive.

**Core technologies:**
- **Variable Fonts (self-hosted)**: Animated typography, performance - single file replaces 6-10 font weights, enables smooth axis animations
- **Lenis (^1.1)**: Smooth scroll foundation - 3KB, works with position:sticky, syncs with GSAP, creates "buttery" feel expected on creative sites
- **SplitType (^0.3)**: Text animation splits - enables character/word-level animation for kinetic typography
- **Fontaine (^0.5)**: Font loading CLS prevention - uses size-adjust to match fallback fonts
- **GSAP (^3.12, optional)**: Complex scroll animations - add only when needed for timeline sequences or scroll-pinning

**Keep as-is:**
- Framer Motion 12.23 (already best-in-class for React)
- CSS Modules (appropriate for project size)
- TypeScript (non-negotiable)

**Do not add:**
- React Three Fiber (only if specific 3D concept emerges)
- Additional CSS framework (modern CSS + CSS Modules sufficient)
- Heavy animation libraries competing with Framer Motion

### Expected Features

**Must have (table stakes):**
- Responsive, mobile-first design (60%+ traffic is mobile)
- Fast load times under 3 seconds (53% leave after 3s)
- Accessible design (WCAG 2.1 AA - 4.5:1 contrast minimum)
- Smooth page transitions (abrupt changes feel broken in 2025)
- Dark mode done well (82% of mobile users use dark mode)
- `prefers-reduced-motion` support (critical given animation focus)
- Lazy loading for media (already present - good)
- Keyboard navigation (test with Tab through entire site)

**Should have (differentiators):**
- Kinetic typography (text that moves with intention, scroll-triggered)
- Custom cursor with personality (immediately signals "this site is different")
- Scroll-driven storytelling (400% higher engagement than static)
- Enhanced page transition choreography (AnimatePresence coordination)
- Micro-interactions that delight (buttons that bounce, forms that respond)

**Defer (v2+):**
- 3D/WebGL elements
- Sound design / audio feedback
- Custom audio player with visualizations
- Horizontal scroll sections

### Architecture Approach

The architecture uses a **layered approach** separating foundations (consistency, code quality) from expressions (creative flexibility, section personalities). Components consume semantic tokens that resolve to different primitives based on their section context - one Button works everywhere but feels unique in each section.

**Major components:**

1. **Three-Layer Token System**
   - Layer 1: Primitives (raw values - colors, sizes, durations)
   - Layer 2: Semantics (purpose-driven aliases - `--text-primary`, `--surface-base`)
   - Layer 3: Section Scoping (`[data-section="hero"]` overrides semantic tokens)

2. **CSS Cascade Layers**
   - `@layer reset, tokens, base, layouts, components, patterns, utilities, overrides`
   - Predictable override behavior, design system organization

3. **Centralized Motion Configuration**
   - `src/motion/config.ts`: Springs, durations, eases
   - `src/motion/variants.ts`: Reusable variant definitions (page transitions, stagger, reveal)
   - `src/motion/AnimationProvider.tsx`: Global reduced-motion handling

4. **Layout Primitives**
   - Stack (vertical rhythm), Cluster (horizontal grouping), Grid, Bleed (break container)

5. **Enhanced Components**
   - Compound component pattern for flexible composition
   - Slot pattern for layout flexibility
   - Polymorphic `as` prop extended with tone/display variants

### Critical Pitfalls

1. **Webflow Sameness Problem** - Sites look "creative" but identical. Prevention: Start with content/concept, reference diverse inspiration (print, architecture, film), ask "why this choice?" for every decision.

2. **Scroll Hijacking** - Overriding native scroll behavior is "the UX crime nobody asked for." Prevention: Default to not hijacking scroll. If must: only on isolated, bounded experiences. Test extensively on mobile.

3. **Animation Hangover** - So much motion users feel disoriented. Prevention: One focal animation at a time, motion should guide attention not demand it, test on lower-powered devices.

4. **Accessibility Motion Neglect** - 35%+ of adults experience vestibular dysfunction. Prevention: Implement `prefers-reduced-motion` throughout, provide manual motion toggle, test reduced-motion as first-class design.

5. **The Awwwards Trap** - Optimizing for awards over user experience. Prevention: "Would I actually want to use this?" Beautiful sites that frustrate users impress no one.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Design Foundation

**Rationale:** Everything depends on tokens. Components cannot reference semantic tokens that don't exist. CSS layer structure must be established first.

**Delivers:**
- Expanded `variables.css` with three-layer token structure
- CSS `@layer` declaration establishing cascade order
- Updated base element styles using semantic tokens
- Section personality system (`data-section` attributes)
- Typography scale with fluid sizing (clamp())

**Addresses features:**
- Consistent visual identity (table stakes)
- Dark mode foundation
- Accessibility color contrast

**Avoids pitfalls:**
- Trend dating (establish durable principles)
- Font chaos (establish typographic system)
- Contrast/readability sacrifice (bake in accessibility)

### Phase 2: Motion Foundation

**Rationale:** Motion patterns should exist before components adopt them. Accessibility must be baked in from the start, not retrofitted.

**Delivers:**
- `src/motion/config.ts` - springs, durations, eases
- `src/motion/variants.ts` - reusable variant definitions
- `src/motion/gestures.ts` - gesture configurations
- `src/motion/AnimationProvider.tsx` - app wrapper with reduced-motion
- Lenis integration for smooth scroll

**Uses stack:**
- Framer Motion (existing)
- Lenis (new)

**Implements architecture:**
- Centralized motion configuration
- AnimationProvider pattern

**Avoids pitfalls:**
- Animation overuse (presets encourage restraint)
- Accessibility motion neglect (reduced-motion from start)
- Death by animation properties (config enforces transform/opacity)

### Phase 3: Layout System

**Rationale:** Layout primitives are building blocks for page compositions. Must exist before page-level work.

**Delivers:**
- Stack component (vertical rhythm)
- Cluster component (horizontal grouping)
- Grid component (responsive grid)
- Bleed component (break out of container)
- CSS utility classes for layout breaks

**Addresses features:**
- Foundation for Bento-style layouts (without falling into trend trap)
- Asymmetric/experimental layouts
- Full-width sections within contained pages

### Phase 4: Component Enhancement

**Rationale:** Components now have tokens to reference and motion configs to use. This is the integration phase.

**Delivers:**
- Enhanced Button with motion and tone variants
- Enhanced Surface with section-aware theming
- Enhanced Heading with display variants and gradient text
- Section compound component with slots
- Card compound component

**Implements architecture:**
- Compound component pattern
- Slot pattern for layout flexibility
- Polymorphic component enhancement

**Addresses features:**
- Micro-interactions (button press feedback, hover states)
- Section personalities visible in components

### Phase 5: Page Compositions

**Rationale:** Requires all previous phases. This is where the bold vision materializes.

**Delivers:**
- Home page with hero section personality
- Gallery with enhanced grid and hover states
- Listen page with music section personality
- About page with storytelling layout
- Contact with action-oriented personality
- Page transitions with AnimatePresence coordination
- Custom cursor (if validated in testing)

**Addresses features:**
- Kinetic typography on hero
- Scroll-driven storytelling
- Enhanced page transitions
- Section-specific visual identities

**Avoids pitfalls:**
- Brutalism gone wrong (internal consistency established)
- Navigation hide and seek (standard patterns, clear location)
- Aesthetic inconsistency (system enforces consistency)

### Phase Ordering Rationale

- **Tokens before components:** Components cannot consume tokens that don't exist
- **Motion before pages:** Animation patterns should be established before page choreography
- **Layout before pages:** Layout primitives enable page compositions
- **Component enhancement before pages:** Pages compose enhanced components
- **Pages last:** Integration of all previous work

This ordering minimizes rework. Each phase builds on the previous and enables the next.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 2 (Motion):** Lenis integration specifics, GSAP interop if needed
- **Phase 5 (Pages):** Custom cursor implementation details, kinetic typography specific techniques

Phases with standard patterns (skip research-phase):
- **Phase 1 (Foundation):** CSS custom properties and layers are well-documented
- **Phase 3 (Layout):** Layout primitives are established React patterns
- **Phase 4 (Components):** Compound components and slots are documented extensively

## Cross-Cutting Themes

Patterns that appeared across multiple research dimensions:

1. **Restraint as Differentiator** - All four research files emphasize that restraint is what separates impressive from annoying. One focal animation, 2-3 fonts maximum, limited trendy elements. The counter-trend that never dates.

2. **Accessibility as Baseline** - Not an afterthought. `prefers-reduced-motion`, contrast ratios, keyboard navigation appear in stack, features, architecture, and pitfalls research. Must be foundational.

3. **Section Personalities** - Architecture, features, and stack all point to section-scoped customization as the key pattern. Hero feels different from Gallery feels different from Listen - but using the same components with different token values.

4. **Performance Consciousness** - Every enhancement has performance implications. Lenis is 3KB because alternatives are heavier. Variable fonts replace multiple files. Animation properties must be compositor-friendly. Core Web Vitals matter.

5. **User Testing Required** - Multiple pitfalls can only be detected through user testing: "Is this intentionally raw or just broken?" "Is this animation engaging or annoying?" "Is this navigation creative or confusing?"

## Tensions and Tradeoffs

Where recommendations conflict or require balance:

1. **Bold vs. Usable** - The project demands experimental design, but research consistently warns against sacrificing usability for aesthetics. Resolution: Bold in visual treatment, conventional in navigation and core interactions.

2. **Animation-Rich vs. Performance** - Kinetic typography, scroll-driven effects, page transitions all add motion. But animation can tank performance. Resolution: Centralized motion config with performance-optimized presets, test on mid-range devices.

3. **Trend-Forward vs. Timeless** - Features research lists current differentiators (kinetic typography, custom cursors) while Pitfalls warns against trend accumulation. Resolution: Limit to 1-2 trendy elements, ensure they serve content not just aesthetics.

4. **Creative Freedom vs. Consistency** - Section personalities need to feel distinct while site needs coherence. Resolution: Token system - same components, different token values. Variation through constraint, not chaos.

5. **GSAP vs. Framer Motion** - Stack research recommends both for different use cases. But multiple animation libraries can conflict. Resolution: Framer Motion for component-level, GSAP only if specific scroll-pinning needs emerge.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core stack verified against official docs; additions are industry-standard |
| Features | HIGH | Multiple 2025-2026 trend sources, Awwwards analysis, portfolio critiques |
| Architecture | HIGH | Patterns verified from CSS-Tricks, Smashing Magazine, Framer Motion docs |
| Pitfalls | HIGH | NN/g research, web.dev documentation, multiple UX professional sources |

**Overall confidence:** HIGH

The research draws from authoritative sources (Mozilla MDN, Framer Motion docs, NN/g, web.dev), verified community consensus (CSS-Tricks, Smashing Magazine), and contemporary trend analysis (Awwwards, Muzli, design blogs). Primary uncertainty is in trend timing - what's "current" shifts, but the underlying principles are sound.

### Gaps to Address

- **Custom cursor specifics:** Research confirms value but implementation details need validation during Phase 5
- **Kinetic typography performance:** SplitType + Motion pattern is recommended but needs performance testing on actual content
- **GSAP necessity:** Recommended as optional - may not be needed if Framer Motion scroll capabilities suffice
- **Dark mode design:** Research confirms importance but actual color design work not specified

## Sources

### Primary (HIGH confidence)
- [Motion Official Docs](https://motion.dev/) - Animation patterns, GSAP comparison
- [MDN CSS @layer](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer) - Cascade layers
- [web.dev Performance](https://web.dev/animations-and-performance/) - Animation performance
- [web.dev prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion) - Accessibility
- [NN/g Navigation Research](https://www.nngroup.com/articles/menu-design/) - Navigation patterns
- [NN/g Scrolljacking](https://www.nngroup.com/articles/scrolljacking-101/) - Scroll behavior

### Secondary (MEDIUM confidence)
- [CSS-Tricks Cascade Layers](https://css-tricks.com/organizing-design-system-component-patterns-with-css-cascade-layers/) - Layer architecture
- [Smashing Magazine CSS Custom Properties](https://www.smashingmagazine.com/2018/05/css-custom-properties-strategy-guide/) - Token scoping
- [Frontend Mastery Component Composition](https://frontendmastery.com/posts/advanced-react-component-composition-guide/) - Compound components
- [Maxime Heckel Animation Patterns](https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/) - Motion orchestration
- [Lenis Official](https://lenis.darkroom.engineering/) - Smooth scroll
- [Muzli Top 100 Portfolios](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/) - Trend analysis

### Tertiary (LOW confidence)
- Various 2025-2026 trend prediction articles - Trend timing is inherently uncertain
- Awwwards site analysis - Subjective aesthetic judgments
- Spring animation values - Community-derived defaults, may need tuning

---
*Research completed: 2026-01-17*
*Ready for roadmap: yes*
