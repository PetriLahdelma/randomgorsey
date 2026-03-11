"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useTransform } from "framer-motion";
import { TransitionLink } from "@/lib/transition";
import { useScrollVelocity } from "@/lib/motion/useScrollVelocity";
import { cn } from "@/lib/utils";

const PIXEL_FONTS = [
  "var(--font-geist-pixel-square)",
  "var(--font-geist-pixel-grid)",
  "var(--font-geist-pixel-circle)",
  "var(--font-geist-pixel-triangle)",
  "var(--font-geist-pixel-line)",
] as const;

const LOGO_TEXT = "Random Gorsey";

interface PixelLogoProps {
  className?: string;
}

const PixelLogo: React.FC<PixelLogoProps> = ({ className }) => {
  const [fontIndex, setFontIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showGhost, setShowGhost] = useState(false);
  const [ghostFont, setGhostFont] = useState(0);

  // 6a: Idle micro-glitch state
  const [glitchCharIndex, setGlitchCharIndex] = useState<number | null>(null);
  const [glitchFont, setGlitchFont] = useState<string | null>(null);

  // 6b: Scroll-velocity letter-spacing
  const velocity = useScrollVelocity();
  const letterSpacing = useTransform(
    velocity,
    [-30, 0, 30],
    ["0.15em", "0.05em", "0.15em"]
  );

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

  // 6a: Idle micro-glitch effect
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    function scheduleGlitch() {
      const delay = 15000 + Math.random() * 15000;
      timeoutId = setTimeout(() => {
        const charIndex = Math.floor(Math.random() * LOGO_TEXT.length);
        const font = PIXEL_FONTS[Math.floor(Math.random() * PIXEL_FONTS.length)];
        setGlitchCharIndex(charIndex);
        setGlitchFont(font);

        setTimeout(() => {
          setGlitchCharIndex(null);
          setGlitchFont(null);
          scheduleGlitch();
        }, 33);
      }, delay);
    }

    scheduleGlitch();
    return () => clearTimeout(timeoutId);
  }, []);

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
        {/* 6c: Split characters for individual targeting */}
        <motion.span
          style={{ letterSpacing, fontFamily: PIXEL_FONTS[fontIndex] }}
          className="inline-block relative z-10"
        >
          {LOGO_TEXT.split("").map((char, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                whiteSpace: char === " " ? "pre" : undefined,
                fontFamily:
                  i === glitchCharIndex && glitchFont ? glitchFont : undefined,
              }}
            >
              {char}
            </span>
          ))}
        </motion.span>
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
            {LOGO_TEXT}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
};

export default PixelLogo;
