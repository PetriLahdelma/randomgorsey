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
  image: string;
  bandcamp: string;
  spotify?: string;
  tracks?: string[];
}

const releases: Release[] = [
  {
    title: 'So Long Spectrum',
    catalog: 'FIRGO2100004',
    year: 2021,
    image: SoLong,
    bandcamp: 'https://randomgorsey.bandcamp.com/track/so-long-spectrum',
    spotify: 'https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q',
    tracks: ['So long spectrum'],
  },
  {
    title: 'The Customer is Always Right EP',
    catalog: 'RDGY 01',
    year: 2021,
    image: Customer,
    bandcamp: 'https://randomgorsey.bandcamp.com/album/the-customer-is-always-right',
    spotify: 'https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q',
    tracks: ['Chillax Karen', 'The Customer is Always Right', 'Fuck Face Masks'],
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
        className="mx-auto w-full max-w-screen-lg px-4 py-8 font-sans leading-relaxed text-foreground grain-overlay sm:px-6 lg:px-8 text-left"
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

            {/* Release cards with gallery styling */}
            <motion.div
              variants={discographyStaggerContainer}
              initial="initial"
              animate="enter"
              className="grid grid-cols-1 gap-8"
            >
              {releases.map((release) => (
                <motion.div
                  key={release.catalog}
                  variants={staggerItem}
                  className="bg-[oklch(8%_0_0deg)] border border-[oklch(12%_0_0deg)] p-8"
                >
                  <div className="flex flex-col md:flex-row gap-8">
                    <a
                      href={release.bandcamp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block shrink-0"
                    >
                      <div className="relative w-full md:w-64 h-64 overflow-hidden">
                        <Image
                          src={release.image}
                          alt={release.title}
                          fill
                          sizes="(min-width: 768px) 256px, 100vw"
                          className="object-cover"
                        />
                      </div>
                    </a>
                    <div className="flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">{release.title}</h3>
                        <p className="font-mono-label text-muted-foreground mt-1">
                          {release.catalog} &middot; {release.year}
                        </p>
                        {release.tracks && release.tracks.length > 1 && (
                          <details className="mt-4">
                            <summary className="cursor-pointer font-mono-label text-sm text-accent underline underline-offset-4 hover:text-foreground transition-colors list-none">
                              Tracklist
                            </summary>
                            <ol className="mt-2 space-y-1 list-decimal list-inside text-sm text-muted-foreground">
                              {release.tracks.map((track) => (
                                <li key={track}>{track}</li>
                              ))}
                            </ol>
                          </details>
                        )}
                        {release.tracks && release.tracks.length === 1 && (
                          <p className="mt-4 text-sm text-muted-foreground">{release.tracks[0]}</p>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-3 mt-6">
                        <a
                          className="inline-block bg-accent text-accent-foreground px-6 py-2 font-mono-label hover:bg-yellow-500 text-sm"
                          href={release.bandcamp}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Bandcamp
                        </a>
                        {release.spotify && (
                          <a
                            className="inline-block border border-[oklch(20%_0_0deg)] text-foreground px-6 py-2 font-mono-label hover:bg-[oklch(12%_0_0deg)] text-sm no-underline"
                            href={release.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Spotify
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Stack>
        </Container>
      </motion.div>
    </>
  );
};

export default Discography;
