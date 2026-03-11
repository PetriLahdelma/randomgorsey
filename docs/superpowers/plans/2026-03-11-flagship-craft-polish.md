# Flagship Craft & Polish Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add the micro-interactions, ambient page effects, and craft details that transform the site from technically impressive to viscerally alive. Every interaction uses the signal vocabulary: interference, voltage, persistence.

**Architecture:** Micro-interactions use CSS transitions and Framer Motion hover/tap variants — no JS animation loops for hover states. Per-page ambient effects live in a shared `AmbientLayer` component with CSS-only implementations driven by SignalBus CSS custom properties. The cursor trail and favicon cycling are isolated canvas/timer systems that respect visibility and performance tiers. SessionStorage preserves homepage scroll position across navigations.

**Tech Stack:** TypeScript, Framer Motion, CSS custom properties, Canvas 2D (cursor trail), WAAPI, SignalBus CSS vars (from Plan 1), Next.js App Router

**Spec:** `docs/superpowers/specs/2026-03-11-flagship-generative-design.md` (Sections 4, 5)

**Plan series:** This is Plan 3 of 3. Plan 1 built SignalBus + ShaderCanvas. Plan 2 built transitions + choreography.

**Depends on:** Plan 1 (SignalBus, CSS vars, performance tiers) and Plan 2 (TransitionLink, scroll variants, `useScrollVelocity` hook) must be complete.

---

## Chunk 1: Hover Micro-interactions

Signal-vocabulary hover states for all interactive elements. Sharp transitions, horizontal displacement, accent flashes, noise bursts. No bounce, no rubber-band.

### Task 1: Nav Link Hover Enhancement

Enhance GlitchLink's existing ghost effect with a horizontal accent line that shoots from the left edge on hover.

**Files:**
- Modify: `src/components/GlitchLink.tsx`

- [ ] **Step 1: Add horizontal accent line to GlitchLink**

In `src/components/GlitchLink.tsx`, add a `motion.div` as the accent line inside the link, after the ghost overlay:

```typescript
// Inside the GlitchLink return JSX, add after the ghost AnimatePresence block:
{/* Accent line — shoots from left on hover */}
<motion.div
  aria-hidden="true"
  className="absolute bottom-0 left-0 h-[1px] bg-[color:var(--color-accent)]"
  initial={{ scaleX: 0, originX: 0 }}
  animate={{ scaleX: showGhost ? 1 : 0 }}
  transition={{ duration: 0.1, ease: [0.22, 1, 0.36, 1] }}
/>
```

Ensure the link wrapper has `relative` positioning (it should already from the ghost overlay).

- [ ] **Step 2: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Nav links now show a 1px accent line shooting from left on hover.

- [ ] **Step 3: Commit**

```bash
git add src/components/GlitchLink.tsx
git commit -m "feat: add horizontal accent line to nav link hover"
```

---

### Task 2: Post Card Hover — Voltage Spike

Border flashes from oklch(12%) to accent yellow for one frame (16ms), then settles to oklch(18%).

**Files:**
- Modify: `src/components/PostCard.tsx`

- [ ] **Step 1: Add voltage spike hover to PostCard**

Pure CSS approach — no React state or re-renders in the animation path.

In `src/styles/globals.css`, add:

```css
/* Post card voltage spike: flash accent on hover contact, settle to brighter border */
@keyframes voltage-spike {
  0% { border-color: var(--color-accent); }
  6% { border-color: var(--color-accent); } /* ~1 frame at 60fps */
  7% { border-color: oklch(18% 0 0deg); }
  100% { border-color: oklch(18% 0 0deg); }
}

.card-signal {
  border: 1px solid oklch(12% 0 0deg);
}

.card-signal:hover {
  animation: voltage-spike 250ms steps(1, end) 1 forwards;
}
```

In `src/components/PostCard.tsx`, add the `card-signal` class to the card's outer article element. Remove any existing `border-[oklch(12%_0_0deg)]` inline classes and replace with `card-signal`.

- [ ] **Step 2: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Post cards flash accent yellow on hover contact, then settle to brighter border.

- [ ] **Step 3: Commit**

```bash
git add src/components/PostCard.tsx
git commit -m "feat: add voltage spike border flash to post card hover"
```

---

### Task 3: Button Hover — Color Inversion

Instant color inversion (bg→accent, text→black) with single-frame horizontal jitter. Active state compresses 1px vertically.

**Files:**
- Create: `src/styles/button-signal.css`
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Create button signal styles**

```css
/* src/styles/button-signal.css */

/**
 * Signal-vocabulary button hover states.
 * Instant color inversion + single-frame horizontal jitter.
 */
.btn-signal {
  transition: none;
  position: relative;
}

.btn-signal:hover {
  background-color: var(--color-accent);
  color: oklch(5% 0 0deg);
  /* Single-frame 1px horizontal jitter via animation */
  animation: btn-jitter 16ms steps(1) 1;
}

.btn-signal:active {
  /* Compress 1px vertically on press */
  padding-top: calc(var(--btn-py, 0.5rem) + 0.5px);
  padding-bottom: calc(var(--btn-py, 0.5rem) - 0.5px);
}

@keyframes btn-jitter {
  0% { transform: translateX(0); }
  50% { transform: translateX(1px); }
  100% { transform: translateX(0); }
}
```

- [ ] **Step 2: Import in globals.css**

Add at the top of `src/styles/globals.css` (with other imports):

```css
@import "./button-signal.css";
```

- [ ] **Step 3: Apply btn-signal class to existing Button component**

Check the Button component location and add the `btn-signal` class. If there's a shared Button component, add it there. Otherwise, note which components render buttons and add the class.

The class can be applied conditionally — only when the site is in "signal mode" (i.e., always, since this is the new design system).

- [ ] **Step 4: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Buttons invert on hover with a jitter frame.

- [ ] **Step 5: Commit**

```bash
git add src/styles/button-signal.css src/styles/globals.css
git commit -m "feat: add signal-vocabulary button hover with color inversion and jitter"
```

---

### Task 4: Gallery Thumbnail Hover — Brightness Jump + Scan Line

