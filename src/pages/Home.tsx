import React from "react";
import PageMeta from "../components/PageMeta";
import { isWebMSupported } from "../utils/isWebMSupported";
import { motion, pageVariants, useLenisScrollTo } from "@/lib/motion";
import RevealOnScroll from "../components/RevealOnScroll";
import styles from "./Home.module.css";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import PostCard, { Post } from "../components/PostCard";
import homeCanvasVideo from "../videos/home_canvas.webm";

// Import all posts statically for Jest compatibility
import FirstPost from "../posts/FirstPost";
import RandomRecommends from "../posts/RandomRecommends";

// Static posts array that works in both webpack and Jest
const allPosts = [FirstPost, RandomRecommends];

const posts: Post[] = allPosts
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
      {/* Background looping video (disabled if WebM unsupported) */}
      {isWebMSupported() && (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: -1,
          }}
        >
          <source
            src={homeCanvasVideo}
            type="video/webm"
          />
        </video>
      )}
      <motion.div
        className={styles["home-container"]}
        data-section="hero"
        variants={pageVariants}
        initial="initial"
        animate="enter"
      >
        {loading && <Spinner style={{ borderTopColor: "#FFD600" }} />}
        {!loading && (
          <>
            <RevealOnScroll>
              <h1>Latest Posts</h1>
            </RevealOnScroll>
            {posts.slice(0, visibleCount).map((post) => (
              <RevealOnScroll key={post.id}>
                <PostCard post={post} />
              </RevealOnScroll>
            ))}
            {visibleCount < posts.length && (
              <Button
                onClick={() =>
                  setVisibleCount((v) => Math.min(v + 1, posts.length))
                }
                className={styles["load-more"]}
                aria-label="Load more posts"
              >
                Load More
              </Button>
            )}
          </>
        )}
        {!loading && (
          <RevealOnScroll>
            <div className={styles["back-to-top"]}>
              <Button
                className={styles["back-to-top-button"]}
                variant="secondary"
                onClick={() => scrollTo(0)}
                aria-label="Back to top"
              >
                Back to Top
              </Button>
            </div>
          </RevealOnScroll>
        )}
      </motion.div>
    </>
  );
};

export default Home;
