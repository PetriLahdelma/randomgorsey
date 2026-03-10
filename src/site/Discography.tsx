"use client";

import React from 'react';
import Image from 'next/image';
import {
  motion,
  discographyVariants,
  discographyStaggerContainer,
  staggerItem,
} from '@/lib/motion';
import PageMeta from '../components/PageMeta';
import { VideoBackground } from '@/components/effects';
import { KineticText } from '@/components/KineticText';
import { Container } from '@/components/layout/Container';
import { Stack } from '@/components/layout/Stack';

const SoLong = "/images/so_long_spectrum.jpg";
const Customer = "/images/customerisalwaysright.jpg";
const firgoCanvasVideo = "/videos/FIRGO002_canvas.webm";

interface Release {
  title: string;
  catalog: string;
  year: number;
}

const releases: Release[] = [
  {
    title: 'So Long Spectrum',
    catalog: 'FIRGO2100004',
    year: 2022,
  },
  {
    title: 'The Customer is Always Right EP',
    catalog: 'RDGY 01',
    year: 2021,
  },
];

const Discography: React.FC = () => {
  return (
    <>
      <PageMeta
        title="Discography | Random Gorsey"
        description="Browse the official releases from Random Gorsey."
        path="/discography/"
      />
      {/* Performance-tiered video background */}
      <VideoBackground
        src={firgoCanvasVideo}
        poster="/images/discography-poster.jpg"
        overlayOpacity={0.3}
      />
      <motion.div
        className="mx-auto w-full max-w-2xl px-4 py-8 font-sans leading-relaxed text-foreground grain-overlay sm:px-6 lg:px-8"
        variants={discographyVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Container size="lg" padding="none">
          <Stack gap="xl" align="stretch">
            {/* Animated headline - simple single word, no fancy break */}
            <KineticText
              as="h1"
              splitBy="chars"
              variant="default"
              staggerDelay={0.03}
              triggerOnView={false}
              className="mb-6 mx-auto w-full px-2 text-center font-display font-bold uppercase tracking-[0.015em] text-[clamp(1.4rem,4vw,2.6rem)]"
            >
              Discography
            </KineticText>

            {/* Release grid with stagger animation */}
            <motion.div
              variants={discographyStaggerContainer}
              initial="initial"
              animate="enter"
              className="grid grid-cols-1 gap-8 md:grid-cols-2"
            >
              {releases.map((release) => {
                const buyHref =
                  release.title === 'So Long Spectrum'
                    ? 'https://randomgorsey.bandcamp.com/track/so-long-spectrum'
                    : 'https://randomgorsey.bandcamp.com/album/the-customer-is-always-right';
                return (
                  <motion.div
                    key={release.catalog}
                    variants={staggerItem}
                    className="group text-center"
                  >
                    <a
                      href={buyHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <div className="relative mx-auto h-48 w-48 overflow-hidden">
                        <Image
                          src={release.title === 'So Long Spectrum' ? SoLong : Customer}
                          alt={release.title}
                          fill
                          sizes="192px"
                          className="object-cover"
                        />
                      </div>
                    </a>
                    <h3 className="mt-4 text-xl font-bold">{release.title}</h3>
                    <p className="font-mono-label text-muted-foreground">
                      {release.catalog} · {release.year}
                    </p>
                    <a
                      className="mt-3 inline-block bg-accent text-accent-foreground px-6 py-2 font-mono-label hover:bg-yellow-500"
                      href={buyHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      BUY
                    </a>
                  </motion.div>
                );
              })}
            </motion.div>
          </Stack>
        </Container>
      </motion.div>
    </>
  );
};

export default Discography;
