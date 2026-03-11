"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, pageVariants } from "@/lib/motion";
import { Container } from "@/components/layout/Container";
import PageMeta from "../components/PageMeta";
import { VideoBackground, AmbientLayer } from "@/components/effects";

const glitchBgVideo = "/videos/rg-glitch-bg.webm";

const PIXEL_FONTS = [
  "var(--font-geist-pixel-square)",
  "var(--font-geist-pixel-grid)",
  "var(--font-geist-pixel-circle)",
  "var(--font-geist-pixel-triangle)",
  "var(--font-geist-pixel-line)",
];

const NotFound: React.FC = () => {
  const [fontIndex, setFontIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFontIndex((i) => (i + 1) % PIXEL_FONTS.length);
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <AmbientLayer variant="not-found" />
      <PageMeta
        title="404 - Page Not Found"
        description="The page you requested could not be found."
        path="/404/"
      />
      {/* Performance-tiered video background */}
      <VideoBackground
        src={glitchBgVideo}
        poster="/images/listen-poster.jpg"
        overlayOpacity={0.3}
      />
      <motion.div
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Container size="sm" padding="md" className="min-h-[60vh] flex flex-col items-center justify-center">
          <h1
            data-testid="not-found-title"
            className="text-6xl uppercase tracking-widest text-foreground mb-4"
            style={{ fontFamily: PIXEL_FONTS[fontIndex] }}
          >
            Signal Not Found
          </h1>
          <Link
            href="/"
            className="text-neutral-400 hover:text-accent text-sm no-underline"
          >
            Back to home
          </Link>
        </Container>
      </motion.div>
    </>
  );
};

export default NotFound;
