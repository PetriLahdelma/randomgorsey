"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { galleryRevealVariants } from "@/lib/motion";

interface ScanLineRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScanLineReveal({
  children,
  className,
  delay = 0,
}: ScanLineRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div ref={ref} className={`relative overflow-hidden ${className ?? ""}`}>
      <motion.div
        variants={galleryRevealVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        transition={{ delay: delay / 1000 }}
      >
        {children}
      </motion.div>
      {/* Bright scan line at clip edge */}
      <motion.div
        aria-hidden="true"
        className="absolute left-0 right-0 h-[2px] bg-[color:var(--color-accent)] pointer-events-none"
        initial={{ top: "0%" }}
        animate={isInView ? { top: "100%" } : { top: "0%" }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
          delay: delay / 1000,
        }}
        style={{ opacity: isInView ? 0.7 : 0 }}
      />
    </div>
  );
}
