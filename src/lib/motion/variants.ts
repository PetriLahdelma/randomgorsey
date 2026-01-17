/**
 * Reusable Animation Variants
 *
 * Pre-defined Framer Motion variant objects for common animation patterns.
 * These use the centralized spring and duration presets from config.ts
 * to ensure consistent motion throughout the application.
 *
 * Usage with motion components:
 * ```tsx
 * <motion.div
 *   variants={pageVariants}
 *   initial="initial"
 *   animate="enter"
 *   exit="exit"
 * />
 * ```
 */

import type { Variants } from 'framer-motion';
import { springs, durations } from './config';

// === PAGE TRANSITIONS ===

/**
 * Standard page-level animation with vertical slide and fade.
 * Use for main content sections and page components.
 *
 * Applies spring physics for natural feel on enter,
 * quick fade for exit to avoid blocking navigation.
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.page },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: durations.fast },
  },
};

// === FADE ONLY (REDUCED MOTION SAFE) ===

/**
 * Opacity-only animation without transform.
 * Safe for users with reduced motion preferences.
 * Use as fallback when motion is reduced or for subtle appearances.
 */
export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: durations.normal },
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.fast },
  },
};

// === STAGGER ANIMATIONS ===

/**
 * Container variant for staggered list animations.
 * Apply to parent element containing staggerItem children.
 *
 * @example
 * ```tsx
 * <motion.ul variants={staggerContainer} initial="initial" animate="enter">
 *   {items.map(item => (
 *     <motion.li key={item.id} variants={staggerItem}>
 *       {item.content}
 *     </motion.li>
 *   ))}
 * </motion.ul>
 * ```
 */
export const staggerContainer: Variants = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

/**
 * Item variant for children in staggered animations.
 * Must be used with staggerContainer parent.
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.default },
  },
  exit: { opacity: 0, y: -10 },
};

// === MODAL/OVERLAY ANIMATIONS ===

/**
 * Backdrop/overlay fade animation.
 * Use for modal backdrops, dialog overlays, etc.
 */
export const overlayVariants: Variants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: durations.fast },
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.fast },
  },
};

/**
 * Modal content animation with scale and fade.
 * Use for modal/dialog content boxes.
 * Pairs with overlayVariants for backdrop.
 */
export const modalVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  enter: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', ...springs.snappy },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: durations.fast },
  },
};
