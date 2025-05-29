import React from 'react';
import styles from './Home.module.css'; // Import the CSS file for styling

const Home: React.FC = () => {
  return (
    <div className={styles['home-container']}>
      <h2>Welcome to Random Gorsey Website</h2>
      <p className={styles['home-description']}>This be the homepage. Content be here. Soon.</p>
    </div>
  );
};

export default Home;