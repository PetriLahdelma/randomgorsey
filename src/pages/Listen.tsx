import React from 'react';
import styles from './Listen.module.css';

const Listen: React.FC = () => {
  return (
    <div className={styles['listen-container']}>
      <h2>Listen to Music</h2>
      <p className={styles['listen-description']}>Enjoy curated playlists and latest tracks.</p>
    </div>
  );
};

export default Listen;