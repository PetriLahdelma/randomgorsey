"use client";

import React, { useState } from "react";
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

interface GlitchLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
}

const GlitchLink: React.FC<GlitchLinkProps> = ({
  href,
  children,
  className,
  title,
  onClick,
}) => {
  const [showGhost, setShowGhost] = useState(false);
  const [ghostFont] = useState(
    () => PIXEL_FONTS[Math.floor(Math.random() * PIXEL_FONTS.length)]
  );

  return (
    <span
      className={cn("relative", className)}
      onMouseEnter={() => setShowGhost(true)}
      onMouseLeave={() => setShowGhost(false)}
    >
      <TransitionLink href={href} title={title} onClick={onClick}>
        <span className="relative z-10">{children}</span>
      </TransitionLink>

      <AnimatePresence>
        {showGhost && (
          <motion.span
            style={{ fontFamily: ghostFont }}
            className="absolute left-0 top-0 text-[1.6em] text-accent pointer-events-none select-none whitespace-nowrap origin-left"
            initial={{ opacity: 0, x: -2, y: -6, scale: 1.05 }}
            animate={{ opacity: 0.1, x: 1, y: -8, scale: 1.15 }}
            exit={{ opacity: 0, x: 4, y: -10, scale: 1.2 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            aria-hidden="true"
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Accent line — shoots from left on hover */}
      <motion.div
        aria-hidden="true"
        className="absolute bottom-0 left-0 h-[1px] bg-[color:var(--color-accent)]"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: showGhost ? 1 : 0 }}
        transition={{ duration: 0.1, ease: [0.22, 1, 0.36, 1] }}
      />
    </span>
  );
};

export default GlitchLink;