Brightness jumps 0.95→1.1 (instant). Single accent scan line sweeps down once (200ms).

**Files:**
- Modify: `src/site/Gallery.tsx`

- [ ] **Step 1: Add hover effect to gallery thumbnails**

In `src/site/Gallery.tsx`, wrap each gallery image in a hover container:

```typescript
// For each gallery image wrapper, add:
<div
  className="relative overflow-hidden group"
  // existing onClick for lightbox etc.
>
  {/* Existing image */}
  <div className="brightness-[0.95] group-hover:brightness-110 transition-none">
    {/* image content */}
  </div>

  {/* Scan line sweep on hover */}
  <div
    aria-hidden="true"
    className="
      absolute left-0 right-0 h-[1px]
      bg-[color:var(--color-accent)] opacity-70
      -top-[1px] group-hover:animate-scan-sweep
      pointer-events-none
    "
  />
</div>
```

- [ ] **Step 2: Add scan-sweep keyframe to globals.css**

Add to `src/styles/globals.css`:

```css
@keyframes scan-sweep {
  from { top: -1px; opacity: 0.7; }
  to { top: 100%; opacity: 0; }
}

.animate-scan-sweep {
  animation: scan-sweep 200ms cubic-bezier(0.22, 1, 0.36, 1) 1 forwards;
}
```

- [ ] **Step 3: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Gallery thumbnails brighten instantly on hover with a scan line sweep.

- [ ] **Step 4: Commit**

```bash
git add src/site/Gallery.tsx src/styles/globals.css
git commit -m "feat: add brightness jump and scan line sweep to gallery hover"
```

---

### Task 5: Link / Read More Hover — Dash Break

Underline breaks into dashes for 2 frames then reforms solid at full accent brightness.

**Files:**
- Create: `src/styles/link-signal.css`
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Create link signal styles**

```css
/* src/styles/link-signal.css */

/**
 * Signal-vocabulary link hover: underline breaks into dashes, reforms solid.
 */
.link-signal {
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: oklch(40% 0 0deg);
  transition: text-decoration-color 100ms;
}

.link-signal:hover {
  text-decoration-color: var(--color-accent);
  animation: link-dash-break 100ms steps(2) 1;
}

@keyframes link-dash-break {
  0% {
    text-decoration-style: dashed;
    text-decoration-color: oklch(60% 0 0deg);
  }
  50% {
    text-decoration-style: dashed;
    text-decoration-color: var(--color-accent);
  }
  100% {
    text-decoration-style: solid;
    text-decoration-color: var(--color-accent);
  }
}
```

- [ ] **Step 2: Import in globals.css**

Add to `src/styles/globals.css`:

```css
@import "./link-signal.css";
```

- [ ] **Step 3: Apply to "Read More" links in PostCard**

In `src/components/PostCard.tsx`, add the `link-signal` class to the "Read more" button/link.

- [ ] **Step 4: Verify build passes**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/styles/link-signal.css src/styles/globals.css src/components/PostCard.tsx
git commit -m "feat: add dash-break hover effect for links"
```

---

## Chunk 2: PixelLogo & Ambient Details

### Task 6: PixelLogo Enhancements

Add idle micro-glitch (random character flickers every 15-30s) and scroll-velocity letter-spacing distortion.

**Files:**
- Modify: `src/components/PixelLogo.tsx`

- [ ] **Step 1: Add idle micro-glitch**

In `src/components/PixelLogo.tsx`, add an effect that randomly flickers a single character to a different pixel font every 15-30s:

```typescript
// Add state for the glitching character
const [glitchCharIndex, setGlitchCharIndex] = useState<number | null>(null);
const [glitchFont, setGlitchFont] = useState<string | null>(null);

// Idle micro-glitch timer
useEffect(() => {
  const PIXEL_FONTS = [
    "font-geist-pixel-square",
    "font-geist-pixel-grid",
    "font-geist-pixel-circle",
    "font-geist-pixel-triangle",
    "font-geist-pixel-line",
  ];

  function scheduleGlitch() {
    // Random interval: 15-30 seconds
    const delay = 15000 + Math.random() * 15000;
    return setTimeout(() => {
      const text = "Random Gorsey";
      const charIdx = Math.floor(Math.random() * text.length);
      const fontIdx = Math.floor(Math.random() * PIXEL_FONTS.length);

      setGlitchCharIndex(charIdx);
      setGlitchFont(PIXEL_FONTS[fontIdx]);

      // Flash for 2 frames (~33ms), then restore
      setTimeout(() => {
        setGlitchCharIndex(null);
        setGlitchFont(null);
      }, 33);

      // Schedule next
      timerId = scheduleGlitch();
    }, delay);
  }

  let timerId = scheduleGlitch();
  return () => clearTimeout(timerId);
}, []);
```

- [ ] **Step 2: Add scroll-velocity letter-spacing**

```typescript
import { useScrollVelocity } from "@/lib/motion/useScrollVelocity";
import { useTransform, motion } from "framer-motion";

// Inside the component:
const velocity = useScrollVelocity();
const letterSpacing = useTransform(
  velocity,
  [-30, 0, 30],
  ["0.15em", "0.05em", "0.15em"]
);
```

Apply `letterSpacing` as a `motion.span` style on the logo text container.

- [ ] **Step 3: Render characters individually for glitch targeting**

Update the logo text rendering to split characters so the micro-glitch can target individual ones:

```typescript
const logoText = "Random Gorsey";

// In the JSX:
<motion.span style={{ letterSpacing }}>
  {logoText.split("").map((char, i) => (
    <span
      key={i}
      className={i === glitchCharIndex ? glitchFont ?? "" : ""}
      style={{ display: "inline-block", whiteSpace: char === " " ? "pre" : undefined }}
    >
      {char}
    </span>
  ))}
