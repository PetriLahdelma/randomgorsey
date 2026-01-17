import { useMemo, useRef } from 'react';
import { Instances, Instance } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { usePerformance } from '@/lib/performance';
import * as THREE from 'three';

/**
 * Props for ParticleField component.
 */
export interface ParticleFieldProps {
  /** Base particle count (scales with tier: tier1=count/4, tier2=count/2, tier3=full) */
  count?: number;
  /** Particle color (CSS color string) */
  color?: string;
  /** Spread area size (cube dimensions) */
  spread?: number;
  /** Particle size (sphere radius) */
  size?: number;
}

/**
 * Instanced particle system with performance-tiered particle count.
 *
 * Automatically scales particle count based on GPU tier:
 * - Tier 1: count / 4 (250 default)
 * - Tier 2: count / 2 (500 default)
 * - Tier 3: full count (1000 default)
 *
 * Animation respects reduced motion preference.
 *
 * Must be rendered inside a Scene3D component.
 *
 * @example
 * ```tsx
 * import { Scene3D, ParticleField } from '@/components/effects';
 *
 * <Scene3D overlay>
 *   <ambientLight intensity={0.5} />
 *   <ParticleField count={500} color="#ff0" spread={8} />
 * </Scene3D>
 * ```
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  count = 1000,
  color = '#ffffff',
  spread = 10,
  size = 0.05,
}) => {
  const { tier, isReducedMotion } = usePerformance();
  const groupRef = useRef<THREE.Group>(null);

  // Scale count based on tier
  const actualCount = tier >= 3 ? count : tier >= 2 ? Math.floor(count / 2) : Math.floor(count / 4);

  // Generate particle positions once
  const particles = useMemo(() => {
    return Array.from({ length: actualCount }, () => ({
      position: [
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
      ] as [number, number, number],
      scale: Math.random() * 0.5 + 0.5,
    }));
  }, [actualCount, spread]);

  // Gentle rotation animation (only if motion allowed)
  useFrame((_, delta) => {
    if (groupRef.current && !isReducedMotion) {
      groupRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <Instances limit={actualCount}>
        <sphereGeometry args={[size, 8, 8]} />
        <meshBasicMaterial color={color} />
        {particles.map((p, i) => (
          <Instance key={i} position={p.position} scale={p.scale} />
        ))}
      </Instances>
    </group>
  );
};

export default ParticleField;
