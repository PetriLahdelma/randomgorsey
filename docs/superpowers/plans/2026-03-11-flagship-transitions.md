# Flagship Transitions & Choreography Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the page transition system (signal disruption effect) and scroll-driven choreography that makes navigating the site feel like tuning through a live broadcast signal.

**Architecture:** A `TransitionOrchestrator` intercepts all internal navigation via `TransitionLink` components. Exit animations use CSS `clip-path` to tear the DOM into horizontal bands (WAAPI for 60fps), while the SignalBus `u_transition` uniform drives a shader spike during the "raw signal" phase. Scroll choreography uses Lenis + Framer Motion `useInView` for staggered content entrances matching the signal vocabulary (scan-line reveals, alternating slides, character staggers). No `animation-timeline: scroll()` — Lenis is the single scroll source.

**Tech Stack:** TypeScript, Framer Motion (WAAPI, useInView, frame scheduler), CSS clip-path, Lenis, Next.js App Router, SignalBus (from Plan 1)

**Spec:** `docs/superpowers/specs/2026-03-11-flagship-generative-design.md` (Sections 2, 3)

**Plan series:** This is Plan 2 of 3. Plan 1 built SignalBus + ShaderCanvas. Plan 3 covers craft & polish.

**Depends on:** Plan 1 (SignalBus, ShaderCanvas, useSignal, getSignalBus, page-intensity) must be complete.

---

## Chunk 1: TransitionLink & Orchestrator

The navigation interception layer. `TransitionLink` wraps all internal `<Link>` elements. `TransitionOrchestrator` coordinates the 5-phase exit/enter sequence.

### Task 1: TransitionLink Component

`TransitionLink` prevents default navigation, triggers the exit animation, then calls `router.push()` after the tear phase. It replaces direct `<Link>` usage throughout the site.

**Files:**
- Create: `src/lib/transition/TransitionContext.tsx`
- Create: `src/lib/transition/TransitionLink.tsx`
- Create: `src/lib/transition/__tests__/TransitionLink.test.tsx`

- [ ] **Step 1: Create TransitionContext**

This context lets any component trigger a transition and check if one is in progress. The orchestrator provides the implementation; consumers just call `navigate()`.

```typescript
// src/lib/transition/TransitionContext.tsx
"use client";

import { createContext, useContext } from "react";

interface TransitionContextValue {
  /** Trigger a navigating transition to the given path */
  navigate: (href: string) => void;
  /** Whether a transition is currently playing */
  isTransitioning: boolean;
}

export const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
  isTransitioning: false,
});

export function usePageTransition() {
  return useContext(TransitionContext);
}
```

- [ ] **Step 2: Write failing tests for TransitionLink**

```typescript
// src/lib/transition/__tests__/TransitionLink.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TransitionLink } from "../TransitionLink";
import { TransitionContext } from "../TransitionContext";

function renderWithContext(
  ui: React.ReactElement,
  navigate = vi.fn(),
  isTransitioning = false
) {
  return render(
    <TransitionContext.Provider value={{ navigate, isTransitioning }}>
      {ui}
    </TransitionContext.Provider>
  );
}

describe("TransitionLink", () => {
  it("renders as an anchor with href", () => {
    renderWithContext(<TransitionLink href="/gallery">Gallery</TransitionLink>);
    const link = screen.getByRole("link", { name: "Gallery" });
    expect(link).toHaveAttribute("href", "/gallery");
  });

  it("calls navigate on click and prevents default", () => {
    const navigate = vi.fn();
    renderWithContext(
      <TransitionLink href="/about">About</TransitionLink>,
      navigate
    );
    const link = screen.getByRole("link", { name: "About" });
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    Object.defineProperty(event, "metaKey", { value: false });
    Object.defineProperty(event, "ctrlKey", { value: false });
    fireEvent(link, event);
    expect(navigate).toHaveBeenCalledWith("/about");
  });

  it("does NOT intercept meta+click (new tab)", () => {
    const navigate = vi.fn();
    renderWithContext(
      <TransitionLink href="/about">About</TransitionLink>,
      navigate
    );
    const link = screen.getByRole("link", { name: "About" });
    fireEvent.click(link, { metaKey: true });
    expect(navigate).not.toHaveBeenCalled();
  });

  it("does NOT intercept ctrl+click (new tab)", () => {
    const navigate = vi.fn();
    renderWithContext(
      <TransitionLink href="/about">About</TransitionLink>,
      navigate
    );
    const link = screen.getByRole("link", { name: "About" });
    fireEvent.click(link, { ctrlKey: true });
    expect(navigate).not.toHaveBeenCalled();
  });

  it("does NOT navigate when already transitioning", () => {
    const navigate = vi.fn();
    renderWithContext(
      <TransitionLink href="/about">About</TransitionLink>,
      navigate,
      true
    );
    fireEvent.click(screen.getByRole("link", { name: "About" }));
    expect(navigate).not.toHaveBeenCalled();
  });

  it("passes className and title to anchor", () => {
    renderWithContext(
      <TransitionLink href="/about" className="nav-link" title="About page">
        About
      </TransitionLink>
    );
    const link = screen.getByRole("link", { name: "About" });
    expect(link).toHaveClass("nav-link");
    expect(link).toHaveAttribute("title", "About page");
  });

  it("falls through for external URLs", () => {
    const navigate = vi.fn();
    renderWithContext(
      <TransitionLink href="https://example.com">External</TransitionLink>,
      navigate
    );
    fireEvent.click(screen.getByRole("link", { name: "External" }));
    expect(navigate).not.toHaveBeenCalled();
  });

  it("falls through for anchor links (same page)", () => {
    const navigate = vi.fn();
    renderWithContext(
      <TransitionLink href="#section">Jump</TransitionLink>,
      navigate
    );
    fireEvent.click(screen.getByRole("link", { name: "Jump" }));
    expect(navigate).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run src/lib/transition/__tests__/TransitionLink.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 4: Implement TransitionLink**

```typescript
// src/lib/transition/TransitionLink.tsx
"use client";

import Link from "next/link";
import { useCallback } from "react";
import { usePageTransition } from "./TransitionContext";

interface TransitionLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
}