</motion.span>
```

- [ ] **Step 4: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Logo occasionally glitches a single character and letter-spacing responds to scroll.

- [ ] **Step 5: Commit**

```bash
git add src/components/PixelLogo.tsx
git commit -m "feat: add idle micro-glitch and scroll letter-spacing to PixelLogo"
```

---

### Task 7: Cursor Trail — Phosphor Persistence

Faint trail of 3-4 afterimages (2px accent dots) fading over 200ms. Normal arrow cursor. Dedicated canvas layer. Desktop only (pointer: fine).

**Files:**
- Create: `src/components/effects/CursorTrail.tsx`
- Modify: `src/components/AppShell.tsx`

- [ ] **Step 1: Implement CursorTrail**

```typescript
// src/components/effects/CursorTrail.tsx
"use client";

import { useEffect, useRef, useCallback } from "react";
import { frame, cancelFrame } from "framer-motion";
import { usePerformance } from "@/lib/performance";

const TRAIL_LENGTH = 4;
const DOT_RADIUS = 1;
const FADE_DURATION = 200; // ms

interface TrailPoint {
  x: number;
  y: number;
  timestamp: number;
}

/**
 * Phosphor persistence cursor trail — 3-4 faint accent dots fading behind the cursor.
 *
 * Renders to a dedicated canvas at z:50 (above all content).
 * Only created on devices with `pointer: fine` (desktop with mouse).
 * Pauses when tab is hidden. Disabled on tier 0-2 or reduced-motion.
 */
export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<TrailPoint[]>([]);
  const rafRef = useRef<number>(0);
  const { tier, isReducedMotion } = usePerformance();

  // Parse accent color once
  const accentRGB = useRef({ r: 242, g: 224, b: 89 }); // fallback for oklch(90% 0.18 85deg)

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const now = performance.now();
    const dpr = window.devicePixelRatio || 1;

    // Resize if needed
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
    }

    ctx.clearRect(0, 0, w, h);

    // Filter expired points
    pointsRef.current = pointsRef.current.filter(
      (p) => now - p.timestamp < FADE_DURATION
    );

    // Draw trail dots
    const { r, g, b } = accentRGB.current;
    for (const point of pointsRef.current) {
      const age = (now - point.timestamp) / FADE_DURATION;
      const alpha = Math.max(0, 0.4 * (1 - age));
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
      ctx.beginPath();
      ctx.arc(point.x, point.y, DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  useEffect(() => {
    // Only on desktop with fine pointer, tier 3
    if (tier < 3 || isReducedMotion) return;
    const isFineMouse = window.matchMedia("(pointer: fine)").matches;
    if (!isFineMouse) return;

    const onMove = (e: MouseEvent) => {
      pointsRef.current.push({
        x: e.clientX,
        y: e.clientY,
        timestamp: performance.now(),
      });
      // Keep only recent points
      if (pointsRef.current.length > TRAIL_LENGTH * 3) {
        pointsRef.current = pointsRef.current.slice(-TRAIL_LENGTH * 3);
      }
    };

    document.addEventListener("mousemove", onMove, { passive: true });
    // Use Framer Motion's frame scheduler — single RAF loop for the whole app
    frame.render(draw, true); // true = keep alive (runs every frame)

    // Pause when hidden
    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        cancelFrame(draw);
      } else {
        pointsRef.current = [];
        frame.render(draw, true);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelFrame(draw);
    };
  }, [tier, isReducedMotion, draw]);

  // Don't render canvas for non-tier-3
  if (tier < 3 || isReducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 50 }}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Mount CursorTrail in AppShell**

In `src/components/AppShell.tsx`:

1. Add import: `import { CursorTrail } from "@/components/effects/CursorTrail";`
2. Add after the shader canvas, before the content div:

```typescript
{/* Cursor trail — tier 3 desktop only */}
<CursorTrail />
```

- [ ] **Step 3: Export from effects barrel**

Add to `src/components/effects/index.ts`:

```typescript
export { CursorTrail } from "./CursorTrail";
```

- [ ] **Step 4: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. On tier 3 desktop, faint accent dots trail behind cursor.

- [ ] **Step 5: Commit**

```bash
git add src/components/effects/CursorTrail.tsx src/components/effects/index.ts src/components/AppShell.tsx
git commit -m "feat: add phosphor persistence cursor trail (tier 3 desktop)"
```

---

### Task 8: Favicon Cycling

Cycles 2-3 pixel font variants of "RG" every 4 seconds using canvas-generated favicons. Pauses when tab is hidden.

**Files:**
- Create: `src/lib/favicon.ts`
- Modify: `src/components/AppShell.tsx`

- [ ] **Step 1: Implement favicon cycling**

```typescript
// src/lib/favicon.ts

const FONTS = [
  '"Geist Pixel Square", monospace',
  '"Geist Pixel Grid", monospace',
  '"Geist Pixel Circle", monospace',
];
const CYCLE_INTERVAL = 4000; // 4 seconds
const CANVAS_SIZE = 32;

/**
 * Creates a canvas-rendered "RG" favicon in the given pixel font.
 * Returns a data URL suitable for the favicon link element.
 */
function renderFavicon(fontFamily: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  // Background
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Text
  ctx.fillStyle = "#f2e059"; // accent yellow
  ctx.font = `bold 18px ${fontFamily}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("RG", CANVAS_SIZE / 2, CANVAS_SIZE / 2 + 1);

  return canvas.toDataURL("image/png");
}

/**
 * Start favicon cycling. Returns a cleanup function.
 * Pauses when document is hidden, resumes on focus.
 */
export function startFaviconCycle(): () => void {
  let fontIndex = 0;
  let timerId: ReturnType<typeof setInterval> | null = null;

  // Get or create the favicon link element
  let link = document.querySelector<HTMLLinkElement>(
    'link[rel="icon"][type="image/png"]'
  );
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/png";
    document.head.appendChild(link);
  }

  function cycle() {
    fontIndex = (fontIndex + 1) % FONTS.length;
    const dataUrl = renderFavicon(FONTS[fontIndex]);
    if (dataUrl && link) {
      link.href = dataUrl;
    }
  }

  function start() {
    if (timerId) return;
    timerId = setInterval(cycle, CYCLE_INTERVAL);
  }

  function stop() {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    }
  }

  const onVisibility = () => {
    if (document.visibilityState === "visible") {
      start();
    } else {
      stop();
    }
  };

  document.addEventListener("visibilitychange", onVisibility);
  // Render initial favicon
  cycle();
  start();

  return () => {
    stop();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}
