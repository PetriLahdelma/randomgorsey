# Phase 7: Visual Effects Foundation - Research

**Researched:** 2026-01-17
**Domain:** WebGL/3D effects, video backgrounds, performance tiering
**Confidence:** HIGH

## Summary

Phase 7 implements full-bleed media backgrounds and performance-tiered WebGL/3D effects. The research covers four primary requirements: full-bleed video backgrounds (VSFX-01), full-bleed hero images (VSFX-02), WebGL particle effects (VSFX-03), and React Three Fiber 3D elements (VSFX-04).

The standard approach uses React Three Fiber with the Drei helper library for 3D effects, detect-gpu for performance tiering, and HTML5 video with proper mobile fallbacks. The existing Framer Motion setup and AnimationProvider provide accessibility integration via `useReducedMotion`.

**Primary recommendation:** Build a performance-tiered system that detects GPU capability at initialization and renders appropriate visual experiences: static images for tier 0, optimized video for tier 1-2, and full WebGL effects for tier 3.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @react-three/fiber | ^9.x | React renderer for Three.js | Official React Three Fiber, maintained by pmndrs |
| @react-three/drei | ^10.x | Helper components for R3F | Stars, Instances, LOD, Performance tools |
| @react-three/postprocessing | ^3.x | Post-processing effects | Bloom, Vignette, Noise - auto-merges for perf |
| detect-gpu | ^5.x | GPU capability detection | Classifies GPUs into tiers 0-3 based on benchmarks |
| three | ^0.175.x | 3D engine (peer dep) | Required by React Three Fiber |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| react-intersection-observer | ^9.x | Viewport detection | Lazy-load videos/effects when visible |
| leva | ^0.10.x | Debug controls | Dev-time tuning of particle/effect parameters |
| r3f-perf | ^8.x | Performance monitoring | Debug GPU calls, FPS, memory in dev |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| R3F | Vanilla Three.js | Less React integration, more boilerplate |
| detect-gpu | Manual WebGL checks | Less accurate, no benchmark data |
| @react-three/postprocessing | EffectComposer manual | More setup, less optimization |
| drei Instances | Raw InstancedMesh | Better perf at extreme scale, less declarative |

**Installation:**
```bash
npm install @react-three/fiber @react-three/drei @react-three/postprocessing detect-gpu three
npm install -D r3f-perf leva
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── effects/               # Visual effects components
│       ├── VideoBackground.tsx    # Full-bleed video with poster fallback
│       ├── HeroImage.tsx          # Full-bleed responsive images
│       ├── ParticleField.tsx      # WebGL particle system
│       ├── Scene3D.tsx            # R3F Canvas wrapper
│       └── index.ts               # Barrel export
├── hooks/
│   └── useGPUTier.ts          # GPU detection hook with caching
├── lib/
│   └── performance/
│       ├── gpu-tier.ts        # detect-gpu configuration
│       └── context.ts         # Performance tier React context
└── stories/
    └── effects/               # Storybook stories for effects
```

### Pattern 1: Performance Tier Provider
**What:** Context provider that detects GPU tier once and shares it app-wide
**When to use:** At app initialization, wrapping visual effects
**Example:**
```typescript
// Source: https://github.com/pmndrs/detect-gpu
import { getGPUTier, TierResult } from 'detect-gpu';
import { createContext, useContext, useEffect, useState } from 'react';

interface PerformanceContext {
  tier: number;           // 0-3
  isMobile: boolean;
  isReducedMotion: boolean;
  canWebGL: boolean;
}

const PerformanceCtx = createContext<PerformanceContext | null>(null);

export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [perf, setPerf] = useState<PerformanceContext>({
    tier: 1, // Safe default
    isMobile: false,
    isReducedMotion: false,
    canWebGL: true,
  });

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    getGPUTier().then((result: TierResult) => {
      setPerf({
        tier: reducedMotion ? 0 : result.tier,
        isMobile: result.isMobile ?? false,
        isReducedMotion: reducedMotion,
        canWebGL: result.tier > 0,
      });
    });
  }, []);

  return <PerformanceCtx.Provider value={perf}>{children}</PerformanceCtx.Provider>;
};

export const usePerformance = () => {
  const ctx = useContext(PerformanceCtx);
  if (!ctx) throw new Error('usePerformance must be used within PerformanceProvider');
  return ctx;
};
```

