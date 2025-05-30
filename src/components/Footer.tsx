import React from 'react';
import { SocialIcon } from 'react-social-icons'
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['social-links']}>
        <SocialIcon label="Spotify" url="https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q?si=TCP19UlhTpyHb7w0UOukmg" bgColor="#000" fgColor="#fff" style={{ width: '2rem', height: '2rem' }} />
        <SocialIcon label="Soundcloud" url="https://soundcloud.com/randomgorsey" bgColor="#000" fgColor="#fff" style={{ width: '2rem', height: '2rem' }} />
        <SocialIcon label="Instagram" url="https://www.instagram.com/random_gorsey?igsh=am42eWcwNGdnY3hm&utm_source=qr" bgColor="#000" fgColor="#fff" style={{ width: '2rem', height: '2rem' }} />
      </div>
      <p>&copy; 2025 Random Gorsey. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;