function isInternalPath(href: string): boolean {
  if (href.startsWith("#")) return false;
  if (href.startsWith("http://") || href.startsWith("https://")) return false;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;
  return true;
}

/**
 * Drop-in replacement for Next.js Link that triggers the transition system.
 *
 * Behavior:
 * - Internal paths: intercepts click, triggers exit animation, then navigates
 * - External URLs, anchor links, meta/ctrl+click: falls through to default
 * - During active transition: ignores clicks (prevents double-navigation)
 */
export function TransitionLink({
  href,
  children,
  className,
  title,
  onClick,
}: TransitionLinkProps) {
  const { navigate, isTransitioning } = usePageTransition();

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      // Let browser handle modifier clicks (new tab)
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      // Don't intercept external URLs or anchors
      if (!isInternalPath(href)) return;
      // Block during active transition
      if (isTransitioning) {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      onClick?.();
      navigate(href);
    },
    [href, navigate, isTransitioning, onClick]
  );

  return (
    <Link href={href} className={className} title={title} onClick={handleClick}>
      {children}
    </Link>
  );
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/lib/transition/__tests__/TransitionLink.test.tsx`
Expected: All 7 tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/transition/TransitionContext.tsx src/lib/transition/TransitionLink.tsx src/lib/transition/__tests__/TransitionLink.test.tsx
git commit -m "feat(transition): add TransitionLink with navigation interception"
```

---

### Task 2: DOM Tear Animation

The visual effect of tearing the page into horizontal bands that slide offscreen. Uses CSS `clip-path` for slicing and WAAPI for 60fps animation — no layout thrashing.

**Files:**
- Create: `src/lib/transition/DOMTear.ts`
- Create: `src/lib/transition/__tests__/DOMTear.test.ts`

- [ ] **Step 1: Write failing tests for DOMTear**

```typescript
// src/lib/transition/__tests__/DOMTear.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { computeBands, type TearBand } from "../DOMTear";

describe("computeBands", () => {
  it("divides viewport into specified number of bands", () => {
    const bands = computeBands(800, 8);
    expect(bands).toHaveLength(8);
  });

  it("bands cover entire viewport height without gaps", () => {
    const bands = computeBands(1000, 10);
    expect(bands[0].top).toBe(0);
    expect(bands[bands.length - 1].bottom).toBe(1000);
    for (let i = 1; i < bands.length; i++) {
      expect(bands[i].top).toBe(bands[i - 1].bottom);
    }
  });

  it("alternates direction (odd left, even right)", () => {
    const bands = computeBands(800, 8);
    bands.forEach((band, i) => {
      expect(band.direction).toBe(i % 2 === 0 ? "left" : "right");
    });
  });

  it("uses default 8 bands when count not specified", () => {
    const bands = computeBands(800);
    expect(bands).toHaveLength(8);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/transition/__tests__/DOMTear.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement DOMTear**

```typescript
// src/lib/transition/DOMTear.ts

export interface TearBand {
  index: number;
  top: number;      // px from viewport top
  bottom: number;   // px from viewport top
  direction: "left" | "right";
}

/**
 * Compute horizontal band positions for the DOM tear effect.
 * Bands divide the viewport into equal-height slices with
 * alternating slide directions (even: left, odd: right).
 */
export function computeBands(
  viewportHeight: number,
  count = 8
): TearBand[] {
  const bandHeight = viewportHeight / count;
  return Array.from({ length: count }, (_, i) => ({
    index: i,
    top: Math.round(bandHeight * i),
    bottom: Math.round(bandHeight * (i + 1)),
    direction: (i % 2 === 0 ? "left" : "right") as "left" | "right",
  }));
}

/**
 * Apply clip-path bands to a container element and animate them offscreen.
 * Returns a promise that resolves when all bands have exited.
 *
 * The element must have `overflow: hidden` and known dimensions.
 * Each band is a child div with clip-path slicing + WAAPI translateX.
 */
