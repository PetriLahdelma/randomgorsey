import React from "react";
import PageMeta from "../components/PageMeta";
import {
  motion,
  heroVariants,
  heroStaggerContainer,
  staggerItem,
  useLenisScrollTo,
} from "@/lib/motion";
import RevealOnScroll from "../components/RevealOnScroll";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import PostCard, { Post } from "../components/PostCard";
import { VideoBackground } from "@/components/effects";
import { KineticText } from "@/components/KineticText";
import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";
import homeCanvasVideo from "../videos/home_canvas.webm";

// Import all posts statically for Jest compatibility
import postsData from "../posts";

const posts: Post[] = postsData
  .filter((post) => post && typeof post === "object") // Ensure valid posts
  .sort(
    (a: Post, b: Post) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

const Home: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [visibleCount, setVisibleCount] = React.useState(3);
  const [autoLoads, setAutoLoads] = React.useState(0);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const scrollTo = useLenisScrollTo();

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && autoLoads < 2) {
            setVisibleCount((v) => Math.min(v + 1, posts.length));
            setAutoLoads((l) => l + 1);
          }
        });
      },
      { root: null, rootMargin: "100px", threshold: 0.25 }
    );

    const current = sentinelRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, [autoLoads]);

  return (
    <>
      <PageMeta
        title="Random Gorsey"
        description="Explore Random Gorsey's latest music and posts."
        path="/"
      />

      {/* VideoBackground with poster fallback for mobile/low-power */}
      <VideoBackground
        src={homeCanvasVideo}
        poster="/images/home-poster.jpg"
        overlayOpacity={0.3}
      />

      <motion.div
        className="relative z-10 min-h-screen text-white"
        data-section="hero"
        variants={heroVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Container size="sm" padding="md" className="py-6">
          <Stack gap="lg">
            {loading && (
              <div className="flex justify-center py-12">
                <Spinner className="border-white/10 border-t-yellow-400" />
              </div>
            )}

            {!loading && (
              <>
                {/* Dramatic kinetic headline */}
                <KineticText
                  as="h1"
                  splitBy="chars"
                  variant="dramatic"
                  className="mb-8 font-display text-4xl uppercase tracking-wide"
                >
                  Latest Posts
                </KineticText>

                {/* Staggered posts reveal */}
                <motion.div
                  variants={heroStaggerContainer}
                  initial="initial"
                  animate="enter"
                >
                  <Stack gap="lg">
                    {posts.slice(0, visibleCount).map((post) => (
                      <motion.div key={post.id} variants={staggerItem}>
                        <PostCard post={post} headingLevel={5} />
                      </motion.div>
                    ))}
                  </Stack>
                </motion.div>

                {/* Load More button */}
                {visibleCount < posts.length && (
                  <div className="flex justify-center">
                    <Button
                      onClick={() =>
                        setVisibleCount((v) => Math.min(v + 1, posts.length))
                      }
                      aria-label="Load more posts"
                    >
                      Load More
                    </Button>
                  </div>
                )}

                {/* Back to Top */}
                <RevealOnScroll>
                  <div className="flex justify-center pt-8">
                    <Button
                      variant="secondary"
                      onClick={() => scrollTo(0)}
                      aria-label="Back to top"
                      className="border border-white/60 text-white bg-white/5 hover:bg-white/10"
                    >
                      Back to Top
                    </Button>
                  </div>
                </RevealOnScroll>
              </>
            )}
          </Stack>
        </Container>

        {/* Intersection observer sentinel for auto-load */}
        <div ref={sentinelRef} aria-hidden="true" />
      </motion.div>
    </>
  );
};

export default Home;
