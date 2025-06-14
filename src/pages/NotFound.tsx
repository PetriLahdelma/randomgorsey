import React from 'react';
import { motion } from 'framer-motion';
import styles from './NotFound.module.css';
import Spinner from '../components/Spinner';
 

const NotFound: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = window.requestAnimationFrame(() => setLoading(false));
    return () => window.cancelAnimationFrame(timer);
  }, []);

  return (
    <motion.div
      className={styles['notfound-container']}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* <video className={styles['background-video']} autoPlay muted loop>
      <source src="/images/butterflies.webm" type="video/webm" />
      Your browser does not support the video tag.
      </video> */}
      {loading && <Spinner />}
      {!loading && <h2 data-testid="not-found-title">404 - Page Not Found</h2>}
      {!loading && <p className={styles['notfound-description']}>Sorry, the page you're looking for does not exist.</p>}
    </motion.div>
  );
};

export default NotFound;