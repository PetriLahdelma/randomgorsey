import React from 'react';
import styles from './Spinner.module.css';

type SpinnerProps = {
  style?: React.CSSProperties;
};

const Spinner: React.FC<SpinnerProps> = ({ style }) => {
  return <div className={styles.spinner} style={style}></div>;
};

export default Spinner;
