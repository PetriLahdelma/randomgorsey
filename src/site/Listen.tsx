"use client";

import React from 'react';
import { motion, listenVariants, embedBorderVariants } from '@/lib/motion';
import { usePerformance } from "@/lib/performance";
import { VideoBackground, AmbientLayer } from '@/components/effects';
import RevealOnScroll from '../components/RevealOnScroll';
import { KineticText } from '@/components/KineticText';
import { Container } from '@/components/layout/Container';
import { Stack } from '@/components/layout/Stack';
import Spinner from '../components/Spinner';
import PageMeta from '../components/PageMeta';
const glitchBgVideo = "/videos/rg-glitch-bg.webm";

const Listen: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [embedProximity, setEmbedProximity] = React.useState(0);
  const { tier, isReducedMotion } = usePerformance();
  const shouldAnimate = tier >= 2 && !isReducedMotion;

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const anyVisible = entries.some((e) => e.isIntersecting);
        setEmbedProximity(anyVisible ? 1 : 0);
      },
      { threshold: 0.1 }
    );
    const embeds = document.querySelectorAll('iframe[title="RG player"], iframe[title="SoundCloud Player"]');
    embeds.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleContentLoad = () => {
    setLoading(false);
  };

  return (
    <>
      <AmbientLayer variant="listen" embedProximity={embedProximity} />
      <PageMeta
        title="Listen | Random Gorsey"
        description="Stream songs and playlists from Random Gorsey."
        path="/listen/"
      />

      {/* Video background with dark overlay for immersive mood */}
      <VideoBackground
        src={glitchBgVideo}
        poster="/images/listen-poster.jpg"
        overlayOpacity={0.4}
      />

      <motion.div
        variants={listenVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="relative z-10 min-h-screen py-16 grain-overlay"
      >
        <Container size="md" padding="md">
          <Stack gap="xl">
            {loading && <Spinner />}

            {/* Animated headline */}
            <RevealOnScroll>
              <KineticText
                as="h1"
                splitBy="words"
                variant="default"
                staggerDelay={0.05}
                className="font-display uppercase tracking-[-0.02em]"
              >
                Listen to Music
              </KineticText>
            </RevealOnScroll>

            {/* Spotify embed */}
            {typeof window !== 'undefined' && (
              <>
                <RevealOnScroll>
                  <motion.div
                    variants={shouldAnimate ? embedBorderVariants : undefined}
                    initial={shouldAnimate ? "hidden" : undefined}
                    whileInView={shouldAnimate ? "visible" : undefined}
                    viewport={{ once: true, margin: "-10% 0px" }}
                  >
                    <iframe
                      title="RG player"
                      className="w-full"
                      src="https://open.spotify.com/embed/artist/54Vv9rlCqX2nW2V0tXw33q?utm_source=generator"
                      width="100%"
                      height="352"
                      frameBorder="0"
                      allowFullScreen={true}
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                      onLoad={handleContentLoad}
                    />
                  </motion.div>
                </RevealOnScroll>

                {/* SoundCloud embed */}
                <RevealOnScroll>
                  <motion.div
                    variants={shouldAnimate ? embedBorderVariants : undefined}
                    initial={shouldAnimate ? "hidden" : undefined}
                    whileInView={shouldAnimate ? "visible" : undefined}
                    viewport={{ once: true, margin: "-10% 0px" }}
                  >
                    <iframe
                      title="SoundCloud Player"
                      className="w-full"
                      width="100%"
                      height="300"
                      scrolling="no"
                      frameBorder="no"
                      allow="autoplay"
                      src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2029288998&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                    />
                  </motion.div>
                </RevealOnScroll>
              </>
            )}

            {/* SoundCloud attribution */}
            <RevealOnScroll>
              <div className="text-xs font-light text-muted-foreground truncate">
                <a
                  href="https://soundcloud.com/randomgorsey"
                  title="Random Gorsey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground no-underline"
                >
                  Random Gorsey
                </a>
                {' · '}
                <a
                  href="https://soundcloud.com/randomgorsey/sets/tuunz"
                  title="Tuunz"
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted-foreground hover:text-foreground no-underline"
                >
                  Tuunz
                </a>
              </div>
            </RevealOnScroll>

            {/* Streaming CTA cards */}
            <RevealOnScroll>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
                <a
                  href="https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[oklch(8%_0_0deg)] border border-[oklch(12%_0_0deg)] p-6 text-center no-underline hover:bg-[oklch(10%_0_0deg)] transition-colors"
                >
                  <span className="text-foreground text-sm font-europa">Spotify</span>
                </a>
                <a
                  href="https://soundcloud.com/randomgorsey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[oklch(8%_0_0deg)] border border-[oklch(12%_0_0deg)] p-6 text-center no-underline hover:bg-[oklch(10%_0_0deg)] transition-colors"
                >
                  <span className="text-foreground text-sm font-europa">SoundCloud</span>
                </a>
                <a
                  href="https://randomgorsey.bandcamp.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[oklch(8%_0_0deg)] border border-[oklch(12%_0_0deg)] p-6 text-center no-underline hover:bg-[oklch(10%_0_0deg)] transition-colors"
                >
                  <span className="text-foreground text-sm font-europa">Bandcamp</span>
                </a>
              </div>
            </RevealOnScroll>
          </Stack>
        </Container>
      </motion.div>
    </>
  );
};

export default Listen;
