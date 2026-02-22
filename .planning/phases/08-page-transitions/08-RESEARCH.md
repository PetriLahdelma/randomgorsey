# Phase 8: Page Transitions - Research

**Researched:** 2026-01-17
**Domain:** Page transitions (AnimatePresence), custom cursor, kinetic typography (SplitType)
**Confidence:** HIGH

## Summary

Phase 8 implements three related features that create a cohesive page experience: choreographed page transitions with AnimatePresence, a custom cursor with desktop-only behavior, and kinetic typography using text splitting. These features build on the existing motion infrastructure from Phases 4-5.

**Key findings:**
1. AnimatePresence with `mode="wait"` and `location.pathname` key is the standard pattern for React Router page transitions
2. Custom cursors are desktop-only features requiring touch device detection via `(pointer: coarse)` media query
3. SplitType (free alternative to GSAP SplitText) splits text into characters/words/lines for staggered animations
4. The existing `pageVariants` already define `initial/enter/exit` states compatible with AnimatePresence
5. React Router v7 also offers native View Transitions API support as an alternative (experimental)

**Primary recommendation:** Wrap Routes with AnimatePresence using `mode="wait"` and `location` key, implement custom cursor as Context-based component with CSS `pointer-events: none` and `(hover: hover) and (pointer: fine)` detection, create KineticText component using SplitType + Framer Motion stagger variants.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| framer-motion | 12.23.24 | AnimatePresence, stagger | Already installed, handles exit animations |
| split-type | ^0.3.4 | Text splitting | Free, framework-agnostic, inspired by GSAP SplitText |
| react-router-dom | 7.6.1 | Location for transition keys | Already installed |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| useMotionValue | built-in | Cursor position tracking | Smooth cursor following |
| useSpring | built-in | Cursor smoothing | Elastic cursor lag effect |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| AnimatePresence | View Transitions API | Native but less control, browser support limited |
| SplitType | GSAP SplitText | More powerful but requires GSAP license for commercial |
| SplitType | Motion splitText() | Motion+ premium feature, not free |
| Custom cursor component | Motion Cursor (premium) | Premium feature, paid |
| Custom implementation | react-cursor-position | Less flexible, adds dependency |

**Installation:**
```bash
npm install split-type
```

**Note:** `split-type` is the only new dependency. Framer Motion and React Router are already installed.

## Architecture Patterns

### Recommended Project Structure
```
src/
├── lib/
│   ├── motion/
│   │   ├── config.ts          # Existing - add cursor spring preset
│   │   ├── variants.ts        # Existing - add text reveal variants
│   │   ├── AnimationProvider.tsx  # Update - add AnimatePresence wrapper
│   │   └── index.ts           # Export new components
│   └── cursor/
│       ├── CursorProvider.tsx # Cursor context + state management
│       ├── CustomCursor.tsx   # Visual cursor component
│       └── index.ts           # Public exports
├── components/
│   ├── KineticText.tsx        # SplitType wrapper component
│   └── PageTransition.tsx     # AnimatePresence route wrapper
└── App.tsx                    # Integrate PageTransition
```

### Pattern 1: AnimatePresence Page Transitions

**What:** Wrap Routes with AnimatePresence to enable exit animations when navigating between pages.

**When to use:** Always for page-level route transitions.

**Example:**
```typescript
// Source: Multiple official Motion docs and community patterns
// https://motion.dev/docs/react-animate-presence
// https://medium.com/@antonio.falcescu/animating-react-pages-with-react-router-dom-outlet-and-framer-motion-animatepresence-bd5438b3433b

import { AnimatePresence } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        {/* ... other routes */}
      </Routes>
    </AnimatePresence>
  );
}
```

**Key points:**
- `mode="wait"` ensures exiting page animates out before entering page animates in
- `key={location.pathname}` tells AnimatePresence when route changes
- `location={location}` prop on Routes prevents stale route rendering
- `onExitComplete` callback is ideal for scroll reset

### Pattern 2: Page Component with Variants

**What:** Each page uses consistent variants for enter/exit animations.

**When to use:** Every page component.

