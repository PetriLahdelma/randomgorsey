# Flagship Generative Site Design

**Date:** 2026-03-11
**Status:** Approved
**Scope:** Transform Random Gorsey from a well-built portfolio into a flagship art-tech showcase

## Design Direction

**The Hybrid: Canvas + Machine** — generative shader environments as backdrop, brutalist editorial content layer on top. The site feels like a living signal being broadcast from a concrete basement.

**Reference points:** Digital art installations (Teamlab, Refik Anadol), brutalist editorial (Bloomberg, Ssense), underground electronic culture (Burial, Aphex Twin), technical showpieces (Awwwards/FWA).

**Performance philosophy:** Flagship first, graceful degradation. Push visuals hard on capable devices, tier system handles the rest.

**No audio.** Embedded players handle music. The site is visual-only.

**Homepage is king.** Gets the most ambitious treatment. Interior pages are quieter.

## Performance Tier Definitions

Aligned with the existing `gpu-tier.ts` in the codebase:

| Tier | Device Class | Shader | Transitions | Ambient Effects | Cursor Trail |
|---|---|---|---|---|---|
| 0 | Reduced motion / no WebGL | Static poster | Instant cut | None | No |
| 1 | Low-end / old mobile | Video fallback | Simple crossfade | Grain only | No |
| 2 | Mid-range | Simplified shader (no particles) | Opacity crossfade + shader spike | Per-page CSS effects | No |
| 3 | High-end desktop/mobile | Full shader + particles + mouse | Full 5-phase DOM tear sequence | All effects | Yes |

All degradation tables throughout this spec use this four-tier vocabulary.

## Section 1: Homepage Shader Environment

Replace the `home_canvas.webm` video background with a real-time GLSL fragment shader running on a fullscreen WebGL2 canvas.

### Concept: Signal Interference

The background is a corrupted broadcast signal. Horizontal noise bands that compress and release like breathing, sharp glitch lines that flash and displace, hot pixels flickering with step-function timing. The aesthetic is analog TV signal bleeding through concrete — CRT in a basement venue, VHS tracking artifacts, modular synth patched to a monitor.

### Shader Behaviors

- **Rhythmic pulse:** Horizontal bands of noise compress and expand at different rates (polyrhythmic, never synchronized). Bands brighten to ~25% luminance at peak.
- **Glitch stutters:** Every 5-8 seconds (pseudo-random, never predictable), a sharp horizontal line flashes across in accent yellow with CRT-style horizontal displacement. Brief (2-3 frames).
- **Scroll = distortion:** Scrolling increases noise intensity and band compression. Fast scrolling destabilizes the whole field. Stopping lets it resettle.
- **Hot pixels:** Scattered dead/hot pixels flicker in and out — single points and short horizontal dashes. Accent yellow. Step-function timing (instant on/off, no fade).
- **Mouse influence (desktop):** Cursor position subtly bends the noise field with gravity and inertia. Not a flashlight — the field flows around the cursor.
- **No looping:** Noise evolves from `u_time` (monotonic float). Layered sine waves at irrational frequency ratios ensure the pattern never visibly repeats.

### Technical

- **Renderer:** Raw WebGL2 canvas (no Three.js — single fullscreen quad)
- **Shader:** Fragment shader with simplex noise, FBM, distance field particles
- **Uniforms:** `u_time`, `u_scroll`, `u_scrollVelocity`, `u_mouse`, `u_resolution`, `u_hourAngle` (radians, drives subtle color temperature shift — warmer evenings, cooler mornings, barely perceptible), `u_transition` (0→1→0 during route changes), `u_pageIntensity` (per-page ambient intensity from 0.0-1.0)
- **Budget:** ~15KB minified GLSL source + WebGL bootstrap JS. This is an aspiration — if the shader exceeds this, cut mouse influence first, then hot pixels, then time-of-day variation. Core noise topology + scroll response + glitch stutters are non-negotiable.
- **Targets:** 60fps on tier 2+. Tier 1 uses video fallback, no shader rendering.

