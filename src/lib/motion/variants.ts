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
import { springs, durations, eases } from './config';

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

// === SCROLL-TRIGGERED REVEALS ===

/**
 * Standard scroll-triggered reveal animation.
 * Use with whileInView="visible" viewport={{ once: true, amount: 0.3 }}
 *
 * Uses hidden/visible naming for whileInView compatibility.
 */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: eases.out,
    },
  },
};

/**
 * Container variant for staggered scroll reveals.
 * Apply to parent element containing revealItemVariants children.
 *
 * @example
 * ```tsx
 * <motion.ul
 *   variants={revealContainerVariants}
 *   initial="hidden"
 *   whileInView="visible"
 *   viewport={{ once: true }}
 * >
 *   {items.map(item => (
 *     <motion.li key={item.id} variants={revealItemVariants}>
 *       {item.content}
 *     </motion.li>
 *   ))}
 * </motion.ul>
 * ```
 */
export const revealContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

/**
 * Item variant for children in staggered scroll reveals.
 * Must be used with revealContainerVariants parent.
 */
export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: eases.out,
    },
  },
};

/**
 * Reduced motion safe reveal (opacity only).
 * Use for users with prefers-reduced-motion.
 * No transform animations - just fade.
 */
export const revealFadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.normal },
  },
};

// === KINETIC TEXT ANIMATIONS ===

/**
 * Container variant for kinetic text (character/word stagger).
 * Use with KineticText component.
 *
 * @example
 * ```tsx
 * <motion.span variants={textRevealContainer} initial="hidden" animate="visible">
 *   {splitElements.map(...)}
 * </motion.span>
 * ```
 */
export const textRevealContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.1,
    },
  },
};

/**
 * Item variant for individual characters/words in kinetic text.
 * Slides up and fades in with smooth ease.
 */
export const textRevealItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: eases.default,
    },
  },
};

/**
 * Alternative text reveal - characters slide from below with rotation.
 * More dramatic effect for hero headings.
 */
export const textRevealDramatic: Variants = {
  hidden: {
    opacity: 0,
    y: 40,
    rotateX: -90,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: eases.default,
    },
  },
};
