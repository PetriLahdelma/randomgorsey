import type { Variants } from 'framer-motion';
import { stagger, transitions } from './config';

// Section transitions use deterministic tweens with no routine bounce.
const sectionEnter = {
  ...transitions.enter,
  delay: 0.08,
};

const sectionExit = transitions.exit;

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

// List rows settle 30ms apart and exit in reverse 20% faster.
const galleryStagger = {
  initial: {},
  enter: { transition: { staggerChildren: stagger.rows, delayChildren: stagger.rows } },
  exit: { transition: { staggerChildren: stagger.rowsExit, staggerDirection: -1 } },
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
    transition: transitions.enter,
  },
  exit: { opacity: 0, transition: transitions.exit },
};