### Degradation Chain

Per the tier table above:
- Tier 3: Full shader + distance field particles + mouse influence
- Tier 2: Shader core (noise + bands + glitch), no particles or mouse
- Tier 1: Video fallback (`home_canvas.webm`)
- Tier 0: Static poster image, no animation

## Section 2: Page Transitions

### Concept: Signal Disruption

When navigating, the signal breaks down. Current page destabilizes, tears apart, raw signal is briefly exposed, new page assembles from the interference.

### Five-Phase Sequence (~600ms total)

1. **Destabilize (0-120ms):** Current page content glitches. Random horizontal slices shift left/right by 2-8px. Noise overlay ramps from 6% to 30%. Shader turbulence spikes.
2. **Tear (120-220ms):** Content splits into horizontal bands sliding offscreen in alternating directions (odd left, even right). Speed varies per band. VHS yank feel.
3. **Raw Signal (220-340ms):** The signature moment. No content visible — shader at full intensity. Scan lines thicken. A bright horizontal band sweeps vertically (CRT refresh). ~120ms — long enough to register as a beat, short enough to not feel like waiting.
4. **Assemble (340-480ms):** New page content slides in from alternating directions (reverse of tear). Bands staggered by 15-30ms each. Content slightly displaced horizontally.
5. **Lock (480-600ms):** Content snaps to final position. One last micro-glitch (single frame horizontal jitter). Noise overlay eases back to ambient. Shader calms.

### Technical

- **DOM tearing:** CSS `clip-path` slices page into 6-10 horizontal bands. Each band gets independent `translateX` via WAAPI for 60fps. No layout thrashing.
- **Shader coordination:** `u_transition` uniform (0→1→0) drives turbulence intensity, scan line density, and refresh bar.
- **600ms ceiling.** Percussive, not cinematic.

### Next.js App Router Integration

The App Router does not support exit animations natively. The approach is **overlay masking**, not navigation delay:

1. A custom `<TransitionLink>` component wraps all internal `<Link>` elements. On click, it calls `e.preventDefault()`, starts the exit animation, then calls `router.push()` after the tear phase completes (~220ms).
2. During the "Raw Signal" phase (220-340ms), the shader overlay at z:5 (between content layers) masks the DOM swap happening underneath. The new route renders behind the overlay — the user never sees raw DOM replacement.
3. Once the new page component mounts, the assemble phase begins (340-600ms). If the destination component hasn't mounted yet (slow dynamic import), the raw signal phase extends up to an additional 200ms maximum, then cuts to the new page. 800ms absolute ceiling.
4. **Browser back/forward:** Cannot be intercepted. These skip the exit phase entirely — the shader fires a condensed 300ms transition (raw signal → assemble → lock only). Detected via `popstate` event listener.
5. **Direct URL / refresh:** No transition. Standard server render + progressive shader boot.
6. **Anchor links (same page):** No transition. Lenis smooth scroll only.

### Degradation

- Tier 3: Full 5-phase sequence
- Tier 2: Skip DOM tearing, use opacity crossfade + shader spike
- Tier 1: Simple 200ms crossfade
- Tier 0: Instant cut, no animation

## Section 3: Typography & Scroll Choreography

### Heading Treatments

- Character-stagger reveal with slight blur and x-offset
- Ghost echo behind in accent color (offset, scaled up, low opacity)
- Underline draws on from left after text lands
- Ghost position responds to scroll velocity (lags and catches up with inertia)

### Per-Content-Type Scroll Entrances

| Content Type | Entrance |
|---|---|
| Post cards | Alternating horizontal slide-in (odd left, even right) with noise/grain burst that clears on settle. Category label snaps in first, then title, then body fades. |
| Gallery images | Scan-line reveal — image clipped top-to-bottom with bright line at clip edge. Like a CRT drawing a frame. |
| Section headings | Character stagger with ghost (as above). |
| Audio/embeds | Border box draws itself clockwise (top→right→bottom→left). Content fades in once box completes. Signal establishing its frame. |
| Body text | Simple opacity + 8px y-offset, 300ms. Restraint — reading shouldn't be a performance. |