```

- [ ] **Step 2: Start favicon cycle from AppShell**

In `src/components/AppShell.tsx`, add to the existing `useEffect`:

```typescript
import { startFaviconCycle } from "@/lib/favicon";

// Inside the component, add a new useEffect:
React.useEffect(() => {
  const cleanup = startFaviconCycle();
  return cleanup;
}, []);
```

- [ ] **Step 3: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Favicon cycles through pixel font "RG" variants every 4 seconds.

- [ ] **Step 4: Commit**

```bash
git add src/lib/favicon.ts src/components/AppShell.tsx
git commit -m "feat: add canvas-generated favicon cycling with visibility pause"
```

---

## Chunk 3: Ambient Page Effects

### Task 9: AmbientLayer Component

A shared component that renders per-page ambient CSS effects. Each page gets a distinct treatment within the signal vocabulary.

**Files:**
- Create: `src/components/effects/AmbientLayer.tsx`

- [ ] **Step 1: Implement AmbientLayer**

```typescript
// src/components/effects/AmbientLayer.tsx
"use client";

import { usePerformance } from "@/lib/performance";
import { cn } from "@/lib/utils";

type AmbientVariant =
  | "home"
  | "listen"
  | "contact"
  | "discography"
  | "about"
  | "gallery"
  | "not-found";

interface AmbientLayerProps {
  variant: AmbientVariant;
  className?: string;
}

/**
 * Per-page ambient effects layer (z:1, between shader and content).
 *
 * Each variant applies a distinct CSS-only ambient treatment:
 * - home: No extra ambient (shader handles it at 100%)
 * - listen: Reactive scan lines near embeds
 * - contact: Border pulse circuit (traveling accent dot, 8s loop)
 * - discography: Horizontal frequency bands at 20% intervals
 * - about: Static grain + edge vignette + ambient hot pixel
 * - gallery: Minimal (shader at 5% in lightbox only)
 * - not-found: Heavy scan lines + frequent glitches
 *
 * Disabled on tier 0-1 and reduced-motion.
 */
export function AmbientLayer({ variant, className }: AmbientLayerProps) {
  const { tier, isReducedMotion } = usePerformance();

  if (tier <= 1 || isReducedMotion) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none",
        "z-[1]", // between shader (z:0) and grain (z:2)
        className
      )}
      aria-hidden="true"
    >
      {variant === "not-found" && <NotFoundAmbient />}
      {variant === "contact" && <ContactAmbient />}
      {variant === "discography" && <DiscographyAmbient />}
      {variant === "about" && <AboutAmbient />}
      {variant === "listen" && <ListenAmbient />}
      {/* home and gallery have no extra ambient layer */}
    </div>
  );
}

/** 404: Heavy scan lines, elevated shader already handles most of it */
function NotFoundAmbient() {
  return (
    <div className="absolute inset-0">
      {/* Dense scan lines */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, oklch(100% 0 0deg / 0.3) 2px, transparent 4px)",
        }}
      />
    </div>
  );
}

/** Contact: Accent dot traveling the form border (8s loop) */
function ContactAmbient() {
  return (
    <div className="absolute inset-8 md:inset-16 lg:inset-24">
      <div
        className="absolute inset-0 border border-[oklch(15%_0_0deg)] overflow-hidden"
      >
        {/* Traveling dot — CSS animation following the border path */}
        <div
          className="absolute w-[4px] h-[4px] bg-[color:var(--color-accent)] rounded-full animate-border-travel"
        />
      </div>
    </div>
  );
}

/** Discography: Thin horizontal frequency bands at 20% intervals */
function DiscographyAmbient() {
  return (
    <div className="absolute inset-0">
      {[20, 40, 60, 80].map((pct) => (
        <div
          key={pct}
          className="absolute left-0 right-0 h-[1px] bg-[oklch(20%_0_0deg)] transition-colors duration-500"
          style={{ top: `${pct}%` }}
        />
      ))}
    </div>
  );
}

/** About: Static grain boost + edge vignette + single ambient hot pixel */
function AboutAmbient() {
  return (
    <div className="absolute inset-0">
      {/* Edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, oklch(0% 0 0deg / 0.4) 100%)",
        }}
      />
      {/* Single ambient hot pixel in upper-right */}
      <div
        className="absolute top-[12%] right-[8%] w-[2px] h-[2px] bg-[color:var(--color-accent)] animate-pulse"
        style={{ animationDuration: "3s" }}
      />
    </div>
  );
}

/** Listen: Scan lines that brighten near embeds (via CSS proximity, simplified) */
function ListenAmbient() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, oklch(100% 0 0deg / 0.2) 3px, transparent 6px)",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 2: Add border-travel animation to globals.css**

Add to `src/styles/globals.css`:

```css
/* Contact ambient: traveling dot along border path */
@keyframes border-travel {
  0% { top: 0; left: 0; }
  25% { top: 0; left: calc(100% - 4px); }
  50% { top: calc(100% - 4px); left: calc(100% - 4px); }
  75% { top: calc(100% - 4px); left: 0; }
  100% { top: 0; left: 0; }
}

.animate-border-travel {
  animation: border-travel 8s linear infinite;
}
```

- [ ] **Step 3: Export from effects barrel**

Add to `src/components/effects/index.ts`:

```typescript
export { AmbientLayer } from "./AmbientLayer";
```

- [ ] **Step 4: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. AmbientLayer is defined but not yet mounted on pages.

- [ ] **Step 5: Commit**

```bash
git add src/components/effects/AmbientLayer.tsx src/components/effects/index.ts src/styles/globals.css
git commit -m "feat: add AmbientLayer with per-page ambient effects"
```

---

### Task 10: Mount AmbientLayer on All Pages

Each page component gets its `<AmbientLayer variant="..." />` at the top of its content.

**Files:**
- Modify: `src/site/Home.tsx`
- Modify: `src/site/About.tsx`
- Modify: `src/site/Contact.tsx`
- Modify: `src/site/Discography.tsx`
- Modify: `src/site/Gallery.tsx`
- Modify: `src/site/Listen.tsx`
- Modify: `src/site/NotFound.tsx`

