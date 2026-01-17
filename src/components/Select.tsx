import { forwardRef } from "react";
import {
  ChevronDownIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";
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
  /** Currently selected value(s) - string for single select, string[] for multiple */
  value: string | string[];
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
const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
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
    },
    ref
  ) => {
    const selectId =
      id || (label ? label.replace(/\s+/g, "-").toLowerCase() : undefined);

    // Size-based classes
    const sizeClasses = {
      small: "py-1 px-2 pr-8 text-sm",
      medium: "py-2 px-3 pr-10 text-base",
      large: "py-3 px-4 pr-12 text-lg",
    };

    // Group options if they have groups
    const groupedOptions = options.reduce((acc, option) => {
      const group = option.group || "default";
      if (!acc[group]) acc[group] = [];
      acc[group].push(option);
      return acc;
    }, {} as Record<string, SelectOption[]>);

    return (
      <div className="flex flex-col mb-4">
        {label && (
          <Label className="mb-2 font-bold text-primary" htmlFor={selectId} required={required}>
            {label}
          </Label>
        )}

        <div className="relative inline-block">
          <select
            ref={ref}
            id={selectId}
            value={multiple ? undefined : (value as string)}
            onChange={onChange}
            onBlur={onBlur}
            onFocus={onFocus}
            className={cn(
              "w-full font-europa text-foreground bg-background appearance-none cursor-pointer",
              "rounded border border-input",
              "ring-offset-background transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary",
              "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-muted disabled:text-muted-foreground",
              sizeClasses[size],
              error && "border-destructive focus-visible:ring-destructive",
              loading && "opacity-70",
              multiple && "min-h-[120px] py-2 px-3 cursor-auto",
              className
            )}
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
              const selectedValues = multiple
                ? Array.isArray(value)
                  ? value
                  : []
                : [];

              if (groupKey === "default") {
                return groupOptions.map((option) => (
                  <option
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    selected={
                      multiple ? selectedValues.includes(option.value) : undefined
                    }
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
                      selected={
                        multiple
                          ? selectedValues.includes(option.value)
                          : undefined
                      }
                    >
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              );
            })}
          </select>

          {!multiple && (
            <ChevronDownIcon
              className="absolute top-1/2 right-3 w-5 h-5 text-muted-foreground pointer-events-none -translate-y-1/2"
              aria-hidden="true"
            />
          )}

          {loading && (
            <span
              className="absolute top-1/2 right-10 text-primary pointer-events-none -translate-y-1/2 animate-spin"
              aria-hidden="true"
            >
              &#10227;
            </span>
          )}
        </div>

        {helpText && !error && (
          <div
            className="mt-1 text-sm text-muted-foreground"
            id={`${selectId}-help`}
          >
            {helpText}
          </div>
        )}

        {error && (
          <div
            className="flex items-center mt-1 text-sm text-destructive"
            id={`${selectId}-error`}
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

Select.displayName = "Select";

export default Select;
export { Select };
