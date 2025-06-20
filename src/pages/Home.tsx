import React from 'react';
import PageMeta from '../components/PageMeta';
import { motion } from 'framer-motion';
import styles from './Home.module.css';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import PostCard, { Post } from '../components/PostCard';

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
      <motion.div
      className={styles['home-container']}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {loading && <Spinner style={{ borderTopColor: '#FFD600' }} />}
      {!loading && (
        <>
          <h2>Latest Posts</h2>
          {posts.slice(0, visibleCount).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {visibleCount < posts.length && (
            <Button onClick={() => setVisibleCount((v) => Math.min(v + 1, posts.length))} className={styles['load-more']}>
              Load more content
            </Button>
          )}
        </>
      )}
      {!loading && (
        <div className={styles['back-to-top']}>
          <Button className={styles['back-to-top-button']} variant="secondary" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top
          </Button>
        </div>
      )}
    </motion.div>
    </>
  );
};

export default Home;

