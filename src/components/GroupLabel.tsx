import React from 'react';
import styles from './GroupLabel.module.css';

export type GroupLabelProps = {
  children: React.ReactNode;
  className?: string;
  required?: boolean;
  style?: React.CSSProperties;
};

const GroupLabel: React.FC<GroupLabelProps> = ({ children, className, required, style }) => (
  <div className={`${styles['group-label']}${className ? ' ' + className : ''}`} style={style}>
    {children}
    {required && <span className={styles.required}>*</span>}
  </div>
);

export default GroupLabel;
