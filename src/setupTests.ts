/// <reference types="vitest/globals" />

// jest-dom adds custom matchers for asserting on DOM nodes.
import "@testing-library/jest-dom";

// Polyfill TextEncoder and TextDecoder for Node.js environment
import { TextEncoder, TextDecoder } from "util";
(globalThis as Record<string, unknown>).TextEncoder = TextEncoder;
(globalThis as Record<string, unknown>).TextDecoder = TextDecoder;

// Mock IntersectionObserver globally (must be a constructor class)
class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] { return []; }
}
window.IntersectionObserver = MockIntersectionObserver;
(globalThis as typeof globalThis).IntersectionObserver = MockIntersectionObserver;

// Mock ResizeObserver globally (must be a constructor class)
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
window.ResizeObserver = MockResizeObserver;
(globalThis as typeof globalThis).ResizeObserver = MockResizeObserver;

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock performance context so effects components work without PerformanceProvider
vi.mock("@/lib/performance/context", () => ({
  PerformanceProvider: ({ children }: { children: React.ReactNode }) => children,
  usePerformance: () => ({
    tier: 1,
    isMobile: false,
    isReducedMotion: false,
    hasWebGL: false,
  }),
}));

// Mock detect-gpu (used by performance context)
vi.mock("detect-gpu", () => ({
  getGPUTier: () => Promise.resolve({ tier: 1, type: "BENCHMARK" }),
}));

// Mock KineticText which depends on SplitType (DOM manipulation)
vi.mock("@/components/KineticText", () => ({
  KineticText: ({ children }: { children: string }) => children,
  default: ({ children }: { children: string }) => children,
}));

// Mock lenis smooth scroll (requires browser APIs not available in jsdom)
vi.mock("lenis/react", () => ({
  ReactLenis: ({ children }: { children: React.ReactNode }) => children,
  useLenis: () => null,
  LenisContext: {},
}));

// Mock LenisProvider directly (uses lenis/react internally)
vi.mock("@/lib/motion/LenisProvider", () => ({
  LenisProvider: ({ children }: { children: React.ReactNode }) => children,
  default: ({ children }: { children: React.ReactNode }) => children,
}));