export function tearExit(
  container: HTMLElement,
  options: { duration?: number; stagger?: number; bandCount?: number } = {}
): Promise<void> {
  const { duration = 100, stagger = 15, bandCount = 8 } = options;
  const height = container.offsetHeight;
  const bands = computeBands(height, bandCount);

  // Create band overlays via clip-path
  const animations: Animation[] = [];
  const children = Array.from(container.children) as HTMLElement[];

  // Wrap content in a clipping container per band
  // Instead of restructuring DOM, we create overlay clones
  // Actually: we animate the container itself using clip-path on cloned layers
  // Simplest correct approach: animate container's child wrapper with per-band clip-path

  // We'll use a single overlay approach:
  // 1. Screenshot the container content via its current state
  // 2. Create band divs with clip-path over it
  // For now, we animate the container itself:

  // Approach: We don't clone. We create N absolutely-positioned copies of
  // the content area, each with a different clip-path, and animate them.
  // But cloning heavy DOM is expensive.

  // Better approach: Apply bands as CSS clip-path slices to the SAME element
  // by layering pseudo-elements. But WAAPI can't target pseudos easily.

  // Simplest performant approach: overlay N transparent divs that clip a
  // snapshot. We'll use `will-change: transform` on the container and
  // actually just use the container directly with sequential clip-path
  // animations. Since WAAPI supports clip-path animation in modern browsers:

  return new Promise<void>((resolve) => {
    // Clone the container's content so each band has visible content to slide.
    // The original container is hidden; the clone overlay shows the bands sliding offscreen.
    const clone = container.cloneNode(true) as HTMLElement;

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 4;
      pointer-events: none;
      overflow: hidden;
    `;

    bands.forEach((band, i) => {
      // Each strip is a full clone of the content, clipped to its band region.
      // This means N clones, but they're purely visual (no event listeners).
      const strip = clone.cloneNode(true) as HTMLElement;
      const topPct = (band.top / height) * 100;
      const bottomPct = (band.bottom / height) * 100;

      strip.style.cssText = `
        position: absolute;
        inset: 0;
        clip-path: inset(${topPct}% 0 ${100 - bottomPct}% 0);
        will-change: transform;
        pointer-events: none;
      `;

      wrapper.appendChild(strip);

      // Vary speed per band — faster bands at edges, slower in middle
      const speedFactor = 0.7 + Math.abs(i - bandCount / 2) / bandCount * 0.6;
      const xTarget = band.direction === "left" ? "-110%" : "110%";
      const delay = i * stagger;

      const anim = strip.animate(
        [
          { transform: "translateX(0)" },
          { transform: `translateX(${xTarget})` },
        ],
        {
          duration: duration * speedFactor,
          delay,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }
      );
      animations.push(anim);
    });

    // Hide original content, show the band overlay
    container.style.position = "relative";
    const prevVisibility = container.style.visibility;
    container.style.visibility = "hidden";
    container.appendChild(wrapper);

    // Resolve when last animation finishes
    const lastAnim = animations[animations.length - 1];
    if (lastAnim) {
      lastAnim.onfinish = () => {
        wrapper.remove();
        container.style.visibility = prevVisibility;
        resolve();
      };
    } else {
      container.style.visibility = prevVisibility;
      resolve();
    }
  });
}

/**
 * Assemble animation — new page content slides in from alternating directions.
 * Mirror of tearExit but in reverse: bands slide IN to final position.
 */
export function tearEnter(
  container: HTMLElement,
  options: { duration?: number; stagger?: number; bandCount?: number } = {}
): Promise<void> {
  const { duration = 140, stagger = 20, bandCount = 8 } = options;
  const height = container.offsetHeight;
  const bands = computeBands(height, bandCount);

  return new Promise<void>((resolve) => {
    // Clone the new content for band assembly
    const clone = container.cloneNode(true) as HTMLElement;

    const wrapper = document.createElement("div");
    wrapper.style.cssText = `
      position: absolute;
      inset: 0;
      z-index: 4;
      pointer-events: none;
      overflow: hidden;
    `;

    const animations: Animation[] = [];

    bands.forEach((band, i) => {
      const strip = clone.cloneNode(true) as HTMLElement;
      const topPct = (band.top / height) * 100;
      const bottomPct = (band.bottom / height) * 100;

      strip.style.cssText = `
        position: absolute;
        inset: 0;
        clip-path: inset(${topPct}% 0 ${100 - bottomPct}% 0);
        will-change: transform;
        pointer-events: none;
      `;

      wrapper.appendChild(strip);

      const speedFactor = 0.7 + Math.abs(i - bandCount / 2) / bandCount * 0.6;
      const xStart = band.direction === "left" ? "-110%" : "110%";
      const delay = i * stagger;

      const anim = strip.animate(
        [
          { transform: `translateX(${xStart})` },
          { transform: "translateX(0)" },
        ],
        {
          duration: duration * speedFactor,
          delay,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          fill: "forwards",
        }
      );
      animations.push(anim);
    });

    // Hide original while bands assemble, then reveal
    container.style.position = "relative";
    const prevVisibility = container.style.visibility;
    container.style.visibility = "hidden";
    container.appendChild(wrapper);

    const lastAnim = animations[animations.length - 1];
    if (lastAnim) {
      lastAnim.onfinish = () => {
        wrapper.remove();
        container.style.visibility = prevVisibility;
        resolve();
      };
    } else {
      container.style.visibility = prevVisibility;
      resolve();
    }
  });
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/transition/__tests__/DOMTear.test.ts`
Expected: All 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/transition/DOMTear.ts src/lib/transition/__tests__/DOMTear.test.ts
git commit -m "feat(transition): add DOM tear band computation and WAAPI animations"
```

---

### Task 3: TransitionOrchestrator

Coordinates the full 5-phase transition sequence. Lives in AppShell, provides TransitionContext to the tree.

**Files:**
- Create: `src/lib/transition/TransitionOrchestrator.tsx`
- Create: `src/lib/transition/index.ts`
- Modify: `src/components/AppShell.tsx`

- [ ] **Step 1: Implement TransitionOrchestrator**

```typescript
// src/lib/transition/TransitionOrchestrator.tsx
"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePerformance } from "@/lib/performance";
import { getSignalBus } from "@/lib/signal";
import { tearExit, tearEnter } from "./DOMTear";
import { TransitionContext } from "./TransitionContext";

interface TransitionOrchestratorProps {
  children: React.ReactNode;
  /** Ref to the main content container for DOM tear effects */
  contentRef: React.RefObject<HTMLElement | null>;
}

/**
 * Five-phase transition sequence (~600ms total):
 * 1. Destabilize (0-120ms): noise overlay ramps, shader turbulence spikes
 * 2. Tear (120-220ms): DOM bands slide offscreen
 * 3. Raw Signal (220-340ms): shader at full intensity, no content visible
 * 4. Assemble (340-480ms): new content slides in from alternating directions
 * 5. Lock (480-600ms): content snaps to final position, shader calms
 *
 * Degradation:
 * - Tier 3: Full 5-phase sequence
 * - Tier 2: Opacity crossfade + shader spike (no DOM tear)
 * - Tier 1: Simple 200ms crossfade
 * - Tier 0: Instant cut
 */
export function TransitionOrchestrator({
  children,
  contentRef,
}: TransitionOrchestratorProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { tier, isReducedMotion } = usePerformance();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const bus = getSignalBus();
  const transitionRef = useRef(false);

  // Announce navigation to screen readers
  const announceRef = useRef<HTMLDivElement>(null);
  const announce = useCallback((pageName: string) => {
    if (announceRef.current) {
      announceRef.current.textContent = `Navigating to ${pageName}`;
    }
  }, []);

  const navigate = useCallback(
    async (href: string) => {
      // Don't navigate to the current page
      if (href === pathname) return;
      // Prevent concurrent transitions
      if (transitionRef.current) return;
      transitionRef.current = true;
      setIsTransitioning(true);

      const pageName = href === "/" ? "home" : href.replace("/", "");
      announce(pageName);

      // Tier 0 or reduced motion: instant navigation
      if (tier === 0 || isReducedMotion) {
        router.push(href);
        transitionRef.current = false;
        setIsTransitioning(false);
        return;
      }

      // Tier 1: simple crossfade
      if (tier === 1) {
        const content = contentRef.current;
        if (content) {
          content.style.transition = "opacity 200ms ease-out";
          content.style.opacity = "0";
          await new Promise((r) => setTimeout(r, 200));
        }
        router.push(href);
        // Fade in after a frame
        requestAnimationFrame(() => {
          if (content) {
            content.style.opacity = "1";
          }
          transitionRef.current = false;
          setIsTransitioning(false);
        });
        return;
      }

      // Tier 2: opacity crossfade + shader spike (no DOM tear)
      if (tier === 2) {
        const content = contentRef.current;
        // Phase 1: fade out + shader spike
        bus.setTransition(0.8);
        if (content) {
          content.style.transition = "opacity 150ms ease-out";
          content.style.opacity = "0";
        }
        await new Promise((r) => setTimeout(r, 200));
        // Navigate
        router.push(href);
        // Phase 2: fade in + shader calm
        await new Promise((r) => setTimeout(r, 100));
        if (content) {
          content.style.transition = "opacity 200ms ease-out";
          content.style.opacity = "1";
        }
        // Ease transition uniform back to 0
        const fadeSteps = 10;
        for (let i = fadeSteps; i >= 0; i--) {
          bus.setTransition((i / fadeSteps) * 0.8);
          await new Promise((r) => setTimeout(r, 30));
        }
        transitionRef.current = false;
        setIsTransitioning(false);
        return;
      }

      // Tier 3: Full 5-phase sequence
      const content = contentRef.current;

      // Phase 1: Destabilize (0-120ms)
      bus.setTransition(0.3);
      if (content) {
        content.style.transition = "none";
        // Add noise overlay ramp via CSS class
        content.classList.add("signal-destabilize");
      }
      await new Promise((r) => setTimeout(r, 120));

      // Phase 2: Tear (120-220ms)
      bus.setTransition(0.7);
      if (content) {
        await tearExit(content, { duration: 80, stagger: 12, bandCount: 8 });
      }

      // Phase 3: Raw Signal (220-340ms, extends up to +200ms if new page hasn't mounted)
      bus.setTransition(1.0);
      if (content) {
        content.style.opacity = "0";
        content.classList.remove("signal-destabilize");
      }
      // Navigate during raw signal — DOM swap masked by shader
      router.push(href);
      // Wait base 120ms, then check if content has new children (page mounted).
      // If not, extend up to 200ms more. 800ms absolute ceiling from transition start.
      const rawSignalStart = performance.now();
      await new Promise((r) => setTimeout(r, 120));
      // Extension: wait for mount signal (simple heuristic — check if content has children)
      const waitForMount = () =>
        new Promise<void>((r) => {
          const check = () => {
            const elapsed = performance.now() - rawSignalStart;
            if (elapsed > 320 || (content && content.children.length > 0)) {
              r();
            } else {
              setTimeout(check, 16);
            }
          };
          check();
        });
      await waitForMount();

      // Phase 4: Assemble (340-480ms)
      bus.setTransition(0.6);
      if (content) {
        content.style.opacity = "1";
        await tearEnter(content, {
          duration: 120,
          stagger: 18,
          bandCount: 8,
        });
      }

      // Phase 5: Lock (480-600ms)
      // Micro-glitch: single frame jitter
      if (content) {
        content.style.transform = "translateX(1px)";
        await new Promise((r) => setTimeout(r, 16));
        content.style.transform = "";
      }
      // Ease shader back to ambient
      const fadeSteps = 8;
      for (let i = fadeSteps; i >= 0; i--) {
        bus.setTransition((i / fadeSteps) * 0.3);
        await new Promise((r) => setTimeout(r, 15));
      }
      bus.setTransition(0);

      transitionRef.current = false;
      setIsTransitioning(false);
    },
    [pathname, tier, isReducedMotion, router, bus, contentRef, announce]
  );

  return (
    <TransitionContext.Provider value={{ navigate, isTransitioning }}>
      {/* Screen reader announcement for navigation */}
      <div
        ref={announceRef}
        role="status"
        aria-live="polite"
        className="sr-only"
      />
      {children}
    </TransitionContext.Provider>
  );
}
```

- [ ] **Step 2: Create barrel export**

```typescript
// src/lib/transition/index.ts
export { TransitionContext, usePageTransition } from "./TransitionContext";
export { TransitionLink } from "./TransitionLink";
export { TransitionOrchestrator } from "./TransitionOrchestrator";
export { computeBands, tearExit, tearEnter } from "./DOMTear";
export type { TearBand } from "./DOMTear";
```

- [ ] **Step 3: Wire TransitionOrchestrator into AppShell**

Modify `src/components/AppShell.tsx`:

1. Add import: `import { TransitionOrchestrator } from "@/lib/transition";`
2. Add a ref for the content container: `const contentRef = React.useRef<HTMLDivElement>(null);`
3. Wrap children with `TransitionOrchestrator` inside `AnimationProvider`
4. Add `ref={contentRef}` to the main content div

The AppShell structure becomes:

```typescript
// src/components/AppShell.tsx — updated structure
<AnimationProvider>
  <TransitionOrchestrator contentRef={contentRef}>
    <AppShellContext.Provider value={value}>
      {/* Shader canvas */}
      {!shaderFailed && (
        <ShaderCanvas
          onReady={() => setShaderReady(true)}
          onFallback={() => setShaderFailed(true)}
        />
      )}

      <div
        ref={contentRef}
        className={cn("flex min-h-screen flex-col text-center", "relative z-10")}
      >
        <Header />
        <main className="pt-16">{children}</main>
        {!isOverlayActive && <Footer />}
        <CookieConsent />
      </div>
    </AppShellContext.Provider>
  </TransitionOrchestrator>
</AnimationProvider>
```

- [ ] **Step 4: Add destabilize CSS class to globals.css**

Add to `src/styles/globals.css`:

```css
/* Transition destabilize phase — noise overlay ramps up */
.signal-destabilize {
  animation: signal-shake 120ms steps(4) forwards;
}

@keyframes signal-shake {
  0% { transform: translateX(0); filter: none; }
  25% { transform: translateX(-3px); filter: brightness(1.05); }
  50% { transform: translateX(5px); filter: brightness(0.95); }
  75% { transform: translateX(-2px); filter: brightness(1.1); }
  100% { transform: translateX(0); filter: brightness(1); }
}
```

- [ ] **Step 5: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Transition system is wired but no links use TransitionLink yet.

- [ ] **Step 6: Commit**

```bash
git add src/lib/transition/TransitionOrchestrator.tsx src/lib/transition/index.ts src/components/AppShell.tsx src/styles/globals.css
git commit -m "feat(transition): add TransitionOrchestrator with 5-phase sequence and tier degradation"
```

---

### Task 4: Migrate Navigation to TransitionLink

Replace all internal `<Link>` and `<GlitchLink>` usage with `<TransitionLink>` wrapped in `<GlitchLink>`.

**Files:**
- Modify: `src/components/GlitchLink.tsx`
- Modify: `src/patterns/Header.tsx`
- Modify: `src/components/PixelLogo.tsx`

- [ ] **Step 1: Update GlitchLink to use TransitionLink**

Replace the `Link` import in `src/components/GlitchLink.tsx` with `TransitionLink`:

```typescript
// src/components/GlitchLink.tsx — change import
// OLD:
// import Link from "next/link";
// NEW:
import { TransitionLink } from "@/lib/transition";

// Replace <Link> with <TransitionLink> in the return JSX:
// OLD: <Link href={href} className={...} title={title} onClick={onClick} ...>
// NEW: <TransitionLink href={href} className={...} title={title} onClick={onClick}>
```

- [ ] **Step 2: Update PixelLogo to use TransitionLink**

Replace the `Link` import in `src/components/PixelLogo.tsx`:

```typescript
// src/components/PixelLogo.tsx — change import
// OLD:
// import Link from "next/link";
// NEW:
import { TransitionLink } from "@/lib/transition";

// Replace <Link href="/" ...> with <TransitionLink href="/" ...>
```

- [ ] **Step 3: Check for any remaining direct Link usage in navigation**

Run: `grep -rn "from 'next/link'" src/patterns/ src/components/GlitchLink.tsx src/components/PixelLogo.tsx --include="*.tsx"`

There should be no remaining direct `next/link` imports in navigation components. Page components (like PostCard) that use Link for non-navigation purposes (e.g., external links) can keep their direct imports.

- [ ] **Step 4: Handle popstate (browser back/forward)**

Add a `popstate` listener to `TransitionOrchestrator.tsx` for browser back/forward. These can't be intercepted, so play a condensed 300ms transition:

Add inside the `TransitionOrchestrator` component, after the existing hooks:

```typescript
// Condensed transition for browser back/forward
useEffect(() => {
  const handlePopState = () => {
    if (tier <= 1 || isReducedMotion) return;

    // Can't prevent popstate — play condensed raw signal → assemble → lock
    setIsTransitioning(true);
    transitionRef.current = true;

    // Raw signal flash
    bus.setTransition(0.8);
    setTimeout(() => {
      bus.setTransition(0.4);
      // Assemble
      const content = contentRef.current;
      if (content && tier >= 3) {
        tearEnter(content, { duration: 100, stagger: 12, bandCount: 6 });
      }
      setTimeout(() => {
        bus.setTransition(0);
        transitionRef.current = false;
        setIsTransitioning(false);
      }, 180);
    }, 120);
  };

  window.addEventListener("popstate", handlePopState);
  return () => window.removeEventListener("popstate", handlePopState);
}, [tier, isReducedMotion, bus, contentRef]);
```

- [ ] **Step 5: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Navigating between pages now triggers the transition system.

- [ ] **Step 6: Manual verification**

Run: `npx next dev -p 3002`

Verify:
1. Clicking a nav link triggers the shader spike (visible turbulence increase)
2. On tier 3 devices, DOM tear bands slide offscreen during exit
3. New page assembles from alternating directions
4. Browser back button triggers the condensed transition
5. Meta+click still opens new tab (no interception)
6. Screen reader announces "Navigating to [page name]"
7. No console errors

- [ ] **Step 7: Commit**

```bash
git add src/components/GlitchLink.tsx src/components/PixelLogo.tsx src/lib/transition/TransitionOrchestrator.tsx
git commit -m "feat(transition): migrate navigation to TransitionLink with popstate handling"
```

---

## Chunk 2: Scroll Choreography

Scroll-driven entrance animations for all content types. Uses Lenis scroll events + Framer Motion `useInView` as the single code path (no `animation-timeline: scroll()`).

### Task 5: Scroll Entrance Variants

Create reusable Framer Motion variants for each content type's entrance animation, as defined in Spec Section 3.

**Files:**
- Create: `src/lib/motion/scroll-variants.ts`

- [ ] **Step 1: Create scroll entrance variants**

```typescript
// src/lib/motion/scroll-variants.ts

import { type Variants } from "framer-motion";
import { eases, durations } from "./config";

/**
 * Post card entrance: alternating horizontal slide-in.
 * Usage: Apply odd/even via the `custom` prop (0 = left, 1 = right).
 */
export const postCardVariants: Variants = {
  hidden: (isOdd: boolean) => ({
    opacity: 0,
    x: isOdd ? 40 : -40,
    filter: "brightness(1.3) contrast(1.2)",
  }),
  visible: {
    opacity: 1,
    x: 0,
    filter: "brightness(1) contrast(1)",
    transition: {
      duration: durations.slow,
      ease: eases.default,
    },
  },
};

/**
 * Post card internal stagger: category → title → body.
 */
export const postCardStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const postCardChild: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.fast,
      ease: eases.default,
    },
  },
};

