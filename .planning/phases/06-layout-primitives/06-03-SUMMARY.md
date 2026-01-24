---
phase: 06-layout-primitives
plan: 03
subsystem: ui
tags: [layout, tailwind, cva, containment, bleed, full-width]

# Dependency graph
requires:
  - phase: 01-tailwind-migration
    provides: CVA pattern for component variants
  - phase: 02-token-architecture
    provides: Design tokens and spacing scale
provides:
  - Bleed full-width breakout component
  - Container max-width constraint component
  - Full-bleed within contained layout pattern
affects: [06-04 (Storybook stories), page layouts, hero sections]

# Tech tracking
tech-stack:
  added: []
  patterns: [full-bleed breakout, max-width containment, polymorphic components]

key-files:
  created:
    - src/components/layout/Bleed.tsx
    - src/components/layout/Container.tsx
  modified:
    - src/components/layout/index.ts

key-decisions:
  - "Bleed uses w-screen with left-1/2 -translate-x-1/2 for full-width breakout"
  - "Container has 7 size variants (sm through 2xl, prose, full)"
  - "Container has 4 padding variants (none, sm, md, lg)"
  - "Both components support polymorphic as prop"

patterns-established:
  - "Full-bleed technique: relative left-1/2 w-screen -translate-x-1/2"
  - "Container constraint: mx-auto w-full max-w-*"

# Metrics
duration: 2min
completed: 2026-01-17
---

# Phase 6 Plan 3: Bleed and Container Primitives Summary

**Bleed and Container layout primitives for intentional grid breaks**

## Performance

- **Duration:** 2 min
- **Started:** 2026-01-17T12:05:00Z
- **Completed:** 2026-01-17T12:07:00Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments
- Bleed component for full-viewport-width breakouts from contained layouts
- Container component with 7 size variants and 4 padding variants
- Both components support polymorphic `as` prop for semantic HTML
- Pattern enables "full-bleed within contained layout" design pattern

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Bleed component** - `58895191` (included with Stack)
2. **Task 2: Create Container component** - `f6f9db93` (feat)
3. **Task 3: Update barrel export** - `620ae283` (fix - removed duplicates)

## Files Created/Modified
- `src/components/layout/Bleed.tsx` - Full-width breakout using transform technique
- `src/components/layout/Container.tsx` - Max-width constraint with CVA variants
- `src/components/layout/index.ts` - Updated barrel export with all layout primitives

## Decisions Made
- Bleed uses classic breakout technique (relative + w-screen + translate)
- Container size variants map to Tailwind screen breakpoints
- Container includes "prose" size for optimal reading width (~65ch)
- Container includes "full" size for no max-width constraint
- Default Container: xl size (1280px) with md padding (1.5rem)

## Deviations from Plan

- Bleed was created during research phase, verified and kept as-is
- Added note about potential w-screen scrollbar issues with alternative (w-dvw)

## Issues Encountered

- Duplicate exports in index.ts from multiple concurrent agents (fixed in commit 620ae283)

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- All 5 layout primitives ready: Stack, Cluster, Grid, Bleed, Container
- Plan 06-04 creates Storybook stories for all primitives
- Layout composition patterns established for page enhancements

---
*Phase: 06-layout-primitives*
*Completed: 2026-01-17*