- [ ] **Step 1: Add AmbientLayer import to all page files**

For each file in `src/site/`, add:

```typescript
import { AmbientLayer } from "@/components/effects";
```

- [ ] **Step 2: Add AmbientLayer to each page's return JSX**

Place `<AmbientLayer>` as the first child of the page wrapper, before the VideoBackground and content:

| File | Code |
|---|---|
| `Home.tsx` | `<AmbientLayer variant="home" />` |
| `About.tsx` | `<AmbientLayer variant="about" />` |
| `Contact.tsx` | `<AmbientLayer variant="contact" />` |
| `Discography.tsx` | `<AmbientLayer variant="discography" />` |
| `Gallery.tsx` | `<AmbientLayer variant="gallery" />` |
| `Listen.tsx` | `<AmbientLayer variant="listen" />` |
| `NotFound.tsx` | `<AmbientLayer variant="not-found" />` |

- [ ] **Step 3: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Each page now has its per-page ambient treatment.

- [ ] **Step 4: Commit**

```bash
git add src/site/Home.tsx src/site/About.tsx src/site/Contact.tsx src/site/Discography.tsx src/site/Gallery.tsx src/site/Listen.tsx src/site/NotFound.tsx
git commit -m "feat: mount AmbientLayer with per-page variants on all pages"
```

---

## Chunk 4: State Transitions & Session Memory

### Task 11: Image Loading Placeholder

Noise shimmer placeholder (animated grain at 15% + repeating scan line) that gets replaced when the image loads.

**Files:**
- Create: `src/components/effects/NoiseShimmer.tsx`

- [ ] **Step 1: Implement NoiseShimmer**

```typescript
// src/components/effects/NoiseShimmer.tsx
"use client";

import { cn } from "@/lib/utils";

interface NoiseShimmerProps {
  className?: string;
  /** Set to true when the real content has loaded */
  loaded?: boolean;
}

/**
 * Animated noise shimmer placeholder for loading states.
 * Grain at 15% + repeating scan line animation.
 * Fades out with a flash at the clip boundary when content loads.
 */
export function NoiseShimmer({ className, loaded = false }: NoiseShimmerProps) {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden transition-opacity duration-200",
        loaded && "opacity-0 pointer-events-none",
        className
      )}
      aria-hidden="true"
    >
      {/* Grain at 15% opacity */}
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />
      {/* Scan line sweep */}
      <div
        className="absolute left-0 right-0 h-[2px] bg-[oklch(40%_0_0deg)] animate-shimmer-scan"
      />
    </div>
  );
}
```

- [ ] **Step 2: Add shimmer-scan keyframe to globals.css**

```css
@keyframes shimmer-scan {
  from { top: -2px; }
  to { top: 100%; }
}

.animate-shimmer-scan {
  animation: shimmer-scan 1.5s linear infinite;
}
```

- [ ] **Step 3: Export from effects barrel**

Add to `src/components/effects/index.ts`:

```typescript
export { NoiseShimmer } from "./NoiseShimmer";
```

- [ ] **Step 4: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. NoiseShimmer is available for use as image loading placeholder.

- [ ] **Step 5: Commit**

```bash
git add src/components/effects/NoiseShimmer.tsx src/components/effects/index.ts src/styles/globals.css
git commit -m "feat: add noise shimmer loading placeholder with scan line animation"
```

---

### Task 12: Form Focus Effects

Border draws itself clockwise on focus. Label does a single character-flicker.

**Files:**
- Create: `src/styles/form-signal.css`
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Create form signal styles**

```css
/* src/styles/form-signal.css */

/**
 * Signal-vocabulary form focus states.
 * Border draws itself clockwise on focus.
 *
 * NOTE: <input> elements don't support ::before/::after pseudo-elements.
 * Wrap inputs in a .input-signal-wrapper div that provides the animated border.
 * The input itself has no border — the wrapper handles it.
 *
 * Markup: <div class="input-signal-wrapper"><input class="input-signal" /></div>
 */
.input-signal-wrapper {
  position: relative;
  border: 1px solid oklch(15% 0 0deg);
  transition: border-color 100ms;
}

.input-signal {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
}

/* Animated border overlay — clips clockwise on focus */
.input-signal-wrapper::after {
  content: "";
  position: absolute;
  inset: -1px;
  border: 1px solid var(--color-accent);
  pointer-events: none;
  clip-path: inset(0 100% 100% 0);
  transition: clip-path 0ms;
}

.input-signal-wrapper:focus-within {
  border-color: transparent;
}

.input-signal-wrapper:focus-within::after {
  animation: border-draw 300ms cubic-bezier(0.22, 1, 0.36, 1) 1 forwards;
}

@keyframes border-draw {
  0% { clip-path: inset(0 100% 100% 0); }
  25% { clip-path: inset(0 0% 100% 0); }
  50% { clip-path: inset(0 0% 0% 0); }
  75% { clip-path: inset(0 0% 0% 0%); }
  100% { clip-path: inset(0 0% 0% 0%); }
}

/**
 * Form label character flicker on input focus.
 * Applied via .label-signal when sibling input is focused.
 */
.label-signal {
  transition: color 150ms;
}

.input-signal:focus ~ .label-signal,
.input-signal:focus + .label-signal {
  color: var(--color-accent);
  animation: label-flicker 150ms steps(3) 1;
}

@keyframes label-flicker {
  0% { opacity: 1; }
  33% { opacity: 0.4; }
  66% { opacity: 1; letter-spacing: 0.05em; }
  100% { opacity: 1; letter-spacing: normal; }
}
```

- [ ] **Step 2: Import in globals.css**

```css
@import "./form-signal.css";
```

- [ ] **Step 3: Apply to Contact form inputs**

In `src/site/Contact.tsx`, add `input-signal` class to all form inputs/textareas and `label-signal` to their labels. The exact placement depends on the current form markup.

- [ ] **Step 4: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Form inputs now have signal-style focus states.

- [ ] **Step 5: Commit**

```bash
git add src/styles/form-signal.css src/styles/globals.css src/site/Contact.tsx
git commit -m "feat: add signal-vocabulary form focus effects"
```

