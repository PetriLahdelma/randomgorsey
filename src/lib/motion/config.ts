/**
 * Motion Configuration Constants
 *
 * Punk timing: fast, snappy, immediate.
 */

export const springs = {
  /** Punk snap — hard, immediate */
  snappy: { stiffness: 500, damping: 30, mass: 1 },
  /** Default — still fast */
  default: { stiffness: 400, damping: 28, mass: 1 },
  /** Gentle — barely */
  gentle: { stiffness: 300, damping: 25, mass: 1 },
  /** Bouncy — use sparingly */
  bouncy: { stiffness: 500, damping: 12, mass: 1 },
  /** Page — quick settle */
  page: { stiffness: 400, damping: 30, mass: 1 },
  /** Dramatic — still fast but heavier */
  dramatic: { stiffness: 500, damping: 30, mass: 1.5 },
} as const;

export const durations = {
  instant: 0,
  fast: 0.08,
  normal: 0.15,
  slow: 0.25,
  slower: 0.35,
} as const;

export const eases = {
  /** Punk ease — fast attack, hard stop */
  default: [0.16, 1, 0.3, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.16, 1, 0.3, 1] as const,
} as const;

// === TYPE EXPORTS ===

/** Available spring preset names */
export type SpringPreset = keyof typeof springs;

/** Available duration preset names */
export type DurationPreset = keyof typeof durations;

/** Available easing preset names */
export type EasePreset = keyof typeof eases;
