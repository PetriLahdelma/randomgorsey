import React from 'react';
import styles from './Label.module.css';

export type LabelProps = {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  required?: boolean;
  style?: React.CSSProperties;
};

const Label: React.FC<LabelProps> = ({ children, htmlFor, className, required, style }) => (
  <label htmlFor={htmlFor} className={`${styles.label}${className ? ' ' + className : ''}`} style={style}>
    {children}
    {required && <span className={styles.required}>*</span>}
  </label>
);

export default Label;