**Example:**
```typescript
// Source: Existing project pattern from variants.ts
import { motion } from 'framer-motion';
import { pageVariants } from '@/lib/motion';

const AboutPage: React.FC = () => {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* Page content */}
    </motion.main>
  );
};
```

**Note:** The existing `pageVariants` already define exit animations:
```typescript
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { type: 'spring', ...springs.page } },
  exit: { opacity: 0, y: -10, transition: { duration: durations.fast } },
};
```

### Pattern 3: Custom Cursor with Context

**What:** Global cursor state managed via Context, rendered as fixed-position element.

**When to use:** Desktop-only, disabled on touch devices.

**Example:**
```typescript
// Source: Synthesized from multiple sources
// https://medium.com/swlh/cool-custom-cursors-with-react-framer-motion-part-1-228126bcae68
// https://dev.to/damkols/how-to-create-a-custom-cursor-with-react-and-framer-motion-1i08

import { createContext, useContext, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface CursorContextType {
  cursorVariant: string;
  setCursorVariant: (variant: string) => void;
}

const CursorContext = createContext<CursorContextType | null>(null);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop via pointer media query
  useEffect(() => {
    const check = () => {
      setIsDesktop(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    };
    check();
    window.matchMedia('(hover: hover) and (pointer: fine)').addEventListener('change', check);
    return () => {
      window.matchMedia('(hover: hover) and (pointer: fine)').removeEventListener('change', check);
    };
  }, []);

  // Don't render custom cursor on touch devices
  if (!isDesktop) {
    return <>{children}</>;
  }

  return (
    <CursorContext.Provider value={{ cursorVariant, setCursorVariant }}>
      {children}
      <CustomCursor variant={cursorVariant} />
    </CursorContext.Provider>
  );
}

function CustomCursor({ variant }: { variant: string }) {
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Spring smoothing for elastic feel
  const springConfig = { stiffness: 500, damping: 28 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  const variants = {
    default: { width: 16, height: 16, backgroundColor: 'rgba(255,255,255,0.5)' },
    hover: { width: 48, height: 48, backgroundColor: 'rgba(255,255,255,0.8)' },
    text: { width: 100, height: 100, mixBlendMode: 'difference' as const },
  };

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999]"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      variants={variants}
      animate={variant}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
    />
  );
}

export const useCursor = () => {
  const context = useContext(CursorContext);
  if (!context) {
    // Return no-op for touch devices (context not available)
    return { cursorVariant: 'default', setCursorVariant: () => {} };
  }
  return context;
};
```

### Pattern 4: SplitType Kinetic Text Component

**What:** Component that splits text and animates characters/words individually.

**When to use:** Hero headings, section titles, key text elements.

**Example:**
```typescript
// Source: SplitType npm docs + Framer Motion stagger patterns
// https://github.com/lukePeavey/SplitType
// https://medium.com/@onifkay/creating-staggered-animations-with-framer-motion-0e7dc90eae33

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useInView } from 'framer-motion';
import SplitType from 'split-type';

interface KineticTextProps {
  children: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  splitBy?: 'chars' | 'words' | 'lines';
  staggerDelay?: number;
  className?: string;
  triggerOnView?: boolean;
}

export function KineticText({
  children,
  as: Tag = 'span',
  splitBy = 'chars',
  staggerDelay = 0.03,
  className,
  triggerOnView = true,
}: KineticTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [elements, setElements] = useState<HTMLElement[]>([]);
  const prefersReducedMotion = useReducedMotion();
  const isInView = useInView(containerRef, { once: true, amount: 0.5 });

  // Initialize SplitType
  useEffect(() => {
    if (!containerRef.current) return;

    const typeMap = {
      chars: 'chars',
      words: 'words',
      lines: 'lines',
    } as const;

    const split = new SplitType(containerRef.current, {
      types: typeMap[splitBy],
      tagName: 'span',
    });

    // Get split elements
    const splitElements = split[splitBy] || [];
    setElements(splitElements as HTMLElement[]);

    // Cleanup on unmount
    return () => {
      split.revert();
    };
  }, [children, splitBy]);

  // Reduced motion: just show text
  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const shouldAnimate = triggerOnView ? isInView : true;

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
    },
  };

  return (
    <motion.span
      ref={containerRef as React.RefObject<HTMLSpanElement>}
      className={className}
      variants={containerVariants}
      initial="hidden"
      animate={shouldAnimate ? 'visible' : 'hidden'}
      aria-label={children}
    >
      {/* SplitType injects elements here, we animate them via CSS */}
      <Tag>{children}</Tag>
      <style>{`
        .${splitBy === 'chars' ? 'char' : splitBy === 'words' ? 'word' : 'line'} {
          display: inline-block;
        }
      `}</style>
    </motion.span>
  );
}
```

