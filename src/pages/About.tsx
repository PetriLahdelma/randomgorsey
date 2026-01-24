import React from 'react';
import { motion, aboutVariants, aboutStaggerContainer, aboutCardItem } from '@/lib/motion';
import RevealOnScroll from '../components/RevealOnScroll';
import { Container } from '../components/layout/Container';
import { Stack } from '../components/layout/Stack';
import { VideoBackground } from '../components/effects/VideoBackground';
import { KineticText } from '../components/KineticText';
import Spinner from '../components/Spinner';
import PageMeta from '../components/PageMeta';
import { isWebMSupported } from '../utils/isWebMSupported';
import promoCanvasVideo from '../videos/promo_canvas.webm';

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
        path="/about"
      />

      {/* Performance-tiered video background */}
      <VideoBackground
        src={promoCanvasVideo}
        poster="/images/about-poster.jpg"
        overlayOpacity={0.2}
      />

      <motion.div
        className="min-h-screen"
        data-section="about"
        variants={aboutVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Container size="prose" padding="md" className="py-8">
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

            {/* Portrait figure */}
            <RevealOnScroll>
              <figure className="flex justify-center">
                {isWebMSupported() ? (
                  <video
                    title="Portrait of Random Gorsey"
                    autoPlay
                    muted
                    loop
                    controls={false}
                    className="w-24 md:w-32 rounded-full shadow-xl"
                    onLoadedData={handleContentLoad}
                  >
                    <source src="/images/portrait.webm" type="video/webm" />
                    <img
                      src="/images/portrait.jpg"
                      alt="Portrait of Random Gorsey"
                      className="w-24 md:w-32 rounded-full"
                    />
                  </video>
                ) : (
                  <img
                    src="/images/portrait.jpg"
                    alt="Portrait of Random Gorsey"
                    className="w-24 md:w-32 rounded-full shadow-xl"
                    onLoad={handleContentLoad}
                  />
                )}
              </figure>
            </RevealOnScroll>

            {/* Bio text */}
            <RevealOnScroll>
              <p className="text-base leading-relaxed">
                Helsinki-based producer/musician Random Gorsey aka DJ Pizza Hut makes warm,
                nostalgic lo-fi house and electronic music with soulful chords and minimalist grooves.
                His music pays homage to mid-paced, high-energy electronic music.
              </p>
            </RevealOnScroll>

            <RevealOnScroll>
              <p className="text-base leading-relaxed">
                Having spent the last few years producing for his own amusement and after his debut EP
                steadily brought the much-needed confidence, he decided to take a step forward and start
                producing on a more regular basis. Random G doesn&apos;t feel he belongs to any particular scene.
                As is the nature of his music, he just acts on instinct and goes wherever it takes him and
                tries not to overthink it.
              </p>
            </RevealOnScroll>

            <RevealOnScroll>
              <p className="text-base leading-relaxed">
                Originally from Turku, Finland, he studied graphic design in the UK, before returning to
                Finland for his master&apos;s. While he is currently on hiatus focusing on his design career,
                he has always had a deep passion for making music. He loves exploring new tools, sounds,
                and ideas, constantly finding fresh processes in an artistic way. Mostly he is inspired by
                aestheticism, raw energy, and talent, always looking to solve problems and push creative boundaries.
              </p>
            </RevealOnScroll>

            {/* Side projects section */}
            <RevealOnScroll>
              <Stack gap="sm">
                <h2 className="text-2xl font-bold">Side projects</h2>
                <p className="text-base">
                  Random Gorsey is also involved in several side projects, including:
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
              <motion.li
                variants={aboutCardItem}
                className="group cursor-pointer"
                onClick={() => window.open('https://soundcloud.com/petri-lahdelma', '_blank')}
              >
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-white/10">
                  <img
                    src="/images/scportrait.jpg"
                    alt="Petri Lahdelma portrait"
                    className="w-12 h-12 rounded-full object-cover"
                    onLoad={handleContentLoad}
                  />
                  <a
                    href="https://soundcloud.com/petri-lahdelma"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-inherit no-underline group-hover:text-accent transition-colors font-semibold"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Petri Lahdelma - A raw techno project on Soundcloud.
                  </a>
                </div>
              </motion.li>

              <motion.li
                variants={aboutCardItem}
                className="group cursor-pointer"
                onClick={() => window.open('https://soundcloud.com/dj-pizza-hut', '_blank')}
              >
                <div className="flex items-center gap-4 p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-white/10">
                  <img
                    src="/images/scpizza.jpg"
                    alt="DJ Pizza Hut"
                    className="w-12 h-12 rounded-full object-cover"
                    onLoad={handleContentLoad}
                  />
                  <a
                    href="https://soundcloud.com/dj-pizza-hut"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-inherit no-underline group-hover:text-accent transition-colors font-semibold"
                    onClick={(e) => e.stopPropagation()}
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
