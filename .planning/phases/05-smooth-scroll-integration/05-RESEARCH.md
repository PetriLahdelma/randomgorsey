# Phase 5: Smooth Scroll Integration - Research

**Researched:** 2026-01-17
**Domain:** Smooth scroll (Lenis) + scroll-driven animations (Framer Motion)
**Confidence:** HIGH

## Summary

Phase 5 implements smooth scroll behavior using Lenis and scroll-driven reveal animations using Framer Motion's built-in hooks. The integration is well-documented and supported for React 19.

**Key findings:**
1. Lenis v1.3.17 is the current stable version with React 19 support via `lenis/react`
2. Framer Motion's `whileInView`, `useScroll`, and `useTransform` provide native scroll-driven animations
3. Lenis and Framer Motion work together when properly synchronized via `frame.update`
4. Mobile should use native scroll (disable Lenis touch handling) for best UX
5. Reduced motion preferences must disable both Lenis AND scroll animations

**Primary recommendation:** Install `lenis`, wrap app with `ReactLenis`, create reveal variants using `whileInView`, disable Lenis for mobile and reduced-motion users.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| lenis | ^1.3.17 | Smooth scroll | Industry standard, lightweight (~2KB gzip), maintained by darkroom.engineering |
| framer-motion | 12.23.24 | Scroll animations | Already in stack, native `useScroll`/`whileInView` support |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lenis/react | (included) | React wrapper | ReactLenis component + useLenis hook |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Lenis | Locomotive Scroll | Lenis is lighter, more actively maintained |
| Lenis | GSAP ScrollSmoother | Requires GSAP license for commercial, heavier |
| Framer Motion scroll | GSAP ScrollTrigger | GSAP is more powerful but adds bundle size |

**Installation:**
```bash
npm install lenis
```

**Note:** The old packages `@studio-freight/lenis` and `@studio-freight/react-lenis` are DEPRECATED. Use `lenis` package only.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   ├── motion/
│   │   ├── config.ts          # Existing spring/duration presets
│   │   ├── variants.ts        # Add reveal variants here
│   │   ├── AnimationProvider.tsx  # Wrap with Lenis here
│   │   └── index.ts           # Export useLenis, scroll variants
│   └── scroll/                # Optional: separate scroll module
│       ├── LenisProvider.tsx  # Alternative: dedicated provider
│       └── index.ts
├── components/
│   └── RevealOnScroll.tsx     # Reusable reveal wrapper component
└── hooks/
    └── useScrollProgress.ts   # Custom scroll progress hook
```

### Pattern 1: Lenis + Framer Motion Sync (RECOMMENDED)
**What:** Synchronize Lenis RAF with Framer Motion's frame scheduler
**When to use:** Always when using both libraries together
**Example:**
```typescript
// Source: https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md
import { ReactLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';
import { cancelFrame, frame } from 'framer-motion';
import { useEffect, useRef } from 'react';

function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }
    frame.update(update, true);
    return () => cancelFrame(update);
  }, []);

  return (
    <ReactLenis root options={{ autoRaf: false }} ref={lenisRef}>
      {children}
    </ReactLenis>
  );
}
```

### Pattern 2: whileInView for Reveal Animations
**What:** Trigger animations when elements enter viewport
**When to use:** For scroll-triggered content reveals
**Example:**
```typescript
// Source: https://motion.dev/docs/react-scroll-animations
import { motion } from 'framer-motion';

const revealVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  }
};

function RevealSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {children}
    </motion.div>
  );
}
```

### Pattern 3: useScroll for Progress-Linked Animations
**What:** Link animation values directly to scroll progress
**When to use:** Progress bars, parallax effects, scroll-linked transforms
**Example:**
```typescript
// Source: https://motion.dev/docs/react-use-scroll
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef } from 'react';

function ParallaxImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  // Create parallax effect
  const y = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  // Optional: smooth the motion value
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return (
    <div ref={ref} style={{ overflow: 'hidden' }}>
      <motion.img src={src} alt={alt} style={{ y: smoothY }} />
    </div>
  );
}
```

### Pattern 4: Conditional Lenis (Mobile + Reduced Motion)
**What:** Disable Lenis on mobile and for reduced-motion users
**When to use:** Always - this is required for accessibility
**Example:**
```typescript
// Source: Multiple - synthesized best practice
import { ReactLenis } from 'lenis/react';
import { useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';

function ConditionalLenisProvider({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for touch device (mobile/tablet)
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Skip Lenis entirely for mobile or reduced motion
  if (isMobile || prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis root options={{ autoRaf: true }}>
      {children}
    </ReactLenis>
  );
}
```

### Anti-Patterns to Avoid
- **Enabling `syncTouch`:** Causes iOS < 16 issues, scroll stuttering on mobile. Keep touch native.
- **Forgetting cleanup:** Lenis RAF must be cancelled in useEffect cleanup to prevent memory leaks.
- **Using `autoRaf: true` with Framer Motion sync:** Double RAF loops cause jank. Use `autoRaf: false` when manually syncing.
- **Animating with Lenis on reduced motion:** Accessibility violation. Check `useReducedMotion()` before enabling.
- **Nested scroll containers without `data-lenis-prevent`:** Causes scroll hijacking. Mark nested scrollable elements.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Smooth scroll | Custom lerp scroll loop | Lenis | Handles edge cases (Safari 60fps cap, iOS touch, iframes) |
| Viewport detection | Custom IntersectionObserver | Framer Motion `whileInView` | Already handles all edge cases, integrated with animation |
| Scroll progress | Custom scroll listener + state | `useScroll` hook | Properly throttled, motion value compatible |
| Parallax calculation | Manual scroll position math | `useTransform` | Composes with spring smoothing, GPU optimized |
| RAF management | Manual requestAnimationFrame | Framer Motion `frame` | Proper scheduling, cleanup handled |

**Key insight:** Both Lenis and Framer Motion have spent years solving scroll edge cases (Safari quirks, mobile touch, reduced motion, memory leaks). Custom solutions will miss something.

## Common Pitfalls

### Pitfall 1: Double Animation Frame Loop
**What goes wrong:** Jittery scroll when Lenis autoRaf conflicts with Framer Motion frame scheduler
**Why it happens:** Both libraries running separate RAF loops creates timing conflicts
**How to avoid:** Set `autoRaf: false` on Lenis and sync via `frame.update` from Framer Motion
**Warning signs:** Scroll feels "doubled" or laggy, especially on page transitions

### Pitfall 2: iOS Touch Scroll Issues
**What goes wrong:** Scroll stops randomly, stutters, or jumps on iOS Safari
**Why it happens:** `syncTouch: true` option conflicts with iOS < 16 touch handling
**How to avoid:** Keep `syncTouch` disabled (default), let mobile use native scroll
**Warning signs:** User reports on iPhone/iPad, works fine on Android/desktop

### Pitfall 3: Scroll Position Lost on Route Change
**What goes wrong:** Navigating to new page doesn't scroll to top
**Why it happens:** Lenis maintains scroll position across React Router navigations
**How to avoid:** Call `lenis.scrollTo(0, { immediate: true })` on route change via useLenis hook
**Warning signs:** New pages start scrolled down, especially after navigating back

### Pitfall 4: Modal/Overlay Scroll Bleed
**What goes wrong:** Background scrolls when modal is open
**Why it happens:** Lenis continues processing scroll events
**How to avoid:** Use `lenis.stop()` when modal opens, `lenis.start()` when closes; OR use `data-lenis-prevent` on modal container
**Warning signs:** Gallery overlay (existing in codebase) scrolls background

### Pitfall 5: whileInView Triggers Too Early/Late
**What goes wrong:** Animations fire before element is meaningfully visible
**Why it happens:** Default `amount: "some"` triggers on any pixel entering viewport
**How to avoid:** Set `viewport={{ amount: 0.3 }}` for 30% visibility threshold
**Warning signs:** Animations feel "too eager" or user misses them

### Pitfall 6: Reduced Motion Not Respected
**What goes wrong:** Users with vestibular disorders experience motion sickness
**Why it happens:** Lenis + scroll animations enabled regardless of system preference
**How to avoid:** Check `useReducedMotion()`, disable Lenis, use `fadeVariants` instead of transform animations
**Warning signs:** Accessibility audit failures, user complaints

## Code Examples

Verified patterns from official sources:

### Lenis Configuration Options
```typescript
// Source: https://github.com/darkroomengineering/lenis
interface LenisOptions {
  lerp?: number;           // 0.1 default - interpolation intensity (0-1)
  duration?: number;       // 1.2 default - scroll animation duration (ignored if lerp set)
  smoothWheel?: boolean;   // true default - smooth wheel events
  wheelMultiplier?: number; // 1 default - wheel scroll speed multiplier
  touchMultiplier?: number; // 1 default - touch scroll speed multiplier (keep at 1)
  orientation?: 'vertical' | 'horizontal';
  syncTouch?: boolean;     // false default - DO NOT enable (iOS issues)
  autoRaf?: boolean;       // true default - set false when syncing with Framer Motion
}

// Recommended configuration for this project
const lenisOptions: LenisOptions = {
  lerp: 0.1,              // Smooth but responsive
  smoothWheel: true,
  wheelMultiplier: 1,
  orientation: 'vertical',
  syncTouch: false,       // Native mobile scroll
  autoRaf: false,         // Sync with Framer Motion
};
```

### Reveal Variants (Add to variants.ts)
```typescript
// Source: Motion best practices + existing project patterns
import type { Variants } from 'framer-motion';
import { durations, eases } from './config';

/**
 * Scroll-triggered reveal animation.
 * Use with whileInView="visible" viewport={{ once: true, amount: 0.3 }}
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: eases.out,
    },
  },
};

/**
 * Stagger container for multiple reveal items.
 * Use with revealItemVariants children.
 */
export const revealContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Individual item for staggered reveals.
 */
export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.normal, ease: eases.out },
  },
};

