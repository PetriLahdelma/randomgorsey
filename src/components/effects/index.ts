/**
 * Visual effects components for the Random Gorsey website.
 *
 * Includes performance-tiered WebGL effects using React Three Fiber.
 * All components respect GPU tier detection and reduced motion preferences.
 *
 * @example
 * ```tsx
 * import { Scene3D, ParticleField } from '@/components/effects';
 *
 * // Render a particle field as background overlay
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