### Scroll Velocity Feedback

- **Shader response:** `u_scrollVelocity` drives turbulence. Faster scroll = more chaotic noise field.
- **Content parallax (desktop):** Category labels move faster than titles, titles faster than body. Subtle depth without 3D transforms.
- **Heading ghost drift:** Ghost echo lags behind and catches up with spring easing. Fast scroll = further trail.
- **Grain intensity:** Overlay opacity scales from 0.06 (rest) to 0.15 (speed). Settles over ~400ms.

### Technical

- **Primary approach:** Lenis scroll events + `useInView` (Framer Motion) for all scroll-driven choreography. This is the only code path — no `animation-timeline: scroll()`. Browser support is too inconsistent to justify two implementations.
- No scroll-jacking. Lenis smoothing only.
- All velocity effects use single RAF loop via SignalBus
- Scroll choreography disabled on tier 0 and tier 1. Tier 2 gets scroll reveals but no velocity feedback.

## Section 4: Micro-interactions & Craft Details

### Design Principle

Every micro-interaction uses the same vocabulary: **signal, interference, voltage, persistence**. No bounce, no rubber-band, no confetti. Sharp transitions, horizontal displacement, accent flashes, noise bursts.

### Hover States

| Element | Behavior |
|---|---|
| Nav links | Keep existing GlitchLink ghost. Add: 1px horizontal line shoots from left edge on hover (100ms). |
| Post cards | Border flash — steps from oklch(12%) to accent yellow for one frame (16ms), settles to oklch(18%). Voltage spike on contact. |
| Buttons | Instant color inversion (bg→accent, text→black). Single-frame 1px horizontal jitter. Active state compresses 1px vertically. |
| Gallery thumbs | Brightness jumps 0.95→1.1 (instant). Single accent scan line sweeps down once (200ms). |
| Links / Read More | Underline breaks into dashes for 2 frames then reforms solid at full accent brightness. Signal strengthening. |

### PixelLogo Enhancements

- **Idle micro-glitch:** Every 15-30s (random), a single character flickers to a different pixel font for 2 frames, then returns. Always slightly alive.
- **Scroll distortion:** Letter-spacing increases proportional to scroll velocity. Signal stretching under load. Spring easing on settle.

### State Transitions

- **Image loading:** Noise shimmer placeholder (animated grain at 15% + repeating scan line). Image replaces noise with flash at clip boundary.
- **Post expand:** Horizontal noise wipe sweeps down the expanding area. Content appears behind it.
- **Form focus:** Border draws itself clockwise. Label does single character-flicker (cycles pixel fonts, 150ms).
- **Share buttons:** Horizontal displacement glitch on hover (2px, 1 frame). Click: icon inverts, ring expands outward and fades (sonar ping).

### Ambient Details

- **Cursor trail (desktop):** Normal arrow cursor. Faint trail of 3-4 afterimages (2px accent dots) fading over 200ms. Phosphor persistence. Dedicated canvas layer.
- **Favicon pulse:** Cycles 2-3 pixel font variants of "RG" every 4 seconds. Canvas-generated favicons.
- **Selection color:** `::selection` with accent yellow background, black text.
- **Scroll position memory:** Homepage remembers scroll position and expanded posts via sessionStorage. Return transition plays condensed 300ms version.

## Section 5: Interior Page Treatments

Each page gets a distinct ambient frequency within the shared signal vocabulary. Wrapped in a single `<AmbientLayer variant="..." />` component.

### Intensity Scale

