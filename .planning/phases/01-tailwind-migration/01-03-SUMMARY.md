---
phase: 01-tailwind-migration
plan: 03
subsystem: ui
tags: [cva, tailwind-css, design-system, heading, text, surface, class-variance-authority]

# Dependency graph
requires:
  - 01-02: Tailwind CSS v4 and cn() utility
provides:
  - Heading component with CVA variants for level, tone, align, weight, uppercase
  - Text component with CVA variants for variant, tone, align, weight, uppercase
  - Surface component with CVA variants for variant, padding, radius, interactive, fullWidth
  - Exported CVA variant definitions (headingVariants, textVariants, surfaceVariants)
affects: [01-04-button-migration, 01-05-card-migration, future-design-system-components]

# Tech tracking
tech-stack:
  added: []
  patterns: [cva-variant-pattern, tailwind-arbitrary-values, polymorphic-component-with-cva]

key-files:
  created: []
  modified:
    - src/components/Heading.tsx
    - src/components/Text.tsx
    - src/components/Surface.tsx

key-decisions:
  - "Use Tailwind arbitrary values to exactly match CSS Module values"
  - "Export CVA variant definitions for external composition"
  - "Keep CSS Module files for reference during gradual migration (delete later)"
  - "Preserve all polymorphic props and BaseComponentProps interface"

patterns-established:
  - "CVA base + variants structure for design primitives"
  - "Join array of Tailwind classes for multi-line base/variant definitions"
  - "Use cn() to merge CVA output with className prop"
  - "Export named variants alongside default component export"

# Metrics
duration: 3min
completed: 2026-01-17
---

# Phase 1 Plan 3: Design System Primitives Migration Summary

**Heading, Text, and Surface components migrated to Tailwind + CVA with pixel-perfect CSS Module value mapping and preserved polymorphic interfaces**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-17T01:48:05Z
- **Completed:** 2026-01-17T01:50:51Z
- **Tasks:** 3
- **Files modified:** 3

## Accomplishments

- Heading component now uses CVA with 6 level sizes, 3 tones, 3 alignments, 3 weights
- Text component now uses CVA with 4 variants (body, bodySmall, caption, eyebrow), 4 tones
- Surface component now uses CVA with 3 visual variants, 5 padding scales, 4 radii, interactive states
- All CSS Module values mapped to Tailwind arbitrary values for visual parity
- CVA variants exported for external composition and testing

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate Heading component** - `71fda7e8` (refactor)
2. **Task 2: Migrate Text component** - `747e1457` (refactor)
3. **Task 3: Migrate Surface component** - `b4608a30` (refactor)

## Files Created/Modified

**Modified:**
- `src/components/Heading.tsx` - CVA variants for heading levels, tones, alignments, weights
- `src/components/Text.tsx` - CVA variants for text sizes, tones, weights with eyebrow special handling
- `src/components/Surface.tsx` - CVA variants for visual styles, padding, radius, interactive states

**Retained (not deleted):**
- `src/components/Heading.module.css` - Reference during migration (delete in cleanup)
- `src/components/Text.module.css` - Reference during migration (delete in cleanup)
- `src/components/Surface.module.css` - Reference during migration (delete in cleanup)

## Decisions Made

1. **Tailwind arbitrary values** - Used exact CSS values like `text-[clamp(2.4rem,5vw,3.4rem)]` to ensure visual parity with CSS Modules
2. **Custom font handling** - Used `font-['Tschick_Bold',sans-serif]` for Heading, `font-['Europa_Regular',sans-serif]` for Text
3. **Shadow complexity** - Preserved exact shadow values using Tailwind arbitrary syntax `shadow-[0_18px_30px_rgb(0_0_0/0.18)]`
4. **Eyebrow uppercase** - Built into variant definition to avoid double-application when `uppercase={true}`

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all components migrated cleanly with build verification passing.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Design primitives ready for use throughout the app
- CVA pattern established for remaining component migrations
- CSS Module files retained for reference during visual comparison testing
- No blockers for continuing with Button or Card migrations

---
*Phase: 01-tailwind-migration*
*Plan: 03*
*Completed: 2026-01-17*