/**
 * Gallery image entrance: scan-line reveal.
 * Image clips from top to bottom with a bright edge at the clip boundary.
 * The clip-path animation can't use Framer Motion variants directly,
 * so this provides the wrapper animation + a CSS class for the clip.
 */
export const galleryRevealVariants: Variants = {
  hidden: {
    clipPath: "inset(0 0 100% 0)",
    opacity: 1,
  },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: eases.default,
    },
  },
};

/**
 * Audio/embed entrance: border box draws itself clockwise.
 * We animate a pseudo-border using clip-path or border-image.
 * Since this needs staged border drawing, we use a wrapper approach.
 */
export const embedBorderVariants: Variants = {
  hidden: {
    opacity: 0,
    clipPath: "inset(0 100% 100% 0)",
  },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0% 0% 0)",
    transition: {
      duration: 0.5,
      ease: eases.default,
    },
  },
};

/**
 * Body text entrance: simple opacity + y-offset.
 * "Restraint — reading shouldn't be a performance."
 */
export const bodyTextVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: eases.default,
    },
  },
};

/**
 * IMPORTANT: All scroll entrance variants below are consumed by components
 * that MUST check the performance tier before applying them:
 * - Tier 0-1: No scroll choreography (use static rendering)
 * - Tier 2: Scroll reveals only (no velocity feedback)
 * - Tier 3: Full scroll reveals + velocity feedback
 * Each consuming component checks via usePerformance().tier.
 */

