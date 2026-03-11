"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

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

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-white text-2xl font-mono-label bg-transparent border-none cursor-pointer z-10"
          aria-label="Close lightbox"
        >
          &times;
        </button>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-[90vw] max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
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
    </AnimatePresence>
  );
};

export default Lightbox;
