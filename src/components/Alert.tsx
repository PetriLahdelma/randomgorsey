import React, { useState } from 'react';
import styles from './Alert.module.css';
import Button from './Button';
import { XCircleIcon } from '@heroicons/react/24/solid';

type AlertProps = {
  variant?: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
  isCloseable?: boolean;
};

const Alert: React.FC<AlertProps> = ({ variant = 'info', children, isCloseable = false }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className={`${styles.alert} ${styles[variant]}`} role="alert">
      {children}
      {isCloseable && (
        <Button
          variant="tertiary"
          className={styles['close-button']}
          aria-label="Close"
          icon={<XCircleIcon style={{ width: '24px', height: '24px' }} />}
          onClick={() => setIsVisible(false)}
        />
      )}
    </div>
  );
};

export default Alert;
