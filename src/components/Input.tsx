import { forwardRef } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import Label from "./Label";
import { cn } from "@/lib/utils";
import { BaseComponentProps, Size } from "../types/common";
import { ValidationRule } from "../types/forms";

/**
 * Input types supported by the component
 */
export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "datetime-local"
  | "time"
  | "color"
  | "textarea";

/**
 * Props for the Input component
 */
export interface InputProps extends Omit<BaseComponentProps, "children"> {
  /** Type of input field */
  type: InputType;
  /** Current value of the input */
  value: string;
  /** Change handler function */
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  /** Blur handler function */
  onBlur?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  /** Focus handler function */
  onFocus?: (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Label text */
  label?: string;
  /** Whether the input is required */
  required?: boolean;
  /** Size variant */
  size?: Size;
  /** Maximum number of characters allowed */
  maxLength?: number;
  /** Minimum number of characters required */
  minLength?: number;
  /** Auto-complete attribute value */
  autoComplete?: string;
  /** Auto-focus the input on mount */
  autoFocus?: boolean;
  /** Help text to display below the input */
  helpText?: string;
  /** Icon to display inside the input */
  icon?: React.ReactNode;
  /** Number of rows for textarea */
  rows?: number;
  /** Validation rules */
  validation?: ValidationRule[];
  /** Pattern for input validation (regex) */
  pattern?: string;
  /** Step attribute for number inputs */
  step?: number | string;
  /** Minimum value for number/date inputs */
  min?: number | string;
  /** Maximum value for number/date inputs */
  max?: number | string;
}

/**
 * Reusable Input component with validation and accessibility features
 *
 * @example
 * ```tsx
 * <Input
 *   type="email"
 *   label="Email Address"
 *   value={email}
 *   onChange={(e) => setEmail(e.target.value)}
 *   error={emailError}
 *   required
 * />
 *
 * <Input
 *   type="textarea"
 *   label="Message"
 *   value={message}
 *   onChange={handleChange}
 *   helpText="Maximum 500 characters"
 *   maxLength={500}
 * />
 * ```
 */
const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(
  (
    {
      type,
      value,
      onChange,
      onBlur,
      onFocus,
      placeholder,
      label,
      size = "medium",
      maxLength,
      minLength,
      autoComplete,
      autoFocus = false,
      helpText,
      icon,
      rows = 4,
      validation,
      pattern,
      step,
      min,
      max,
      className,
      style,
      id,
      testId,
      disabled = false,
      required = false,
      error,
      loading = false,
      ...accessibilityProps
    },
    ref
  ) => {
    const inputId =
      id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

    // Size-based classes
    const sizeClasses = {
      small: "py-1 px-2 text-sm",
      medium: "py-2 px-3 text-base",
      large: "py-3 px-4 text-lg",
    };

    // Base input classes
    const inputClasses = cn(
      "w-full max-w-full box-border font-europa rounded border border-input bg-background",
      "ring-offset-background transition-colors",
      "placeholder:italic placeholder:text-muted-foreground",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted",
      sizeClasses[size],
      error && "border-destructive focus-visible:ring-destructive",
      icon && "pl-10",
      loading && "opacity-70",
      className
    );

    const commonProps = {
      id: inputId,
      value,
      onChange,
      onBlur,
      onFocus,
      placeholder,
      disabled: disabled || loading,
      required,
      maxLength,
      minLength,
      autoComplete,
      autoFocus,
      pattern,
      step,
      min,
      max,
      className: inputClasses,
      style,
      "data-testid": testId,
      "aria-invalid": error ? ("true" as const) : ("false" as const),
      "aria-describedby": error
        ? `${inputId}-error`
        : helpText
        ? `${inputId}-help`
        : undefined,
      ...accessibilityProps,
    };

    const inputElement =
      type === "textarea" ? (
        <textarea
          {...commonProps}
          rows={rows}
          ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
        />
      ) : (
        <input
          {...commonProps}
          type={type}
          ref={ref as React.ForwardedRef<HTMLInputElement>}
        />
      );

    return (
      <div className="flex flex-col w-full max-w-full mb-4">
        {label && (
          <Label
            className="mb-2 font-bold text-primary"
            htmlFor={inputId}
            required={required}
          >
            {label}
          </Label>
        )}

        <div className="relative">
          {icon && !loading && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            >
              {icon}
            </span>
          )}

          {loading && (
            <span
              className="absolute left-3 top-1/2 -translate-y-1/2 text-primary animate-spin"
              aria-hidden="true"
            >
              &#10227;
            </span>
          )}

          {inputElement}
        </div>

        {helpText && !error && (
          <div
            className="mt-1 text-sm text-muted-foreground"
            id={`${inputId}-help`}
          >
            {helpText}
          </div>
        )}

        {error && (
          <div
            className="flex items-center mt-1 text-sm text-destructive"
            id={`${inputId}-error`}
          >
            <ExclamationCircleIcon
              className="shrink-0 w-4 h-4 mr-1.5"
              aria-hidden="true"
            />
            <span role="alert">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
export { Input };
