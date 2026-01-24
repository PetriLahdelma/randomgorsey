# Phase 4: Motion Foundation - Research

**Researched:** 2026-01-17
**Domain:** Framer Motion centralized configuration, prefers-reduced-motion accessibility, spring physics, animation provider patterns
**Confidence:** HIGH

## Summary

This research addresses how to centralize motion configuration for a Tailwind v4 + Framer Motion 12.x stack, implementing accessibility-first reduced-motion handling, standardizing spring physics, and creating an AnimationProvider pattern for React 19.

The codebase currently has 8 files using Framer Motion with inconsistent inline animation configs: identical `{ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.4 } }` patterns are duplicated across 7 page components, and iOS detection (`isIOS()`) completely disables animations instead of respecting user preferences. This creates maintenance burden and accessibility gaps.

Framer Motion 12.x provides built-in accessibility support via `MotionConfig` with `reducedMotion` prop and `useReducedMotion` hook. The recommended approach is: wrap the app with `MotionConfig reducedMotion="user"` for automatic system preference detection, extract repeated animation configs into centralized presets, and remove the iOS-specific animation disabling in favor of proper reduced-motion handling.

**Primary recommendation:** Create `src/lib/motion/` directory with `config.ts` (springs, durations, eases), `variants.ts` (reusable animation variants), and `AnimationProvider.tsx` (MotionConfig wrapper with LazyMotion for bundle optimization). Replace `isIOS()` conditional with proper `prefers-reduced-motion` support.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | 12.23.24 | Animation library | Already installed, comprehensive accessibility support |
| motion/react | 12.x | New import path (alias) | Motion rebrand, same package |
| MotionConfig | built-in | Global animation config | Site-wide reducedMotion and transition defaults |
| useReducedMotion | built-in | Accessibility hook | Real-time system preference detection |
| LazyMotion | built-in | Bundle optimization | Reduce initial bundle size |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| AnimatePresence | built-in | Exit animations | Mount/unmount transitions |
| LayoutGroup | built-in | Shared layout animations | Cross-component layout animations |
| domAnimation | built-in | LazyMotion feature set | Standard DOM animations without gesture support |
| domMax | built-in | Full LazyMotion features | When drag/gesture support needed |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Framer Motion | React Spring | More physics control, steeper learning curve, less accessibility tooling |
| Framer Motion | GSAP | More powerful, larger bundle, license considerations |
| CSS animations | Framer Motion | Simpler for basic cases, lacks orchestration and spring physics |
| Custom hook | useReducedMotion | Built-in handles edge cases, listener cleanup, SSR |

**Installation:**
```bash
# No additional packages needed - framer-motion 12.23.24 already installed
# Note: Motion was rebranded from "framer-motion" to "motion" but same npm package
```

## Architecture Patterns

### Recommended Project Structure
```
src/lib/motion/
├── index.ts           # Public exports
├── config.ts          # Springs, durations, eases constants
├── variants.ts        # Reusable animation variants
├── AnimationProvider.tsx  # MotionConfig + LazyMotion wrapper
└── hooks/
    └── useMotionPresets.ts  # Hook for accessing motion config
```

### Pattern 1: Centralized Motion Configuration

**What:** Single source of truth for all animation timing, spring physics, and easing values.

**When to use:** Always - this is the foundation for consistent animations across the site.

**Example:**
```typescript
// src/lib/motion/config.ts
// Source: Framer Motion official docs + project architecture research

// === SPRING PRESETS ===
// Named presets matching common interaction patterns
export const springs = {
  // Snappy interactions (buttons, toggles) - responsive feedback
  snappy: { stiffness: 400, damping: 30, mass: 1 },

  // Default UI transitions - balanced feel
  default: { stiffness: 100, damping: 15, mass: 1 },

  // Gentle, organic movement - content reveals
  gentle: { stiffness: 50, damping: 15, mass: 1 },

  // Bouncy, playful - use sparingly for delight
  bouncy: { stiffness: 300, damping: 10, mass: 1 },

  // Smooth page transitions - weighted feel
  page: { stiffness: 80, damping: 20, mass: 1 },

  // Heavy, dramatic - hero elements, major transitions
  dramatic: { stiffness: 60, damping: 12, mass: 2 },
} as const;

// === DURATION PRESETS (for tween animations) ===
export const durations = {
  instant: 0,
  fast: 0.15,      // Micro interactions
  normal: 0.3,     // Standard transitions
  slow: 0.5,       // Deliberate movement
  slower: 0.7,     // Emphasis
  glacial: 1.0,    // Intro sequences only
} as const;

// === EASING PRESETS ===
// Cubic bezier curves for tween animations
export const eases = {
  default: [0.4, 0, 0.2, 1],       // Material Design standard
  in: [0.4, 0, 1, 1],              // Accelerating
  out: [0, 0, 0.2, 1],             // Decelerating
  inOut: [0.4, 0, 0.2, 1],         // Symmetric
  bounce: [0.68, -0.55, 0.265, 1.55], // Overshoot
} as const;

// Type exports for type-safe usage
export type SpringPreset = keyof typeof springs;
export type DurationPreset = keyof typeof durations;
export type EasePreset = keyof typeof eases;
```