---

### Task 13: Share Button Micro-interactions

Horizontal displacement glitch on hover (2px, 1 frame). Click: icon inverts, ring expands outward and fades (sonar ping).

**Files:**
- Modify: `src/components/SocialShare.tsx`

- [ ] **Step 1: Add hover glitch and click sonar to SocialShare**

Check if `src/components/SocialShare.tsx` exists. If so, update the share button wrappers:

1. Add hover animation class:

```css
/* Add to globals.css or inline */
.share-signal:hover {
  animation: share-glitch 16ms steps(1) 1;
}

@keyframes share-glitch {
  0% { transform: translateX(0); }
  50% { transform: translateX(2px); }
  100% { transform: translateX(0); }
}
```

2. For click sonar, add a `::after` pseudo-element that expands on click:

```css
.share-signal {
  position: relative;
  overflow: visible;
}

.share-signal:active::after {
  content: "";
  position: absolute;
  inset: -4px;
  border: 1px solid var(--color-accent);
  border-radius: 50%;
  animation: sonar-ping 300ms ease-out 1 forwards;
  pointer-events: none;
}

@keyframes sonar-ping {
  from { transform: scale(1); opacity: 0.6; }
  to { transform: scale(1.8); opacity: 0; }
}
```

- [ ] **Step 2: Add share signal styles to globals.css**

Add the keyframes above to `src/styles/globals.css`.

- [ ] **Step 3: Apply `share-signal` class to share buttons**

In the SocialShare component, add the class to each share button element.

- [ ] **Step 4: Verify build passes**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/components/SocialShare.tsx src/styles/globals.css
git commit -m "feat: add glitch hover and sonar ping to share buttons"
```

---

### Task 14: Homepage Scroll Position Memory

SessionStorage preserves scroll position and expanded posts on homepage. Returns with a condensed 300ms transition.

**Files:**
- Create: `src/lib/session-scroll.ts`
- Modify: `src/site/Home.tsx`

- [ ] **Step 1: Write failing tests for session-scroll**

```typescript
// src/lib/__tests__/session-scroll.test.ts
import { describe, it, expect, beforeEach } from "vitest";
import { saveHomeScroll, loadHomeScroll, type HomeScrollState } from "../session-scroll";

describe("session-scroll", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("saves and loads scroll state", () => {
    const state: HomeScrollState = {
      scrollY: 450,
      expandedPosts: [3, 7, 12],
    };
    saveHomeScroll(state);
    const loaded = loadHomeScroll();
    expect(loaded).toEqual(state);
  });

  it("returns null when no state saved", () => {
    expect(loadHomeScroll()).toBeNull();
  });

  it("returns null when version mismatches", () => {
    // Simulate old version
    sessionStorage.setItem(
      "rg:home:scroll",
      JSON.stringify({ scrollY: 100, expandedPosts: [], version: -1 })
    );
    expect(loadHomeScroll()).toBeNull();
  });

  it("clears stored state", () => {
    saveHomeScroll({ scrollY: 100, expandedPosts: [] });
    expect(loadHomeScroll()).not.toBeNull();
    sessionStorage.removeItem("rg:home:scroll");
    expect(loadHomeScroll()).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/session-scroll.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement session-scroll**

```typescript
// src/lib/session-scroll.ts

const STORAGE_KEY = "rg:home:scroll";
const CURRENT_VERSION = 1;

export interface HomeScrollState {
  scrollY: number;
  expandedPosts: number[];
}

interface StoredState extends HomeScrollState {
  version: number;
}

/**
 * Save homepage scroll position and expanded posts to sessionStorage.
 */
export function saveHomeScroll(state: HomeScrollState): void {
  try {
    const stored: StoredState = { ...state, version: CURRENT_VERSION };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

/**
 * Load homepage scroll state from sessionStorage.
 * Returns null if no state exists or version mismatches.
 */
export function loadHomeScroll(): HomeScrollState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as StoredState;
    if (parsed.version !== CURRENT_VERSION) return null;

    return {
      scrollY: parsed.scrollY,
      expandedPosts: parsed.expandedPosts,
    };
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/session-scroll.test.ts`
Expected: All 4 tests PASS

- [ ] **Step 5: Integrate into Home.tsx**

In `src/site/Home.tsx`:

1. Import the session scroll utilities:

```typescript
import { saveHomeScroll, loadHomeScroll } from "@/lib/session-scroll";
```

2. On mount, restore scroll position if available:

```typescript
useEffect(() => {
  const saved = loadHomeScroll();
  if (saved) {
    // Restore expanded posts
    // (depends on how Home.tsx tracks expanded state — adapt to existing pattern)

    // Restore scroll position after a frame
    requestAnimationFrame(() => {
      window.scrollTo(0, saved.scrollY);
    });
  }
}, []);
```

3. Save state on navigation away (in a beforeunload or via the TransitionLink system):

```typescript
useEffect(() => {
  const save = () => {
    saveHomeScroll({
      scrollY: window.scrollY,
      expandedPosts: [], // populate with actual expanded post IDs
    });
  };

  // Save on any navigation away
  window.addEventListener("beforeunload", save);
  return () => {
    save(); // Also save on unmount (SPA navigation)
    window.removeEventListener("beforeunload", save);
  };
}, []);
```

- [ ] **Step 6: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Homepage remembers scroll position across navigations within the session.

- [ ] **Step 7: Commit**

```bash
git add src/lib/session-scroll.ts src/lib/__tests__/session-scroll.test.ts src/site/Home.tsx
git commit -m "feat: add sessionStorage scroll memory for homepage"
```

---

### Task 15: Post Expand Noise Wipe

When a post card expands to show full content, a horizontal noise wipe sweeps down the expanding area with content appearing behind it.

**Files:**
- Modify: `src/components/PostCard.tsx`

- [ ] **Step 1: Add noise wipe CSS to globals.css**

```css
/* Post expand: horizontal noise wipe sweeps down */
@keyframes noise-wipe-down {
  from {
    clip-path: inset(0 0 100% 0);
    filter: brightness(1.2) contrast(1.1);
  }
  to {
    clip-path: inset(0 0 0% 0);
    filter: brightness(1) contrast(1);
  }
}

.noise-wipe-enter {
  animation: noise-wipe-down 350ms cubic-bezier(0.22, 1, 0.36, 1) 1 forwards;
}
```

- [ ] **Step 2: Apply noise wipe to PostCard's expanded content area**

In `src/components/PostCard.tsx`, when the card expands (showFullContent becomes true), apply the `noise-wipe-enter` class to the expanding content wrapper:

```typescript
// In the AnimatePresence block where expanded content appears:
<motion.div
  initial={{ height: 0, opacity: 0 }}
  animate={{ height: "auto", opacity: 1 }}
  exit={{ height: 0, opacity: 0 }}
  className="noise-wipe-enter overflow-hidden"
>
  {/* expanded post body content */}
</motion.div>
```

- [ ] **Step 3: Verify build passes**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/PostCard.tsx src/styles/globals.css
git commit -m "feat: add noise wipe effect to post card expand transition"
```

---

### Task 16: 404 Heading Pixel-Font Flicker

The "SIGNAL NOT FOUND" heading on the 404 page continuously flickers through all pixel font variants.

**Files:**
- Modify: `src/site/NotFound.tsx`

- [ ] **Step 1: Add pixel-font cycling to 404 heading**

In `src/site/NotFound.tsx`, add a timer that cycles through pixel fonts on the heading:

```typescript
"use client";
import { useState, useEffect } from "react";

const PIXEL_FONTS = [
  "font-geist-pixel-square",
  "font-geist-pixel-grid",
  "font-geist-pixel-circle",
  "font-geist-pixel-triangle",
  "font-geist-pixel-line",
];

// Inside the component:
const [fontIndex, setFontIndex] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setFontIndex((i) => (i + 1) % PIXEL_FONTS.length);
  }, 200); // Fast flicker — cycles through all 5 in 1 second
  return () => clearInterval(interval);
}, []);

