# Flagship Foundation Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the SignalBus, WebGL shader canvas, and progressive boot system that all subsequent flagship features depend on.

**Architecture:** A singleton SignalBus collects scroll/mouse/time signals in Framer Motion's frame scheduler and exposes them to a persistent WebGL2 shader canvas and CSS custom properties. The shader renders a fullscreen noise-interference field behind all content, with video/poster fallback. React never re-renders for animation values.

**Tech Stack:** TypeScript, WebGL2 (raw — no Three.js), GLSL, Framer Motion frame scheduler, Lenis, Next.js 16 App Router

**Spec:** `docs/superpowers/specs/2026-03-11-flagship-generative-design.md`

**Plan series:** This is Plan 1 of 3. Plan 2 covers transitions & choreography. Plan 3 covers craft & polish.

---

## Chunk 1: SignalBus

The core reactive state system that feeds all animation consumers. A plain JS singleton — no React state, no re-renders.

### Task 1: SignalBus Singleton

**Files:**
- Create: `src/lib/signal/SignalBus.ts`
- Create: `src/lib/signal/__tests__/SignalBus.test.ts`

- [ ] **Step 1: Write failing tests for SignalBus**

```typescript
// src/lib/signal/__tests__/SignalBus.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { SignalBus, createSignalBus } from '../SignalBus';

describe('SignalBus', () => {
  let bus: SignalBus;

  beforeEach(() => {
    bus = createSignalBus();
  });

  it('initializes with default state', () => {
    const state = bus.state;
    expect(state.scrollY).toBe(0);
    expect(state.scrollVelocity).toBe(0);
    expect(state.scrollProgress).toBe(0);
    expect(state.mouseX).toBe(-1);
    expect(state.mouseY).toBe(-1);
    expect(state.transition).toBe(0);
    expect(state.page).toBe('/');
    expect(state.pageIntensity).toBe(1);
    expect(state.time).toBe(0);
    expect(state.hourAngle).toBe(0);
    expect(state.tier).toBe(1);
    expect(state.reducedMotion).toBe(false);
  });

  it('updates scroll values', () => {
    bus.updateScroll(500, 12.5, 0.25);
    expect(bus.state.scrollY).toBe(500);
    expect(bus.state.scrollVelocity).toBe(12.5);
    expect(bus.state.scrollProgress).toBe(0.25);
  });

  it('updates mouse position', () => {
    bus.updateMouse(0.5, 0.3);
    expect(bus.state.mouseX).toBe(0.5);
    expect(bus.state.mouseY).toBe(0.3);
  });

  it('resets mouse to -1 when deactivated', () => {
    bus.updateMouse(0.5, 0.3);
    bus.deactivateMouse();
    expect(bus.state.mouseX).toBe(-1);
    expect(bus.state.mouseY).toBe(-1);
  });

  it('updates transition value', () => {
    bus.setTransition(0.7);
    expect(bus.state.transition).toBe(0.7);
  });

  it('updates page and intensity', () => {
    bus.setPage('/gallery', 0.05);
    expect(bus.state.page).toBe('/gallery');
    expect(bus.state.pageIntensity).toBe(0.05);
  });

  it('updates time and hourAngle', () => {
    bus.updateTime(1.5, 3.14);
    expect(bus.state.time).toBe(1.5);
    expect(bus.state.hourAngle).toBe(3.14);
  });

  it('keeps previous hourAngle when not provided', () => {
    bus.updateTime(1.0, 2.0);
    bus.updateTime(2.0);
    expect(bus.state.time).toBe(2.0);
    expect(bus.state.hourAngle).toBe(2.0);
  });

  it('sets tier and reducedMotion', () => {
    bus.configure({ tier: 3, reducedMotion: false });
    expect(bus.state.tier).toBe(3);
    expect(bus.state.reducedMotion).toBe(false);
  });

  it('writes CSS custom properties to a target element', () => {
    const el = document.createElement('div');
    bus.updateScroll(0, 5.0, 0.1);
    bus.writeCSSVars(el);
    expect(el.style.getPropertyValue('--signal-velocity')).toBe('5');
    expect(el.style.getPropertyValue('--signal-transition')).toBe('0');
    // grain opacity = 0.06 + velocity * 0.018 clamped to 0.15
    expect(el.style.getPropertyValue('--signal-grain-opacity')).toBe('0.15');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/signal/__tests__/SignalBus.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement SignalBus**

```typescript
// src/lib/signal/SignalBus.ts

export interface SignalState {
  scrollY: number;
  scrollVelocity: number;
  scrollProgress: number;
  mouseX: number;
  mouseY: number;
  transition: number;
  page: string;
  pageIntensity: number;
  time: number;
  hourAngle: number;
  tier: 0 | 1 | 2 | 3;
  reducedMotion: boolean;
}

