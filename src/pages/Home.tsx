import React from 'react';
import styles from './Home.module.css';
import Spinner from '../components/Spinner';
import PostCard, { Post } from '../components/PostCard';

const posts: Post[] = [
  {
    id: 1,
    title: 'First Post',
    timestamp: '2024-05-01',
    contentType: 'text',
    body: 'Welcome to the brand new Random Gorsey blog! This space will be filled with updates about music, art and more. Stay tuned for upcoming releases and random thoughts. This first entry is here just to give you an idea how a longer post looks like when collapsed in the feed. You can expand it to read the whole thing.',
    avatarColor: '#ff0',
  },
  {
    id: 2,
    title: 'Studio Snapshot',
    timestamp: '2024-05-05',
    contentType: 'image',
    body: 'A quick look at today\'s studio setup.',
    media: '/images/laser.jpg',
    avatarColor: '#0f0',
  },
  {
    id: 3,
    title: 'Live Clip',
    timestamp: '2024-05-08',
    contentType: 'video',
    body: 'Caught a moment from last night\'s jam session.',
    media: '/images/portrait.webm',
    avatarColor: '#f0f',
  },
  {
    id: 4,
    title: 'Random Link',
    timestamp: '2024-05-10',
    contentType: 'text',
    body: 'Check out <a href="https://randomgorsey.bandcamp.com/" target="_blank" rel="noopener noreferrer">my Bandcamp page</a> for more tunes!',
    avatarColor: '#00f',
  },
];

const Home: React.FC = () => {
  const [loading, setLoading] = React.useState(true);
  const [visibleCount, setVisibleCount] = React.useState(2);
  const [autoLoads, setAutoLoads] = React.useState(0);
  const sentinelRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && autoLoads < 2) {
        setVisibleCount((v) => Math.min(v + 1, posts.length));
        setAutoLoads((l) => l + 1);
      }
    });
    const current = sentinelRef.current;
    if (current) observer.observe(current);
    return () => {
      if (current) observer.unobserve(current);
    };
  }, [autoLoads]);

  const handleLoadMore = () => {
    setVisibleCount((v) => Math.min(v + 1, posts.length));
  };

  return (
    <div className={styles['home-container']}>
      {loading && <Spinner />}
      {!loading && (
        <>
          <h2>Latest Posts</h2>
          {posts.slice(0, visibleCount).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {visibleCount < posts.length && autoLoads >= 2 && (
            <button onClick={handleLoadMore} className={styles['load-more']}>
              Load more content
            </button>
          )}
          {visibleCount < posts.length && <div ref={sentinelRef} />}
          <a href="#/about" className={styles['who-link']}>
            Who the heck is Random Gorsey?
          </a>
        </>
      )}
    </div>
  );
};

export default Home;

