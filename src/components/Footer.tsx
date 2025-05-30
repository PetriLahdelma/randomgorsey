import React from 'react';
import { SocialIcon } from 'react-social-icons'
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles['social-links']}>
        <a href="https://spotify.com" target="_blank" rel="noopener noreferrer">
          <SocialIcon url="https://spotify.com" className={styles.icon} />
        </a>
        <a href="https://soundcloud.com" target="_blank" rel="noopener noreferrer">
          <SocialIcon url="https://soundcloud.com" className={styles.icon} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <SocialIcon url="https://instagram.com" className={styles.icon} />
        </a>
      </div>      
      <p>&copy; 2025 Random Gorsey. All Rights Reserved.</p>

    </footer>
  );
};

export default Footer;