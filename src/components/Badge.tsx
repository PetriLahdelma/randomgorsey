import React from 'react';
import styles from './Badge.module.css';

type BadgeProps = {
  text: string;
  variant?: 'default' | 'primary' | 'secondary' | 'tertiary' | 'success' | 'danger';
  disabled?: boolean; // Added disabled prop
};

const Badge: React.FC<BadgeProps> = ({ text, variant = 'default', disabled = false }) => (
  <span
    className={`${styles.badge} ${styles[variant]} ${disabled ? styles.disabled : ''}`}
    aria-disabled={disabled}
  >
    {text}
  </span>
);

export default Badge;
