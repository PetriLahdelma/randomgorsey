import React from 'react';
import styles from './Select.module.css';

type Option = { label: string; value: string };

type SelectProps = {
  options: Option[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
};

const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder }) => (
  <select className={styles.select} value={value} onChange={onChange} aria-label="select">
    {placeholder && (
      <option value="" disabled hidden>
        {placeholder}
      </option>
    )}
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

export default Select;
