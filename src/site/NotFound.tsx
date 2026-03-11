"use client";

import React from "react";
import Link from "next/link";
import { motion, pageVariants } from "@/lib/motion";
import { Container } from "@/components/layout/Container";
import PageMeta from "../components/PageMeta";
import { VideoBackground, AmbientLayer } from "@/components/effects";

const glitchBgVideo = "/videos/rg-glitch-bg.webm";

const NotFound: React.FC = () => {
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
          <h1 data-testid="not-found-title" className="text-4xl font-europa-light text-foreground mb-4">
            Lost in the mix.
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