| Page | Intensity | Treatment |
|---|---|---|
| Homepage | 100% | Full shader environment |
| 404 | 80% | Full signal loss — shader at elevated intensity, heavy scan lines, frequent glitches. "SIGNAL NOT FOUND" heading flickers through all pixel fonts. The page IS the error. |
| /listen | 30% | Reactive scan lines — brighten and pulse near playing embeds. Signal stronger near source. |
| /contact | 25% | Border pulse circuit — accent dot travels form border continuously (8s loop), speeds up while typing. Submit success: ring pulse outward. |
| /discography | 20% | Frequency bands — thin horizontal lines at 20% viewport intervals. Nearest line brightens to accent when release card enters viewport. |
| /about | 15% | Static grain (0.08 opacity), edge vignette, one ambient hot pixel in upper corner. Quiet. |
| /gallery | 5% | Minimal — no grain on images. Shader appears faintly (5%) in lightbox overlay only. |

## Section 6: Engineering Architecture

### Layer Stack (bottom to top)

1. **z:0 GPU Layer** — WebGL2 canvas, fullscreen shader / video fallback
2. **z:1 Ambient Layer** — per-page CSS effects (scan lines, border circuits, frequency bands)
3. **z:2 Grain Overlay** — CSS pseudo-element, opacity driven by scroll velocity
4. **z:10 Content Layer** — page components, Framer Motion variants, scroll choreography, clip-path transitions
5. **z:40 Header + Nav** — sticky, backdrop-blur
6. **z:50 Cursor Canvas** — phosphor trail, pointer-events:none

### SignalBus

A plain JS singleton (not React state) that collects all input signals in a single RAF callback and exposes them to consumers.

```typescript
interface SignalState {
  // Scroll (from Lenis)
  scrollY: number;          // pixels from top
  scrollVelocity: number;   // pixels/frame, smoothed
  scrollProgress: number;   // 0-1 normalized

  // Mouse (desktop only, -1 when inactive)
  mouseX: number;           // 0-1 normalized to viewport
  mouseY: number;           // 0-1 normalized to viewport

  // Transition
  transition: number;       // 0-1, peaks during route change
  page: string;             // current pathname
  pageIntensity: number;    // 0-1, per-page ambient intensity

  // System
  time: number;             // monotonic seconds since boot
  hourAngle: number;        // radians, derived from local clock
  tier: 0 | 1 | 2 | 3;     // performance tier (set once at boot)
  reducedMotion: boolean;   // prefers-reduced-motion
}
```