### Pattern 2: Tiered Video Background
**What:** Video that degrades gracefully based on device capability
**When to use:** Hero sections with video backgrounds
**Example:**
```typescript
// Source: https://web.dev/articles/lazy-loading-video + MDN HTMLVideoElement
import { usePerformance } from '@/lib/performance/context';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface VideoBackgroundProps {
  src: string;
  poster: string;
  className?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  poster,
  className,
}) => {
  const { tier, isMobile, isReducedMotion } = usePerformance();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0 });

  // Tier 0 or reduced motion: static image only
  if (tier === 0 || isReducedMotion) {
    return (
      <div
        className={cn('fixed inset-0 -z-10 bg-cover bg-center', className)}
        style={{ backgroundImage: `url(${poster})` }}
        role="img"
        aria-label="Background image"
      />
    );
  }

  // Mobile: poster until in view, then attempt video
  // Desktop tier 1+: video with lazy loading
  return (
    <div ref={ref} className={cn('fixed inset-0 -z-10', className)}>
      {inView ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={poster}
          className="h-full w-full object-cover"
        >
          <source src={src} type="video/webm" />
        </video>
      ) : (
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
    </div>
  );
};
```

### Pattern 3: On-Demand R3F Canvas
**What:** Canvas that only renders when scene changes, saves battery
**When to use:** Static or semi-static 3D scenes
**Example:**
```typescript
// Source: https://r3f.docs.pmnd.rs/advanced/scaling-performance
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor } from '@react-three/drei';

export const Scene3D: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { tier, canWebGL } = usePerformance();
  const [dpr, setDpr] = useState(1);

  if (!canWebGL || tier === 0) return null;

  return (
    <Canvas
      frameloop="demand"  // Only render when invalidated
      dpr={dpr}           // Dynamic pixel ratio
      gl={{ antialias: tier >= 2 }}
    >
      <PerformanceMonitor
        onIncline={() => setDpr(Math.min(2, dpr + 0.5))}
        onDecline={() => setDpr(Math.max(0.5, dpr - 0.5))}
      >
        {children}
      </PerformanceMonitor>
    </Canvas>
  );
};
```

### Pattern 4: Instanced Particles
**What:** GPU-efficient particle system using instancing
**When to use:** Particle effects that need 1000+ particles
**Example:**
```typescript
// Source: https://drei.docs.pmnd.rs/performances/instances
import { Instances, Instance } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

interface ParticleFieldProps {
  count?: number;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({ count = 1000 }) => {
  const { tier } = usePerformance();
  const actualCount = tier >= 3 ? count : tier >= 2 ? count / 2 : count / 4;

  const particles = useMemo(() => {
    return Array.from({ length: actualCount }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.1,
    }));
  }, [actualCount]);

  return (
    <Instances limit={actualCount}>
      <sphereGeometry args={[0.05, 8, 8]} />
      <meshBasicMaterial color="#ffffff" />
      {particles.map((p, i) => (
        <Instance key={i} position={p.position} scale={p.scale} />
      ))}
    </Instances>
  );
};
```

### Anti-Patterns to Avoid
- **useState in useFrame:** Causes React re-renders every frame; mutate refs instead
- **Creating objects in render:** Geometries/materials should be memoized or shared
- **Mount/unmount for visibility:** Use `visible` prop to toggle, not conditional rendering
- **100vh on mobile:** Use `dvh` or fixed dimensions to avoid Safari viewport bugs
- **Blocking video autoplay:** Always include `muted`, `playsinline` attributes

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GPU capability detection | WebGL feature checks | detect-gpu | Has benchmark data for 1000s of GPUs |
| Particle instancing | Manual THREE.InstancedMesh | drei Instances | Declarative, handles buffer updates |
| Post-processing chain | Manual EffectComposer | @react-three/postprocessing | Auto-merges effects for performance |
| Video autoplay detection | navigator.userAgent sniffing | Feature detection + poster fallback | More reliable, respects user settings |
| Reduced motion detection | Manual matchMedia | Framer Motion useReducedMotion | Already integrated with AnimationProvider |
| LOD switching | Manual distance calculations | drei Detailed | Handles camera distance automatically |
| Performance monitoring | Custom FPS counter | r3f-perf or PerformanceMonitor | Tracks GPU calls, memory, frame budget |