### Pattern 2: Reusable Animation Variants

**What:** Pre-defined variant objects for common animation patterns that can be applied consistently across components.

**When to use:** For any repeated animation pattern (page transitions, stagger lists, hover effects).

**Example:**
```typescript
// src/lib/motion/variants.ts
// Source: Motion docs (motion.dev/docs/react-animation)
import { Variants } from 'framer-motion';
import { springs, durations } from './config';

// === PAGE TRANSITIONS ===
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.page }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: durations.fast }
  },
};

// === FADE ONLY (reduced motion safe) ===
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: durations.normal } },
  exit: { opacity: 0, transition: { duration: durations.fast } },
};

// === STAGGER CONTAINER ===
export const staggerContainer: Variants = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// === STAGGER ITEMS ===
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.default }
  },
  exit: { opacity: 0, y: -10 },
};

// === MODAL/OVERLAY ===
export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: durations.fast } },
  exit: { opacity: 0, transition: { duration: durations.fast } },
};

export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  enter: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', ...springs.snappy }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: durations.fast }
  },
};

// === HOVER LIFT (cards) ===
export const hoverLift: Variants = {
  rest: { y: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  hover: {
    y: -4,
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    transition: { type: 'spring', ...springs.snappy }
  },
};

// === BUTTON PRESS ===
export const buttonPress: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};
```

### Pattern 3: AnimationProvider with Reduced Motion

**What:** Context wrapper that provides global motion configuration including automatic reduced-motion handling.

**When to use:** Wrap the entire app to enable site-wide motion preferences.

**Example:**
```typescript
// src/lib/motion/AnimationProvider.tsx
// Source: Motion docs (motion.dev/docs/react-motion-config)
import React from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';

interface AnimationProviderProps {
  children: React.ReactNode;
  /** Override system preference: 'user' (default), 'always', 'never' */
  reducedMotion?: 'user' | 'always' | 'never';
}

/**
 * Provides global animation configuration for the entire app.
 *
 * Features:
 * - Automatic prefers-reduced-motion detection when reducedMotion="user"
 * - LazyMotion for bundle optimization (loads animation features on demand)
 * - Consistent transition defaults
 *
 * When reduced motion is enabled:
 * - Transform animations (x, y, scale, rotate) are disabled
 * - Layout animations are disabled
 * - Opacity and color animations are preserved
 */
export const AnimationProvider: React.FC<AnimationProviderProps> = ({
  children,
  reducedMotion = 'user',
}) => {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={reducedMotion}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
};

export default AnimationProvider;
```

**Usage in App.tsx:**
```typescript
// src/App.tsx
import { AnimationProvider } from '@/lib/motion';

const App: React.FC = () => {
  return (
    <AnimationProvider>
      <BrowserRouter>
        {/* ... routes ... */}
      </BrowserRouter>
    </AnimationProvider>
  );
};
```

### Pattern 4: Using useReducedMotion for Custom Behavior

**What:** Hook for bespoke reduced-motion handling when MotionConfig's automatic behavior isn't sufficient.

**When to use:** When you need conditional logic based on motion preference (e.g., disabling autoplay videos, parallax effects).

**Example:**
```typescript
// Source: Motion docs (motion.dev/docs/react-use-reduced-motion)
import { useReducedMotion, motion } from 'framer-motion';

const HeroSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section data-section="hero">
      {/* Disable autoplay video for reduced motion users */}
      {!shouldReduceMotion && (
        <video autoPlay muted loop playsInline>
          <source src={backgroundVideo} type="video/webm" />
        </video>
      )}

      {/* Show static image fallback */}
      {shouldReduceMotion && (
        <img src={backgroundPoster} alt="" />
      )}

      <motion.h1
        // Animation still works - MotionConfig handles transform suppression
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Welcome
      </motion.h1>
    </section>
  );
};
```

### Anti-Patterns to Avoid