/**
 * Reduced motion safe reveal (opacity only).
 * Use for users with prefers-reduced-motion.
 */
export const revealFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.normal },
  },
};
```

### useLenis Hook Usage
```typescript
// Source: https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md
import { useLenis } from 'lenis/react';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scroll to top on route change
function useScrollToTopOnRouteChange() {
  const lenis = useLenis();
  const location = useLocation();

  useEffect(() => {
    // Immediate scroll to top on route change
    lenis?.scrollTo(0, { immediate: true });
  }, [location.pathname, lenis]);
}

// Programmatic scroll (e.g., "Back to Top" button)
function BackToTopButton() {
  const lenis = useLenis();

  const handleClick = () => {
    lenis?.scrollTo(0, { duration: 1.2 });
  };

  return <button onClick={handleClick}>Back to Top</button>;
}

// Scroll callback for custom behavior
function useScrollDirection() {
  useLenis(({ scroll, direction }) => {
    // direction: 1 = down, -1 = up
    console.log('Scroll position:', scroll);
    console.log('Direction:', direction);
  });
}
```

### viewport Prop Options
```typescript
// Source: https://motion.dev/docs/react-scroll-animations
interface ViewportOptions {
  root?: React.RefObject<Element>;  // Custom scroll container (default: window)
  once?: boolean;                    // Animate only once (default: false)
  amount?: 'some' | 'all' | number; // Visibility threshold (default: 'some')
  margin?: string;                   // Margin around viewport (default: '0px')
}

// Recommended defaults for this project
const defaultViewport: ViewportOptions = {
  once: true,    // Don't re-animate on scroll up
  amount: 0.3,   // Trigger when 30% visible
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @studio-freight/lenis | lenis (renamed) | 2024 | Must use new package name |
| @studio-freight/react-lenis | lenis/react (included) | 2024 | React wrapper included in main package |
| Manual IntersectionObserver | whileInView prop | Framer Motion 6+ | Simpler API, integrated animations |
| Custom scroll lerp | Lenis | 2023+ | Better browser support, maintained |
| scrollY state listener | useScroll hook | Framer Motion 6+ | Performance optimized, motion values |

**Deprecated/outdated:**
- `@studio-freight/lenis`: Use `lenis` package
- `@studio-freight/react-lenis`: Use `lenis/react` import
- `smoothTouch: true`: Replaced by `syncTouch`, but both should be avoided
- Custom scroll position state: Use `useScroll` hook instead

## Open Questions

Things that couldn't be fully resolved:

1. **Gallery overlay scroll lock**
   - What we know: Gallery.tsx has overlay that should lock scroll
   - What's unclear: Whether existing overlay needs `data-lenis-prevent` or `lenis.stop()`
   - Recommendation: Test both approaches, prefer `data-lenis-prevent` for simplicity

2. **Header show/hide on scroll**
   - What we know: Header pattern exists but doesn't currently hide on scroll
   - What's unclear: Whether Phase 5 should add scroll-aware header behavior
   - Recommendation: Defer to Phase 5 planning, may be out of scope

3. **Back to Top button integration**
   - What we know: Home.tsx has "Back to Top" using `window.scrollTo({ behavior: 'smooth' })`
   - What's unclear: Should this use `lenis.scrollTo()` instead?
   - Recommendation: Yes, replace with `useLenis` hook for consistent behavior

## Sources

### Primary (HIGH confidence)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis) - Official documentation, configuration options
- [Lenis React README](https://github.com/darkroomengineering/lenis/blob/main/packages/react/README.md) - React integration, TypeScript types
- [Motion Scroll Animations](https://motion.dev/docs/react-scroll-animations) - whileInView, useScroll documentation
- [Motion useInView](https://motion.dev/docs/react-use-in-view) - Viewport detection hook

### Secondary (MEDIUM confidence)
- [Building Smooth Scroll in 2025 with Lenis](https://www.edoardolunardi.dev/blog/building-smooth-scroll-in-2025-with-lenis) - Best practices guide
- [Olivier Larose Parallax Tutorial](https://blog.olivierlarose.com/tutorials/smooth-parallax-scroll) - Lenis + Framer Motion patterns
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - Accessibility reference

### Tertiary (LOW confidence)
- GitHub Discussions on mobile issues - Community reports, may vary by iOS version

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official docs, npm verified, React 19 compatible
- Architecture: HIGH - Patterns from official Lenis React README
- Pitfalls: HIGH - Well documented in GitHub issues + official docs
- Mobile handling: MEDIUM - iOS behavior varies by version, but "disable on mobile" is safe

**Research date:** 2026-01-17
**Valid until:** 60 days (stable library, active maintenance)
