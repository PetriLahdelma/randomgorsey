---
phase: 08-page-transitions
plan: 01
subsystem: ui
tags: [framer-motion, animate-presence, page-transitions, routing, exit-animations]

# Dependency graph
requires:
  - phase: 04-motion-foundation
    provides: pageVariants with exit state, AnimationProvider
provides:
  - AnimatedRoutes component wrapping Routes with AnimatePresence
  - Coordinated page exit/enter animations
  - Automatic scroll-to-top on route transition
affects: [08-02, 08-03, page-experiences, navigation-ux]

# Tech tracking
tech-stack:
  added: []
  patterns: [animate-presence-routing, exit-animation-coordination]

key-files:
  created:
    - src/lib/motion/AnimatedRoutes.tsx
  modified:
    - src/lib/motion/index.ts
    - src/App.tsx
    - src/pages/Home.tsx
    - src/pages/About.tsx
    - src/pages/Contact.tsx
    - src/pages/Discography.tsx
    - src/pages/Gallery.tsx
    - src/pages/Listen.tsx
    - src/pages/NotFound.tsx

key-decisions:
  - "AnimatePresence mode='wait' ensures exit completes before enter starts"
  - "Scroll reset via onExitComplete callback (replaces ScrollToTop component)"
  - "Location.pathname as key for proper route transition detection"

patterns-established:
  - "AnimatedRoutes wrapper pattern for React Router integration"
  - "exit='exit' prop required on all page motion wrappers"

# Metrics
duration: 4min
completed: 2026-01-17
---

# Phase 8 Plan 1: AnimatePresence Route Wrapper Summary

**AnimatedRoutes component wrapping Routes with AnimatePresence mode='wait' for coordinated page exit/enter animations**

## Performance

- **Duration:** 4 min
- **Started:** 2026-01-17
- **Completed:** 2026-01-17
- **Tasks:** 3
- **Files modified:** 10

## Accomplishments
- Created AnimatedRoutes component with AnimatePresence mode="wait"
- Integrated scroll-to-top via onExitComplete callback
- Replaced bare Routes with AnimatedRoutes in App.tsx
- Removed redundant ScrollToTop component
- Added exit="exit" prop to all 7 page components

## Task Commits

Each task was committed atomically:

1. **Task 1: Create AnimatedRoutes component** - `4ddeeb7b` (feat)
2. **Task 2: Update App.tsx to use AnimatedRoutes** - `bf5d5b43` (feat)
3. **Task 3: Add exit variant to all page components** - `bd724bea` (feat)

## Files Created/Modified
- `src/lib/motion/AnimatedRoutes.tsx` - AnimatePresence wrapper for route transitions (36 lines)
- `src/lib/motion/index.ts` - Added AnimatedRoutes export
- `src/App.tsx` - Uses AnimatedRoutes, removed ScrollToTop component
- `src/pages/Home.tsx` - Added exit="exit" to pageVariants motion wrapper
- `src/pages/About.tsx` - Added exit="exit" to pageVariants motion wrapper
- `src/pages/Contact.tsx` - Added exit="exit" to pageVariants motion wrapper
- `src/pages/Discography.tsx` - Added exit="exit" to pageVariants motion wrapper
- `src/pages/Gallery.tsx` - Added exit="exit" to pageVariants motion wrapper
- `src/pages/Listen.tsx` - Added exit="exit" to pageVariants motion wrapper
- `src/pages/NotFound.tsx` - Added exit="exit" to pageVariants motion wrapper

## Decisions Made
- **AnimatePresence mode:** Use "wait" to complete exit before enter (not "sync" or "popLayout")
- **Scroll handling:** onExitComplete callback replaces ScrollToTop component (cleaner approach)
- **Route keying:** location.pathname as key for proper transition detection
- **Exit animation:** Fade out (opacity: 0) with slight upward motion (y: -10) from pageVariants

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all tasks completed without issues.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Page transitions now have visible exit animation before enter animation
- Scroll position resets to top after exit animation completes
- AnimatedRoutes available from @/lib/motion for future routing needs
- Ready for 08-02 (Crossfade Transition Variant)

---
*Phase: 08-page-transitions*
*Plan: 01*
*Completed: 2026-01-17*
