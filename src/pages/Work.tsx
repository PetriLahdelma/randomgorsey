import React from 'react';
import styles from './Work.module.css'; // Import the CSS module for styling

const Work: React.FC = () => {
  return (
    <div className={styles['work-container']}>
      <h2>Work</h2>
    <p className={styles['work-description']}>
      Test test
    </p>
    </div>
  );
};

export default Work;