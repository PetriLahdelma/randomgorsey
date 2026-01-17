/**
 * Visual effects components.
 *
 * Performance-aware components that adapt to device capabilities
 * using the usePerformance hook from @/lib/performance.
 *
 * @example
 * ```tsx
 * import { VideoBackground } from '@/components/effects';
 *
 * <VideoBackground
 *   src={videoSrc}
 *   poster={posterImg}
 *   overlayOpacity={0.3}
 * />
 * ```
 */

export { VideoBackground } from './VideoBackground';
export type { VideoBackgroundProps } from './VideoBackground';
