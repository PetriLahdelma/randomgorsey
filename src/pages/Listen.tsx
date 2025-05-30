import React from 'react';
import styles from './Listen.module.css';

const Listen: React.FC = () => {
  return (
    <div className={styles['listen-container']}>
      <h2>Listen to Music</h2>
      <p className={styles['listen-description']}>Enjoy curated playlists and latest tracks.</p>
      <iframe
        title="RG player"
        style={{ borderRadius: '12px' }}
        src="https://open.spotify.com/embed/artist/54Vv9rlCqX2nW2V0tXw33q?utm_source=generator"
        width="100%"
        height="352"
        frameBorder="0"
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default Listen;