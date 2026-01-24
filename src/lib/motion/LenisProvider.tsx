import React, { useEffect, useRef, useState } from 'react';
import { ReactLenis } from 'lenis/react';
import type { LenisRef } from 'lenis/react';
import { cancelFrame, frame, useReducedMotion } from 'framer-motion';

interface LenisProviderProps {
  children: React.ReactNode;
}

/**
 * Provides smooth scroll behavior using Lenis.
 *
 * This provider conditionally enables smooth scroll based on:
 * - **Device type:** Disabled on touch/mobile devices (pointer: coarse) for native scroll UX
 * - **Accessibility:** Disabled when user prefers reduced motion
 *
 * When enabled, Lenis RAF is synchronized with Framer Motion's frame scheduler
 * to prevent double animation frame loops and ensure smooth performance.
 *
 * @example
 * ```tsx
 * // Typically wrapped by AnimationProvider, but can be used standalone
 * <LenisProvider>
 *   <App />
 * </LenisProvider>
 * ```
 *
 * @see https://github.com/darkroomengineering/lenis
 */
export const LenisProvider: React.FC<LenisProviderProps> = ({ children }) => {
  const lenisRef = useRef<LenisRef>(null);
  const prefersReducedMotion = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  // Detect touch/mobile devices via pointer: coarse media query
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    // Re-check on resize for tablet orientation changes
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync Lenis RAF with Framer Motion's frame scheduler
  // This prevents double RAF loops when both libraries are active
  useEffect(() => {
    if (isMobile || prefersReducedMotion) return;

    function update(data: { timestamp: number }) {
      lenisRef.current?.lenis?.raf(data.timestamp);
    }
    frame.update(update, true);
    return () => cancelFrame(update);
  }, [isMobile, prefersReducedMotion]);

  // Skip Lenis for mobile or reduced motion - return native scroll
  if (isMobile || prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        autoRaf: false, // We sync with Framer Motion frame scheduler
        smoothWheel: true,
        syncTouch: false, // Keep native touch scroll for mobile UX
        lerp: 0.1, // Smooth but responsive interpolation
      }}
    >
      {children}
    </ReactLenis>
  );
};

export default LenisProvider;