- **Disabling animations for specific devices (like iOS):** Use `prefers-reduced-motion` instead of device detection. The current `isIOS()` pattern should be removed.
- **Inline animation configs everywhere:** Extract to centralized variants for consistency and maintainability.
- **Animating layout-affecting properties:** Prefer `transform` and `opacity` for performance. Use Framer Motion's `layout` prop when layout animations are needed.
- **Ignoring transition on exit:** Exit animations are just as important as enter animations for spatial continuity.
- **Hard-coded duration values:** Use duration presets for consistency; 0.4s everywhere is too slow for interactions.
- **Overriding MotionConfig with reducedMotion="never":** This ignores user accessibility preferences.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reduced motion detection | Custom media query listener | `useReducedMotion` hook | Handles SSR, cleanup, real-time updates |
| Global motion config | Props drilling | `MotionConfig` component | Built-in context, proper reduced-motion cascade |
| Bundle optimization | Manual code splitting | `LazyMotion` with `domAnimation` | Framer Motion's optimized feature loading |
| Device-based animation disabling | `isIOS()` checks | `prefers-reduced-motion` | Accessibility standard, user preference not device |
| Spring physics | Manual requestAnimationFrame | `type: "spring"` transition | Physics engine handles velocity, momentum |
| Exit animations | Conditional rendering | `AnimatePresence` | Defers unmount until animation completes |

**Key insight:** Framer Motion 12.x provides comprehensive accessibility support built-in. The `MotionConfig reducedMotion="user"` setting handles 90% of accessibility needs automatically by disabling transform/layout animations while preserving opacity transitions.

## Common Pitfalls

### Pitfall 1: Using Device Detection Instead of User Preference

**What goes wrong:** The current codebase disables all animations on iOS devices using `isIOS()`. This is incorrect because: (1) it assumes all iOS users want reduced motion, (2) it completely removes animations rather than providing accessible alternatives, (3) it doesn't respect the actual system setting.

**Why it happens:** Older iOS Safari had animation performance issues, leading to this workaround.

**How to avoid:**
- Remove `isIOS()` conditional animation disabling
- Use `MotionConfig reducedMotion="user"` to respect system preference
- If performance is a concern on older devices, use `useReducedMotion` for specific heavy animations only

**Warning signs:** `isIOS() ? 'div' : motion.div` patterns in code.

### Pitfall 2: Conflicting Tailwind Transitions with Framer Motion

**What goes wrong:** Stuttery or weird animations when Tailwind CSS `transition-*` classes conflict with Framer Motion's inline styles.

**Why it happens:** Tailwind adds CSS transitions, Framer Motion applies inline styles - they fight.

**How to avoid:**
- Don't apply `transition-*` Tailwind classes to `motion.*` elements
- Let Framer Motion handle all animation timing
- Use Tailwind for static styling only

**Warning signs:** Animations look wrong or "doubled", removing Tailwind class fixes it.

### Pitfall 3: Not Providing Exit Animations

**What goes wrong:** Elements disappear abruptly without animation, breaking spatial continuity.

**Why it happens:** `AnimatePresence` not wrapping conditional content, or no `exit` variant defined.

**How to avoid:**
- Always wrap conditionally rendered motion elements with `AnimatePresence`
- Define `exit` variants for all animated content
- Use `mode="wait"` on AnimatePresence when needed for sequential transitions

**Warning signs:** Elements pop in smoothly but disappear instantly.

### Pitfall 4: Overusing Bouncy Springs

**What goes wrong:** UI feels cheap, unprofessional, or causes motion sickness.

**Why it happens:** Bouncy animations are fun to implement but inappropriate for most UI.

**How to avoid:**
- Use `springs.snappy` or `springs.default` for most interactions
- Reserve `springs.bouncy` for rare moments of delight
- Consider that what feels "fun" in development can be annoying at scale

**Warning signs:** Elements bouncing where simple ease would suffice.

### Pitfall 5: Forgetting Reduced Motion in Custom Animations

**What goes wrong:** Custom animation logic bypasses MotionConfig's reduced motion handling.

**Why it happens:** Using raw `animate()` API, CSS animations, or manual animation loops.

**How to avoid:**
- Prefer declarative `motion.*` components over imperative `animate()`
- For CSS animations, add `@media (prefers-reduced-motion: reduce)` overrides
- For custom hooks, call `useReducedMotion` and conditionally modify behavior

**Warning signs:** Animation plays even when system reduced motion is enabled.

## Code Examples

### Migrating Current Page Animation Pattern

Current pattern (duplicated across 7 pages):
```typescript
// BEFORE - src/pages/Home.tsx (and 6 other pages)
const Container: React.ElementType = isIOS() ? "div" : motion.div;

<Container
  {...(!isIOS() && {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  })}
>
```

Recommended pattern:
```typescript
// AFTER - src/pages/Home.tsx
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';

// AnimationProvider in App.tsx handles reduced motion automatically
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="enter"
  exit="exit"
>
```

### Migrating Modal Component

```typescript
// BEFORE - src/components/Modal.tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.2 }}
>
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >

// AFTER - with centralized variants
import { overlayVariants, modalVariants } from '@/lib/motion';

<motion.div
  variants={overlayVariants}
  initial="initial"
  animate="enter"
  exit="exit"
>
  <motion.div
    variants={modalVariants}
    initial="initial"
    animate="enter"
    exit="exit"
  >
```

