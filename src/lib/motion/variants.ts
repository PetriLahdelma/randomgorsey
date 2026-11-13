/**
 * Reusable Animation Variants
 *
 * Pre-defined Framer Motion variant objects for common animation patterns.
 * These use the centralized duration and easing presets from config.ts
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
import { stagger, transitions } from './config';

// === PAGE TRANSITIONS ===

/**
 * Standard page-level animation with vertical slide and fade.
 * Use for main content sections and page components.
 *
 * Routine page movement uses a non-bouncing tween and a shorter exit.
 */
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: {
    opacity: 1,
    y: 0,
    transition: transitions.enter,
  },
  exit: {
    opacity: 0,
    transition: transitions.exit,
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
    transition: transitions.enter,
  },
  exit: {
    opacity: 0,
    transition: transitions.exit,
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
      staggerChildren: stagger.rows,
      delayChildren: stagger.rows,
    },
  },
  exit: {
    transition: {
      staggerChildren: stagger.rowsExit,
      staggerDirection: -1,
    },
  },
};

/**
 * Item variant for children in staggered animations.
 * Must be used with staggerContainer parent.
 */
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: {
    opacity: 1,
    y: 0,
    transition: transitions.enter,
  },
  exit: { opacity: 0, y: -4, transition: transitions.exit },
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
    transition: transitions.enter,
  },
  exit: {
    opacity: 0,
    transition: transitions.exit,
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
    transition: transitions.enter,
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: transitions.exit,
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
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.enter,
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
      staggerChildren: stagger.rows,
      delayChildren: stagger.rows,
    },
  },
};

/**
 * Item variant for children in staggered scroll reveals.
 * Must be used with revealContainerVariants parent.
 */
export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.enter,
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
    transition: transitions.enter,
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
      staggerChildren: stagger.rows,
      delayChildren: stagger.rows * 2,
    },
  },
};

/**
 * Item variant for individual characters/words in kinetic text.
 * Slides up and fades in with smooth ease.
 */
export const textRevealItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitions.enter,
  },
};

/**
 * Alternative text reveal - characters slide from below with rotation.
 * More dramatic effect for hero headings.
 */
export const textRevealDramatic: Variants = {
  hidden: { opacity: 0, y: 12, rotateX: -45 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { ...transitions.enter, duration: 0.5 },
  },
};
