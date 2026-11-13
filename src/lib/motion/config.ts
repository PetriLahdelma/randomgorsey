/**
 * Motion Configuration Constants
 *
 * Shared motion contract for routine interface movement.
 * Durations are expressed in seconds for Framer Motion.
 */

export const springs = {
  /** Snappy — responsive but smooth */
  snappy: { stiffness: 300, damping: 30, mass: 1 },
  /** Default — balanced gallery feel */
  default: { stiffness: 260, damping: 28, mass: 1 },
  /** Gentle — slow, graceful */
  gentle: { stiffness: 200, damping: 25, mass: 1 },
  /** Bouncy — use sparingly */
  bouncy: { stiffness: 300, damping: 14, mass: 1 },
  /** Page — smooth settle */
  page: { stiffness: 260, damping: 30, mass: 1 },
  /** Dramatic — heavy, cinematic */
  dramatic: { stiffness: 300, damping: 30, mass: 1.5 },
} as const;

export const durations = {
  instant: 0,
  /** Immediate tactile feedback such as a button press. */
  press: 0.1,
  /** Routine exits are 20% shorter than the standard entrance. */
  exit: 0.16,
  /** Standard interface entrance. */
  enter: 0.2,
  /** Dropdowns and popovers stay inside the requested 150-250ms range. */
  dropdown: 0.2,
  /** On-screen movement between settled states. */
  movement: 0.2,
  /** Existing aliases retained for consumers outside the shared variants. */
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
  slower: 0.7,
} as const;

export const eases = {
  /** Confident deceleration for entrances. */
  default: [0.16, 1, 0.3, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  out: [0.16, 1, 0.3, 1] as const,
  /** Symmetric acceleration and deceleration for movement already on screen. */
  inOut: [0.65, 0, 0.35, 1] as const,
} as const;

/** Semantic transitions used by routine production UI. */
export const transitions = {
  enter: { type: 'tween' as const, duration: durations.enter, ease: eases.out },
  exit: { type: 'tween' as const, duration: durations.exit, ease: eases.in },
  dropdown: { type: 'tween' as const, duration: durations.dropdown, ease: eases.out },
  movement: { type: 'tween' as const, duration: durations.movement, ease: eases.inOut },
} as const;

/** List rows settle 30ms apart; reverse exits retain the 20% shorter ratio. */
export const stagger = {
  rows: 0.03,
  rowsExit: 0.024,
} as const;

// === TYPE EXPORTS ===

/** Available spring preset names */
export type SpringPreset = keyof typeof springs;

/** Available duration preset names */
export type DurationPreset = keyof typeof durations;

/** Available easing preset names */
export type EasePreset = keyof typeof eases;