**Key insight:** The pmndrs ecosystem (React Three Fiber, drei, detect-gpu) is designed to work together. Using these libraries in combination provides better performance than hand-rolling equivalent functionality.

## Common Pitfalls

### Pitfall 1: Video Autoplay Failures on Mobile
**What goes wrong:** Video doesn't play on iOS/Android, shows black screen
**Why it happens:** Mobile browsers block autoplay for non-muted video
**How to avoid:** Always include `muted`, `playsinline`, and `poster` attributes
**Warning signs:** Black rectangle where video should be, works on desktop only

### Pitfall 2: 100vh Mobile Viewport Bug
**What goes wrong:** Content is cut off or extends behind browser chrome on iOS Safari
**Why it happens:** Safari calculates 100vh based on full viewport, not visible area
**How to avoid:** Use `dvh` (dynamic viewport height) or fixed pixel values
**Warning signs:** Hero section looks wrong on iPhone, works on Android/desktop

### Pitfall 3: WebGL Context Loss
**What goes wrong:** 3D scene goes blank, effects stop working
**Why it happens:** GPU memory pressure, tab backgrounding, device sleep
**How to avoid:** Handle `webglcontextlost` event, implement reconnection logic
**Warning signs:** Black canvas after tab switch, "WebGL context lost" console error

### Pitfall 4: Performance Regression in useFrame
**What goes wrong:** Frame rate drops, janky animations
**Why it happens:** Creating new objects every frame triggers GC; using setState
**How to avoid:** Mutate refs directly, reuse Vector3/Quaternion instances
**Warning signs:** Saw-tooth pattern in performance graph, GC pauses

### Pitfall 5: Bundle Size Explosion
**What goes wrong:** Slow initial load, large JS bundle
**Why it happens:** Three.js and postprocessing are large libraries
**How to avoid:** Use dynamic imports, only import what you need from drei
**Warning signs:** Bundle > 500KB for effects code, slow Lighthouse score

### Pitfall 6: Accessibility Violations
**What goes wrong:** Users with vestibular disorders experience motion sickness
**Why it happens:** Not respecting `prefers-reduced-motion` preference
**How to avoid:** Check `useReducedMotion()` and disable motion/video autoplay
**Warning signs:** WCAG 2.1 SC 2.3.3 failures, user complaints

## Code Examples

Verified patterns from official sources:

### Full-Bleed Hero Image
```typescript
// Source: Existing Bleed component pattern + object-fit best practices
import { Bleed } from '@/components/layout';

export const HeroImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => (
  <Bleed className="h-[50vh] md:h-[70vh]">
    <img
      src={src}
      alt={alt}
      className="h-full w-full object-cover"
      loading="lazy"
    />
  </Bleed>
);
```

### Bloom Post-Processing
```typescript
// Source: https://react-postprocessing.docs.pmnd.rs/effects/bloom
import { EffectComposer, Bloom, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';

export const PostEffects: React.FC = () => {
  const { tier } = usePerformance();
  if (tier < 2) return null; // Skip postprocessing on low-tier devices

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={1}
        luminanceSmoothing={0.9}
        intensity={0.5}
      />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  );
};
```

### Reduced Motion Integration
```typescript
// Source: https://motion.dev/docs/react-use-reduced-motion
import { useReducedMotion } from 'framer-motion';

export const AnimatedParticles: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    // Return static alternative
    return <StaticStarfield />;
  }

  return <ParticleField count={2000} />;
};
```

