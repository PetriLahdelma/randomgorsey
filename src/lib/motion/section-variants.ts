import type { Variants } from 'framer-motion';
import { springs, durations } from './config';

// All sections use the same snappy timing — no more "personalities"
const sectionEnter = {
  type: 'spring' as const,
  ...springs.snappy,
  delay: 0.05,
};

const sectionExit = { duration: durations.fast };

export const heroVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const galleryVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const listenVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const aboutVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const contactVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const discographyVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

// Stagger containers — tight, fast
const punkStagger = {
  initial: {},
  enter: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

export const heroStaggerContainer: Variants = punkStagger;
export const galleryStaggerContainer: Variants = punkStagger;
export const discographyStaggerContainer: Variants = punkStagger;
export const aboutStaggerContainer: Variants = punkStagger;

// Card item — no scale, just snap in
export const aboutCardItem: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.snappy },
  },
  exit: { opacity: 0, transition: { duration: durations.fast } },
};
