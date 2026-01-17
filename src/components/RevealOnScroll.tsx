import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { revealVariants, revealFadeVariants } from '@/lib/motion';

type ElementType = 'div' | 'section' | 'article' | 'aside' | 'main' | 'header' | 'footer';

interface RevealOnScrollProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'whileInView' | 'viewport'> {
  children: React.ReactNode;
  /** HTML element to render. Default: 'div' */
  as?: ElementType;
  /** Trigger animation only once. Default: true */
  once?: boolean;
  /** Amount of element that must be visible (0-1). Default: 0.3 */
  amount?: number;
  /** Margin around viewport for early/late trigger. Default: '0px' */
  margin?: string;
  /** Custom className */
  className?: string;
}

/**
 * Wrapper component for scroll-triggered reveal animations.
 * Automatically respects reduced-motion preferences.
 *
 * @example
 * ```tsx
 * <RevealOnScroll>
 *   <h2>This heading reveals on scroll</h2>
 * </RevealOnScroll>
 *
 * <RevealOnScroll as="section" amount={0.5}>
 *   <p>This section waits until 50% visible</p>
 * </RevealOnScroll>
 * ```
 */
export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  as = 'div',
  once = true,
  amount = 0.3,
  margin = '0px',
  className,
  ...props
}) => {
  const prefersReducedMotion = useReducedMotion();
  const variants = prefersReducedMotion ? revealFadeVariants : revealVariants;

  // Create the appropriate motion component
  const MotionComponent = motion[as] as typeof motion.div;

  return (
    <MotionComponent
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin }}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export default RevealOnScroll;
