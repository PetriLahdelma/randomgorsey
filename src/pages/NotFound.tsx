import React from 'react';
import { motion } from 'framer-motion';
import styles from './NotFound.module.css';
import Spinner from '../components/Spinner';
import PageMeta from '../components/PageMeta';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
 

const NotFound: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = window.requestAnimationFrame(() => setLoading(false));
    return () => window.cancelAnimationFrame(timer);
  }, []);

  return (
    <>
      <PageMeta title="404 - Page Not Found" description="The page you requested could not be found." path="/" />
      {/* Background looping video (same as Listen page) */}
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
        <source src={require('../videos/rg-glitch-bg.webm')} type="video/webm" />
      </video>
      <motion.div
      className={styles['notfound-container']}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {loading && <Spinner />}
      {!loading && <h1 data-testid="not-found-title">404 - Page Not Found</h1>}
      {!loading && <p className={styles['notfound-description']}>Sorry, the page you're looking for does not exist.😢</p>}
      <div className={styles['notfound-footer']}>
        <Link to="/" >
          <Button
            className={styles['notfound-button']}
            ariaLabel="Go to home page"
          >
            Go Home
          </Button>
        </Link>
      </div>
    </motion.div>
    </>
  );
};

export default NotFound;