import { getGPUTier, TierResult } from 'detect-gpu';

/**
 * Performance context describing device capability.
 *
 * Tiers:
 * - 0: Low-end / reduced motion preference (static images only)
 * - 1: Basic capability (optimized video, minimal effects)
 * - 2: Medium capability (video + basic WebGL)
 * - 3: High capability (full WebGL, particles, post-processing)
 */
export interface PerformanceContext {
  /** GPU tier from 0-3 based on detect-gpu benchmarks */
  tier: number;
  /** Whether device is detected as mobile */
  isMobile: boolean;
  /** Whether user prefers reduced motion */
  isReducedMotion: boolean;
  /** Whether WebGL is available (tier > 0) */
  canWebGL: boolean;
}

/**
 * Detect device GPU tier and performance capabilities.
 *
 * Uses detect-gpu library which benchmarks the GPU against a database
 * of known GPU capabilities. Respects prefers-reduced-motion preference
 * by returning tier 0 when enabled.
 *
 * @returns Promise resolving to PerformanceContext
 */
export async function getPerformanceTier(): Promise<PerformanceContext> {
  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  try {
    const result: TierResult = await getGPUTier();
    return {
      tier: reducedMotion ? 0 : result.tier,
      isMobile: result.isMobile ?? false,
      isReducedMotion: reducedMotion,
      canWebGL: result.tier > 0,
    };
  } catch {
    // Safe fallback: assume basic capability
    return {
      tier: reducedMotion ? 0 : 1,
      isMobile: false,
      isReducedMotion: reducedMotion,
      canWebGL: true,
    };
  }
}