### Complete Motion Config Module

```typescript
// src/lib/motion/index.ts
// Public API - single import point

// Configuration
export { springs, durations, eases } from './config';
export type { SpringPreset, DurationPreset, EasePreset } from './config';

// Variants
export {
  pageVariants,
  fadeVariants,
  staggerContainer,
  staggerItem,
  overlayVariants,
  modalVariants,
  hoverLift,
  buttonPress,
} from './variants';

// Provider
export { AnimationProvider } from './AnimationProvider';

// Re-export commonly used Framer Motion utilities
export {
  motion,
  AnimatePresence,
  useReducedMotion,
  useAnimation,
  useInView,
} from 'framer-motion';
```

### CSS Tokens for Animation (Optional Enhancement)

If CSS-level animation tokens are desired for Tailwind integration:

```css
/* src/styles/tokens/motion.css */
@theme {
  /* Duration tokens for CSS transitions */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;

  /* Easing tokens */
  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

/* Reduced motion handling for CSS animations */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| framer-motion import | motion/react import | Motion rebrand 2025 | New import path, same functionality |
| Device detection for animation | prefers-reduced-motion | Accessibility standard | Respects user preference, not device |
| Physics springs only | Duration-based springs | Motion 11+ | Easier configuration with `visualDuration` + `bounce` |
| Global feature bundle | LazyMotion code splitting | Framer Motion 6+ | Smaller initial bundle |
| Manual reduced-motion hooks | MotionConfig reducedMotion | Framer Motion 10+ | Automatic transform/layout disabling |

**Deprecated/outdated:**
- `isIOS()` or device detection for animation disabling - use reduced-motion media query
- Hard-coded `duration: 0.4` everywhere - use semantic duration presets
- Physics-only spring syntax - duration-based springs (`visualDuration`, `bounce`) are easier

## Open Questions

1. **CSS Animation Tokens**
   - What we know: Tailwind v4 @theme supports animation tokens
   - What's unclear: Whether to duplicate duration/easing values in CSS for Tailwind utilities
   - Recommendation: Keep Framer Motion as single source of truth for JS animations; add CSS tokens only if Tailwind `transition-*` classes are heavily used

2. **LazyMotion Feature Granularity**
   - What we know: `domAnimation` includes basic animations, `domMax` adds gestures
   - What's unclear: Whether gesture support (drag) will be needed in future phases
   - Recommendation: Start with `domAnimation`, upgrade to `domMax` when drag/gesture features are added

3. **Exit Animation Strategy for Page Transitions**
   - What we know: AnimatePresence can coordinate page exits
   - What's unclear: How to coordinate with React Router's view transitions
   - Recommendation: Defer page transition orchestration to Phase 8 (Page Transitions), keep simple fade for now

## Sources

### Primary (HIGH confidence)
- [Motion Accessibility Guide](https://motion.dev/docs/react-accessibility) - reducedMotion prop, accessibility patterns
- [Motion MotionConfig Docs](https://motion.dev/docs/react-motion-config) - reducedMotion options ("user", "always", "never")
- [Motion useReducedMotion Docs](https://motion.dev/docs/react-use-reduced-motion) - Hook API and usage
- [Motion Transition Docs](https://motion.dev/docs/react-transitions) - Spring physics, duration-based springs

### Secondary (MEDIUM confidence)
- [Let's Build UI: Reducing Motion](https://www.letsbuildui.dev/articles/reducing-motion-in-animations/) - CSS and JS patterns for reduced motion
- [Shakuro: Framer Motion Features](https://shakuro.com/blog/framer-motion-new-and-underestimated-features) - MotionConfig usage patterns
- [Ruixen: Best Practices](https://www.ruixen.com/blog/react-anim-framer-spring) - Duration guidelines (150-250ms micro, 250-400ms major)
- [LogRocket: Motion Guide](https://blog.logrocket.com/creating-react-animations-with-motion/) - MotionConfig props documentation
- Project's existing ARCHITECTURE.md research - Spring presets, AnimationProvider pattern

### Tertiary (LOW confidence)
- [DEV.to: Framer Motion + Tailwind 2025](https://dev.to/manukumar07/framer-motion-tailwind-the-2025-animation-stack-1801) - General integration patterns
- Community discussions on Framer Motion spring values - Default values (stiffness: 100, damping: 10, mass: 1)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using installed Framer Motion 12.23.24, official documentation verified
- Architecture: HIGH - Patterns from official Motion docs and prior project research
- Pitfalls: MEDIUM - Based on codebase analysis and community patterns, some extrapolated

**Research date:** 2026-01-17
**Valid until:** 2026-04-17 (Motion library is stable, patterns unlikely to change significantly)
