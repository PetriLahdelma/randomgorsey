import React from 'react';
import styles from './Checkbox.module.css';

type CheckboxProps = {
  label?: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange, disabled }) => (
  <label className={styles.container}>
    <input
      type="checkbox"
      className={styles.checkbox}
      checked={checked}
      onChange={onChange}
      disabled={disabled}
    />
    <span className={styles.checkmark} />
    {label && <span className={styles.label}>{label}</span>}
  </label>
);

export default Checkbox;
