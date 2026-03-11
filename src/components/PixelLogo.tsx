"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TransitionLink } from "@/lib/transition";
import { cn } from "@/lib/utils";

const PIXEL_FONTS = [
  "var(--font-geist-pixel-square)",
  "var(--font-geist-pixel-grid)",
  "var(--font-geist-pixel-circle)",
  "var(--font-geist-pixel-triangle)",
  "var(--font-geist-pixel-line)",
] as const;

interface PixelLogoProps {
  className?: string;
}

const PixelLogo: React.FC<PixelLogoProps> = ({ className }) => {
  const [fontIndex, setFontIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [ghostFont, setGhostFont] = useState(0);

  const cycleFont = useCallback(() => {
    setIsAnimating(true);
    const totalSteps = PIXEL_FONTS.length * 2;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      setFontIndex(step % PIXEL_FONTS.length);
      if (step >= totalSteps) {
        clearInterval(interval);
        setFontIndex(0);
        setIsAnimating(false);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    cycleFont();
  }, [cycleFont]);

  const handleMouseEnter = () => {
    // Pick a random different font for the ghost
    setGhostFont((fontIndex + 2) % PIXEL_FONTS.length);
    setShowGhost(true);

    if (!isAnimating) {
      cycleFont();
    }
  };

  const handleMouseLeave = () => {
    setShowGhost(false);
  };

  return (
    <span
      className={cn(
        "text-sm uppercase tracking-[0.25em] text-foreground no-underline transition-colors hover:text-accent relative",
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Random Gorsey — Home"
    >
      <TransitionLink href="/">
        <span
          style={{ fontFamily: PIXEL_FONTS[fontIndex] }}
          className="inline-block relative z-10"
        >
          Random Gorsey
        </span>
      </TransitionLink>

      <AnimatePresence>
        {showGhost && (
          <motion.span
            style={{ fontFamily: PIXEL_FONTS[ghostFont] }}
            className="absolute left-0 top-0 text-[1.8em] text-accent pointer-events-none select-none whitespace-nowrap origin-left"
            initial={{ opacity: 0, x: -4, y: -8, scale: 1.1 }}
            animate={{ opacity: 0.12, x: 2, y: -12, scale: 1.2 }}
            exit={{ opacity: 0, x: 6, y: -16, scale: 1.3 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            aria-hidden="true"
          >
            Random Gorsey
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

export default PixelLogo;
