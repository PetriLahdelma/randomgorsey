import React from 'react';
import styles from './Alert.module.css';

type AlertProps = {
  variant?: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
};

const Alert: React.FC<AlertProps> = ({ variant = 'info', children }) => (
  <div className={`${styles.alert} ${styles[variant]}`} role="alert">
    {children}
  </div>
);

export default Alert;
