import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger' | 'tertiary' | 'success' | 'icon';
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', onClick, children, disabled = false, icon, className, style }) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      title={typeof children === 'string' ? children : ''} 
    >
      {icon && <span className={styles.icon}>{icon}</span>} {/* Render icon if provided */}
      {children}
    </button>
  );
};

export default Button;