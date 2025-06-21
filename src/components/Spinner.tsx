import React from 'react';
import styles from './Spinner.module.css';

type SpinnerProps = {
  style?: React.CSSProperties;
  size?: number;
  ariaLabel?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ style, size = 32, ariaLabel = 'Loading' }) => {
  return (
    <div
      className={styles.spinner}
      style={{ width: size, height: size, ...style }}
      role="status"
      aria-label={ariaLabel}
    ></div>
  );
};

export default Spinner;
