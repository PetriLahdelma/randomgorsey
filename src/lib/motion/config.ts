/**
 * Motion Configuration Constants
 *
 * Centralized source of truth for all animation timing, spring physics,
 * and easing values. Import these presets instead of hardcoding values
 * to ensure consistent motion across the application.
 */

// === SPRING PRESETS ===
// Named presets matching common interaction patterns
// Use `type: 'spring'` with spread: `{ type: 'spring', ...springs.snappy }`

/**
 * Spring physics presets for different interaction types.
 *
 * @example
 * ```tsx
 * <motion.div
 *   animate={{ x: 100 }}
 *   transition={{ type: 'spring', ...springs.snappy }}
 * />
 * ```
 */
export const springs = {
  /** Snappy interactions (buttons, toggles) - responsive feedback */
  snappy: { stiffness: 400, damping: 30, mass: 1 },

  /** Default UI transitions - balanced feel */
  default: { stiffness: 100, damping: 15, mass: 1 },

  /** Gentle, organic movement - content reveals */
  gentle: { stiffness: 50, damping: 15, mass: 1 },

  /** Bouncy, playful - use sparingly for delight moments */
  bouncy: { stiffness: 300, damping: 10, mass: 1 },

  /** Smooth page transitions - weighted feel */
  page: { stiffness: 80, damping: 20, mass: 1 },

  /** Heavy, dramatic - hero elements, major transitions */
  dramatic: { stiffness: 60, damping: 12, mass: 2 },
} as const;

// === DURATION PRESETS ===
// For tween animations (non-spring), values in seconds

/**
 * Duration presets for tween animations.
 *
 * @example
 * ```tsx
 * <motion.div
 *   animate={{ opacity: 1 }}
 *   transition={{ duration: durations.fast }}
 * />
 * ```
 */
export const durations = {
  /** No perceptible delay */
  instant: 0,

  /** Micro interactions (tooltips, hover states) */
  fast: 0.15,

  /** Standard transitions (most UI elements) */
  normal: 0.3,

  /** Deliberate movement (panels, drawers) */
  slow: 0.5,

  /** Emphasis animations (hero reveals) */
  slower: 0.7,
} as const;

// === EASING PRESETS ===
// Cubic bezier curves for tween animations
// Use with `ease` prop: `transition={{ ease: eases.default }}`

/**
 * Easing curve presets as cubic-bezier arrays.
 *
 * @example
 * ```tsx
 * <motion.div
 *   animate={{ x: 100 }}
 *   transition={{ duration: 0.3, ease: eases.out }}
 * />
 * ```
 */
export const eases = {
  /** Material Design standard - slight acceleration, smooth deceleration */
  default: [0.4, 0, 0.2, 1] as const,

  /** Accelerating motion - starts slow, speeds up */
  in: [0.4, 0, 1, 1] as const,

  /** Decelerating motion - starts fast, slows down */
  out: [0, 0, 0.2, 1] as const,

  /** Symmetric ease - smooth start and end */
  inOut: [0.4, 0, 0.2, 1] as const,
} as const;

// === TYPE EXPORTS ===
// For type-safe preset selection

/** Available spring preset names */
export type SpringPreset = keyof typeof springs;

/** Available duration preset names */
export type DurationPreset = keyof typeof durations;

/** Available easing preset names */
export type EasePreset = keyof typeof eases;