/**
 * Section heading entrance: character stagger with ghost echo.
 * The ghost is a separate element rendered behind, controlled by its own variant.
 */
export const headingCharVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -8,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: eases.default,
    },
  },
};

export const headingContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.05,
    },
  },
};

/**
 * Ghost echo behind headings — offset, scaled, low opacity accent color.
 */
export const headingGhostVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -4,
    scale: 1.05,
  },
  visible: {
    opacity: 0.12,
    x: 2,
    scale: 1.08,
    transition: {
      duration: 0.6,
      ease: eases.default,
      delay: 0.2,
    },
  },
};

/**
 * Heading underline: draws on from left after text lands.
 */
export const headingUnderlineVariants: Variants = {
  hidden: {
    scaleX: 0,
    originX: 0,
  },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.4,
      ease: eases.default,
      delay: 0.4,
    },
  },
};
```

- [ ] **Step 2: Export from motion barrel**

Add to `src/lib/motion/index.ts`:

```typescript
export {
  postCardVariants,
  postCardStagger,
  postCardChild,
  galleryRevealVariants,
  embedBorderVariants,
  bodyTextVariants,
  headingCharVariants,
  headingContainerVariants,
  headingGhostVariants,
  headingUnderlineVariants,
} from "./scroll-variants";
```

- [ ] **Step 3: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Variants are defined but not yet consumed.

- [ ] **Step 4: Commit**

```bash
git add src/lib/motion/scroll-variants.ts src/lib/motion/index.ts
git commit -m "feat(motion): add scroll entrance variants for all content types"
```

---

### Task 6: AnimatedHeading Component

A heading with character-stagger reveal, ghost echo, and underline draw-on. Replaces the plain `<Heading>` component for section headings.

**Files:**
- Create: `src/components/AnimatedHeading.tsx`
- Create: `src/components/__tests__/AnimatedHeading.test.tsx`

- [ ] **Step 1: Write failing tests**

```typescript
// src/components/__tests__/AnimatedHeading.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { AnimatedHeading } from "../AnimatedHeading";

