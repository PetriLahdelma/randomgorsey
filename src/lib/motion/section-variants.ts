/**
 * Section-Specific Motion Variants
 *
 * Each section/page has a unique motion personality expressed through
 * timing, physics, and choreography. These variants maintain cohesion
 * by sharing spring presets from config.ts while giving each section
 * its distinct character.
 *
 * Usage:
 * ```tsx
 * import { heroVariants } from '@/lib/motion';
 *
 * <motion.div
 *   variants={heroVariants}
 *   initial="initial"
 *   animate="enter"
 *   exit="exit"
 * >
 *   Hero content
 * </motion.div>
 * ```
 */

import type { Variants } from 'framer-motion';
import { springs, durations, eases } from './config';

// === PAGE SECTION VARIANTS ===

/**
 * Hero Section - Bold, dramatic entrance
 *
 * Character: Confident, impactful, demands attention
 * - Large vertical offset for dramatic reveal
 * - Heavy spring (dramatic preset) with delay for anticipation
 * - Quick exit to not obstruct navigation
 */
export const heroVariants: Variants = {
  initial: { opacity: 0, y: 40 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      ...springs.dramatic,
      delay: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

/**
 * Gallery Section - Light, airy, graceful
 *
 * Character: Elegant, floating, visual-focused
 * - Subtle vertical offset for gentle lift
 * - Gentle spring for organic, flowing movement
 * - Quick exit to let visuals speak
 */
export const galleryVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      ...springs.gentle,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.fast },
  },
};

/**
 * Listen Section - Slow, deliberate, immersive
 *
 * Character: Atmospheric, contemplative, musical
 * - Moderate offset for measured reveal
 * - Tween animation for smooth, predictable motion
 * - Longer exit for cinematic feel
 */
export const listenVariants: Variants = {
  initial: { opacity: 0, y: 30 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: eases.out,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
};

/**
 * About Section - Warm, natural, reading-paced
 *
 * Character: Personal, approachable, storytelling
 * - Comfortable offset for inviting entrance
 * - Custom spring tuned for reading rhythm
 * - Standard exit to feel grounded
 */
export const aboutVariants: Variants = {
  initial: { opacity: 0, y: 25 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 18,
      mass: 1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

/**
 * Contact Section - Crisp, professional, efficient
 *
 * Character: Purposeful, clear, action-oriented
 * - Small offset for direct appearance
 * - Snappy spring (slightly softer) for responsive feel
 * - Fast exit for efficiency
 */
export const contactVariants: Variants = {
  initial: { opacity: 0, y: 15 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 30,
      mass: 1,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

/**
 * Discography Section - Catalog reveal style
 *
 * Character: Organized, systematic, archival
 * - Standard offset for consistent presentation
 * - Default spring for balanced, neutral motion
 * - Standard exit for uniformity
 */
export const discographyVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      ...springs.default,
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.2 },
  },
};

// === SECTION STAGGER CONTAINERS ===

/**
 * Hero Stagger Container
 *
 * Slower stagger for dramatic buildup.
 * Delay allows page transition to settle before content animates.
 */
export const heroStaggerContainer: Variants = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
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
 * Gallery Stagger Container
 *
 * Faster stagger for flowing grid reveals.
 * Minimal delay to let images populate quickly.
 */
export const galleryStaggerContainer: Variants = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

/**
 * Discography Stagger Container
 *
 * Quick stagger for catalog-style list reveals.
 * Keeps rhythm tight for systematic feel.
 */
export const discographyStaggerContainer: Variants = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

/**
 * About Stagger Container
 *
 * Relaxed stagger for warm, personal card reveals.
 * Slower pace matches the storytelling vibe.
 */
export const aboutStaggerContainer: Variants = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.06,
      staggerDirection: -1,
    },
  },
};

/**
 * About Card Item
 *
 * Item variant for side project cards with slight scale.
 * Warm, inviting entrance.
 */
export const aboutCardItem: Variants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 80,
      damping: 20,
      mass: 1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.15 },
  },
};
