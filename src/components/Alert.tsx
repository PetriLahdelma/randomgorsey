import React, { useState } from 'react';
import styles from './Alert.module.css';
import Button from './Button';
import { XCircleIcon, InformationCircleIcon, CheckCircleIcon, ExclamationTriangleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

type AlertProps = {
  variant?: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  isCloseable?: boolean;
  hasIcon?: boolean;
};

const iconMap = {
  info: <InformationCircleIcon style={{ width: 24, height: 24, color: '#fff', marginRight: 8 }} />,
  success: <CheckCircleIcon style={{ width: 24, height: 24, color: '#000', marginRight: 8 }} />,
  warning: <ExclamationTriangleIcon style={{ width: 24, height: 24, color: '#000', marginRight: 8 }} />,
  error: <ExclamationCircleIcon style={{ width: 24, height: 24, color: '#fff', marginRight: 8 }} />,
};

const Alert: React.FC<AlertProps> = ({ variant = 'info', children, isCloseable = false, hasIcon = false }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`${styles.alert} ${styles[variant]}`} role="alert">
      {hasIcon && iconMap[variant]}
      {children}
      {isCloseable && (
        <Button
          variant="tertiary"
          className={styles['close-button']}
          aria-label="Close alert"
          icon={XCircleIcon}
          onClick={() => setIsVisible(false)}
        />
      )}
    </div>
  );
};

export default Alert;
