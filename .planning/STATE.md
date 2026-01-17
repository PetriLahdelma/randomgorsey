# Project State

## Project Reference

See: .planning/PROJECT.md

**Core value:** Ship something you'd be proud to show design-literate peers - every decision should feel intentional, not safe.
**Current focus:** Phase 5 - Smooth Scroll Integration (IN PROGRESS)

## Current Position

Phase: 5 of 9 (Smooth Scroll Integration)
Plan: 2 of 5 complete (05-01, 05-02)
Status: In progress
Last activity: 2026-01-17 - Completed 05-02-PLAN.md (Reveal Variants and RevealOnScroll)

Progress: [========================================] ~40% (20/~50 total plans estimated)

## Performance Metrics

**Velocity:**
- Total plans completed: 20
- Average duration: 6 min
- Phase 1 total: ~70 min
- Phase 2 total: ~18 min
- Phase 3 total: ~13 min
- Phase 4 total: ~12 min
- Phase 5 so far: ~6 min

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 01-tailwind-migration | 7 | 70 min | 10 min |
| 02-token-architecture | 4 | 18 min | 5 min |
| 03-typography-system | 3 | 13 min | 4 min |
| 04-motion-foundation | 4 | 12 min | 3 min |
| 05-smooth-scroll-integration | 2/5 | 6 min | 3 min |

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

### Phase 5 Progress (In Progress)

**Smooth Scroll Integration:**
- `src/lib/motion/LenisProvider.tsx` - Lenis smooth scroll integration (Plan 05-01)
- `src/lib/motion/variants.ts` - Added 4 reveal variants (Plan 05-02)
- `src/components/RevealOnScroll.tsx` - Scroll-triggered reveal component (Plan 05-02)

**Plan 05-01:** Lenis Smooth Scroll Setup (COMPLETE)
**Plan 05-02:** Reveal Variants and RevealOnScroll (COMPLETE)
**Plan 05-03:** ScrollProgress Components (PENDING)
**Plan 05-04:** Parallax and Scroll Effects (PENDING)
**Plan 05-05:** Gap Closure (PENDING)

### Pending Todos

- Configure Vitest for testing (Phase 2 or later)
- Migrate page CSS Modules (when pages are enhanced)
- Delete variables.css (after page migration)
- Remove legacy color aliases (after Phase 3+ page migration)

### Blockers/Concerns

(None)

## Session Continuity

Last session: 2026-01-17
Stopped at: Completed 05-02-PLAN.md - Reveal Variants and RevealOnScroll
Resume file: None - continue with 05-03-PLAN.md
