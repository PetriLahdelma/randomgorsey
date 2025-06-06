import React from 'react';
import styles from './Badge.module.css';

type BadgeProps = {
  text: string;
  variant?: 'default' | 'primary' | 'success' | 'danger';
};

const Badge: React.FC<BadgeProps> = ({ text, variant = 'default' }) => (
  <span className={`${styles.badge} ${styles[variant]}`}>{text}</span>
);

export default Badge;
