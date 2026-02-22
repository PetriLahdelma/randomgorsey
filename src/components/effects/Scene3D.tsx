import { Canvas } from '@react-three/fiber';
import { usePerformance } from '@/lib/performance';
import { cn } from '@/lib/utils';

/**
 * Props for Scene3D component.
 */
export interface Scene3DProps {
  /** Scene contents (R3F components) */
  children: React.ReactNode;
  /** Additional CSS classes for container */
  className?: string;
  /** Whether scene is absolute positioned overlay */
  overlay?: boolean;
  /** Initial DPR (device pixel ratio), auto-adjusts based on performance */
  dpr?: number;
}

/**
 * React Three Fiber Canvas wrapper with performance-tiered settings.
 *
 * Automatically adjusts rendering quality based on GPU tier:
 * - Tier 0: Returns null (no 3D rendering)
 * - Tier 1: DPR 1, no antialiasing
 * - Tier 2: DPR 1.5, antialiasing enabled
 * - Tier 3: DPR 2, antialiasing enabled
 *
 * Uses on-demand frame loop for battery efficiency.
 *
 * @example
 * ```tsx
 * import { Scene3D, ParticleField } from '@/components/effects';
 *
 * <Scene3D overlay className="pointer-events-none">
 *   <ParticleField count={500} color="#ffffff" />
 * </Scene3D>
 * ```
 */
export const Scene3D: React.FC<Scene3DProps> = ({
  children,
  className,
  overlay = false,
  dpr: initialDpr,
}) => {
  const { tier, canWebGL } = usePerformance();

  // No WebGL support or tier 0: skip rendering
  if (!canWebGL || tier === 0) {
    return null;
  }

  // Scale DPR and quality based on tier
  const dpr = initialDpr ?? (tier >= 3 ? 2 : tier >= 2 ? 1.5 : 1);
  const antialias = tier >= 2;

  return (
    <div
      className={cn(
        overlay ? 'absolute inset-0 -z-10' : 'relative h-full w-full',
        className
      )}
    >
      <Canvas
        frameloop="demand"
        dpr={dpr}
        gl={{ antialias }}
      >
        {children}
      </Canvas>
    </div>
  );
};

export default Scene3D;
