import React from 'react';
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';

interface AnimationProviderProps {
  children: React.ReactNode;
  /** Override system preference: 'user' (default), 'always', 'never' */
  reducedMotion?: 'user' | 'always' | 'never';
}

/**
 * Provides global animation configuration for the entire app.
 *
 * Features:
 * - Automatic prefers-reduced-motion detection when reducedMotion="user"
 * - LazyMotion for bundle optimization (loads animation features on demand)
 *
 * When reduced motion is enabled:
 * - Transform animations (x, y, scale, rotate) are disabled
 * - Layout animations are disabled
 * - Opacity and color animations are preserved
 */
export const AnimationProvider: React.FC<AnimationProviderProps> = ({
  children,
  reducedMotion = 'user',
}) => {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={reducedMotion}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
};

export default AnimationProvider;
