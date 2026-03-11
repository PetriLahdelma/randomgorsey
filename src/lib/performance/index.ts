/**
 * Performance tier detection and context.
 *
 * Provides GPU tier detection (0-3) for performance-tiered rendering:
 * - Tier 0: Static images only (reduced motion or very low-end)
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
 * const { tier, isReducedMotion } = usePerformance();
 * ```
 */

export { PerformanceProvider, usePerformance } from './context';
export type { PerformanceContext } from './gpu-tier';
