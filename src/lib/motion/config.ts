/**
 * Motion Configuration Constants
 *
 * Gallery timing: smooth, deliberate, elegant.
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
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
  slower: 0.7,
} as const;

export const eases = {
  /** Gallery ease — smooth attack, gentle deceleration */
  default: [0.22, 1, 0.36, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  out: [0.22, 1, 0.36, 1] as const,
  inOut: [0.22, 1, 0.36, 1] as const,
} as const;

// === TYPE EXPORTS ===

/** Available spring preset names */
export type SpringPreset = keyof typeof springs;

/** Available duration preset names */
export type DurationPreset = keyof typeof durations;

/** Available easing preset names */
export type EasePreset = keyof typeof eases;
