import React from 'react';
import styles from './Home.module.css';
import Spinner from '../components/Spinner';

const Home: React.FC = () => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles['home-container']}>
      {loading && <Spinner />}
      {!loading && (
        <>
          <h2>Welcome to Random Gorsey Website</h2>
          <p className={styles['home-description']}>This be the homepage. Content be here. Soon.</p>
          <a href="#/about" className={styles['who-link']}>Who the heck is Random Gorsey?</a>
        </>
      )}
    </div>
  );
};

export default Home;