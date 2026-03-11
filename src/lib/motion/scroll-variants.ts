import { type Variants } from "framer-motion";
import { eases, durations } from "./config";

/**
 * Post card entrance: alternating horizontal slide-in.
 * Usage: Apply odd/even via the `custom` prop (0 = left, 1 = right).
 */
export const postCardVariants: Variants = {
  hidden: (isOdd: boolean) => ({
    opacity: 0,
    x: isOdd ? 40 : -40,
    filter: "brightness(1.3) contrast(1.2)",
  }),
  visible: {
    opacity: 1,
    x: 0,
    filter: "brightness(1) contrast(1)",
    transition: {
      duration: durations.slow,
      ease: eases.default,
    },
  },
};

export const postCardStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

export const postCardChild: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.fast,
      ease: eases.default,
    },
  },
};

export const galleryRevealVariants: Variants = {
  hidden: {
    clipPath: "inset(0 0 100% 0)",
    opacity: 1,
  },
  visible: {
    clipPath: "inset(0 0 0% 0)",
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: eases.default,
    },
  },
};

export const embedBorderVariants: Variants = {
  hidden: {
    opacity: 0,
    clipPath: "inset(0 100% 100% 0)",
  },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0% 0% 0)",
    transition: {
      duration: 0.5,
      ease: eases.default,
    },
  },
};

export const bodyTextVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: eases.default,
    },
  },
};

export const headingCharVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -8,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: eases.default,
    },
  },
};

export const headingContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.025,
      delayChildren: 0.05,
    },
  },
};

export const headingGhostVariants: Variants = {
  hidden: {
    opacity: 0,
    x: -4,
    scale: 1.05,
  },
  visible: {
    opacity: 0.12,
    x: 2,
    scale: 1.08,
    transition: {
      duration: 0.6,
      ease: eases.default,
      delay: 0.2,
    },
  },
};

export const headingUnderlineVariants: Variants = {
  hidden: {
    scaleX: 0,
    originX: 0,
  },
  visible: {
    scaleX: 1,
    transition: {
      duration: 0.4,
      ease: eases.default,
      delay: 0.4,
    },
  },
};
