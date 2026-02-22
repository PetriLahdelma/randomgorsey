---
phase: 09-section-experiences
plan: 01
subsystem: ui
tags: [framer-motion, animation, variants, motion-system]

# Dependency graph
requires:
  - phase: 04-motion-foundation
    provides: springs, durations, eases config presets
provides:
  - heroVariants - bold dramatic entrance for hero sections
  - galleryVariants - light airy transitions for galleries
  - listenVariants - slow immersive tween for music pages
  - aboutVariants - warm reading-paced spring for bio
  - contactVariants - crisp professional motion for forms
  - discographyVariants - catalog reveal style for listings
  - heroStaggerContainer - 0.1s stagger with 0.2s delay
  - galleryStaggerContainer - 0.08s stagger with 0.1s delay
  - discographyStaggerContainer - 0.06s stagger with 0.1s delay
affects: [09-02, 09-03, 09-04 - page-level variant integration]

# Tech tracking
tech-stack:
  added: []
  patterns: [section-specific motion variants, per-page timing profiles]

key-files:
  created:
    - src/lib/motion/section-variants.ts
  modified:
    - src/lib/motion/index.ts

key-decisions:
  - "Hero uses dramatic spring with 0.2s delay for anticipation"
  - "Listen uses tween (not spring) for cinematic feel"
  - "Contact has softer snappy spring (200 stiffness vs 400)"
  - "Each section stagger container has distinct timing for personality"

patterns-established:
  - "Section variants use initial/enter/exit naming for AnimatePresence"
  - "Import springs from config.ts for cohesion, customize per-section"
  - "Stagger containers have matching exit with staggerDirection: -1"

# Metrics
duration: 4min
completed: 2026-01-24
---

# Phase 09 Plan 01: Section Motion Variants Summary

**Six section-specific motion variants with distinct timing personalities using shared spring presets for cohesion**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-24T09:00:00Z
- **Completed:** 2026-01-24T09:04:00Z
- **Tasks:** 3
- **Files modified:** 2

## Accomplishments

- Created 6 page-specific motion variants with unique character
- Added 3 section stagger containers with tuned timing
- Exported all variants from @/lib/motion barrel
- Maintained cohesion through shared spring presets

## Task Commits

Each task was committed atomically:

1. **Task 1: Create section-variants.ts with per-section motion timing** - `447d5a7c` (feat)
2. **Task 2: Update motion barrel export to include section variants** - `4051ff15` (feat)
3. **Task 3: Verify build and exports** - (no commit - verification only)

## Files Created/Modified

- `src/lib/motion/section-variants.ts` - Section-specific motion variants (244 lines)
- `src/lib/motion/index.ts` - Barrel export updated with section variants

## Decisions Made

- **Hero delay:** 0.2s delay creates anticipation, lets page settle before dramatic entrance
- **Listen tween:** 0.6s tween (not spring) for smooth cinematic feel matching music content
- **About custom spring:** Tuned stiffness 70 damping 18 for comfortable reading pace
- **Contact softer snappy:** 200 stiffness (vs 400 in snappy preset) for professional not aggressive feel

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - straightforward implementation following existing patterns.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 6 section variants ready for page integration
- Stagger containers ready for list animations
- Import pattern established: `import { heroVariants } from '@/lib/motion'`
- Next plans can apply variants to actual page components

---
*Phase: 09-section-experiences*
*Completed: 2026-01-24*
