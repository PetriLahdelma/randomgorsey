# Project State

## Project Reference

See: .planning/PROJECT.md

**Core value:** Ship something you'd be proud to show design-literate peers - every decision should feel intentional, not safe.
**Current focus:** Phase 9 - Section Experiences (IN PROGRESS)

## Current Position

Phase: 9 of 9 (Section Experiences)
Plan: 6 of ? complete
Status: In progress
Last activity: 2026-01-24 - Completed 09-06-PLAN.md (Contact and Discography Experiences)

Progress: [==========================================================================] ~86% (43/~50 total plans estimated)

## Performance Metrics

**Velocity:**
- Total plans completed: 43
- Average duration: 5 min
- Phase 1 total: ~70 min
- Phase 2 total: ~18 min
- Phase 3 total: ~13 min
- Phase 4 total: ~12 min
- Phase 5 total: ~26 min (includes debugging)
- Phase 6 total: ~20 min
- Phase 7 total: ~16 min (5 plans)
- Phase 8 total: ~12 min (4 plans)
- Phase 9 total: ~19 min (6 plans so far)

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-tailwind-migration | 7 | 70 min | 10 min |
| 02-token-architecture | 4 | 18 min | 5 min |
| 03-typography-system | 3 | 13 min | 4 min |
| 04-motion-foundation | 4 | 12 min | 3 min |
| 05-smooth-scroll-integration | 5 | 26 min | 5 min |
| 06-layout-primitives | 4 | 20 min | 5 min |
| 07-visual-effects-foundation | 5 | 16 min | 3 min |
| 08-page-transitions | 4 | 12 min | 3 min |
| 09-section-experiences | 6 | 19 min | 3 min |

## Accumulated Context

### Decisions

