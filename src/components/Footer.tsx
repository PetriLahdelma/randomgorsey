import React from 'react';
import { SocialIcon } from 'react-social-icons'
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['social-links']}>
        <a href="https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q?si=TCP19UlhTpyHb7w0UOukmg" target="_blank" rel="noopener noreferrer">
          <SocialIcon label="Spotify" url="https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q?si=TCP19UlhTpyHb7w0UOukmg" bgColor="#000" fgColor="#fff" style={{ width: '2rem', height: '2rem' }} />
        </a>
        <a href="https://soundcloud.com/randomgorsey" target="_blank" rel="noopener noreferrer">
          <SocialIcon label="Soundcloud" url="https://soundcloud.com/randomgorsey" bgColor="#000" fgColor="#fff" style={{ width: '2rem', height: '2rem' }} />
        </a>
        <a href="https://www.instagram.com/random_gorsey?igsh=am42eWcwNGdnY3hm&utm_source=qr" target="_blank" rel="noopener noreferrer">
          <SocialIcon label="Instagram" url="https://www.instagram.com/random_gorsey?igsh=am42eWcwNGdnY3hm&utm_source=qr" bgColor="#000" fgColor="#fff" style={{ width: '2rem', height: '2rem' }} />
        </a>
      </div>
      <p>&copy; 2025 Random Gorsey. All Rights Reserved.</p>

    </footer>
  );
};

export default Footer;