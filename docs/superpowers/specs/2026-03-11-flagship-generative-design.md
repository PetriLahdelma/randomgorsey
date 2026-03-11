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
- **Uniforms:** `u_time`, `u_scroll`, `u_scrollVelocity`, `u_mouse`, `u_resolution`, `u_hourAngle`, `u_transition`, `u_pageIntensity`
- **Budget:** ~15KB shader source + WebGL bootstrap. Zero runtime dependencies.
- **Targets:** 30fps on tier 1, 60fps on tier 2+

### Degradation Chain

1. Tier 3: Full shader + particles + mouse influence
2. Tier 2: Shader only, no particles
3. Tier 1: Video fallback (`home_canvas.webm`)
4. No WebGL / reduced motion: Static poster image

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
- **Next.js integration:** `TransitionOrchestrator` in AppShell intercepts route changes via `usePathname`. Coordinates exit → shader spike → enter sequence.
- **600ms ceiling.** Percussive, not cinematic.

### Degradation

- Tier 3: Full sequence
- Tier 2: Skip DOM tearing, use opacity crossfade + shader spike
- Tier 1: Simple crossfade
- Reduced motion: Instant cut

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

- CSS `animation-timeline: scroll()` where supported, Lenis + `useInView` fallback
- No scroll-jacking. Lenis smoothing only.
- All velocity effects use single RAF loop via SignalBus
- Disabled on tier 1

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

**Inputs:** Lenis scroll position, Lenis scroll velocity, mouse position, route transition state, performance tier, monotonic time, current page.

**Consumers read via:** Direct property access, CSS custom properties on `document.documentElement`, or WebGL uniform updates.

**Zero React re-renders in the animation path.**

### Key Decisions

- **Shader is singleton:** One WebGL2 canvas in AppShell, persists across route changes. Never unmounts. Route changes modify uniforms only.
- **Progressive boot:** Content + video render immediately. Shader initializes in parallel, fades in with noise burst when ready. WebGL failure = video stays.
- **No React in the loop:** SignalBus is mutated in RAF. No useState, no useEffect for animation values. React handles structure and lifecycle only.
- **Transition gate:** TransitionOrchestrator intercepts route changes, coordinates exit → shader spike → enter sequence against 600ms budget.
- **Extended tier system:** Existing `usePerformance` gains WebGL capability detection. Tier 3: everything. Tier 2: simplified shader + opacity transitions. Tier 1: video + crossfade. Reduced motion: static + instant cuts.

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
│   │   ├── VideoBackground.tsx  — existing, becomes fallback
│   │   └── ParticleField.tsx    — existing (gallery lightbox only)
```
