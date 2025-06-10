import React from 'react';
import styles from './Home.module.css';
import Spinner from '../components/Spinner';
import PostCard, { Post } from '../components/PostCard';
import FirstPost from '../posts/FirstPost';
import StudioSnapshot from '../posts/StudioSnapshot';
import LiveClip from '../posts/LiveClip';
import RandomLink from '../posts/RandomLink';

const posts: Post[] = [FirstPost, StudioSnapshot, LiveClip, RandomLink].sort(
  (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
);

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
          console.log('Entry:', entry);
          if (entry.isIntersecting && autoLoads < 2) {
            console.log('Autoload triggered');
            setVisibleCount((v) => Math.min(v + 1, posts.length));
            setAutoLoads((l) => l + 1);
          }
        });
      },
      { root: null, rootMargin: '100px', threshold: 0.25 }
    );

    const current = sentinelRef.current;
    if (current) {
      console.log('Sentinel observed');
      observer.observe(current);
    }

    return () => {
      if (current) {
        console.log('Sentinel unobserved');
        observer.unobserve(current);
      }
    };
  }, [autoLoads]);

  return (
    <div className={styles['home-container']}>
      {loading && <Spinner />}
      {!loading && (
        <>
          <h2>Latest Posts</h2>
          {posts.slice(0, visibleCount).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {visibleCount < posts.length && (
            <button onClick={() => setVisibleCount((v) => Math.min(v + 1, posts.length))} className={styles['load-more']}>
              Load more content
            </button>
          )}
        </>
      )}
      {!loading && (
        <div className={styles['back-to-top']} style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            Back to top
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;

