import type { Variants } from 'framer-motion';
import { springs, durations } from './config';

// All sections use smooth gallery timing
const sectionEnter = {
  type: 'spring' as const,
  ...springs.snappy,
  delay: 0.08,
};

const sectionExit = { duration: durations.fast };

export const heroVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const galleryVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const listenVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const aboutVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const contactVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const discographyVariants: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

// Stagger containers — smooth gallery pace
const galleryStagger = {
  initial: {},
  enter: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

export const heroStaggerContainer: Variants = galleryStagger;
export const galleryStaggerContainer: Variants = galleryStagger;
export const discographyStaggerContainer: Variants = galleryStagger;
export const aboutStaggerContainer: Variants = galleryStagger;

// Card item — no scale, just snap in
export const aboutCardItem: Variants = {
  initial: { opacity: 0, y: 12 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.snappy },
  },
  exit: { opacity: 0, transition: { duration: durations.fast } },
};
