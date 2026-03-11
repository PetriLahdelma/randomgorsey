"use client";

import React from "react";
import PageMeta from "../components/PageMeta";
import {
  motion,
  heroVariants,
  useLenisScrollTo,
} from "@/lib/motion";
import RevealOnScroll from "../components/RevealOnScroll";
import Button from "../components/Button";
import PostCard from "../components/PostCard";
import { VideoBackground } from "@/components/effects";
import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";

const homeCanvasVideo = "/videos/home_canvas.webm";

import postsData from "../posts";

const posts = postsData.filter(
  (post) => post && typeof post === "object"
);

const BATCH_SIZE = 6;
const MAX_AUTO_LOADS = 2;

const Home: React.FC = () => {
  const [visibleCount, setVisibleCount] = React.useState(1 + BATCH_SIZE);
  const [autoLoads, setAutoLoads] = React.useState(0);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);
  const scrollTo = useLenisScrollTo();

  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1, visibleCount);
  const hasMore = visibleCount < posts.length;

  React.useEffect(() => {
    if (autoLoads >= MAX_AUTO_LOADS) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && autoLoads < MAX_AUTO_LOADS) {
            setVisibleCount((v) => Math.min(v + BATCH_SIZE, posts.length));
            setAutoLoads((l) => l + 1);
          }
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
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

      <VideoBackground
        src={homeCanvasVideo}
        poster="/images/home-poster.jpg"
        overlayOpacity={0.4}
      />

      <motion.div
        className="relative z-10 min-h-screen text-foreground grain-overlay"
        variants={heroVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Container size="lg" padding="md" className="py-6">
          <Stack gap="lg">
            {/* Featured post — latest, rendered large with no truncation */}
            {featuredPost && (
              <RevealOnScroll as="section" aria-label="Featured post">
                <PostCard
                  id={`post-${featuredPost.id}`}
                  post={featuredPost}
                  headingLevel={2}
                  truncateLength={Infinity}
                  showFullContent
                  className="border-[oklch(12%_0_0deg)]"
                />
              </RevealOnScroll>
            )}

            {/* Posts — single column feed */}
            {remainingPosts.length > 0 && (
              <section aria-label="All posts">
                <Stack gap="lg">
                  {remainingPosts.map((post, index) => (
                    <RevealOnScroll key={post.id} amount={0.2}>
                      <PostCard
                        id={`post-${post.id}`}
                        post={post}
                        headingLevel={3}
                        index={index}
                      />
                    </RevealOnScroll>
                  ))}
                </Stack>
              </section>
            )}

            {/* Load More button — shown after auto-loads exhausted */}
            {hasMore && (
              <div className="flex justify-center">
                <Button
                  onClick={() =>
                    setVisibleCount((v) =>
                      Math.min(v + BATCH_SIZE, posts.length)
                    )
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
                >
                  Back to Top
                </Button>
              </div>
            </RevealOnScroll>
          </Stack>
        </Container>

        {/* Intersection observer sentinel for auto-load */}
        <div ref={sentinelRef} aria-hidden="true" />
      </motion.div>
    </>
  );
};

export default Home;
