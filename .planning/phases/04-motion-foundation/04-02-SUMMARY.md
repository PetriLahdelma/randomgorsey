---
phase: 04-motion-foundation
plan: 02
subsystem: motion
tags: [framer-motion, accessibility, reduced-motion, lazy-motion]

dependency_graph:
  requires: ["04-01"]
  provides: ["AnimationProvider", "global-motion-config", "reduced-motion-support"]
  affects: ["04-03", "all-animated-components"]

tech_stack:
  added: []
  patterns: ["LazyMotion for bundle optimization", "MotionConfig for global settings"]

file_tracking:
  created:
    - src/lib/motion/AnimationProvider.tsx
  modified:
    - src/lib/motion/index.ts
    - src/App.tsx

decisions:
  - id: provider-wrapper-position
    choice: "AnimationProvider wraps BrowserRouter as outermost wrapper"
    rationale: "All route components inherit motion configuration"

metrics:
  duration: 3 min
  completed: 2026-01-17
---

# Phase 4 Plan 2: AnimationProvider Setup Summary

**One-liner:** AnimationProvider with LazyMotion and MotionConfig enabling automatic prefers-reduced-motion detection.

## What Was Built

Created a global animation configuration layer using Framer Motion's MotionConfig and LazyMotion, enabling accessibility-first reduced-motion handling throughout the app.

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/motion/AnimationProvider.tsx` | MotionConfig + LazyMotion wrapper component |
| `src/lib/motion/index.ts` | Updated barrel export with AnimationProvider |
| `src/App.tsx` | App wrapped in AnimationProvider |

## Technical Decisions

### 1. Provider Wrapper Position
**Decision:** AnimationProvider wraps BrowserRouter as outermost wrapper
**Rationale:** All route components inherit motion configuration, ensuring consistent behavior across all pages

### 2. LazyMotion with domAnimation
**Decision:** Use `domAnimation` features (not `domMax`)
**Rationale:** Gestures and drag features not needed yet; smaller bundle size

### 3. ReducedMotion Default
**Decision:** Default `reducedMotion="user"` respects system preference
**Rationale:** Accessibility-first approach; users can override if needed

## Commits

| Hash | Description |
|------|-------------|
| c55d7215 | Create AnimationProvider with reduced-motion handling |
| 6debc17e | Export AnimationProvider from motion module |
| 07329deb | Wrap App.tsx with AnimationProvider |

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

- Build passes: SUCCESS (built in 2.31s)
- AnimationProvider in tree: VERIFIED
- Import chain: App.tsx -> @/lib/motion -> AnimationProvider.tsx

## Accessibility Features

When `prefers-reduced-motion: reduce` is enabled:
- Transform animations (x, y, scale, rotate) are disabled
- Layout animations are disabled
- Opacity and color animations are preserved for visual feedback

## Next Phase Readiness

### Ready for 04-03
- AnimationProvider is active and wrapping the app
- Motion variants from 04-01 can now be used with consistent reduced-motion behavior
- Components can import from `@/lib/motion` for centralized animation configuration