**Write path:** A single RAF callback reads Lenis state, mouse position, and internal timers, then mutates the singleton object. Lenis fires first (via Framer Motion's `frame.update` as the existing `LenisProvider` does), then SignalBus reads the updated Lenis values in the same frame. No separate RAF loop — SignalBus hooks into Framer Motion's frame scheduler via `frame.read` (runs after `frame.update`).

**Read paths:**
- **WebGL shader:** `ShaderCanvas` reads SignalState properties directly in its own `frame.render` callback and pushes them as uniforms. Same frame, no delay.
- **CSS custom properties:** SignalBus writes `--signal-velocity`, `--signal-transition`, `--signal-grain-opacity` to `document.documentElement.style` each frame. CSS consumers (grain overlay, ambient effects) bind to these variables. No JS needed per-consumer.
- **React components:** `useSignal()` returns a stable ref (`React.useRef<SignalState>`) pointing to the singleton. Components read `ref.current.velocity` inside event handlers or layout effects. Never triggers re-renders. For components that need to re-render on tier change (rare, boot-only), a separate `usePerformance()` hook with React state is used (already exists).

**Zero React re-renders in the animation path.**

### RAF Loop Ownership

There is one frame scheduler: **Framer Motion's**. The existing `LenisProvider` already uses `frame.update`. New systems hook in at appropriate priorities:

1. `frame.update` — Lenis smooth scroll (existing)
2. `frame.read` — SignalBus reads Lenis state + mouse + time, mutates singleton, writes CSS vars
3. `frame.render` — ShaderCanvas pushes uniforms and renders WebGL frame

This avoids multiple competing RAF loops.

### Key Decisions

- **Shader is singleton:** One WebGL2 canvas in AppShell, persists across route changes. Never unmounts. Route changes modify `u_transition` and `u_pageIntensity` uniforms only.
- **Progressive boot:** Content + video render immediately. Shader initializes in parallel, fades in with noise burst when ready. WebGL failure = video stays. User never sees a blank screen.
- **No React in the loop:** SignalBus is mutated in RAF. No useState, no useEffect for animation values. React handles structure and lifecycle only.
- **Transition gate:** TransitionOrchestrator intercepts route changes via custom `<TransitionLink>`, coordinates exit → shader spike → enter sequence against 600ms budget (see Section 2).
- **Extended tier system:** Existing `usePerformance` gains WebGL2 capability detection via `canvas.getContext('webgl2')` check at boot.
- **ParticleField:** The existing Three.js ParticleField is removed. The homepage shader replaces its visual role. Gallery lightbox gets the shader at 5% intensity instead of a separate Three.js scene. No dual WebGL contexts.

### Accessibility

- **`prefers-reduced-motion`:** All animation disabled. Instant cuts for transitions. Static poster backgrounds. Tier 0 behavior regardless of GPU capability.
- **Screen readers during transitions:** An `aria-live="polite"` region announces "Navigating to [page name]" at transition start. Content is never removed from the DOM during transition — it's visually masked by the shader overlay but remains accessible.
- **Photosensitivity (WCAG 2.3.1):** The "Raw Signal" phase must not flash more than 3 times per second. The accent yellow glitch line (2-3 frames) fires at most once per transition. Hot pixel flicker is sub-threshold (individual pixels, not large areas). The shader's rhythmic pulse is slow (multi-second cycles) and low contrast. These constraints are hard requirements on the shader implementation.
- **`prefers-contrast: more`:** Ambient effects disabled. Card borders and text contrast increased. Content legibility takes priority over atmosphere.

### Favicon and Background Tab Behavior

- Favicon cycling pauses when `document.visibilityState !== 'visible'`. Resumes on tab focus.
- Shader RAF skips rendering when tab is not visible (already standard WebGL behavior, but enforced explicitly).
- Cursor trail canvas is not created on devices without persistent pointer (touch-only tablets, phones). Detection via `window.matchMedia('(pointer: fine)')`.

### sessionStorage Strategy

- Storage key: `rg:home:scroll` — contains `{ scrollY: number, expandedPosts: number[], version: number }`.
- `version` field incremented on deploy (build-time constant). Mismatched versions discard stored state.
- Maximum 56 post IDs stored (current total). If posts exceed 200 in the future, only store the first screen's worth.

### New File Structure

```
src/
├── lib/
│   ├── signal/
│   │   ├── SignalBus.ts          — singleton state + RAF loop
│   │   ├── useSignal.ts         — React hook (read-only, no re-renders)
│   │   └── index.ts
│   ├── shader/
│   │   ├── ShaderCanvas.tsx     — WebGL2 fullscreen quad component
│   │   ├── noise-topology.frag  — main GLSL fragment shader
│   │   ├── passthrough.vert     — simple vertex shader
│   │   └── webgl-utils.ts       — compile, link, uniform helpers
│   ├── transition/
│   │   ├── TransitionOrchestrator.tsx — route change coordinator
│   │   ├── DOMTear.ts           — clip-path + WAAPI band animations
│   │   └── index.ts
│   └── motion/                  — existing, extended with new variants
├── components/
│   ├── effects/
│   │   ├── AmbientLayer.tsx     — per-page ambient effects
│   │   ├── CursorTrail.tsx      — phosphor persistence canvas
│   │   ├── ScanLineReveal.tsx   — image reveal animation
│   │   ├── BorderCircuit.tsx    — traveling dot border effect
│   │   └── VideoBackground.tsx  — existing, becomes shader fallback
```