- 2026-01-17: Roadmap derived with 9 phases targeting comprehensive depth
- 2026-01-17: Tailwind/shadcn migration prioritized as Phase 1 (everything depends on it)
- 2026-01-17: Motion and layout systems established before page-level work
- 2026-01-17: Visual effects separated from page experiences for cleaner implementation
- 2026-01-17: Vite build output to build/ for gh-pages compatibility
- 2026-01-17: Static imports for video assets (Vite doesn't support require())
- 2026-01-17: Test reconfiguration deferred to Plan 07
- 2026-01-17: Tailwind v4 CSS-first configuration using @theme directive
- 2026-01-17: oklch color format for modern color handling
- 2026-01-17: new-york style for shadcn/ui components
- 2026-01-17: Keep existing CSS imports during gradual migration
- 2026-01-17: Tailwind arbitrary values to exactly match CSS Module values for visual parity
- 2026-01-17: Export CVA variant definitions for external composition
- 2026-01-17: CSS Module files retained for reference during gradual migration (delete later)
- 2026-01-17: Alert uses solid backgrounds matching original CSS colors
- 2026-01-17: Modal has Framer Motion animations (improvement over original)
- 2026-01-17: Caption preserves yellow (#ff0) color from original
- 2026-01-17: CVA for Button with 5 variants and 3 sizes
- 2026-01-17: Size variants use small/medium/large matching existing Size type
- 2026-01-17: Custom SVG checkmark for Checkbox instead of CSS pseudo-element
- 2026-01-17: Success and font-family tokens added to globals.css theme
- 2026-01-17: Header uses white text with drop-shadow for video background visibility
- 2026-01-17: Footer uses semi-transparent white text (text-white/70)
- 2026-01-17: App shell uses min-h-screen flex layout for sticky footer
- 2026-01-17: PostCard simplified to dark text on white background
- 2026-01-17: Global font utilities (.font-mono, .font-sans) for explicit font control
- 2026-01-17: Storybook switched to react-vite builder
- 2026-01-17: Stories use StoryObj format with autodocs tag
- 2026-01-17: Keep variables.css for page CSS Module compatibility
- 2026-01-17: Three-layer token architecture (primitives -> semantics -> sections)
- 2026-01-17: oklch color format for all primitive tokens (perceptual uniformity)
- 2026-01-17: Yellow-400 tuned to oklch(0.88 0.17 85) to match #ff0 brand color
- 2026-01-17: Spacing base 0.25rem creates standard Tailwind spacing scale
- 2026-01-17: Semantic tokens reference primitives via var() for cascade
- 2026-01-17: Feedback colors (destructive, success) stay absolute in dark mode
- 2026-01-17: Card/popover tokens alias surface-elevated for consistency
- 2026-01-17: Accent color unchanged in dark mode - yellow works on both
- 2026-01-17: Section overrides use [data-section] attribute selectors
- 2026-01-17: Sections in @layer base so utilities always override
- 2026-01-17: Semantic tokens also in @theme for Tailwind utility generation
- 2026-01-17: Legacy color aliases inside @theme block for CSS variable compatibility
- 2026-01-17: data-section values match section names in sections.css
- 2026-01-17: Fluid type scale uses 1.25 (Major Third) ratio
- 2026-01-17: Typography viewport scaling: 400px to 1280px
- 2026-01-17: Each typography size token has paired line-height token
- 2026-01-17: Unified Europa font-family with weight axis (300, 400, 700)
- 2026-01-17: Only two fonts preloaded: Europa Regular and Tschick Bold
- 2026-01-17: Heading levels 1-6 map to text-6xl through text-xl respectively
- 2026-01-17: Text body uses text-base, bodySmall uses text-sm, caption/eyebrow use text-xs
- 2026-01-17: Typography components use text-* tokens, not inline clamp()
- 2026-01-17: Base layer h1-h6 use CSS custom properties for fluid typography
- 2026-01-17: Fixed font-size breakpoint overrides removed from page CSS Modules
- 2026-01-17: Spring presets use physics parameters (stiffness, damping, mass) not visualDuration
- 2026-01-17: Variants use 'initial/enter/exit' naming for AnimatePresence compatibility
- 2026-01-17: Re-export common Framer Motion utilities from @/lib/motion for convenience
- 2026-01-17: AnimationProvider wraps BrowserRouter as outermost wrapper for global config
- 2026-01-17: LazyMotion with domAnimation (not domMax) for smaller bundle
- 2026-01-17: Default reducedMotion="user" for accessibility-first approach
- 2026-01-17: Modal imports from @/lib/motion instead of framer-motion for centralized control
- 2026-01-17: Modal backdrop uses overlayVariants (opacity-only, fast duration)
- 2026-01-17: Modal content uses modalVariants (scale+opacity with snappy spring)
- 2026-01-17: isIOS pattern removed from all page components - AnimationProvider handles reduced-motion
- 2026-01-17: All 7 pages use pageVariants from @/lib/motion for consistent enter animations
- 2026-01-17: Gallery overlay uses overlayVariants for enter/exit animations
- 2026-01-17: Lenis disabled for mobile (pointer: coarse) - native scroll UX preferred
- 2026-01-17: Lenis disabled for prefers-reduced-motion - accessibility compliance
- 2026-01-17: RAF synced with Framer Motion frame scheduler to prevent double animation loops
- 2026-01-17: lerp: 0.1 for smooth but responsive Lenis feel
- 2026-01-17: syncTouch: false to avoid iOS scroll issues
- 2026-01-17: Reveal variants use hidden/visible naming for whileInView compatibility
- 2026-01-17: RevealOnScroll automatically switches to fade-only for reduced motion users
- 2026-01-17: useLenisScrollTo uses Lenis when available, native smooth scroll as fallback
- 2026-01-17: useScrollToTopOnRouteChange uses immediate scroll to prevent flash of previous position
- 2026-01-17: data-lenis-prevent attribute on overlay prevents background scroll
- 2026-01-17: Wrap semantic content blocks with RevealOnScroll, not individual elements
- 2026-01-17: Move key prop to RevealOnScroll when wrapping mapped arrays
- 2026-01-17: pageVariants handles page enter, RevealOnScroll handles scroll reveals for below-fold content
- 2026-01-17: Stack gap variants: none, xs, sm, md, lg, xl, 2xl, section
- 2026-01-17: Cluster gap variants: none, xs, sm, md, lg (simpler than Stack)
- 2026-01-17: Layout primitives use polymorphic as prop for semantic HTML elements
- 2026-01-17: Grid uses @container queries for context-aware responsiveness
- 2026-01-17: Grid minItemWidth prop uses CSS auto-fit minmax for intrinsic sizing
- 2026-01-17: Container size variants: sm, md, lg, xl, 2xl, prose, full
- 2026-01-17: Bleed uses relative left-1/2 w-screen -translate-x-1/2 for breakout
- 2026-01-17: Layout stories organized in src/stories/layout/ subdirectory
- 2026-01-17: PerformanceProvider wraps LazyMotion as outermost provider (GPU detection first)
- 2026-01-17: Safe default tier 1 before detection completes to prevent flash of high-fidelity content
- 2026-01-17: Reduced motion forces tier 0 regardless of GPU capability for accessibility
- 2026-01-17: Performance-tiered rendering: tier 0 static, tier 1 video, tier 2-3 WebGL
- 2026-01-17: Scene3D returns null for tier 0 or no WebGL (graceful degradation)
- 2026-01-17: Scene3D DPR scaling: tier 1=1, tier 2=1.5, tier 3=2
- 2026-01-17: Scene3D antialiasing enabled for tier 2+ only
- 2026-01-17: On-demand frameloop for battery efficiency in R3F Canvas
- 2026-01-17: ParticleField count scaling: tier1=count/4, tier2=count/2, tier3=full
- 2026-01-17: drei Instances for GPU-efficient instanced rendering
- 2026-01-17: VideoBackground mobile gets poster regardless of tier (battery-conscious)
- 2026-01-17: VideoBackground uses h-dvh for proper mobile viewport (dynamic viewport height)
- 2026-01-17: HeroImage uses Bleed for viewport-width breakout from Container
- 2026-01-17: Effects stories organized in src/stories/effects/ subdirectory
- 2026-01-17: R3F stories use decorator pattern to wrap in Scene3D context
- 2026-01-17: Desktop cursor detection uses "(hover: hover) and (pointer: fine)" media query
- 2026-01-17: useCursor returns no-op outside provider for safe touch device usage
- 2026-01-17: Cursor spring config: stiffness 500, damping 28, mass 0.5 for responsive feel
- 2026-01-17: Three cursor variants: default (16px), hover (48px yellow), text (80px blend)
- 2026-01-17: body.custom-cursor-active class controls CSS cursor hiding
- 2026-01-17: AnimatePresence mode='wait' ensures exit completes before enter starts
- 2026-01-17: Scroll reset via onExitComplete callback (replaces ScrollToTop component)
- 2026-01-17: Location.pathname as key for proper route transition detection
- 2026-01-17: exit='exit' prop required on all page motion wrappers for exit animations
- 2026-01-17: SplitType extracts text content to strings, React renders motion elements (avoids DOM conflicts)
- 2026-01-17: KineticText shows hidden placeholder during split init to prevent layout flash
- 2026-01-17: Perspective CSS only for 'dramatic' variant (3D rotateX needs perspective context)
- 2026-01-17: Space characters as non-breaking space with whiteSpace: pre for proper spacing
- 2026-01-17: Provider hierarchy: AnimationProvider > CursorProvider > BrowserRouter
- 2026-01-17: CursorProvider wraps BrowserRouter for cursor context on all pages
- 2026-01-17: CustomCursor stories use CursorProvider decorator for isolated testing
- 2026-01-17: KineticText stories use triggerOnView=false for immediate animation in docs
- 2026-01-24: Section variants use initial/enter/exit naming for AnimatePresence compatibility
- 2026-01-24: Hero uses dramatic spring with 0.2s delay for anticipation
- 2026-01-24: Listen uses tween (not spring) for cinematic feel
- 2026-01-24: Contact has softer snappy spring (200 stiffness vs 400)
- 2026-01-24: Each section stagger container has distinct timing for personality
- 2026-01-24: Gallery uses og.jpg as poster fallback (ffmpeg unavailable for frame extraction)
- 2026-01-24: Gallery KineticText uses word-by-word split for gentle headline feel
- 2026-01-24: Gallery overlayOpacity=0.1 for light, airy background
- 2026-01-24: Gallery Container size='md' for centered layout
- 2026-01-24: Home poster derived from og.jpg with dark padding (macOS sips)
- 2026-01-24: Home uses heroStaggerContainer for staggered post reveals
- 2026-01-24: Home CSS Module removed - full Tailwind implementation
- 2026-01-24: Listen uses 0.4 overlay opacity for immersive dark mood
- 2026-01-24: Listen KineticText uses 0.05s stagger for slow, contemplative feel
- 2026-01-24: Listen poster from promo.jpg (ffmpeg unavailable)
- 2026-01-24: aboutStaggerContainer uses 0.12s stagger (slower than others) for reading pace
- 2026-01-24: aboutCardItem includes subtle scale (0.98) for warm, inviting entrance
- 2026-01-24: About poster reused from promo.jpg (matches promo_canvas.webm aesthetic)
- 2026-01-24: About bio split into three RevealOnScroll blocks for reading-paced reveals
- 2026-01-24: Contact poster from promo.jpg, Discography poster from disco.jpg (sips scaling)
- 2026-01-24: Contact KineticText uses 0.02s stagger for crisp, efficient feel
- 2026-01-24: Discography title simplified (removed creative Disco-graphy break)
- 2026-01-24: Discography albums stagger with discographyStaggerContainer for catalog reveal
- 2026-01-24: Album hover effect uses group-hover:scale-[1.02] for subtle lift
- 2026-01-24: Contact modal moved outside main motion.div for proper AnimatePresence handling

### Phase 1 Completion Summary

**Tailwind v4 Migration Complete:**
- All 19 components migrated to Tailwind with CVA
- All 2 patterns (Header, Footer) migrated
- App shell (App.tsx, main.tsx) migrated
- 23 CSS Module files deleted
- Storybook updated to Vite builder

**Key Artifacts:**
- `src/styles/globals.css` - Tailwind v4 theme with custom fonts
- `src/lib/utils.ts` - cn() utility for class merging
- `.storybook/main.ts` - Vite-based Storybook config

### Phase 2 Completion Summary

**Token Architecture Complete:**
- Three-layer cascade: primitives -> semantics -> sections
- `src/styles/tokens/primitives.css` - Raw values, defaults, and legacy aliases (137 lines)
- `src/styles/tokens/semantic.css` - Meaningful mappings and dark mode (115 lines)
- `src/styles/tokens/sections.css` - Section overrides (95 lines)
- `src/styles/globals.css` - Integrated imports (81 lines)

**Plan 02-01:** Primitive token layer (colors, spacing, radius, typography)
**Plan 02-02:** Semantic token layer (background/foreground, surfaces, interactive states)
**Plan 02-03:** Section token overrides (6 sections with distinct visual personalities)
**Plan 02-04:** Gap closure - wired sections to pages via data-section attributes

**Key Artifacts:**
- Token files in `src/styles/tokens/`
- All 6 pages have data-section attributes
- Legacy color aliases for CSS Module compatibility
- Build verified and passing

### Phase 3 Completion Summary

**Typography System Complete:**
- `src/styles/tokens/typography.css` - 10 fluid size tokens with clamp()
- All @font-face declarations now have font-display: swap
- Unified "Europa" font-family with weight axis (300, 400, 700)
- Critical fonts preloaded in index.html
- Heading component uses text-6xl through text-xl for levels 1-6
- Text component uses text-base, text-sm, text-xs for body variants
- Base layer h1-h6 use fluid typography tokens
- Page CSS Modules cleaned of fixed font-size overrides

**Plan 03-01:** Fluid Typography Token Infrastructure
**Plan 03-02:** Typography Component Updates
**Plan 03-03:** Gap Closure - base layer h1-h6 + page module cleanup

**Key Artifacts:**
- `src/styles/tokens/typography.css` - Fluid type scale
- `src/styles/globals.css` - Base layer heading styles
- `src/components/Heading.tsx` - Token-based heading component
- `src/components/Text.tsx` - Token-based text component

### Phase 4 Completion Summary

**Motion Foundation Complete:**
- `src/lib/motion/config.ts` - Spring, duration, easing presets
- `src/lib/motion/variants.ts` - Reusable animation variants (page, fade, stagger, overlay, modal)
- `src/lib/motion/index.ts` - Public API barrel export
- `src/lib/motion/AnimationProvider.tsx` - Global motion config wrapper

**Plan 04-01:** Motion Configuration Module (COMPLETE)
**Plan 04-02:** AnimationProvider Setup (COMPLETE)
**Plan 04-03:** Component Migration to Centralized Variants (COMPLETE)
**Plan 04-04:** Modal Migration to Centralized Variants (COMPLETE)

**Key Artifacts:**
- `src/lib/motion/` - Motion system module
- `src/lib/motion/AnimationProvider.tsx` - Global motion config wrapper
- `src/App.tsx` - Wrapped with AnimationProvider
- `src/components/Modal.tsx` - Uses overlayVariants and modalVariants
- All 7 page components use pageVariants from @/lib/motion

### Phase 5 Completion Summary

**Smooth Scroll Integration Complete:**
- `src/lib/motion/LenisProvider.tsx` - Conditional Lenis smooth scroll (79 lines)
- `src/lib/motion/variants.ts` - 4 reveal variants added (revealVariants, revealContainerVariants, revealItemVariants, revealFadeVariants)
- `src/components/RevealOnScroll.tsx` - Scroll-triggered reveal component (66 lines)
- `src/lib/motion/hooks.ts` - Custom scroll hooks (100 lines)
- `src/stories/RevealOnScroll.stories.tsx` - Storybook documentation (155 lines)

**Plan 05-01:** Lenis Smooth Scroll Setup (COMPLETE)
**Plan 05-02:** Reveal Variants and RevealOnScroll (COMPLETE)
**Plan 05-03:** Scroll Utility Wiring (COMPLETE)
**Plan 05-04:** Page Content Reveal Animations (COMPLETE)
**Plan 05-05:** Complete Integration (COMPLETE)

**Key Decisions:**
- LazyMotion strict mode removed (allows `motion` components, not just `m`)
- Lenis CSS imported via `lenis/dist/lenis.css`
- useLenis replaced with safe LenisContext access (prevents crash outside provider)

### Phase 6 Completion Summary

**Layout Primitives Complete:**
- `src/components/layout/Stack.tsx` - Vertical flow with gap variants (95 lines)
- `src/components/layout/Cluster.tsx` - Horizontal wrapping with justify/align (106 lines)
- `src/components/layout/Grid.tsx` - Container query responsive grid (135 lines)
- `src/components/layout/Bleed.tsx` - Full-width breakout component (52 lines)
- `src/components/layout/Container.tsx` - Max-width constraint with padding (108 lines)

**Plan 06-01:** Stack and Cluster primitives (COMPLETE)
**Plan 06-02:** Grid with container queries (COMPLETE)
**Plan 06-03:** Bleed and Container (COMPLETE)
**Plan 06-04:** Layout Storybook Stories (COMPLETE)

**Key Artifacts:**
- `src/components/layout/` - 5 layout primitives
- `src/stories/layout/` - 5 Storybook story files (1143 total lines)
- All components have interactive argTypes controls
- ContainerQueryDemo proves container-based responsiveness

### Phase 7 Completion Summary

**Visual Effects Foundation Complete:**
- `src/lib/performance/PerformanceProvider.tsx` - GPU tier detection with usePerformance hook
- `src/components/effects/VideoBackground.tsx` - Performance-tiered video background
- `src/components/effects/HeroImage.tsx` - Full-bleed responsive hero images
- `src/components/effects/Scene3D.tsx` - R3F Canvas with tier-scaled quality
- `src/components/effects/ParticleField.tsx` - Instanced particle system

**Plan 07-01:** GPU Tier Detection Infrastructure (COMPLETE)
**Plan 07-02:** Video Background Component (COMPLETE)
**Plan 07-03:** Hero Image Component (COMPLETE)
**Plan 07-04:** React Three Fiber Infrastructure (COMPLETE)
**Plan 07-05:** Effects Storybook Stories (COMPLETE)

**Key Artifacts:**
- `src/lib/performance/` - Performance detection module
- `src/components/effects/` - 4 visual effects components
- `src/stories/effects/` - 4 Storybook story files (666 total lines)
- All effects adapt to GPU tier for optimal performance

### Pending Todos

- Configure Vitest for testing (Phase 2 or later)
- Migrate page CSS Modules (when pages are enhanced)
- Delete variables.css (after page migration)
- Remove legacy color aliases (after Phase 3+ page migration)

### Blockers/Concerns

(None)

### Phase 8 Completion Summary

**Page Transitions Complete:**
- `src/lib/motion/AnimatedRoutes.tsx` - AnimatePresence route wrapper with exit coordination
- `src/lib/cursor/CursorProvider.tsx` - Desktop detection + cursor context
- `src/lib/cursor/CustomCursor.tsx` - Spring-based cursor with 3 variants
- `src/lib/cursor/index.ts` - Public exports (CursorProvider, useCursor)
- `src/components/KineticText.tsx` - SplitType text animation component
- `src/lib/motion/variants.ts` - Added textRevealContainer, textRevealItem, textRevealDramatic
- `src/stories/cursor/CustomCursor.stories.tsx` - Cursor Storybook documentation
- `src/stories/KineticText.stories.tsx` - KineticText Storybook documentation

**Plan 08-01:** AnimatePresence Route Wrapper (COMPLETE)
**Plan 08-02:** Custom Cursor System (COMPLETE)
**Plan 08-03:** Kinetic Text Component (COMPLETE)
**Plan 08-04:** App Integration (COMPLETE)

**Key Artifacts:**
- `src/lib/cursor/` - Cursor system module
- `src/lib/motion/AnimatedRoutes.tsx` - Page transition wrapper
- `src/components/KineticText.tsx` - Kinetic text animation component
- `src/stories/cursor/` - Cursor Storybook stories
- `src/stories/KineticText.stories.tsx` - KineticText Storybook stories

### Phase 9 Progress

**Section Experiences In Progress:**
- `src/lib/motion/section-variants.ts` - 6 page variants + 5 stagger containers (288 lines)
- All variants importable from @/lib/motion
- All 5 pages enhanced with distinct motion personalities

**Plan 09-01:** Section Motion Variants (COMPLETE)
**Plan 09-02:** Home Page Enhancement (COMPLETE)
**Plan 09-03:** Gallery Section Experience (COMPLETE)
**Plan 09-04:** Listen Section Experience (COMPLETE)
**Plan 09-05:** About Section Experience (COMPLETE)
**Plan 09-06:** Contact and Discography Experiences (COMPLETE)

**Key Artifacts:**
- `src/lib/motion/section-variants.ts` - Section-specific motion variants with aboutStaggerContainer, aboutCardItem
- `src/lib/motion/index.ts` - Updated barrel export
- `public/images/home-poster.jpg` - Home VideoBackground poster fallback
- `src/pages/Home.tsx` - Enhanced with heroVariants, KineticText, staggered posts
- `public/images/gallery-poster.jpg` - Gallery VideoBackground poster fallback
- `src/pages/Gallery.tsx` - Enhanced with section personality
- `public/images/listen-poster.jpg` - Listen VideoBackground poster fallback
- `src/pages/Listen.tsx` - Enhanced with immersive, cinematic feel
- `public/images/about-poster.jpg` - About VideoBackground poster fallback
- `src/pages/About.tsx` - Enhanced with warm, personal storytelling feel
- `public/images/contact-poster.jpg` - Contact VideoBackground poster fallback
- `src/pages/Contact.tsx` - Enhanced with crisp, professional feel
- `public/images/discography-poster.jpg` - Discography VideoBackground poster fallback
- `src/pages/Discography.tsx` - Enhanced with catalog stagger effect

## Session Continuity

Last session: 2026-01-24
Stopped at: Completed 09-06-PLAN.md (Contact and Discography Experiences)
Resume file: None - ready for next plan
