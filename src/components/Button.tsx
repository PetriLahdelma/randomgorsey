import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger' | 'tertiary' | 'success';
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  iconOnly?: boolean;
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

export default Button;