/**
 * Visual effects components for the Random Gorsey website.
 *
 * Includes performance-tiered components that adapt to device capabilities
 * using the usePerformance hook from @/lib/performance.
 *
 * - VideoBackground: Full-bleed video with poster fallback
 * - HeroImage: Responsive full-bleed hero images
 * - Scene3D: React Three Fiber Canvas wrapper with performance scaling
 * - ParticleField: Animated particle system for WebGL backgrounds
 *
 * @example
 * ```tsx
 * import { VideoBackground, HeroImage, Scene3D, ParticleField } from '@/components/effects';
 *
 * // Video background with poster fallback
 * <VideoBackground src={videoSrc} poster={posterImg} overlayOpacity={0.3} />
 *
 * // Responsive hero image
 * <HeroImage src="/hero.jpg" alt="Hero" height="half" />
 *
 * // 3D particle field overlay
 * <Scene3D overlay className="pointer-events-none">
 *   <ambientLight intensity={0.5} />
 *   <ParticleField count={500} color="#ffffff" />
 * </Scene3D>
 * ```
 */

export { VideoBackground } from './VideoBackground';
export type { VideoBackgroundProps } from './VideoBackground';

export { HeroImage } from './HeroImage';
export type { HeroImageProps } from './HeroImage';

export { Scene3D } from './Scene3D';
export type { Scene3DProps } from './Scene3D';

export { ParticleField } from './ParticleField';
export type { ParticleFieldProps } from './ParticleField';