**Alternative approach - manual splitting (no SplitType dependency):**
```typescript
// For simple use cases without SplitType
function KineticTextSimple({ children, staggerDelay = 0.03 }: { children: string; staggerDelay?: number }) {
  const words = children.split(' ');

  return (
    <motion.span
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: staggerDelay * 4 } },
      }}
    >
      {words.map((word, wordIndex) => (
        <motion.span key={wordIndex} style={{ display: 'inline-block', marginRight: '0.25em' }}>
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              style={{ display: 'inline-block' }}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </motion.span>
  );
}
```

### Anti-Patterns to Avoid

- **Wrapping Outlet with AnimatePresence directly:** AnimatePresence only tracks direct children. Use `useOutlet` hook or wrap Routes instead.
- **Forgetting `location` prop on Routes:** Causes stale route rendering during exit animations.
- **Using `mode="sync"` for pages:** Pages overlap during transition, causing visual issues.
- **Rendering custom cursor on touch devices:** Confuses users, wastes resources. Check `(pointer: coarse)`.
- **Forgetting `pointer-events: none` on cursor:** Blocks all clicks on the page.
- **Not calling `SplitType.revert()` on unmount:** Memory leak, DOM nodes accumulate.
- **Splitting long paragraphs into characters:** Performance issue. Use words or lines for body text.
- **Animating text without `aria-label`:** Screen readers read nothing while text animates.

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Page exit animations | Conditional unmount delays | AnimatePresence | Handles lifecycle, key changes, nested exits |
| Text splitting | Manual string manipulation | SplitType | Handles kerning, nested elements, line detection |
| Cursor smoothing | Manual lerp/RAF | useSpring motion value | GPU accelerated, proper frame scheduling |
| Touch detection | navigator.userAgent | `(pointer: coarse)` media query | Reliable, no user agent sniffing |
| Scroll position reset | setTimeout hacks | `onExitComplete` callback | Fires at correct time in animation lifecycle |

**Key insight:** Page transitions seem simple but have many edge cases (scroll position, nested routes, rapid navigation, reduced motion). AnimatePresence handles these; custom solutions won't.

## Common Pitfalls

### Pitfall 1: Scroll Position Issues with AnimatePresence

**What goes wrong:** Page scrolls to top before exit animation finishes, or new page starts scrolled down.

**Why it happens:** React Router changes scroll position immediately; AnimatePresence defers unmount.

**How to avoid:**
- Use `onExitComplete` callback to scroll to top AFTER exit animation
- Or give each page container `position: fixed; overflow-y: auto` for independent scroll

**Warning signs:** Pages "jump" during transitions.

### Pitfall 2: Exit Animation Not Playing

**What goes wrong:** Page instantly disappears without exit animation.

**Why it happens:** Missing `exit` variant, wrong key strategy, or AnimatePresence not wrapping the right element.

**How to avoid:**
- Ensure `exit` variant is defined on motion element
- Use `location.pathname` as key on Routes
- AnimatePresence must be direct parent of keyed children
- Check for React.Fragment wrapping (breaks AnimatePresence)

**Warning signs:** Enter animation works, exit doesn't.

### Pitfall 3: Custom Cursor Blocking Clicks

**What goes wrong:** Users can't click anything on the page.

**Why it happens:** Custom cursor element intercepts all pointer events.

**How to avoid:**
- Always set `pointer-events: none` on cursor element
- Use `z-index: 9999` to ensure cursor is on top
- Test by removing cursor and verifying clicks work

