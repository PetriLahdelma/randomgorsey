import React from 'react';
import PageMeta from '../components/PageMeta';
import { isWebMSupported } from '../utils/isWebMSupported';
import { motion } from 'framer-motion';
import styles from './Home.module.css';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import PostCard, { Post } from '../components/PostCard';
import { isIOS } from '../utils/isIOS';

// Dynamically import all posts from the posts folder using require.context
// @ts-ignore
const postContext = require.context('../posts', false, /\.tsx$/);

const posts: Post[] = postContext
  .keys()
  .map((key: string) => postContext(key).default)
  .sort((a: Post, b: Post) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

const Home: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [visibleCount, setVisibleCount] = React.useState(3);
  const [autoLoads, setAutoLoads] = React.useState(0);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  const Container: React.ElementType = isIOS() ? 'div' : motion.div;

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
      { root: null, rootMargin: '100px', threshold: 0.25 }
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
      <PageMeta title="Random Gorsey" description="Explore Random Gorsey's latest music and posts." path="/" />
      {/* Background looping video (disabled if WebM unsupported) */}
      {isWebMSupported() && (
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
          }}
        >
          <source src={require('../videos/home_canvas.webm')} type="video/webm" />
        </video>
      )}
      <Container
        className={styles['home-container']}
        {...(!isIOS() && {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.4 },
        })}
      >
      {loading && <Spinner style={{ borderTopColor: '#FFD600' }} />}
      {!loading && (
        <>
          <h1>Latest Posts</h1>
          {posts.slice(0, visibleCount).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {visibleCount < posts.length && (
            <Button
              onClick={() => setVisibleCount((v) => Math.min(v + 1, posts.length))}
              className={styles['load-more']}
              ariaLabel="Load more posts"
            >
              Load More
            </Button>
          )}
        </>
      )}
      {!loading && (
        <div className={styles['back-to-top']}>
          <Button
            className={styles['back-to-top-button']}
            variant="secondary"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            ariaLabel="Back to top"
          >
            Back to Top
          </Button>
        </div>
      )}
    </Container>
    </>
  );
};

export default Home;

