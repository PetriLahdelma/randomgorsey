import React, { createContext, useContext, useEffect, useState } from 'react';
import { PerformanceContext, getPerformanceTier } from './gpu-tier';

/**
 * React context for performance tier information.
 * Null when accessed outside PerformanceProvider.
 */
const PerfCtx = createContext<PerformanceContext | null>(null);

interface PerformanceProviderProps {
  children: React.ReactNode;
}

/**
 * Provider that detects GPU tier and shares performance context app-wide.
 *
 * Detects:
 * - GPU tier (0-3) via detect-gpu benchmarks
 * - Mobile device detection
 * - prefers-reduced-motion preference
 * - WebGL capability
 *
 * Default state (before detection completes) uses tier 1 for safe fallback.
 * This prevents flash of high-fidelity content on low-end devices.
 *
 * @example
 * ```tsx
 * <PerformanceProvider>
 *   <App />
 * </PerformanceProvider>
 * ```
 */
export const PerformanceProvider: React.FC<PerformanceProviderProps> = ({
  children,
}) => {
  const [perf, setPerf] = useState<PerformanceContext>({
    tier: 1,
    isMobile: false,
    isReducedMotion: false,
    canWebGL: true,
  });

  useEffect(() => {
    getPerformanceTier().then(setPerf);
  }, []);

  return <PerfCtx.Provider value={perf}>{children}</PerfCtx.Provider>;
};

/**
 * Hook to access performance tier information.
 *
 * Must be used within PerformanceProvider.
 *
 * @returns PerformanceContext with tier, isMobile, isReducedMotion, canWebGL
 * @throws Error if used outside PerformanceProvider
 *
 * @example
 * ```tsx
 * const { tier, isReducedMotion } = usePerformance();
 *
 * if (tier === 0 || isReducedMotion) {
 *   return <StaticImage />;
 * }
 * return <AnimatedVideo />;
 * ```
 */
export const usePerformance = (): PerformanceContext => {
  const ctx = useContext(PerfCtx);
  if (!ctx) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return ctx;
};
