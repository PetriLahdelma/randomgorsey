import React from 'react';
import { SocialIcon } from 'react-social-icons'
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['social-links']}>
        <a href="https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q?si=TCP19UlhTpyHb7w0UOukmg" target="_blank" rel="noopener noreferrer">
          <SocialIcon url="https://spotify.com" className="w-4 h-4" />
        </a>
        <a href="https://soundcloud.com/randomgorsey" target="_blank" rel="noopener noreferrer">
          <SocialIcon url="https://soundcloud.com" className="w-4 h-4" />
        </a>
        <a href="https://www.instagram.com/random_gorsey?igsh=am42eWcwNGdnY3hm&utm_source=qr" target="_blank" rel="noopener noreferrer">
          <SocialIcon url="https://instagram.com" className="w-4 h-4" />
        </a>
      </div>
      <p>&copy; 2025 Random Gorsey. All Rights Reserved.</p>

    </footer>
  );
};

export default Footer;