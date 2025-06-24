import React from 'react';
import styles from './Button.module.css';

type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'danger' | 'tertiary' | 'success';
  onClick?: () => void;
  children?: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ElementType;
  iconClassName?: string;
  iconStyle?: React.CSSProperties;
  iconOnly?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
};

const Button: React.FC<ButtonProps> = ({ variant = 'primary', onClick, children, disabled = false, icon, className, style, iconOnly = false, type = 'button', ariaLabel, iconClassName, iconStyle }) => {
  const buttonClass = iconOnly
    ? `${styles.iconOnly}`
    : icon && children
    ? styles['text-with-icon']
    : icon
    ? styles.icon
    : '';

  // Accessible label for icon-only buttons
  const computedAriaLabel = ariaLabel || (iconOnly && typeof children === 'string' ? children : undefined);

  return (
    <button
      type={type}
      className={`${styles.button} ${styles[variant]} ${buttonClass} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
      title={typeof children === 'string' ? children : ''}
      aria-label={computedAriaLabel}
    >
      {icon && React.createElement(icon, {
        className: [styles.icon, 'chevron-icon', iconClassName].filter(Boolean).join(' '),
        style: iconStyle,
        'aria-hidden': true
      })}
      {!iconOnly && children}
    </button>
  );
};

export default Button;