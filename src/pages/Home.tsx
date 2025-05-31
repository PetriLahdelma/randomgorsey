import React from 'react';
import styles from './Home.module.css';

const Home: React.FC = () => {
  return (
    <div className={styles['home-container']}>
      <h2>Welcome to Random Gorsey Website</h2>
      <p className={styles['home-description']}>This be the homepage. Content be here. Soon.</p>
      <a href="/about" className={styles['who-link']}>Who the heck is Random Gorsey?</a>
    </div>
  );
};

export default Home;