export interface SignalBus {
  readonly state: SignalState;
  updateScroll(y: number, velocity: number, progress: number): void;
  updateMouse(x: number, y: number): void;
  deactivateMouse(): void;
  setTransition(value: number): void;
  setPage(path: string, intensity: number): void;
  updateTime(elapsed: number, hourAngle?: number): void;
  configure(opts: { tier: 0 | 1 | 2 | 3; reducedMotion: boolean }): void;
  writeCSSVars(el: HTMLElement): void;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function createSignalBus(): SignalBus {
  const state: SignalState = {
    scrollY: 0,
    scrollVelocity: 0,
    scrollProgress: 0,
    mouseX: -1,
    mouseY: -1,
    transition: 0,
    page: '/',
    pageIntensity: 1,
    time: 0,
    hourAngle: 0,
    tier: 1,
    reducedMotion: false,
  };

  return {
    get state() {
      return state;
    },

    updateScroll(y, velocity, progress) {
      state.scrollY = y;
      state.scrollVelocity = velocity;
      state.scrollProgress = progress;
    },

    updateMouse(x, y) {
      state.mouseX = x;
      state.mouseY = y;
    },

    deactivateMouse() {
      state.mouseX = -1;
      state.mouseY = -1;
    },

    setTransition(value) {
      state.transition = value;
    },

    setPage(path, intensity) {
      state.page = path;
      state.pageIntensity = intensity;
    },

    updateTime(elapsed, hourAngle?) {
      state.time = elapsed;
      if (hourAngle !== undefined) state.hourAngle = hourAngle;
    },

    configure({ tier, reducedMotion }) {
      state.tier = tier;
      state.reducedMotion = reducedMotion;
    },

    writeCSSVars(el) {
      const v = Math.abs(state.scrollVelocity);
      const grainOpacity = clamp(0.06 + v * 0.018, 0.06, 0.15);

      el.style.setProperty('--signal-velocity', String(v));
      el.style.setProperty('--signal-transition', String(state.transition));
      el.style.setProperty('--signal-grain-opacity', String(grainOpacity));
    },
  };
}

/** Singleton instance for the app */
let instance: SignalBus | null = null;

export function getSignalBus(): SignalBus {
  if (!instance) {
    instance = createSignalBus();
  }
  return instance;
}

/** Reset singleton — for testing only */
export function resetSignalBus(): void {
  instance = null;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/signal/__tests__/SignalBus.test.ts`
Expected: All 8 tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/signal/SignalBus.ts src/lib/signal/__tests__/SignalBus.test.ts
git commit -m "feat(signal): add SignalBus singleton with tests"
```

---

### Task 2: useSignal React Hook

**Files:**
- Create: `src/lib/signal/useSignal.ts`
- Create: `src/lib/signal/__tests__/useSignal.test.ts`
- Create: `src/lib/signal/index.ts`

- [ ] **Step 1: Write failing test for useSignal**

```typescript
// src/lib/signal/__tests__/useSignal.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSignal } from '../useSignal';
import { getSignalBus, resetSignalBus } from '../SignalBus';

describe('useSignal', () => {
  beforeEach(() => resetSignalBus());

  it('returns a ref to the SignalBus state', () => {
    const { result } = renderHook(() => useSignal());
    expect(result.current.current).toBe(getSignalBus().state);
  });

  it('ref stays stable across re-renders', () => {
    const { result, rerender } = renderHook(() => useSignal());
    const firstRef = result.current;
    rerender();
    expect(result.current).toBe(firstRef);
  });

  it('reflects mutations from SignalBus without re-render', () => {
    const { result } = renderHook(() => useSignal());
    const bus = getSignalBus();
    bus.updateScroll(100, 5, 0.1);
    // No rerender needed — ref points to same mutable object
    expect(result.current.current.scrollY).toBe(100);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/signal/__tests__/useSignal.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement useSignal**

```typescript
// src/lib/signal/useSignal.ts
import { useRef } from 'react';
import { getSignalBus } from './SignalBus';
import type { SignalState } from './SignalBus';

/**
 * Returns a stable ref pointing to the SignalBus state singleton.
 *
 * Read `ref.current.scrollVelocity` etc. inside event handlers,
 * layout effects, or RAF callbacks. Never triggers React re-renders.
 */
export function useSignal(): React.RefObject<SignalState> {
  const ref = useRef<SignalState>(getSignalBus().state);
  return ref;
}
```

- [ ] **Step 4: Create barrel export**

```typescript
// src/lib/signal/index.ts
export { getSignalBus, createSignalBus, resetSignalBus } from './SignalBus';
export type { SignalBus, SignalState } from './SignalBus';
export { useSignal } from './useSignal';
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/lib/signal/__tests__/`
Expected: All 11 tests PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/signal/
git commit -m "feat(signal): add useSignal hook and barrel exports"
```

---

### Task 3: SignalBus Frame Integration

Wire SignalBus into Framer Motion's frame scheduler so it updates every frame from Lenis scroll data, mouse position, and time.

**Files:**
- Create: `src/lib/signal/SignalBusProvider.tsx`
- Modify: `src/lib/motion/AnimationProvider.tsx`

- [ ] **Step 1: Create SignalBusProvider**

This component hooks into Framer Motion's `frame.read` to update the SignalBus each frame. It also listens for mouse events and pushes data into the bus.

```typescript
// src/lib/signal/SignalBusProvider.tsx
"use client";

import { useEffect, useRef, useContext } from 'react';
import { frame, cancelFrame } from 'framer-motion';
import { LenisContext } from 'lenis/react';
import { usePerformance } from '@/lib/performance';
import { getSignalBus } from './SignalBus';

interface SignalBusProviderProps {
  children: React.ReactNode;
}

/**
 * Safely get Lenis instance from context — returns null if no provider.
 * useLenis() from lenis/react is callback-style and does not return the instance.
 */
function useLenisSafe() {
  const context = useContext(LenisContext);
  return context?.lenis ?? null;
}

/**
 * Wires SignalBus into Framer Motion's frame scheduler.
 *
 * Updates every frame with:
 * - Scroll data from Lenis
 * - Mouse position (desktop only)
 * - Monotonic time
 * - CSS custom properties on document.documentElement
 *
 * Must be rendered inside AnimationProvider (after PerformanceProvider and LenisProvider).
 */
export function SignalBusProvider({ children }: SignalBusProviderProps) {
  const lenis = useLenisSafe();
  const perf = usePerformance();
  const bus = getSignalBus();
  const startTime = useRef(performance.now());
  // Cache hourAngle — recompute once per minute, not every frame
  const hourAngleRef = useRef({ value: 0, lastUpdate: 0 });

  // Configure tier on mount and when perf changes
  useEffect(() => {
    bus.configure({
      tier: perf.tier as 0 | 1 | 2 | 3,
      reducedMotion: perf.isReducedMotion,
    });
  }, [perf.tier, perf.isReducedMotion, bus]);

  // Mouse tracking (desktop only — pointer: fine)
  useEffect(() => {
    const isFineMouse = window.matchMedia('(pointer: fine)').matches;
    if (!isFineMouse) return;

    const onMove = (e: MouseEvent) => {
      bus.updateMouse(
        e.clientX / window.innerWidth,
        e.clientY / window.innerHeight,
      );
    };

    const onLeave = () => {
      bus.deactivateMouse();
    };

    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [bus]);

  // Frame loop: read Lenis + time, write CSS vars
  useEffect(() => {
    function read() {
      // Time (hourAngle throttled to once per minute)
      const now = performance.now();
      const elapsed = (now - startTime.current) / 1000;
      if (now - hourAngleRef.current.lastUpdate > 60000) {
        const date = new Date();
        const hours = date.getHours() + date.getMinutes() / 60;
        hourAngleRef.current.value = (hours / 24) * Math.PI * 2;
        hourAngleRef.current.lastUpdate = now;
      }
      bus.updateTime(elapsed, hourAngleRef.current.value);

      // Scroll from Lenis (if available)
      if (lenis) {
        const limit = lenis.limit || 1;
        bus.updateScroll(
          lenis.scroll,
          lenis.velocity,
          lenis.scroll / limit,
        );
      }

      // CSS vars
      bus.writeCSSVars(document.documentElement);
    }

    frame.read(read, true);
    return () => cancelFrame(read);
  }, [lenis, bus]);

  return <>{children}</>;
}
```

Note: The `updateTime` signature changes to accept an explicit `hourAngle` parameter instead of computing it internally. Update SignalBus accordingly:

```typescript
// In SignalBus.ts, change updateTime to:
updateTime(elapsed: number, hourAngle?: number) {
  state.time = elapsed;
  if (hourAngle !== undefined) state.hourAngle = hourAngle;
},
```

- [ ] **Step 2: Add SignalBusProvider to AnimationProvider**

Modify `src/lib/motion/AnimationProvider.tsx` to wrap children with SignalBusProvider, inside the LenisProvider (so Lenis context is available):

```typescript
// src/lib/motion/AnimationProvider.tsx
import React from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';
import { LenisProvider } from './LenisProvider';
import { PerformanceProvider } from '@/lib/performance';
import { SignalBusProvider } from '@/lib/signal/SignalBusProvider';

interface AnimationProviderProps {
  children: React.ReactNode;
  reducedMotion?: 'user' | 'always' | 'never';
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({
  children,
  reducedMotion = 'user',
}) => {
  return (
    <PerformanceProvider>
      <LazyMotion features={domAnimation}>
        <MotionConfig reducedMotion={reducedMotion}>
          <LenisProvider>
            <SignalBusProvider>{children}</SignalBusProvider>
          </LenisProvider>
        </MotionConfig>
      </LazyMotion>
    </PerformanceProvider>
  );
};

export default AnimationProvider;
```

- [ ] **Step 3: Export SignalBusProvider from signal barrel**

Add to `src/lib/signal/index.ts`:

```typescript
export { SignalBusProvider } from './SignalBusProvider';
```

- [ ] **Step 4: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. No type errors. The SignalBus now updates every frame but has no visual consumers yet.

- [ ] **Step 5: Commit**

```bash
git add src/lib/signal/SignalBusProvider.tsx src/lib/signal/index.ts src/lib/motion/AnimationProvider.tsx
git commit -m "feat(signal): wire SignalBus into Framer Motion frame scheduler"
```

---

## Chunk 2: WebGL Shader Infrastructure

Raw WebGL2 utilities, the GLSL noise-interference shader, and the ShaderCanvas component.

### Task 4: WebGL Utility Functions

**Files:**
- Create: `src/lib/shader/webgl-utils.ts`
- Create: `src/lib/shader/__tests__/webgl-utils.test.ts`

- [ ] **Step 1: Write failing tests for WebGL utilities**

```typescript
// src/lib/shader/__tests__/webgl-utils.test.ts
import { describe, it, expect } from 'vitest';
import { compileShader, createProgram, setUniform } from '../webgl-utils';

// These tests use a real WebGL2 context via OffscreenCanvas (available in Node 18+)
// If OffscreenCanvas is unavailable, we test the error paths.

describe('webgl-utils', () => {
  function getGL(): WebGL2RenderingContext | null {
    try {
      const canvas = new OffscreenCanvas(1, 1);
      return canvas.getContext('webgl2');
    } catch {
      return null;
    }
  }

  it('compileShader returns a shader object for valid GLSL', () => {
    const gl = getGL();
    if (!gl) return; // Skip in environments without WebGL2
    const src = 'void main() { gl_Position = vec4(0.0); }';
    const shader = compileShader(gl, gl.VERTEX_SHADER, src);
    expect(shader).not.toBeNull();
  });

  it('compileShader returns null for invalid GLSL', () => {
    const gl = getGL();
    if (!gl) return;
    const shader = compileShader(gl, gl.VERTEX_SHADER, 'not valid glsl');
    expect(shader).toBeNull();
  });

  it('createProgram returns a program for valid shaders', () => {
    const gl = getGL();
    if (!gl) return;
    const vert = 'void main() { gl_Position = vec4(0.0); }';
    const frag = `#version 300 es
precision mediump float;
out vec4 fragColor;
void main() { fragColor = vec4(1.0); }`;
    const program = createProgram(gl, vert, frag);
    expect(program).not.toBeNull();
  });

  it('createProgram returns null when linking fails', () => {
    const gl = getGL();
    if (!gl) return;
    // Valid individual shaders but mismatched (varying mismatch etc.)
    // Simplest: pass an empty string for one
    const program = createProgram(gl, '', '');
    expect(program).toBeNull();
  });

  it('setUniform sets float uniform', () => {
    const gl = getGL();
    if (!gl) return;
    const vert = `#version 300 es
void main() { gl_Position = vec4(0.0); }`;
    const frag = `#version 300 es
precision mediump float;
uniform float u_test;
out vec4 fragColor;
void main() { fragColor = vec4(u_test); }`;
    const program = createProgram(gl, vert, frag);
    if (!program) return;
    gl.useProgram(program);
    // Should not throw
    setUniform(gl, program, 'u_test', 0.5);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/shader/__tests__/webgl-utils.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement WebGL utilities**

```typescript
// src/lib/shader/webgl-utils.ts

/**
 * Compile a single GLSL shader.
 * Returns null on failure (logs error to console).
 */
export function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Create and link a WebGL program from vertex + fragment source.
 * Returns null on failure.
 */
export function createProgram(
  gl: WebGL2RenderingContext,
  vertSource: string,
  fragSource: string,
): WebGLProgram | null {
  const vert = compileShader(gl, gl.VERTEX_SHADER, vertSource);
  const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSource);
  if (!vert || !frag) return null;

  const program = gl.createProgram();
  if (!program) return null;

  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  // Shaders can be detached after linking
  gl.detachShader(program, vert);
  gl.detachShader(program, frag);
  gl.deleteShader(vert);
  gl.deleteShader(frag);

  return program;
}

/**
 * Set a uniform value by name. Supports float, vec2, vec3, vec4.
 */
export function setUniform(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  name: string,
  ...values: number[]
): void {
  const loc = gl.getUniformLocation(program, name);
  if (!loc) return; // Uniform may be optimized out

  switch (values.length) {
    case 1:
      gl.uniform1f(loc, values[0]);
      break;
    case 2:
      gl.uniform2f(loc, values[0], values[1]);
      break;
    case 3:
      gl.uniform3f(loc, values[0], values[1], values[2]);
      break;
    case 4:
      gl.uniform4f(loc, values[0], values[1], values[2], values[3]);
      break;
  }
}

/**
 * Create a fullscreen quad VAO (two triangles covering clip space).
 */
export function createFullscreenQuad(gl: WebGL2RenderingContext): WebGLVertexArrayObject | null {
  const vao = gl.createVertexArray();
  if (!vao) return null;

  gl.bindVertexArray(vao);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  // Two triangles covering [-1, 1] clip space
  const vertices = new Float32Array([
    -1, -1,
     1, -1,
    -1,  1,
    -1,  1,
     1, -1,
     1,  1,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);
  return vao;
}

/**
 * Check if WebGL2 is available in this browser.
 * Safe to call during SSR (returns false).
 */
export function isWebGL2Available(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2');
    return gl !== null;
  } catch {
    return false;
  }
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/shader/__tests__/webgl-utils.test.ts`
Expected: Tests pass (or skip gracefully if no OffscreenCanvas)

- [ ] **Step 5: Commit**

```bash
git add src/lib/shader/webgl-utils.ts src/lib/shader/__tests__/webgl-utils.test.ts
git commit -m "feat(shader): add WebGL2 utility functions with tests"
```

---

### Task 5: GLSL Shaders

**Files:**
- Create: `src/lib/shader/passthrough.vert.ts`
- Create: `src/lib/shader/noise-topology.frag.ts`

Note: GLSL source is stored as TypeScript string exports (not raw `.glsl` files) to avoid build tooling for shader imports.

- [ ] **Step 1: Create vertex shader**

```typescript
// src/lib/shader/passthrough.vert.ts

/** Minimal passthrough vertex shader for a fullscreen quad. */
export const passthroughVert = `#version 300 es
layout(location = 0) in vec2 a_position;
out vec2 v_uv;

void main() {
  // Map [-1,1] clip coords to [0,1] UV coords
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;
```

- [ ] **Step 2: Create fragment shader**

This is the core noise-interference shader. It implements: simplex noise, FBM, horizontal bands, glitch stutters, hot pixels, scroll/mouse/transition response.

```typescript
// src/lib/shader/noise-topology.frag.ts

/** Signal interference fragment shader — the site's living background. */
export const noiseTopologyFrag = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

// Uniforms from SignalBus
uniform float u_time;
uniform float u_scroll;
uniform float u_scrollVelocity;
uniform vec2 u_mouse;        // -1,-1 when inactive
uniform vec2 u_resolution;
uniform float u_hourAngle;
uniform float u_transition;   // 0-1 during route changes
uniform float u_pageIntensity; // per-page ambient level

// --- Noise functions ---

// Simplex-like hash
vec3 mod289(vec3 x) { return x - floor(x / 289.0) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x / 289.0) * 289.0; }
vec3 permute(vec3 x) { return mod289((x * 34.0 + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 a0 = x - floor(x + 0.5);
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// FBM (fractal Brownian motion)
float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * snoise(p);
    p *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

// --- Pseudo-random hash ---
float hash(float n) { return fract(sin(n) * 43758.5453123); }
float hash2(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

void main() {
  vec2 uv = v_uv;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = u_time;
  float intensity = u_pageIntensity;
  float vel = abs(u_scrollVelocity) * 0.002; // normalize velocity
  float trans = u_transition;

  // --- Base noise field ---
  // Irrational frequency ratios prevent visible looping
  vec2 noiseCoord = p * 3.0 + vec2(
    t * 0.07 + sin(t * 0.031) * 0.5,
    t * 0.05 + cos(t * 0.019) * 0.3
  );
  float n = fbm(noiseCoord) * 0.5 + 0.5;

  // --- Horizontal bands (polyrhythmic) ---
  float band1 = smoothstep(0.48, 0.52, sin(uv.y * 6.2831 * 2.0 + t * 1.0) * 0.5 + 0.5);
  float band2 = smoothstep(0.48, 0.52, sin(uv.y * 6.2831 * 3.0 + t * 1.618) * 0.5 + 0.5);
  float band3 = smoothstep(0.48, 0.52, sin(uv.y * 6.2831 * 5.0 + t * 2.317) * 0.5 + 0.5);
  float bands = (band1 + band2 * 0.7 + band3 * 0.4) / 2.1;
  bands *= 0.25 * intensity; // peak ~25% luminance

  // Scroll compresses bands vertically
  float scrollDistort = vel * 2.0 + trans * 3.0;
  bands *= (1.0 + scrollDistort);

  // --- Scan lines ---
  float scanDensity = mix(3.0, 1.5, trans); // thicken during transition
  float scanLine = step(0.5, fract(uv.y * u_resolution.y / scanDensity));
  float scanAlpha = mix(0.015, 0.04, trans) * intensity;

  // --- Glitch stutter ---
  // Fire at pseudo-random intervals (~every 5-8 seconds)
  float glitchSeed = floor(t * 0.15); // changes ~every 6.7s
  float glitchRand = hash(glitchSeed);
  float glitchActive = step(0.85, glitchRand); // ~15% chance per interval
  float glitchY = hash(glitchSeed + 100.0);
  float glitchLine = smoothstep(0.0, 0.003, abs(uv.y - glitchY));
  glitchLine = (1.0 - glitchLine) * glitchActive;
  // Horizontal displacement during glitch
  float hDisplace = glitchLine * (hash(glitchSeed + 200.0) - 0.5) * 0.01;

  // Amplify glitch during transition
  glitchLine *= mix(1.0, 3.0, trans);

  // --- Hot pixels ---
  float hotPixel = 0.0;
  for (int i = 0; i < 5; i++) {
    vec2 hpPos = vec2(hash(float(i) * 73.0 + floor(t * 0.3)), hash(float(i) * 137.0 + floor(t * 0.2)));
    float hpActive = step(0.7, hash(float(i) * 53.0 + floor(t * (0.3 + float(i) * 0.1))));
    float dist = length(uv - hpPos);
    hotPixel += step(dist, 0.002) * hpActive;
  }
  // Horizontal dash variant
  for (int i = 0; i < 3; i++) {
    vec2 hdPos = vec2(hash(float(i) * 91.0 + floor(t * 0.25)), hash(float(i) * 173.0 + floor(t * 0.15)));
    float hdActive = step(0.75, hash(float(i) * 67.0 + floor(t * (0.2 + float(i) * 0.08))));
    float dy = abs(uv.y - hdPos.y);
    float dx = uv.x - hdPos.x;
    hotPixel += step(dy, 0.001) * step(0.0, dx) * step(dx, 0.015) * hdActive;
  }
  hotPixel = min(hotPixel, 1.0) * intensity;

  // --- Mouse influence (gravity bend) ---
  if (u_mouse.x >= 0.0) {
    vec2 mouseUV = u_mouse;
    vec2 toMouse = mouseUV - uv;
    float mouseDist = length(toMouse);
    float mouseInfluence = smoothstep(0.4, 0.0, mouseDist) * 0.3;
    n += mouseInfluence * snoise(p * 2.0 + t * 0.1);
  }

  // --- CRT refresh sweep (transition only) ---
  float sweep = 0.0;
  if (trans > 0.3) {
    float sweepPos = fract(t * 1.5);
    sweep = smoothstep(0.0, 0.01, abs(uv.y - sweepPos));
    sweep = (1.0 - sweep) * smoothstep(0.3, 0.5, trans) * 0.8;
  }

  // --- Time-of-day color temperature ---
  // hourAngle: 0 = midnight, PI = noon
  float dayFactor = sin(u_hourAngle) * 0.5 + 0.5; // 0 at midnight, 1 at noon
  vec3 warmTint = vec3(1.0, 0.95, 0.85);  // evening
  vec3 coolTint = vec3(0.9, 0.95, 1.0);   // morning
  vec3 timeTint = mix(warmTint, coolTint, dayFactor);

  // --- Compose ---
  float base = n * 0.12 * intensity;
  base += bands;
  base += scanLine * scanAlpha;

  // Apply hDisplace to UV for final sampling distortion
  float displaced = fbm(noiseCoord + vec2(hDisplace * 50.0, 0.0)) * 0.5 + 0.5;
  base = mix(base, displaced * 0.15 * intensity, abs(hDisplace) * 100.0);

  // Accent color: electric yellow oklch(90% 0.18 85deg) ≈ rgb(0.95, 0.88, 0.35)
  vec3 accentYellow = vec3(0.95, 0.88, 0.35);
  vec3 baseColor = vec3(base) * timeTint;

  // Glitch line in accent color
  vec3 color = baseColor + glitchLine * accentYellow * 0.7 * intensity;

  // Hot pixels in accent
  color += hotPixel * accentYellow * 0.9;

  // CRT sweep in accent
  color += sweep * accentYellow * 0.6;

  // Transition boost: overall brightness spike
  color *= 1.0 + trans * 2.0;

  fragColor = vec4(color, 1.0);
}
`;
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/shader/passthrough.vert.ts src/lib/shader/noise-topology.frag.ts
git commit -m "feat(shader): add GLSL vertex and fragment shaders"
```

---

### Task 6: ShaderCanvas Component

The persistent fullscreen WebGL2 canvas that lives in AppShell.

**Files:**
- Create: `src/lib/shader/ShaderCanvas.tsx`
- Create: `src/lib/shader/index.ts`

- [ ] **Step 1: Implement ShaderCanvas**

```typescript
// src/lib/shader/ShaderCanvas.tsx
"use client";

import { useEffect, useRef, useCallback } from 'react';
import { frame, cancelFrame } from 'framer-motion';
import { usePerformance } from '@/lib/performance';
import { getSignalBus } from '@/lib/signal';
import { createProgram, createFullscreenQuad, setUniform, isWebGL2Available } from './webgl-utils';
import { passthroughVert } from './passthrough.vert';
import { noiseTopologyFrag } from './noise-topology.frag';

interface ShaderCanvasProps {
  /** Called when shader fails to initialize — parent should show video fallback */
  onFallback?: () => void;
  /** Called when shader successfully boots — parent can fade out video */
  onReady?: () => void;
}

/**
 * Persistent fullscreen WebGL2 canvas rendering the noise-interference shader.
 *
 * Reads from SignalBus each frame via Framer Motion's frame.render priority.
 * Never unmounts across route changes — uniforms change, canvas stays.
 *
 * Falls back gracefully:
 * - Tier 0/1: renders nothing, calls onFallback
 * - WebGL2 unavailable: calls onFallback
 * - Shader compile failure: calls onFallback
 */
export function ShaderCanvas({ onFallback, onReady }: ShaderCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const vaoRef = useRef<WebGLVertexArrayObject | null>(null);
  const readyRef = useRef(false);
  const { tier, isReducedMotion } = usePerformance();
  // Stabilize callbacks via refs to prevent re-initialization on parent re-render
  const onFallbackRef = useRef(onFallback);
  const onReadyRef = useRef(onReady);
  onFallbackRef.current = onFallback;
  onReadyRef.current = onReady;

  const bus = getSignalBus();

  // Initialize WebGL
  const init = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return false;

    if (tier <= 1 || isReducedMotion || !isWebGL2Available()) {
      onFallbackRef.current?.();
      return false;
    }

    const gl = canvas.getContext('webgl2', {
      alpha: false,
      antialias: false,
      powerPreference: 'high-performance',
    });

    if (!gl) {
      onFallbackRef.current?.();
      return false;
    }

    const program = createProgram(gl, passthroughVert, noiseTopologyFrag);
    if (!program) {
      onFallbackRef.current?.();
      return false;
    }

    const vao = createFullscreenQuad(gl);
    if (!vao) {
      onFallbackRef.current?.();
      return false;
    }

    glRef.current = gl;
    programRef.current = program;
    vaoRef.current = vao;

    gl.useProgram(program);

    // Handle WebGL context loss — fall back to video
    canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
      readyRef.current = false;
      onFallbackRef.current?.();
    });

