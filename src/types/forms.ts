/**
 * Available form field types
 */
export type FormFieldType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "date"
  | "time"
  | "datetime-local"
  | "file";

/**
 * Form validation rules
 */
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  custom?: (value: unknown) => string | undefined;
}

/**
 * Form field state
 */
export interface FieldState {
  value: unknown;
  error?: string;
  touched?: boolean;
  dirty?: boolean;
}

/**
 * Form validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Base form field props
 */
export interface BaseFormFieldProps {
  name: string;
  value: unknown;
  onChange: (value: unknown) => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helpText?: string;
  label?: string;
  placeholder?: string;
  validation?: ValidationRule;
}
