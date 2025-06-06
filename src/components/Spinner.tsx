import React from 'react';
import styles from './Spinner.module.css';

const Spinner: React.FC = () => {
  return <div className={styles.spinner} data-testid="spinner"></div>;
};

export default Spinner;