### Lazy-Load 3D Scene
```typescript
// Source: React.lazy + Suspense best practices
import { lazy, Suspense } from 'react';
import { useInView } from 'react-intersection-observer';

const Scene3D = lazy(() => import('./Scene3D'));

export const Lazy3DSection: React.FC = () => {
  const { ref, inView } = useInView({ triggerOnce: true, rootMargin: '200px' });

  return (
    <div ref={ref} className="h-[400px]">
      {inView && (
        <Suspense fallback={<div className="animate-pulse bg-muted h-full" />}>
          <Scene3D />
        </Suspense>
      )}
    </div>
  );
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FBO-based GPGPU | Compute shaders via TSL | 2024-2025 | 2-3x particle performance |
| 100vh for full-screen | dvh/svh viewport units | 2022-2023 | Fixes iOS Safari issues |
| Manual WebGL detection | detect-gpu benchmarks | 2020+ | Accurate GPU tiering |
| EffectComposer manual | @react-three/postprocessing | 2021+ | Auto-optimization |
| userAgent for mobile | Feature detection + Intersection Observer | 2020+ | More reliable |

**Deprecated/outdated:**
- `window.innerHeight` for mobile viewport: Use CSS viewport units
- Manual requestAnimationFrame loops: Use Framer Motion frame scheduler
- navigator.userAgent for capability detection: Use feature detection APIs

## Open Questions

Things that couldn't be fully resolved:

1. **WebGPU vs WebGL for particles**
   - What we know: WebGPU is successor with compute shader support
   - What's unclear: Browser support still limited in 2026
   - Recommendation: Use WebGL2 for now, plan WebGPU migration later

2. **Optimal particle count thresholds**
   - What we know: detect-gpu provides tier 0-3
   - What's unclear: Exact particle counts per tier depend on scene complexity
   - Recommendation: Start conservative, tune with r3f-perf in dev

3. **Video codec selection for best mobile support**
   - What we know: WebM has best compression, MP4 has widest support
   - What's unclear: HEVC/AV1 adoption varies by device
   - Recommendation: WebM primary with MP4 fallback, test on real devices

## Sources

### Primary (HIGH confidence)
- [React Three Fiber Performance Docs](https://r3f.docs.pmnd.rs/advanced/scaling-performance) - On-demand rendering, instancing
- [React Three Fiber Pitfalls](https://r3f.docs.pmnd.rs/advanced/pitfalls) - Common mistakes, useFrame patterns
- [detect-gpu GitHub](https://github.com/pmndrs/detect-gpu) - Tier API, configuration options
- [drei Instances](https://drei.docs.pmnd.rs/performances/instances) - Instanced mesh patterns
- [react-postprocessing Bloom](https://react-postprocessing.docs.pmnd.rs/effects/bloom) - Post-processing setup
- [MDN HTMLVideoElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback) - Video API
- [Framer Motion Accessibility](https://motion.dev/docs/react-use-reduced-motion) - useReducedMotion hook

### Secondary (MEDIUM confidence)
- [web.dev Lazy Loading Video](https://web.dev/articles/lazy-loading-video) - Intersection Observer patterns
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) - Accessibility guidance
- [Shopify Background Video CSS](https://www.shopify.com/blog/background-video-css) - Mobile considerations
- [Medium 100vh Fix](https://medium.com/@alekswebnet/fix-mobile-100vh-bug-in-one-line-of-css-dynamic-viewport-units-in-action-102231e2ed56) - dvh units

### Tertiary (LOW confidence)
- [wawa-vfx](https://wawasensei.dev/blog/wawa-vfx-open-source-particle-system-for-react-three-fiber-projects) - Alternative particle library
- [R3FPointsFX](https://pointsfx.vercel.app/) - High-performance particle system

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - pmndrs ecosystem is well-documented and maintained
- Architecture: HIGH - Patterns verified from official docs
- Pitfalls: HIGH - Common issues documented across multiple sources
- Performance tiering: MEDIUM - Exact thresholds require testing

**Research date:** 2026-01-17
**Valid until:** 2026-02-17 (30 days - stable ecosystem)

## Integration with Existing Codebase

### Leveraging Current Infrastructure

The codebase already has key infrastructure this phase builds upon:

1. **AnimationProvider** (`src/lib/motion/AnimationProvider.tsx`):
   - Already wraps app with `MotionConfig reducedMotion="user"`
   - PerformanceProvider should wrap or integrate with AnimationProvider

2. **Bleed Component** (`src/components/layout/Bleed.tsx`):
   - Already implements `relative left-1/2 w-screen -translate-x-1/2`
   - VideoBackground and HeroImage can use Bleed for breakout

3. **Existing Video Background** (`src/pages/Home.tsx`):
   - Current implementation uses `isWebMSupported()` utility
   - Upgrade path: Replace with VideoBackground component using detect-gpu

4. **Lenis Integration** (`src/lib/motion/LenisProvider.tsx`):
   - Already disabled for mobile and reduced motion
   - 3D scenes should respect same conditions

### Required Additions

- `src/lib/performance/context.tsx` - GPU tier detection provider
- `src/components/effects/` - New effects components directory
- `src/stories/effects/` - Storybook stories for effects
- Video poster images for each existing .webm file in `src/videos/`
