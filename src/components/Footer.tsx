import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2025 Random Gorsey. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;