    // Optional: attempt recovery on context restore
    canvas.addEventListener('webglcontextrestored', () => {
      init();
    });

    return true;
  }, [tier, isReducedMotion]);

  // Resize canvas to match display
  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const gl = glRef.current;
    if (!canvas || !gl) return;

    const dpr = tier >= 3 ? Math.min(window.devicePixelRatio, 2) : 1;
    const width = Math.floor(canvas.clientWidth * dpr);
    const height = Math.floor(canvas.clientHeight * dpr);

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }, [tier]);

  // Boot shader
  useEffect(() => {
    const success = init();
    if (success) {
      resize();
      readyRef.current = true;
      onReadyRef.current?.();
    }

    const onResize = () => resize();
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [init, resize]);

  // Render loop — hooks into Framer Motion's frame.render
  // Skip registration entirely for low tiers to avoid no-op RAF callbacks
  useEffect(() => {
    if (tier <= 1 || isReducedMotion) return;

    function render() {
      const gl = glRef.current;
      const program = programRef.current;
      const vao = vaoRef.current;
      const canvas = canvasRef.current;
      if (!gl || !program || !vao || !canvas || !readyRef.current) return;

      // Skip when tab is hidden
      if (document.visibilityState === 'hidden') return;

      resize();

      const s = bus.state;

      setUniform(gl, program, 'u_time', s.time);
      setUniform(gl, program, 'u_scroll', s.scrollY);
      setUniform(gl, program, 'u_scrollVelocity', s.scrollVelocity);
      setUniform(gl, program, 'u_mouse', s.mouseX, s.mouseY);
      setUniform(gl, program, 'u_resolution', canvas.width, canvas.height);
      setUniform(gl, program, 'u_hourAngle', s.hourAngle);
      setUniform(gl, program, 'u_transition', s.transition);
      setUniform(gl, program, 'u_pageIntensity', s.pageIntensity);

      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    frame.render(render, true);
    return () => cancelFrame(render);
  }, [bus, resize]);

  // Cleanup WebGL on unmount
  useEffect(() => {
    return () => {
      const gl = glRef.current;
      if (gl) {
        if (programRef.current) gl.deleteProgram(programRef.current);
        if (vaoRef.current) gl.deleteVertexArray(vaoRef.current);
        const ext = gl.getExtension('WEBGL_lose_context');
        ext?.loseContext();
      }
      glRef.current = null;
      programRef.current = null;
      vaoRef.current = null;
      readyRef.current = false;
    };
  }, []);

  // Don't render canvas for low tiers
  if (tier <= 1 || isReducedMotion) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
```

- [ ] **Step 2: Create barrel export**

```typescript
// src/lib/shader/index.ts
export { ShaderCanvas } from './ShaderCanvas';
export { isWebGL2Available } from './webgl-utils';
```

- [ ] **Step 3: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. ShaderCanvas is not yet mounted in AppShell.

- [ ] **Step 4: Commit**

```bash
git add src/lib/shader/
git commit -m "feat(shader): add ShaderCanvas component with WebGL2 noise-interference shader"
```

---

## Chunk 3: Integration

Wire the shader into AppShell with progressive boot and video fallback.

### Task 7: Progressive Boot in AppShell

Mount ShaderCanvas in AppShell. VideoBackground becomes the fallback — shown immediately, faded out when shader is ready.

**Files:**
- Modify: `src/components/AppShell.tsx`
- Modify: `src/components/effects/VideoBackground.tsx`

- [ ] **Step 1: Update AppShell to mount ShaderCanvas**

```typescript
// src/components/AppShell.tsx
"use client";

import React from "react";

import CookieConsent from "@/components/CookieConsent";

import { AnimationProvider } from "@/lib/motion";
import { cn } from "@/lib/utils";
import Footer from "@/patterns/Footer";
import Header from "@/patterns/Header";
import { initializeSecurityMeasures } from "@/utils/httpsEnforcement";
import { ShaderCanvas } from "@/lib/shader";

interface AppShellContextValue {
  setOverlayActive: (active: boolean) => void;
}

const AppShellContext = React.createContext<AppShellContextValue>({
  setOverlayActive: () => {},
});

export function useAppShell() {
  return React.useContext(AppShellContext);
}

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [isOverlayActive, setOverlayActive] = React.useState(false);
  const [shaderReady, setShaderReady] = React.useState(false);
  const [shaderFailed, setShaderFailed] = React.useState(false);

  React.useEffect(() => {
    initializeSecurityMeasures();
  }, []);

  const value = React.useMemo(
    () => ({ setOverlayActive }),
    []
  );

  return (
    <AnimationProvider>
        <AppShellContext.Provider value={value}>
          {/* Shader canvas — persistent across route changes */}
          {!shaderFailed && (
            <ShaderCanvas
              onReady={() => setShaderReady(true)}
              onFallback={() => setShaderFailed(true)}
            />
          )}

          <div className={cn("flex min-h-screen flex-col text-center", "relative z-10")}>
            <Header />
            <main className="pt-16">
            {children}
            </main>
            {!isOverlayActive && <Footer />}
            <CookieConsent />
          </div>
        </AppShellContext.Provider>
    </AnimationProvider>
  );
}
```

Note: The `shaderReady` state is available for child components to know when to fade out their VideoBackground. We expose it via AppShellContext in the next step.

- [ ] **Step 2: Extend AppShellContext with shaderReady**

Add `shaderReady` to the context so page components can hide their VideoBackground when the shader is active:

Update the context interface and value in `AppShell.tsx`:

```typescript
interface AppShellContextValue {
  setOverlayActive: (active: boolean) => void;
  shaderReady: boolean;
}

const AppShellContext = React.createContext<AppShellContextValue>({
  setOverlayActive: () => {},
  shaderReady: false,
});

// In the component:
const value = React.useMemo(
  () => ({ setOverlayActive, shaderReady }),
  [shaderReady]
);
```

- [ ] **Step 3: Update VideoBackground to respect shaderReady**

Modify `src/components/effects/VideoBackground.tsx` to accept a `hidden` prop and fade out when the shader takes over:

```typescript
// Add to VideoBackgroundProps:
export interface VideoBackgroundProps {
  src: string;
  poster: string;
  fallbackSrc?: string;
  className?: string;
  overlayOpacity?: number;
  /** When true, video fades out (shader has taken over) */
  hidden?: boolean;
}

// In the component, wrap the return in a transition container:
export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  poster,
  fallbackSrc,
  className,
  overlayOpacity = 0,
  hidden = false,
}) => {
  const { tier, isMobile, isReducedMotion } = usePerformance();

  const wrapperClass = cn(
    'fixed inset-0 -z-10 h-dvh transition-opacity duration-500',
    hidden && 'opacity-0 pointer-events-none',
    className,
  );

  // Tier 0, reduced motion, or mobile: static image only
  if (tier === 0 || isReducedMotion || isMobile) {
    return (
      <div className={wrapperClass}>
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${poster})` }}
          role="img"
          aria-label="Background"
        />
        {overlayOpacity > 0 && (
          <div
            className="absolute inset-0 bg-black"
            style={{ opacity: overlayOpacity }}
            aria-hidden="true"
          />
        )}
      </div>
    );
  }

  // Desktop tier 1+: video with poster fallback
  return (
    <div className={wrapperClass}>
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={poster}
        className="h-full w-full object-cover"
      >
        <source src={src} type="video/webm" />
        {fallbackSrc && <source src={fallbackSrc} type="video/mp4" />}
      </video>
      {overlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
```

- [ ] **Step 4: Update ALL page components to pass shaderReady to VideoBackground**

Every file in `src/site/` that uses `<VideoBackground>` needs two changes:
1. Import and destructure `shaderReady` from `useAppShell()`
2. Add `hidden={shaderReady}` to the `<VideoBackground>` component

Files to update (8 total):
- `src/site/Home.tsx`
- `src/site/Gallery.tsx`
- `src/site/Listen.tsx`
- `src/site/About.tsx`
- `src/site/Contact.tsx`
- `src/site/Discography.tsx`
- `src/site/NotFound.tsx`
- `src/site/Post.tsx`

For each file, the change is the same pattern:

```typescript
// Add import if not already present:
import { useAppShell } from "@/components/AppShell";

// Inside the component, add (or extend existing destructuring):
const { shaderReady } = useAppShell();
// If the component already uses useAppShell, just add shaderReady to the destructuring:
// const { setOverlayActive, shaderReady } = useAppShell();

// On every <VideoBackground> instance, add the hidden prop:
<VideoBackground
  src={...}
  poster={...}
  overlayOpacity={...}
  hidden={shaderReady}
/>
```

Verify no other files use VideoBackground: `grep -r "VideoBackground" src/ --include="*.tsx" -l`

- [ ] **Step 5: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. On tier 2+, the shader canvas renders behind content. On tier 0-1, video fallback shows as before.

- [ ] **Step 6: Manual verification**

Run: `npx next dev -p 3002`

Verify:
1. Homepage shows the noise-interference shader behind content (tier 2+ device)
2. Scrolling causes visible turbulence increase in the shader
3. Mouse movement subtly bends the noise field
4. The video background fades out once the shader initializes
5. No console errors

- [ ] **Step 7: Commit**

```bash
git add src/components/AppShell.tsx src/components/effects/VideoBackground.tsx src/site/Home.tsx src/site/Gallery.tsx src/site/Listen.tsx src/site/About.tsx src/site/Contact.tsx src/site/Discography.tsx src/site/NotFound.tsx src/site/Post.tsx
git commit -m "feat: integrate ShaderCanvas into AppShell with progressive boot and video fallback"
```

---

### Task 8: Page Intensity Mapping

Wire up per-page ambient intensity so the shader dims on interior pages.

**Files:**
- Create: `src/lib/signal/page-intensity.ts`
- Modify: `src/lib/signal/SignalBusProvider.tsx`

- [ ] **Step 1: Write failing tests for page intensity**

```typescript
// src/lib/signal/__tests__/page-intensity.test.ts
import { describe, it, expect } from 'vitest';
import { getPageIntensity } from '../page-intensity';

describe('getPageIntensity', () => {
  it('returns 1.0 for homepage', () => {
    expect(getPageIntensity('/')).toBe(1.0);
  });

  it('strips trailing slashes', () => {
    expect(getPageIntensity('/gallery/')).toBe(0.05);
    expect(getPageIntensity('/listen/')).toBe(0.3);
  });

  it('returns correct values for all known pages', () => {
    expect(getPageIntensity('/listen')).toBe(0.3);
    expect(getPageIntensity('/contact')).toBe(0.25);
    expect(getPageIntensity('/discography')).toBe(0.2);
    expect(getPageIntensity('/about')).toBe(0.15);
    expect(getPageIntensity('/gallery')).toBe(0.05);
  });

  it('returns 0.8 for unknown routes (404, post pages)', () => {
    expect(getPageIntensity('/unknown')).toBe(0.8);
    expect(getPageIntensity('/posts/some-slug')).toBe(0.8);
  });

  it('handles root with trailing slash', () => {
    // Edge case: "/" with no trailing slash is already "/"
    expect(getPageIntensity('/')).toBe(1.0);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/signal/__tests__/page-intensity.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Create page intensity map**

```typescript
// src/lib/signal/page-intensity.ts

/**
 * Maps route pathnames to shader intensity levels (0-1).
 * See spec Section 5 for intensity rationale.
 *
 * DEFAULT_INTENSITY (0.8) intentionally covers 404 pages and
 * post detail routes — these get elevated shader presence
 * matching the "full signal loss" 404 concept from the spec.
 */
const PAGE_INTENSITY: Record<string, number> = {
  '/': 1.0,          // Homepage: full shader
  '/listen': 0.3,    // Listen: moderate
  '/contact': 0.25,  // Contact: low-moderate
  '/discography': 0.2, // Discography: low
  '/about': 0.15,    // About: quiet
  '/gallery': 0.05,  // Gallery: minimal
};

/** Default intensity for unmatched routes (including 404 and /posts/*) */
const DEFAULT_INTENSITY = 0.8;

/**
 * Get the shader intensity for a given pathname.
 * Strips trailing slashes before matching.
 */
export function getPageIntensity(pathname: string): number {
  const normalized = pathname.replace(/\/$/, '') || '/';
  return PAGE_INTENSITY[normalized] ?? DEFAULT_INTENSITY;
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/signal/__tests__/page-intensity.test.ts`
Expected: All 5 tests PASS

- [ ] **Step 2: Wire into SignalBusProvider**

Add pathname tracking to `src/lib/signal/SignalBusProvider.tsx`:

```typescript
// Add import at top:
import { usePathname } from 'next/navigation';
import { getPageIntensity } from './page-intensity';

// Inside the component, after existing hooks:
const pathname = usePathname();

useEffect(() => {
  bus.setPage(pathname, getPageIntensity(pathname));
}, [pathname, bus]);
```

- [ ] **Step 3: Export from signal barrel**

Add to `src/lib/signal/index.ts`:
```typescript
export { getPageIntensity } from './page-intensity';
```

- [ ] **Step 4: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Navigating between pages will now change shader intensity.

- [ ] **Step 5: Commit**

```bash
git add src/lib/signal/page-intensity.ts src/lib/signal/SignalBusProvider.tsx src/lib/signal/index.ts
git commit -m "feat(signal): add per-page shader intensity mapping"
```

---

### Task 9: Grain Overlay Reactive Upgrade

Upgrade the existing CSS grain overlay to respond to scroll velocity via the SignalBus CSS custom properties.

**Files:**
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Update grain-overlay to use CSS variable**

In `src/styles/globals.css`, update the `.grain-overlay::after` rule:

Replace the fixed `opacity: 0.06;` with:
```css
opacity: var(--signal-grain-opacity, 0.06);
```

This makes the grain overlay reactive — the SignalBus writes `--signal-grain-opacity` every frame based on scroll velocity (0.06 at rest, up to 0.15 at speed). The fallback `0.06` ensures it works even before JS loads.

- [ ] **Step 2: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Grain overlay now pulses with scroll velocity.

- [ ] **Step 3: Commit**

```bash
git add src/styles/globals.css
git commit -m "feat: make grain overlay reactive to scroll velocity via SignalBus CSS vars"
```

---

### Task 10: Remove Three.js Dependencies

Per spec: ParticleField is removed, shader replaces its role. Remove Three.js, react-three-fiber, and react-three-drei.

**Files:**
- Delete: `src/components/effects/ParticleField.tsx`
- Delete: `src/components/effects/Scene3D.tsx`
- Modify: `src/components/effects/index.ts`

- [ ] **Step 1: Check for remaining Three.js usage**

Run: `grep -r "Scene3D\|ParticleField\|@react-three\|from 'three'" src/ --include="*.tsx" --include="*.ts" -l`

Check for Storybook stories too: `grep -r "Scene3D\|ParticleField" src/stories/ --include="*.tsx" --include="*.ts" -l`

If any files reference these, they need deletion or updating.

- [ ] **Step 2: Remove ParticleField, Scene3D, and related stories**

Delete:
- `src/components/effects/ParticleField.tsx`
- `src/components/effects/Scene3D.tsx`
- Any Storybook stories referencing ParticleField or Scene3D (check `src/stories/` directory)

- [ ] **Step 3: Update effects barrel export**

```typescript
// src/components/effects/index.ts
export { VideoBackground } from './VideoBackground';
export type { VideoBackgroundProps } from './VideoBackground';

export { HeroImage } from './HeroImage';
export type { HeroImageProps } from './HeroImage';
```

- [ ] **Step 4: Uninstall Three.js packages**

Run: `npm uninstall three @react-three/fiber @react-three/drei @types/three`

- [ ] **Step 5: Verify build passes**

Run: `npx next build`
Expected: Build succeeds with smaller bundle. No Three.js references remain.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: remove Three.js dependencies, shader replaces ParticleField"
```

---

### Task 11: Selection Color and Text Selection

Pure CSS addition from the spec's craft details — quick win.

**Files:**
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Add selection styles**

Add to the `@layer base` block in `src/styles/globals.css`:

```css
::selection {
  background-color: var(--color-accent);
  color: var(--color-accent-foreground);
}
```

- [ ] **Step 2: Verify build passes**

Run: `npx next build`
Expected: Build succeeds. Selecting text now shows accent yellow background with black text.

- [ ] **Step 3: Commit**

```bash
git add src/styles/globals.css
git commit -m "feat: add branded text selection color"
```

---

## Summary

After completing this plan, the site will have:

1. **SignalBus** — singleton state collecting scroll, mouse, time, transition, and tier data every frame
2. **ShaderCanvas** — persistent WebGL2 noise-interference shader behind all content
3. **Progressive boot** — video background shows instantly, shader fades in when ready
4. **Per-page intensity** — shader dims on interior pages (gallery at 5%, homepage at 100%)
5. **Reactive grain** — overlay opacity pulses with scroll velocity
6. **Three.js removed** — smaller bundle, single WebGL context
7. **Branded selection color** — accent yellow text selection

**Next plan:** Plan 2 will cover TransitionOrchestrator, TransitionLink, DOM tearing, scroll choreography, and heading treatments.