describe("AnimatedHeading", () => {
  it("renders the text content", () => {
    render(<AnimatedHeading level={2}>Latest Posts</AnimatedHeading>);
    // Characters are split into spans, but text content should be accessible
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Latest Posts"
    );
  });

  it("renders with the correct heading level", () => {
    render(<AnimatedHeading level={3}>Section</AnimatedHeading>);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("splits text into individual character spans", () => {
    const { container } = render(
      <AnimatedHeading level={2}>Hello</AnimatedHeading>
    );
    const charSpans = container.querySelectorAll("[data-char]");
    expect(charSpans).toHaveLength(5);
  });

  it("renders ghost echo element", () => {
    const { container } = render(
      <AnimatedHeading level={2}>Test</AnimatedHeading>
    );
    const ghost = container.querySelector("[data-ghost]");
    expect(ghost).toBeInTheDocument();
  });

  it("renders underline element", () => {
    const { container } = render(
      <AnimatedHeading level={2}>Test</AnimatedHeading>
    );
    const underline = container.querySelector("[data-underline]");
    expect(underline).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/components/__tests__/AnimatedHeading.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Implement AnimatedHeading**

```typescript
// src/components/AnimatedHeading.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  headingCharVariants,
  headingContainerVariants,
  headingGhostVariants,
  headingUnderlineVariants,
} from "@/lib/motion";
import { usePerformance } from "@/lib/performance";
import { cn } from "@/lib/utils";

interface AnimatedHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: string;
  className?: string;
  /** Disable animation (e.g., for reduced-motion) */
  static?: boolean;
}

const levelStyles: Record<number, string> = {
  1: "text-6xl md:text-7xl",
  2: "text-4xl md:text-5xl",
  3: "text-3xl md:text-4xl",
  4: "text-2xl md:text-3xl",
  5: "text-xl md:text-2xl",
  6: "text-lg md:text-xl",
};

/**
 * Section heading with character-stagger reveal, ghost echo, and underline.
 *
 * - Characters fade in with blur and x-offset, staggered by 25ms
 * - Ghost echo appears behind in accent color (offset, scaled up, 12% opacity)
 * - Underline draws on from left after text lands
 * - Triggered when heading enters viewport (useInView)
 */
export function AnimatedHeading({
  level,
  children,
  className,
  static: isStatic = false,
}: AnimatedHeadingProps) {
  const Tag = `h${level}` as keyof React.JSX.IntrinsicElements;
  const ref = useRef<HTMLDivElement>(null);
  const { tier, isReducedMotion } = usePerformance();
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const chars = children.split("");

  // Tier 0-1 or reduced motion: static rendering, no scroll choreography
  if (isStatic || tier <= 1 || isReducedMotion) {
    return (
      <Tag
        className={cn(
          "font-tschick-bold uppercase tracking-wider",
          levelStyles[level],
          className
        )}
      >
        {children}
      </Tag>
    );
  }

  return (
    <div ref={ref} className="relative inline-block text-left">
      {/* Ghost echo — behind main text */}
      <motion.div
        data-ghost
        variants={headingGhostVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className={cn(
          "absolute inset-0 text-[color:var(--color-accent)] pointer-events-none select-none",
          "font-tschick-bold uppercase tracking-wider",
          levelStyles[level]
        )}
        aria-hidden="true"
      >
        {children}
      </motion.div>

      {/* Main heading with character stagger */}
      <motion.div
        variants={headingContainerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <Tag
          className={cn(
            "font-tschick-bold uppercase tracking-wider relative",
            levelStyles[level],
            className
          )}
        >
          {chars.map((char, i) => (
            <motion.span
              key={i}
              data-char
              variants={headingCharVariants}
              className="inline-block"
              style={{ whiteSpace: char === " " ? "pre" : undefined }}
            >
              {char}
            </motion.span>
          ))}
        </Tag>
      </motion.div>

      {/* Underline draws from left */}
      <motion.div
        data-underline
        variants={headingUnderlineVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="h-[2px] bg-[color:var(--color-accent)] mt-2"
      />
    </div>
  );
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/components/__tests__/AnimatedHeading.test.tsx`
Expected: All 5 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/AnimatedHeading.tsx src/components/__tests__/AnimatedHeading.test.tsx
git commit -m "feat: add AnimatedHeading with character stagger, ghost echo, and underline"
```

---

### Task 7: Apply Scroll Entrances to PostCard

Add the alternating slide-in entrance with staggered internals (category → title → body) and grain/noise burst that clears on settle.

**Files:**
- Modify: `src/components/PostCard.tsx`

- [ ] **Step 1: Update PostCard with scroll entrance variants**

Modify `src/components/PostCard.tsx`:

1. Add imports for the new scroll variants:

```typescript
import {
  postCardVariants,
  postCardStagger,
  postCardChild,
} from "@/lib/motion";
```

2. The PostCard component receives its index via props already. Add `index` to the props if not present:

```typescript
interface PostCardProps {
  // ... existing props
  /** Position in the feed — determines entrance direction */
  index?: number;
}
```

3. Wrap the card's outer container with the scroll entrance variant:

```typescript
// Change the outer card wrapper:
// FROM (plain motion.article or div):
<motion.article className={...}>
// TO:
<motion.article
  custom={index !== undefined ? index % 2 === 1 : false}
  variants={postCardVariants}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-5% 0px" }}
  className={...}
>
```

4. Wrap the internal content sections (category, title, body) with stagger variants:

```typescript
// Inside the card, wrap the content area:
<motion.div variants={postCardStagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
  <motion.div variants={postCardChild}>
    {/* category label */}
  </motion.div>
  <motion.div variants={postCardChild}>
    {/* title / heading */}
  </motion.div>
  <motion.div variants={postCardChild}>
    {/* body content */}
  </motion.div>
</motion.div>
```

- [ ] **Step 2: Pass index prop from Home.tsx**

In `src/site/Home.tsx`, ensure the PostCard receives its index:

```typescript
// In the posts.map() call:
{visiblePosts.map((post, index) => (
  <PostCard
    key={post.id}
    post={post}
    index={index}
    // ... other existing props
  />
))}
```

- [ ] **Step 3: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Post cards now slide in from alternating directions when scrolled into view.

- [ ] **Step 4: Commit**

```bash
git add src/components/PostCard.tsx src/site/Home.tsx
git commit -m "feat: add alternating scroll entrance to post cards with staggered internals"
```

---

### Task 8: Gallery Scan-Line Reveal

Apply the scan-line entrance to gallery images — clipped top-to-bottom with a bright line at the clip edge.

**Files:**
- Modify: `src/site/Gallery.tsx`
- Create: `src/components/effects/ScanLineReveal.tsx`

- [ ] **Step 1: Create ScanLineReveal wrapper component**

```typescript
// src/components/effects/ScanLineReveal.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { galleryRevealVariants } from "@/lib/motion";

interface ScanLineRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Delay before reveal starts (ms) — for staggering in grids */
  delay?: number;
}

/**
 * Wraps content in a scan-line reveal animation.
 * Image clips from top to bottom like a CRT drawing a frame.
 * A bright accent line at the clip boundary sells the effect.
 */
export function ScanLineReveal({
  children,
  className,
  delay = 0,
}: ScanLineRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div
        variants={galleryRevealVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ delay: delay / 1000 }}
      >
        {children}
      </motion.div>
      {/* Bright scan line at clip edge — purely decorative */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 right-0 h-[2px] bg-[color:var(--color-accent)] pointer-events-none"
        initial={{ top: "0%" }}
        animate={isInView ? { top: "100%" } : { top: "0%" }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
          delay: delay / 1000,
        }}
        style={{ opacity: isInView ? 0.7 : 0 }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Wrap gallery images in ScanLineReveal**

In `src/site/Gallery.tsx`, wrap each gallery image with `ScanLineReveal`:

```typescript
import { ScanLineReveal } from "@/components/effects/ScanLineReveal";

// In the gallery grid, wrap each image:
{images.map((img, index) => (
  <ScanLineReveal key={img.id} delay={index * 80} className="aspect-square">
    {/* existing image/lightbox trigger content */}
  </ScanLineReveal>
))}
```

- [ ] **Step 3: Export ScanLineReveal from effects barrel**

Add to `src/components/effects/index.ts`:

```typescript
export { ScanLineReveal } from "./ScanLineReveal";
```

- [ ] **Step 4: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Gallery images reveal with scan-line effect when scrolled into view.

- [ ] **Step 5: Commit**

```bash
git add src/components/effects/ScanLineReveal.tsx src/components/effects/index.ts src/site/Gallery.tsx
git commit -m "feat: add scan-line reveal for gallery images"
```

---

### Task 9: Wire Embed Border & Body Text Variants Into Pages

Apply the `embedBorderVariants` to audio/video embeds on Listen and Discography pages, and `bodyTextVariants` to body text sections on About and Contact pages. Add tier gating to PostCard scroll entrance.

**Files:**
- Modify: `src/site/Listen.tsx`
- Modify: `src/site/Discography.tsx`
- Modify: `src/site/About.tsx`
- Modify: `src/site/Contact.tsx`
- Modify: `src/components/PostCard.tsx`

- [ ] **Step 1: Add tier-gated embed border entrance to Listen page**

In `src/site/Listen.tsx`, wrap each embed/iframe with the border-draw entrance:

```typescript
import { motion, useInView } from "framer-motion";
import { embedBorderVariants } from "@/lib/motion";
import { usePerformance } from "@/lib/performance";

// Inside the component:
const { tier, isReducedMotion } = usePerformance();
const shouldAnimate = tier >= 2 && !isReducedMotion;

// Wrap each embed:
<motion.div
  variants={shouldAnimate ? embedBorderVariants : undefined}
  initial={shouldAnimate ? "hidden" : undefined}
  whileInView={shouldAnimate ? "visible" : undefined}
  viewport={{ once: true, margin: "-10% 0px" }}
>
  {/* existing iframe/embed */}
</motion.div>
```

- [ ] **Step 2: Add body text entrance to About and Contact pages**

In `src/site/About.tsx` and `src/site/Contact.tsx`, wrap body text paragraphs:

```typescript
import { motion } from "framer-motion";
import { bodyTextVariants } from "@/lib/motion";
import { usePerformance } from "@/lib/performance";

// Inside the component:
const { tier, isReducedMotion } = usePerformance();
const shouldAnimate = tier >= 2 && !isReducedMotion;

// Wrap body text sections:
<motion.p
  variants={shouldAnimate ? bodyTextVariants : undefined}
  initial={shouldAnimate ? "hidden" : undefined}
  whileInView={shouldAnimate ? "visible" : undefined}
  viewport={{ once: true }}
>
  {/* paragraph text */}
</motion.p>
```

- [ ] **Step 3: Add tier gating to PostCard scroll entrance**

In `src/components/PostCard.tsx`, gate the scroll variants behind tier check:

```typescript
import { usePerformance } from "@/lib/performance";

// Inside the component:
const { tier, isReducedMotion } = usePerformance();
const shouldAnimate = tier >= 2 && !isReducedMotion;

// On the article wrapper:
<motion.article
  custom={shouldAnimate ? (index !== undefined ? index % 2 === 1 : false) : undefined}
  variants={shouldAnimate ? postCardVariants : undefined}
  initial={shouldAnimate ? "hidden" : undefined}
  whileInView={shouldAnimate ? "visible" : undefined}
  viewport={{ once: true, margin: "-5% 0px" }}
  className={...}
>
```

- [ ] **Step 4: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Embed borders draw on scroll, body text fades in, all gated behind tier 2+.

- [ ] **Step 5: Commit**

```bash
git add src/site/Listen.tsx src/site/Discography.tsx src/site/About.tsx src/site/Contact.tsx src/components/PostCard.tsx
git commit -m "feat: wire embed border and body text scroll variants with tier gating"
```

---

### Task 10: Scroll Velocity Feedback

Wire scroll velocity from SignalBus into visual feedback: heading ghost drift and content parallax (category labels move faster than titles).

**Files:**
- Create: `src/lib/motion/useScrollVelocity.ts`
- Modify: `src/components/AnimatedHeading.tsx`

- [ ] **Step 1: Create useScrollVelocity hook**

A convenience hook that reads scroll velocity from SignalBus each frame and returns a MotionValue for use in Framer Motion transforms.

```typescript
// src/lib/motion/useScrollVelocity.ts
"use client";

import { useEffect } from "react";
import { useMotionValue } from "framer-motion";
import { frame, cancelFrame } from "framer-motion";
import { getSignalBus } from "@/lib/signal";

/**
 * Returns a MotionValue tracking the current scroll velocity.
 * Updates every frame via SignalBus — no React re-renders.
 *
 * Use with `useTransform` for velocity-driven visual effects.
 */
export function useScrollVelocity() {
  const velocity = useMotionValue(0);
  const bus = getSignalBus();

  useEffect(() => {
    function read() {
      velocity.set(bus.state.scrollVelocity);
    }
    frame.read(read, true);
    return () => cancelFrame(read);
  }, [velocity, bus]);

  return velocity;
}
```

- [ ] **Step 2: Add ghost drift to AnimatedHeading**

Update `src/components/AnimatedHeading.tsx` to make the ghost echo lag behind scroll velocity:

1. Add imports:

```typescript
import { useTransform } from "framer-motion";
import { useScrollVelocity } from "@/lib/motion/useScrollVelocity";
```

2. Inside the component, after `isInView`:

```typescript
const velocity = useScrollVelocity();
// Ghost drifts proportional to velocity — lags behind, catches up with spring
const ghostX = useTransform(velocity, [-20, 0, 20], [6, 0, -6]);
const ghostY = useTransform(velocity, [-20, 0, 20], [3, 0, -3]);
```

3. Apply to the ghost element's `style`:

```typescript
<motion.div
  data-ghost
  variants={headingGhostVariants}
  initial="hidden"
  animate={isInView ? "visible" : "hidden"}
  style={{ x: ghostX, y: ghostY }}
  className={...}
>
```

- [ ] **Step 3: Export useScrollVelocity from motion barrel**

Add to `src/lib/motion/index.ts`:

```typescript
export { useScrollVelocity } from "./useScrollVelocity";
```

- [ ] **Step 4: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Heading ghosts now drift with scroll velocity.

- [ ] **Step 5: Commit**

```bash
git add src/lib/motion/useScrollVelocity.ts src/lib/motion/index.ts src/components/AnimatedHeading.tsx
git commit -m "feat: add scroll velocity feedback with heading ghost drift"
```

---

## Summary

After completing this plan, the site will have:

1. **TransitionLink** — intercepts all internal navigation, respects modifier keys and external URLs (renamed `usePageTransition` to avoid React 19 conflict)
2. **TransitionOrchestrator** — 5-phase signal disruption sequence with tier degradation and 800ms ceiling
3. **DOM Tear** — CSS clip-path bands with cloned content, animated via WAAPI at 60fps, per-band speed variation
4. **Scroll entrance variants** — per-content-type animations (post cards, gallery, headings, embeds, body text) with tier gating
5. **AnimatedHeading** — character stagger, ghost echo, underline draw-on, tier-gated
6. **ScanLineReveal** — CRT-style top-to-bottom image reveal
7. **Embed border draw** — clockwise clip-path reveal for audio/video embeds
8. **Body text entrance** — subtle opacity + y-offset for reading content
9. **Scroll velocity feedback** — heading ghost drift, reactive grain (from Plan 1)
10. **Accessibility** — aria-live announcements, reduced-motion respect, tier 0-1 skip all choreography

**Next plan:** Plan 3 covers micro-interactions (hover states, PixelLogo enhancements), ambient page effects (AmbientLayer, BorderCircuit), cursor trail, favicon cycling, and sessionStorage scroll memory.
