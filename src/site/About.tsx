"use client";

import React from 'react';
import Image from 'next/image';
import { motion, aboutVariants, aboutStaggerContainer, aboutCardItem } from '@/lib/motion';
import RevealOnScroll from '../components/RevealOnScroll';
import { Container } from '../components/layout/Container';
import { Stack } from '../components/layout/Stack';
import { VideoBackground } from '../components/effects/VideoBackground';
import { KineticText } from '../components/KineticText';
import Spinner from '../components/Spinner';
import PageMeta from '../components/PageMeta';
const promoCanvasVideo = "/videos/promo_canvas.webm";

const HoverWords = ({ children }: { children: string }) => (
  <>
    {children.split(' ').map((word, i) => (
      <span key={i} className="hover-word">{word} </span>
    ))}
  </>
);

const About: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  const handleContentLoad = () => {
    setLoading(false);
  };

  return (
    <>
      <PageMeta
        title="About | Random Gorsey"
        description="Background, influences and side projects of Random Gorsey."
        path="/about/"
      />

      {/* Performance-tiered video background */}
      <VideoBackground
        src={promoCanvasVideo}
        poster="/images/about-poster.jpg"
        overlayOpacity={0.2}
      />

      <motion.div
        className="min-h-screen grain-overlay"
        variants={aboutVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Container size="md" padding="lg" className="py-8 text-left bg-[oklch(8%_0_0deg)] border border-[oklch(12%_0_0deg)] my-8">
          <Stack gap="xl">
            {loading && <Spinner className="border-t-accent" />}

            {/* Heading with kinetic text */}
            <RevealOnScroll>
              <KineticText
                as="h1"
                splitBy="words"
                variant="default"
                className="text-6xl font-bold uppercase"
              >
                About
              </KineticText>
            </RevealOnScroll>

            {/* Portrait figure - video with jpg fallback */}
            <RevealOnScroll>
              <figure className="flex justify-center">
                <video
                  title="Portrait of Random Gorsey"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="/images/portrait.jpg"
                  className="w-24 md:w-32 shadow-xl"
                  onLoadedData={handleContentLoad}
                >
                  <source src="/images/portrait.webm" type="video/webm" />
                </video>
              </figure>
            </RevealOnScroll>

            {/* Bio text */}
            <RevealOnScroll>
              <p className="text-base leading-relaxed">
                <HoverWords>Helsinki-based producer Random Gorsey aka DJ Pizza Hut makes warm, nostalgic lo-fi house and electronic music. Soulful chords, minimalist grooves, mid-paced and high-energy. Connected to both the Helsinki and global electronic scenes.</HoverWords>
              </p>
            </RevealOnScroll>

            <RevealOnScroll>
              <p className="text-base leading-relaxed">
                <HoverWords>{"Self-taught and driven by instinct. Random G doesn't belong to any particular scene and doesn't try to. He acts on instinct, explores wherever creativity takes him, and tries not to overthink it."}</HoverWords>
              </p>
            </RevealOnScroll>

            <RevealOnScroll>
              <p className="text-base leading-relaxed">
                <HoverWords>{"Actively producing and exploring new tools, sounds, and ideas. Always finding fresh processes, inspired by raw energy and aestheticism, pushing creative boundaries."}</HoverWords>
              </p>
            </RevealOnScroll>

            {/* Side projects section */}
            <RevealOnScroll>
              <Stack gap="sm">
                <h2 className="text-2xl font-bold">Other projects</h2>
                <p className="text-base">
                  Beyond Random Gorsey, there are a few other things going on:
                </p>
              </Stack>
            </RevealOnScroll>

            {/* Staggered side project cards */}
            <motion.ul
              variants={aboutStaggerContainer}
              initial="initial"
              whileInView="enter"
              viewport={{ once: true, amount: 0.3 }}
              className="space-y-4 list-none p-0"
            >
              <motion.li variants={aboutCardItem}>
                <div className="flex items-center gap-4 py-3 border-l-3 border-accent pl-4">
                  <Image
                    src="/images/scportrait.jpg"
                    alt="Petri Lahdelma portrait"
                    width={1080}
                    height={1080}
                    sizes="48px"
                    className="w-12 h-12 object-cover"
                    onLoad={handleContentLoad}
                  />
                  <a
                    href="https://soundcloud.com/petri-lahdelma"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-accent no-underline font-semibold"
                  >
                    Petri Lahdelma - A raw techno project on Soundcloud.
                  </a>
                </div>
              </motion.li>

              <motion.li variants={aboutCardItem}>
                <div className="flex items-center gap-4 py-3 border-l-3 border-accent pl-4">
                  <Image
                    src="/images/scpizza.jpg"
                    alt="DJ Pizza Hut"
                    width={1080}
                    height={1080}
                    sizes="48px"
                    className="w-12 h-12 object-cover"
                    onLoad={handleContentLoad}
                  />
                  <a
                    href="https://soundcloud.com/dj-pizza-hut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground hover:text-accent no-underline font-semibold"
                  >
                    Dj Pizza Hut - Honestly, I don&apos;t even know, man. Check it out on SC.
                  </a>
                </div>
              </motion.li>
            </motion.ul>
          </Stack>
        </Container>
      </motion.div>
    </>
  );
};

export default About;
