"use client";

import { useRef } from "react";
import { motion, useInView, useTransform } from "framer-motion";
import {
  headingCharVariants,
  headingContainerVariants,
  headingGhostVariants,
  headingUnderlineVariants,
} from "@/lib/motion";
import { useScrollVelocity } from "@/lib/motion/useScrollVelocity";
import { usePerformance } from "@/lib/performance";
import { cn } from "@/lib/utils";

interface AnimatedHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: string;
  className?: string;
  static?: boolean;
}

const levelStyles: Record<number, string> = {
  1: "text-6xl md:text-7xl",
  2: "text-4xl md:text-5xl",
  3: "text-3xl md:text-4xl",
  4: "text-2xl md:text-3xl",
  5: "text-xl md:text-2xl",
  6: "text-lg md:text-xl",
};

export function AnimatedHeading({
  level,
  children,
  className,
  static: isStatic = false,
}: AnimatedHeadingProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Tag = `h${level}` as any;
  const ref = useRef<HTMLDivElement>(null);
  const { tier, isReducedMotion } = usePerformance();
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  const velocity = useScrollVelocity();
  // Ghost drifts proportional to velocity
  const ghostX = useTransform(velocity, [-20, 0, 20], [6, 0, -6]);
  const ghostY = useTransform(velocity, [-20, 0, 20], [3, 0, -3]);

  const chars = children.split("");

  // Tier 0-1 or reduced motion: static rendering
  if (isStatic || tier <= 1 || isReducedMotion) {
    return (
      <Tag
        className={cn(
          "font-tschick-bold uppercase tracking-wider",
          levelStyles[level],
          className
        )}
      >
        {children}
      </Tag>
    );
  }

  return (
    <div ref={ref} className="relative inline-block text-left">
      {/* Ghost echo */}
      <motion.div
        data-ghost
        variants={headingGhostVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        style={{ x: ghostX, y: ghostY }}
        className={cn(
          "absolute inset-0 text-[color:var(--color-accent)] pointer-events-none select-none",
          "font-tschick-bold uppercase tracking-wider",
          levelStyles[level]
        )}
        aria-hidden="true"
      >
        {children}
      </motion.div>

      {/* Main heading with character stagger */}
      <motion.div
        variants={headingContainerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <Tag
          className={cn(
            "font-tschick-bold uppercase tracking-wider relative",
            levelStyles[level],
            className
          )}
        >
          {chars.map((char, i) => (
            <motion.span
              key={i}
              data-char
              variants={headingCharVariants}
              className="inline-block"
              style={{ whiteSpace: char === " " ? "pre" : undefined }}
            >
              {char}
            </motion.span>
          ))}
        </Tag>
      </motion.div>

      {/* Underline draws from left */}
      <motion.div
        data-underline
        variants={headingUnderlineVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="h-[2px] bg-[color:var(--color-accent)] mt-2"
      />
    </div>
  );
}
