import React from 'react';
import styles from './Caption.module.css';

type CaptionProps = {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

const Caption: React.FC<CaptionProps> = ({ children, className = '', style }) => (
  <figcaption className={`${styles.caption} ${className}`} style={style}>
    {children}
  </figcaption>
);

export default Caption;
