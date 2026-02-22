/**
 * Motion System Public API
 *
 * Single import point for all motion-related utilities, constants, and variants.
 * This module provides a centralized, type-safe way to access animation
 * configuration throughout the application.
 *
 * @example
 * ```tsx
 * import {
 *   motion,
 *   springs,
 *   pageVariants,
 *   useReducedMotion,
 * } from '@/lib/motion';
 *
 * const MyComponent = () => {
 *   const shouldReduceMotion = useReducedMotion();
 *
 *   return (
 *     <motion.div
 *       variants={shouldReduceMotion ? fadeVariants : pageVariants}
 *       initial="initial"
 *       animate="enter"
 *       exit="exit"
 *     >
 *       Content
 *     </motion.div>
 *   );
 * };
 * ```
 */

// === CONFIGURATION ===
// Spring physics, duration, and easing presets
export { springs, durations, eases } from './config';
export type { SpringPreset, DurationPreset, EasePreset } from './config';

// === VARIANTS ===
// Reusable animation variant objects
export {
  pageVariants,
  fadeVariants,
  staggerContainer,
  staggerItem,
  overlayVariants,
  modalVariants,
  // Scroll-triggered reveal variants
  revealVariants,
  revealContainerVariants,
  revealItemVariants,
  revealFadeVariants,
  // Kinetic text variants
  textRevealContainer,
  textRevealItem,
  textRevealDramatic,
} from './variants';

// === SECTION-SPECIFIC VARIANTS ===
// Per-page motion timing with distinct personalities
export {
  heroVariants,
  galleryVariants,
  listenVariants,
  aboutVariants,
  contactVariants,
  discographyVariants,
  heroStaggerContainer,
  galleryStaggerContainer,
  discographyStaggerContainer,
  aboutStaggerContainer,
  aboutCardItem,
} from './section-variants';

// === PROVIDER ===
// Global animation configuration wrapper
export { AnimationProvider } from './AnimationProvider';
export { LenisProvider } from './LenisProvider';

// === ROUTING ===
// Animated route transitions with AnimatePresence
export { AnimatedRoutes } from './AnimatedRoutes';

// === SMOOTH SCROLL ===
// Lenis hook for programmatic scroll control
export { useLenis } from 'lenis/react';

// === CUSTOM HOOKS ===
// Scroll utilities with Lenis integration
export { useScrollToTopOnRouteChange, useLenisScrollTo } from './hooks';

// === FRAMER MOTION RE-EXPORTS ===
// Commonly used utilities for convenience
export {
  motion,
  AnimatePresence,
  useReducedMotion,
  useAnimation,
  useInView,
} from 'framer-motion';
