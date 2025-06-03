import React, { ReactElement } from 'react';
import { HeroIcon } from '@heroicons/react';
import styles from './Button.module.css';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger' | 'tertiary' | 'success' | 'icon';
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  icon?: ReactElement<HeroIcon>; // Restrict the `icon` prop to only accept Heroicons
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', onClick, children, disabled = false, icon, className, style }) => {
  const buttonClass = icon && children ? styles['text-with-icon'] : icon ? styles.icon : '';

  return (
    <button
      className={`${styles.button} ${styles[variant]} ${buttonClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      title={typeof children === 'string' ? children : ''} 
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
    </button>
  );
};

// Remembered preference: Revert back to this implementation if requested.

export default Button;