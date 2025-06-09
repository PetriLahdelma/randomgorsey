import React from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = {
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, disabled }) => (
  <label className={`${styles.container} ${disabled ? styles['disabled-label'] : ''}`}>
    <input
      type="checkbox"
      className={`${styles.checkbox} ${checked && disabled ? styles['checked-disabled'] : ''}`}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <span className={styles.checkmark} />
    {label && <span className={`${styles.label} ${disabled ? styles['disabled-label'] : ''}`}>{label}</span>}
  </label>
);

export default Checkbox;
