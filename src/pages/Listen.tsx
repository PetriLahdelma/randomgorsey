import React from 'react';
import { motion, listenVariants } from '@/lib/motion';
import { VideoBackground } from '@/components/effects';
import RevealOnScroll from '../components/RevealOnScroll';
import { KineticText } from '@/components/KineticText';
import { Container } from '@/components/layout/Container';
import { Stack } from '@/components/layout/Stack';
import Spinner from '../components/Spinner';
import PageMeta from '../components/PageMeta';
import glitchBgVideo from '../videos/rg-glitch-bg.webm';

const Listen: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  const handleContentLoad = () => {
    setLoading(false);
  };

  return (
    <>
      <PageMeta
        title="Listen | Random Gorsey"
        description="Stream songs and playlists from Random Gorsey."
        path="/listen"
      />

      {/* Video background with dark overlay for immersive mood */}
      <VideoBackground
        src={glitchBgVideo}
        poster="/images/listen-poster.jpg"
        overlayOpacity={0.4}
      />

      <motion.div
        data-section="listen"
        variants={listenVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        className="relative z-10 min-h-screen py-16"
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
                className="font-heading text-4xl uppercase tracking-wide text-section-foreground"
              >
                Listen to Music
              </KineticText>
            </RevealOnScroll>

            {/* Description */}
            <RevealOnScroll>
              <p className="font-sans text-lg text-section-foreground/80">
                Enjoy curated playlists and latest tracks.
              </p>
            </RevealOnScroll>

            {/* Spotify embed */}
            {typeof window !== 'undefined' && (
              <>
                <RevealOnScroll>
                  <iframe
                    title="RG player"
                    className="w-full rounded-xl"
                    src="https://open.spotify.com/embed/artist/54Vv9rlCqX2nW2V0tXw33q?utm_source=generator"
                    width="100%"
                    height="352"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    onLoad={handleContentLoad}
                  />
                </RevealOnScroll>

                {/* SoundCloud embed */}
                <RevealOnScroll>
                  <iframe
                    title="SoundCloud Player"
                    className="w-full rounded-xl"
                    width="100%"
                    height="300"
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2029288998&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
                  />
                </RevealOnScroll>
              </>
            )}

            {/* SoundCloud attribution */}
            <RevealOnScroll>
              <div className="text-xs font-light text-white/60 truncate">
                <a
                  href="https://soundcloud.com/randomgorsey"
                  title="Random Gorsey"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/60 hover:text-white/80 no-underline transition-colors"
                >
                  Random Gorsey
                </a>
                {' · '}
                <a
                  href="https://soundcloud.com/randomgorsey/sets/tuunz"
                  title="Tuunz"
                  target="_blank"
                  rel="noreferrer"
                  className="text-white/60 hover:text-white/80 no-underline transition-colors"
                >
                  Tuunz
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
