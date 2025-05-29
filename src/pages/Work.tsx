import React from 'react';
import styles from './Work.module.css';

const Work: React.FC = () => {
  return (
    <div className={styles['work-container']}>
      <h2>Work</h2>
    <p className={styles['work-description']}>
      Coming soon! This page will showcase work and projects. Stay tuned for updates!
    </p>
    </div>
  );
};

export default Work;