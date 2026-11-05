/**
 * Performance tier detection and context.
 *
 * Provides GPU tier detection (0-3) for performance-tiered rendering:
 * - Tier 0: Static images only (unknown or unavailable GPU capability)
 * - Tier 1: Basic video playback
 * - Tier 2: Video + basic WebGL effects
 * - Tier 3: Full WebGL, particles, post-processing
 *
 * @example
 * ```tsx
 * // In src/app/layout.tsx or another root client boundary
 * import { PerformanceProvider } from '@/lib/performance';
 *
 * <PerformanceProvider>
 *   {children}
 * </PerformanceProvider>
 *
 * // In components
 * import { usePerformance } from '@/lib/performance';
 *
 * const { tier, isReducedMotion, effectsEnabled } = usePerformance();
 * ```
 */

export { PerformanceProvider, usePerformance } from './context';
export type { PerformanceContextValue } from './context';
export type { PerformanceContext } from './gpu-tier';