**Warning signs:** Page appears frozen, no hover states work.

### Pitfall 4: SplitType Memory Leaks

**What goes wrong:** Performance degrades over time, memory usage grows.

**Why it happens:** SplitType creates DOM nodes; not calling `revert()` leaves them orphaned.

**How to avoid:**
- Always call `split.revert()` in useEffect cleanup
- Store SplitType instance in ref for cleanup access
- Don't re-split on every render; memoize or use key

**Warning signs:** Memory grows on navigation, React DevTools shows increasing component count.

### Pitfall 5: Kinetic Text Accessibility

**What goes wrong:** Screen readers announce nothing or read characters individually.

**Why it happens:** Split text creates many elements, breaks natural text flow.

**How to avoid:**
- Add `aria-label={originalText}` on container
- Hide split elements from screen readers with `aria-hidden="true"`
- Test with VoiceOver/NVDA

**Warning signs:** Accessibility audit failures, user complaints.

### Pitfall 6: Reduced Motion Ignored

**What goes wrong:** Users with vestibular disorders experience motion sickness.

**Why it happens:** Custom animations bypass MotionConfig's reduced motion handling.

**How to avoid:**
- Check `useReducedMotion()` in all custom animation components
- For kinetic text: show static text immediately
- For cursor: consider using default cursor or subtle version

**Warning signs:** Animation plays despite system reduced motion setting.

## Code Examples

Verified patterns from official sources:

### Complete Page Transition Setup

```typescript
// src/App.tsx - Integration
// Source: Synthesized from multiple patterns

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AnimationProvider } from '@/lib/motion';
import { CursorProvider } from '@/lib/cursor';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence
      mode="wait"
      onExitComplete={() => {
        // Scroll to top after exit animation completes
        window.scrollTo(0, 0);
      }}
    >
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/listen" element={<Listen />} />
        <Route path="/discography" element={<Discography />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <AnimationProvider>
      <CursorProvider>
        <BrowserRouter>
          <Header />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
        </BrowserRouter>
      </CursorProvider>
    </AnimationProvider>
  );
}
```

### Cursor Variants for Different Elements

```typescript
// Using cursor context in components
// Source: Community patterns

import { useCursor } from '@/lib/cursor';

function InteractiveCard({ children }: { children: React.ReactNode }) {
  const { setCursorVariant } = useCursor();

  return (
    <div
      onMouseEnter={() => setCursorVariant('hover')}
      onMouseLeave={() => setCursorVariant('default')}
    >
      {children}
    </div>
  );
}

function HeroHeading({ children }: { children: string }) {
  const { setCursorVariant } = useCursor();

  return (
    <h1
      onMouseEnter={() => setCursorVariant('text')}
      onMouseLeave={() => setCursorVariant('default')}
    >
      <KineticText splitBy="chars" staggerDelay={0.02}>
        {children}
      </KineticText>
    </h1>
  );
}
```

### CSS for Custom Cursor

```css
/* Hide default cursor globally when custom cursor is active */
/* Only on desktop with fine pointer */
@media (hover: hover) and (pointer: fine) {
  body.custom-cursor-active {
    cursor: none;
  }

  body.custom-cursor-active a,
  body.custom-cursor-active button,
  body.custom-cursor-active [role="button"] {
    cursor: none;
  }
}

/* Touch device fallback - do nothing, use native cursor */
@media (hover: none), (pointer: coarse) {
  .custom-cursor {
    display: none !important;
  }
}
```

### SplitType CSS Requirement

