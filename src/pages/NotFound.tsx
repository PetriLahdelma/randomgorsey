import React from 'react';
import styles from './NotFound.module.css';
 

const NotFound: React.FC = () => {
  return (
    <div className={styles['notfound-container']}>
      {/* <video className={styles['background-video']} autoPlay muted loop>
        <source src="/images/butterflies.webm" type="video/webm" />
        Your browser does not support the video tag.
      </video> */}
      <h2>404 - Page Not Found</h2>
      <p className={styles['notfound-description']}>Sorry, the page you're looking for does not exist.</p>
    </div>
  );
};

export default NotFound;