// On the heading:
<h1 className={cn("text-6xl uppercase tracking-widest", PIXEL_FONTS[fontIndex])}>
  Signal Not Found
</h1>
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. 404 heading flickers through pixel font variants.

- [ ] **Step 3: Commit**

```bash
git add src/site/NotFound.tsx
git commit -m "feat: add pixel-font flicker to 404 heading"
```

---

### Task 17: Enhanced Contact Ambient Effects

Contact border circuit speeds up while typing. Submit success triggers a ring pulse outward.

**Files:**
- Modify: `src/components/effects/AmbientLayer.tsx`
- Modify: `src/site/Contact.tsx`

- [ ] **Step 1: Make ContactAmbient accept a typing prop**

Update `ContactAmbient` in `AmbientLayer.tsx` to modulate animation speed:

```typescript
function ContactAmbient({ typing = false }: { typing?: boolean }) {
  return (
    <div className="absolute inset-8 md:inset-16 lg:inset-24">
      <div className="absolute inset-0 border border-[oklch(15%_0_0deg)] overflow-hidden">
        <div
          className="absolute w-[4px] h-[4px] bg-[color:var(--color-accent)] rounded-full"
          style={{
            animation: `border-travel ${typing ? "3s" : "8s"} linear infinite`,
          }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update AmbientLayer to accept and pass typing prop**

```typescript
interface AmbientLayerProps {
  variant: AmbientVariant;
  className?: string;
  /** Whether user is actively typing (contact form) */
  typing?: boolean;
}

// In the render:
{variant === "contact" && <ContactAmbient typing={typing} />}
```

- [ ] **Step 3: Wire typing detection in Contact.tsx**

In `src/site/Contact.tsx`:

```typescript
const [isTyping, setIsTyping] = useState(false);
const typingTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

const handleInput = useCallback(() => {
  setIsTyping(true);
  clearTimeout(typingTimeoutRef.current);
  typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1000);
}, []);

// Pass to AmbientLayer:
<AmbientLayer variant="contact" typing={isTyping} />

// Add onInput to form inputs:
<input onInput={handleInput} ... />
<textarea onInput={handleInput} ... />
```

- [ ] **Step 4: Add submit success ring pulse**

Add CSS for the success ring:

```css
/* Contact form submit success ring */
@keyframes submit-ring {
  from { transform: scale(1); opacity: 0.6; border-color: var(--color-accent); }
  to { transform: scale(2.5); opacity: 0; border-color: var(--color-accent); }
}

.submit-success-ring {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  margin: -50px 0 0 -50px;
  border: 2px solid var(--color-accent);
  border-radius: 50%;
  pointer-events: none;
  animation: submit-ring 500ms ease-out 1 forwards;
}
```

In Contact.tsx, on successful submit, briefly render the ring element:

```typescript
const [showSuccessRing, setShowSuccessRing] = useState(false);

// On successful submit:
setShowSuccessRing(true);
setTimeout(() => setShowSuccessRing(false), 500);

