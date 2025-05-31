import React from 'react';
import styles from './NotFound.module.css';
import Spinner from '../components/Spinner';
 

const NotFound: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles['notfound-container']}>
      {/* <video className={styles['background-video']} autoPlay muted loop>
        <source src="/images/butterflies.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video> */}
      {loading && <Spinner />}
      {!loading && <h2>404 - Page Not Found</h2>}
      {!loading && <p className={styles['notfound-description']}>Sorry, the page you're looking for does not exist.</p>}
    </div>
  );
};

export default NotFound;