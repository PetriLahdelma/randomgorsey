"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePerformance } from "@/lib/performance";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const hasMultiple = images.length > 1;
  const { effectsEnabled, isMobile, isReducedMotion } = usePerformance();
  const motionAllowed = effectsEnabled && !isMobile && !isReducedMotion;
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const dialogRef = React.useRef<HTMLDivElement>(null);
  const previousOverflowRef = React.useRef("");

  React.useLayoutEffect(() => {
    closeRef.current?.focus();
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        const controls = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>("button:not([disabled])") ?? []);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (first && last && e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (first && last && !e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
      if (e.key === "Escape") onClose();
      if (hasMultiple && e.key === "ArrowRight")
        onNavigate((currentIndex + 1) % images.length);
      if (hasMultiple && e.key === "ArrowLeft")
        onNavigate((currentIndex - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, hasMultiple, onClose, onNavigate]);

  React.useEffect(() => {
    previousOverflowRef.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflowRef.current;
    };
  }, []);

  return (
    <motion.div
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
      initial={motionAllowed ? { opacity: 0 } : false}
      animate={{
        opacity: 1,
        transition: {
          duration: motionAllowed ? 0.2 : 0,
          ease: [0.16, 1, 0.3, 1],
        },
      }}
      exit={{
        opacity: 0,
        transition: {
          duration: motionAllowed ? 0.16 : 0,
          ease: [0.4, 0, 1, 1],
        },
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
    >
      <button
        ref={closeRef}
        onClick={onClose}
        className="absolute top-6 right-6 text-neutral-400 hover:text-white text-2xl font-mono-label bg-transparent border-none cursor-pointer z-10"
        aria-label="Close lightbox"
      >
        &times;
      </button>

      <motion.div
        className="relative max-w-[90vw] max-h-[90vh]"
        initial={motionAllowed ? { scale: 0.95 } : false}
        animate={{
          scale: 1,
          transition: {
            duration: motionAllowed ? 0.2 : 0,
            ease: [0.16, 1, 0.3, 1],
          },
        }}
        exit={{
          scale: 0.95,
          transition: {
            duration: motionAllowed ? 0.16 : 0,
            ease: [0.4, 0, 1, 1],
          },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={currentIndex}
            initial={motionAllowed ? { opacity: 0, filter: "blur(2px)" } : false}
            animate={{
              opacity: 1,
              filter: "blur(0px)",
              transition: {
                duration: motionAllowed ? 0.2 : 0,
                ease: [0.65, 0, 0.35, 1],
              },
            }}
            exit={{
              opacity: 0,
              filter: "blur(2px)",
              transition: {
                duration: motionAllowed ? 0.16 : 0,
                ease: [0.65, 0, 0.35, 1],
              },
            }}
          >
            <Image
              src={images[currentIndex]}
              alt=""
              width={1200}
              height={800}
              className="object-contain max-h-[90vh] w-auto"
              sizes="90vw"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {hasMultiple && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex - 1 + images.length) % images.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-3xl font-mono-label bg-transparent border-none cursor-pointer"
            aria-label="Previous image"
          >
            &larr;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate((currentIndex + 1) % images.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-3xl font-mono-label bg-transparent border-none cursor-pointer"
            aria-label="Next image"
          >
            &rarr;
          </button>
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono-label text-sm text-neutral-400">
            {currentIndex + 1} / {images.length}
          </span>
        </>
      )}
    </motion.div>
  );
};

export default Lightbox;
