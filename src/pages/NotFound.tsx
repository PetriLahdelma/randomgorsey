import React from 'react';
import styles from './NotFound.module.css'; // Import the CSS module for styling

const NotFound: React.FC = () => {
  return (
    <div className={styles['notfound-container']}>
      <h2>404 - Page Not Found</h2>
      <p className={styles['notfound-description']}>Sorry, the page you're looking for does not exist.</p>
    </div>
  );
};

export default NotFound;