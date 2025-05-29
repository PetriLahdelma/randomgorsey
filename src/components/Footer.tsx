import React from 'react';
import styles from './Footer.module.css';
import { HomeIcon } from '@heroicons/react/solid';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2025 Random Gorsey. All Rights Reserved.</p>
      <HomeIcon className={styles.homeIcon} />
    </footer>
  );
};

export default Footer;