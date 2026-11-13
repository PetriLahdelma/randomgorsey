import { ChevronDownIcon, ExclamationCircleIcon } from "@heroicons/react/24/solid";
import { forwardRef, useId } from "react";

import { cn } from "@/lib/utils";
import type { BaseComponentProps, Size } from "../types/common";
import Label from "./Label";
import styles from "./forms/FormField.module.css";

export interface SelectOption { label: string; value: string; disabled?: boolean; group?: string; }
export interface SelectProps extends Omit<BaseComponentProps, "children"> {
  options: SelectOption[];
  value: string | string[];
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  size?: Size;
  helpText?: string;
  multiple?: boolean;
  autoFocus?: boolean;
  name?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select({ options, value, onChange, onBlur, onFocus, placeholder, id, label, className, required = false, disabled = false, error, loading = false, size = "medium", helpText, multiple = false, autoFocus = false, name, testId, ...accessibilityProps }, ref) {
  const generatedId = useId();
  const selectId = id ?? (label ? label.replace(/\s+/g, "-").toLowerCase() : `select-${generatedId.replace(/:/g, "")}`);
  const groupedOptions = options.reduce<Record<string, SelectOption[]>>((groups, option) => {
    const group = option.group ?? "default";
    groups[group] = [...(groups[group] ?? []), option];
    return groups;
  }, {});
  return (
    <div className={styles.field}>
      {label && <Label htmlFor={selectId} required={required}>{label}</Label>}
      <div className={styles.controlWrap}>
        <select ref={ref} id={selectId} value={value} onChange={onChange} onBlur={onBlur} onFocus={onFocus} className={cn(styles.control, styles.select, !multiple && styles.withTrailingIcon, className)} disabled={disabled || loading} required={required} multiple={multiple} autoFocus={autoFocus} name={name} data-size={size} data-loading={loading || undefined} data-testid={testId} {...accessibilityProps} aria-invalid={error ? "true" : "false"} aria-describedby={error ? `${selectId}-error` : helpText ? `${selectId}-help` : accessibilityProps["aria-describedby"]}>
          {placeholder && !multiple && <option value="" disabled>{placeholder}</option>}
          {Object.entries(groupedOptions).map(([group, groupOptions]) => group === "default" ? groupOptions.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>) : <optgroup key={group} label={group}>{groupOptions.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}</optgroup>)}
        </select>
        {!multiple && !loading && <ChevronDownIcon className={styles.trailingIcon} aria-hidden="true" />}
        {loading && <span className={cn(styles.trailingIcon, styles.spinner)} aria-hidden="true">↻</span>}
      </div>
      {helpText && !error && <p id={`${selectId}-help`} className={styles.helpText}>{helpText}</p>}
      {error && <p id={`${selectId}-error`} className={styles.error} role="alert"><ExclamationCircleIcon className={styles.errorIcon} aria-hidden="true" />{error}</p>}
    </div>
  );
});

Select.displayName = "Select";
export default Select;
export { Select };