```css
/* Required: Prevent character misalignment */
/* Source: https://github.com/lukePeavey/SplitType */
.kinetic-text {
  font-kerning: none;
}

/* Split element display */
.kinetic-text .char,
.kinetic-text .word,
.kinetic-text .line {
  display: inline-block;
}

/* Preserve whitespace between words */
.kinetic-text .word {
  white-space: nowrap;
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| exitBeforeEnter prop | mode="wait" | Framer Motion 7 | New API, clearer naming |
| Custom exit timing | AnimatePresence lifecycle | Always | Automatic unmount delay |
| Device detection for cursor | pointer media query | CSS Level 4 | No JS sniffing needed |
| GSAP SplitText | SplitType (free) | 2022+ | No license required |
| Manual text spans | SplitType library | 2022+ | Handles edge cases |
| CSS View Transitions | React Router viewTransition | 2024+ | Native alternative, less control |

**Deprecated/outdated:**
- `exitBeforeEnter` prop: Use `mode="wait"` instead
- `presenceAffectsLayout` prop: Removed in Motion 11
- User agent sniffing for touch: Use `(pointer: coarse)` media query
- `@studio-freight/split-type`: Use `split-type` package

## Open Questions

Things that couldn't be fully resolved:

1. **Scroll Restoration Strategy**
   - What we know: AnimatePresence defers unmount, scroll can be tricky
   - What's unclear: Whether to use `onExitComplete` or CSS-based isolated scroll
   - Recommendation: Start with `onExitComplete`, switch to isolated scroll if issues arise

2. **Cursor Performance on Lower-End Devices**
   - What we know: useSpring uses RAF, should be GPU accelerated
   - What's unclear: Performance on tier 1-2 devices from PerformanceProvider
   - Recommendation: Consider disabling custom cursor for tier 0-1 devices

3. **SplitType and Responsive Text**
   - What we know: Line splits don't reflow on resize
   - What's unclear: Whether to re-split on resize or avoid line splitting
   - Recommendation: Use character/word splitting for headings, avoid line splitting for responsive content

4. **React Router v7 View Transitions Alternative**
   - What we know: React Router v7 has native View Transitions API support
   - What's unclear: Whether to use native API instead of AnimatePresence
   - Recommendation: Stick with AnimatePresence for more control; View Transitions API is newer and browser support varies

## Sources

### Primary (HIGH confidence)
- [Motion AnimatePresence](https://motion.dev/docs/react-animate-presence) - Official docs for exit animations, mode prop
- [SplitType GitHub](https://github.com/lukePeavey/SplitType) - Official documentation, API reference
- [React Router View Transitions](https://reactrouter.com/how-to/view-transitions) - Native alternative documentation
- [Motion stagger](https://www.framer.com/motion/stagger/) - Official stagger documentation

### Secondary (MEDIUM confidence)
- [Medium: AnimatePresence with React Router](https://medium.com/@antonio.falcescu/animating-react-pages-with-react-router-dom-outlet-and-framer-motion-animatepresence-bd5438b3433b) - Integration patterns
- [Medium: Custom Cursors with Framer Motion](https://medium.com/swlh/cool-custom-cursors-with-react-framer-motion-part-1-228126bcae68) - Cursor implementation patterns
- [DEV.to: Touch Device Detection](https://dev.to/cooty/a-new-way-to-test-for-touch-devices-without-javascript-enter-the-pointer-media-query-2kok) - Pointer media query patterns
- [Smashing Magazine: Hover and Pointer Media Queries](https://www.smashingmagazine.com/2022/03/guide-hover-pointer-media-queries/) - Comprehensive guide
- [Medium: Staggered Animations (Nov 2025)](https://medium.com/@onifkay/creating-staggered-animations-with-framer-motion-0e7dc90eae33) - Recent stagger patterns

### Tertiary (LOW confidence)
- [Frontend.fyi: Staggered Text Animations](https://www.frontend.fyi/tutorials/staggered-text-animations-with-framer-motion) - Tutorial patterns
- [Medium: Understanding AnimatePresence](https://medium.com/javascript-decoded-in-plain-english/understanding-animatepresence-in-framer-motion-attributes-usage-and-a-common-bug-914538b9f1d3) - Bug patterns and solutions

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - AnimatePresence and SplitType are well-documented, established patterns
- Architecture: HIGH - Patterns from official docs and verified community implementations
- Pitfalls: HIGH - Well-documented issues in GitHub issues and tutorials
- Cursor implementation: MEDIUM - Many approaches exist, synthesized best practices

**Research date:** 2026-01-17
**Valid until:** 60 days (Framer Motion stable, SplitType stable)