// In JSX:
{showSuccessRing && <div className="submit-success-ring" aria-hidden="true" />}
```

- [ ] **Step 5: Verify build passes**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 6: Commit**

```bash
git add src/components/effects/AmbientLayer.tsx src/site/Contact.tsx src/styles/globals.css
git commit -m "feat: add typing speed-up to contact border circuit and submit success ring"
```

---

### Task 18: Reactive Ambient Layers (Discography & Listen)

Discography frequency bands brighten when release cards enter viewport. Listen scan lines brighten near embeds.

**Files:**
- Modify: `src/components/effects/AmbientLayer.tsx`
- Modify: `src/site/Discography.tsx`
- Modify: `src/site/Listen.tsx`

- [ ] **Step 1: Make DiscographyAmbient reactive to card positions**

Replace the static `DiscographyAmbient` with a component that accepts active band indices:

```typescript
function DiscographyAmbient({ activeBand }: { activeBand?: number }) {
  return (
    <div className="absolute inset-0">
      {[20, 40, 60, 80].map((pct, i) => (
        <div
          key={pct}
          className={cn(
            "absolute left-0 right-0 h-[1px] transition-colors duration-500",
            i === activeBand
              ? "bg-[color:var(--color-accent)] opacity-60"
              : "bg-[oklch(20%_0_0deg)] opacity-100"
          )}
          style={{ top: `${pct}%` }}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Wire viewport detection in Discography.tsx**

In `src/site/Discography.tsx`:

```typescript
import { useInView } from "framer-motion";

// Track which release card is nearest to a frequency band
// Simple approach: divide viewport into 4 zones, detect which zone has a card
const [activeBand, setActiveBand] = useState<number | undefined>();

// For each release card, use a ref + useInView:
// When a card enters the viewport, compute which band (0-3) it's closest to
// based on its vertical position relative to the viewport quarters.

// Pass to AmbientLayer:
<AmbientLayer variant="discography" activeBand={activeBand} />
```

- [ ] **Step 3: Make ListenAmbient reactive to embed proximity**

Replace static `ListenAmbient` with proximity-aware scan lines:

```typescript
function ListenAmbient({ embedProximity = 0 }: { embedProximity?: number }) {
  // embedProximity: 0-1, where 1 = embed is center viewport
  const opacity = 0.03 + embedProximity * 0.08; // 0.03 base, up to 0.11 near embed
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{
          opacity,
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 3px, oklch(100% 0 0deg / 0.2) 3px, transparent 6px)",
          transition: "opacity 300ms ease-out",
        }}
      />
    </div>
  );
}
```

- [ ] **Step 4: Wire embed proximity in Listen.tsx**

Use IntersectionObserver or `useInView` on each embed container to detect proximity:

```typescript
// Simple approach: track if any embed is in the viewport center
const [embedProximity, setEmbedProximity] = useState(0);

// Use a scroll handler or IntersectionObserver with threshold steps
// to compute proximity of the nearest embed to viewport center.

<AmbientLayer variant="listen" embedProximity={embedProximity} />
```

- [ ] **Step 5: Update AmbientLayer props to pass through reactive values**

Update the `AmbientLayerProps` interface:

```typescript
interface AmbientLayerProps {
  variant: AmbientVariant;
  className?: string;
  typing?: boolean;
  activeBand?: number;
  embedProximity?: number;
}

// Route props to sub-components:
{variant === "discography" && <DiscographyAmbient activeBand={activeBand} />}
{variant === "listen" && <ListenAmbient embedProximity={embedProximity} />}
```

- [ ] **Step 6: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Discography bands brighten on card proximity, listen scan lines brighten near embeds.

- [ ] **Step 7: Commit**

```bash
git add src/components/effects/AmbientLayer.tsx src/site/Discography.tsx src/site/Listen.tsx
git commit -m "feat: add reactive ambient effects for discography bands and listen scan lines"
```

---

### Task 19: Prefers-Contrast Support

When `prefers-contrast: more` is active, disable ambient effects and increase card/text contrast. Uses `data-*` attributes for reliable targeting.

**Files:**
- Modify: `src/styles/globals.css`
- Modify: `src/components/effects/AmbientLayer.tsx`
- Modify: `src/components/PostCard.tsx`

- [ ] **Step 1: Add data attributes for high-contrast targeting**

In `AmbientLayer.tsx`, add `data-ambient` to the wrapper div:

```typescript
<div
  data-ambient
  className={cn("fixed inset-0 pointer-events-none", "z-[1]", className)}
  aria-hidden="true"
>
```

In `PostCard.tsx`, add `data-card` to the article element:

```typescript
<motion.article data-card className={...}>
```

- [ ] **Step 2: Add high-contrast media query overrides**

Add to `src/styles/globals.css`:

```css
/* High-contrast mode: prioritize legibility over atmosphere */
@media (prefers-contrast: more) {
  /* Disable all ambient effects */
  [data-ambient] { display: none; }
  .grain-overlay::after { display: none; }

  /* Increase card contrast */
  [data-card] {
    background-color: oklch(5% 0 0deg) !important;
    border-color: oklch(30% 0 0deg) !important;
  }

  /* Ensure text is high contrast */
  body { color: oklch(95% 0 0deg); }
}
```

- [ ] **Step 3: Verify build passes**

Run: `npx next build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/styles/globals.css src/components/effects/AmbientLayer.tsx src/components/PostCard.tsx
git commit -m "feat: add prefers-contrast:more support with data-attribute targeting"
```

---

## Summary

After completing this plan, the site will have:

1. **Nav link hover** — accent line shoots from left, existing ghost preserved
2. **Post card hover** — voltage spike border flash (CSS keyframes, zero re-renders)
3. **Button hover** — instant color inversion + single-frame jitter + active compression
4. **Gallery hover** — brightness jump + scan line sweep
5. **Link hover** — underline dash-break, reforms at accent brightness
6. **PixelLogo** — idle micro-glitch every 15-30s + scroll-driven letter-spacing
7. **Cursor trail** — phosphor persistence via Framer Motion frame scheduler, tier 3 desktop only
8. **Favicon cycling** — canvas-rendered "RG" in pixel fonts, 4s cycle, visibility-paused
9. **AmbientLayer** — per-page CSS effects with reactive variants:
   - Contact: typing speeds up border circuit + submit success ring pulse
   - Discography: frequency bands brighten on card proximity
   - Listen: scan lines brighten near embeds
   - 404: dense scan lines (heading flicker in NotFound.tsx)
   - About: vignette + ambient hot pixel
10. **Post expand** — horizontal noise wipe sweeps down expanding area
11. **Image loading** — noise shimmer placeholder with scan line
12. **Form focus** — clockwise border draw (wrapper-based) + label character flicker
13. **Share buttons** — hover glitch + sonar ping on click
14. **404 heading** — continuous pixel-font flicker through all variants
15. **Scroll memory** — sessionStorage preserves homepage position and expanded posts
16. **High-contrast support** — ambient effects disabled, card contrast increased, data-attribute targeting

**All three plans complete.** The full flagship build sequence is:
- Plan 1: Foundation (SignalBus, ShaderCanvas, progressive boot)
- Plan 2: Transitions & Choreography (TransitionOrchestrator, scroll entrances, AnimatedHeading, tier-gated)
- Plan 3: Craft & Polish (micro-interactions, ambient effects, cursor trail, favicon, session memory)
