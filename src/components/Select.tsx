import React from "react";
import styles from "./Select.module.css";
import {
  ChevronDownIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { BaseComponentProps, Size } from "../types/common";
import Label from "./Label";

/**
 * Option data structure for Select component
 */
export interface SelectOption {
  /** Display text for the option */
  label: string;
  /** Value of the option */
  value: string;
  /** Whether the option is disabled */
  disabled?: boolean;
  /** Group this option belongs to */
  group?: string;
}

/**
 * Props for the Select component
 */
export interface SelectProps extends Omit<BaseComponentProps, "children"> {
  /** Array of options to display */
  options: SelectOption[];
  /** Currently selected value */
  value: string;
  /** Change handler function */
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Blur handler function */
  onBlur?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  /** Focus handler function */
  onFocus?: (e: React.FocusEvent<HTMLSelectElement>) => void;
  /** Placeholder text when no option is selected */
  placeholder?: string;
  /** Label text */
  label?: string;
  /** Whether the select is required */
  required?: boolean;
  /** Size variant */
  size?: Size;
  /** Help text to display below the select */
  helpText?: string;
  /** Whether the select allows multiple selections */
  multiple?: boolean;
  /** Auto-focus the select on mount */
  autoFocus?: boolean;
  /** Form name attribute */
  name?: string;
}

/**
 * Reusable Select component with enhanced accessibility and styling
 *
 * @example
 * ```tsx
 * <Select
 *   label="Country"
 *   options={[
 *     { label: "United States", value: "us" },
 *     { label: "Canada", value: "ca" }
 *   ]}
 *   value={selectedCountry}
 *   onChange={(e) => setSelectedCountry(e.target.value)}
 *   placeholder="Select a country"
 *   required
 * />
 * ```
 */
const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  onBlur,
  onFocus,
  placeholder,
  id,
  label,
  className,
  required = false,
  disabled = false,
  error,
  loading = false,
  size = "medium",
  helpText,
  multiple = false,
  autoFocus = false,
  name,
  testId,
  ...accessibilityProps
}) => {
  const selectId =
    id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

  // Combine CSS classes
  const selectClasses = [
    styles.select,
    styles[size],
    error ? styles.error : "",
    disabled ? styles.disabled : "",
    loading ? styles.loading : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  // Group options if they have groups
  const groupedOptions = options.reduce((acc, option) => {
    const group = option.group || "default";
    if (!acc[group]) acc[group] = [];
    acc[group].push(option);
    return acc;
  }, {} as Record<string, SelectOption[]>);

  return (
    <div className={styles.selectContainer}>
      {label && (
        <Label className={styles.label} htmlFor={selectId} required={required}>
          {label}
        </Label>
      )}

      <div className={styles.selectWrapper}>
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          className={selectClasses}
          disabled={disabled || loading}
          required={required}
          multiple={multiple}
          autoFocus={autoFocus}
          name={name}
          data-testid={testId}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={
            error
              ? `${selectId}-error`
              : helpText
              ? `${selectId}-help`
              : undefined
          }
          {...accessibilityProps}
        >
          {placeholder && !multiple && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}

          {Object.keys(groupedOptions).map((groupKey) => {
            const groupOptions = groupedOptions[groupKey];

            if (groupKey === "default") {
              return groupOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ));
            }

            return (
              <optgroup key={groupKey} label={groupKey}>
                {groupOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    {option.label}
                  </option>
                ))}
              </optgroup>
            );
          })}
        </select>

        <ChevronDownIcon className={styles.chevronIcon} aria-hidden="true" />

        {loading && (
          <span className={styles.spinner} aria-hidden="true">
            ⟳
          </span>
        )}
      </div>

      {helpText && !error && (
        <div className={styles.helpText} id={`${selectId}-help`}>
          {helpText}
        </div>
      )}

      {error && (
        <div className={styles.errorMessage} id={`${selectId}-error`}>
          <ExclamationCircleIcon
            className={styles.errorIcon}
            aria-hidden="true"
          />
          <span role="alert">{error}</span>
        </div>
      )}
    </div>
  );
};

export default Select;
