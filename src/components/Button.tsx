import React from "react";
import styles from "./Button.module.css";
import { BaseComponentProps, Size } from '../types/common';

/**
 * Button component variants for different use cases
 */
export type ButtonVariant =
  | "primary"
  | "secondary" 
  | "danger"
  | "tertiary"
  | "success";

/**
 * Icon position options for buttons with both icon and text
 */
export type IconPosition = "left" | "right";

/**
 * Props for the Button component
 */
export interface ButtonProps extends Omit<BaseComponentProps, 'children'> {
  /** Visual style variant of the button */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: Size;
  /** Button content */
  children?: React.ReactNode;
  /** Click handler function */
  onClick?: () => void;
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Icon to display in the button */
  icon?: React.ReactNode;
  /** Whether to show only the icon (hides text) */
  iconOnly?: boolean;
  /** Position of the icon relative to text */
  iconPosition?: IconPosition;
  /** HTML button type */
  type?: "button" | "submit" | "reset";
  /** Whether the button should take full width of its container */
  fullWidth?: boolean;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Auto-focus the button on mount */
  autoFocus?: boolean;
  /** Form attribute for submit buttons */
  form?: string;
}

/**
 * Reusable Button component with various styling options and accessibility features
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Primary Button
 * </Button>
 *
 * <Button variant="secondary" icon={<Icon />} iconOnly ariaLabel="Close">
 *   Close
 * </Button>
 *
 * <Button size="large" loading>
 *   Loading...
 * </Button>
 * ```
 */
const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "medium",
  children,
  onClick,
  disabled = false,
  icon,
  iconOnly = false,
  iconPosition = "left",
  type = "button",
  fullWidth = false,
  loading = false,
  autoFocus = false,
  form,
  className,
  style,
  id,
  testId,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
  role,
  tabIndex,
  ...accessibilityProps
}) => {
  // Determine button layout classes
  const buttonClass = iconOnly
    ? styles.iconOnly
    : icon && children
    ? styles["text-with-icon"]
    : icon
    ? styles.icon
    : "";

  // Combine CSS classes
  const classNames = [
    styles.button,
    styles[variant],
    styles[size],
    buttonClass,
    fullWidth ? styles.fullWidth : "",
    loading ? styles.loading : "",
    iconPosition === "right" ? styles.iconRight : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  // Accessible label for icon-only buttons
  const computedAriaLabel =
    ariaLabel ||
    (iconOnly && typeof children === "string" ? children : undefined);

  return (
    <button
      id={id}
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
      autoFocus={autoFocus}
      form={form}
      title={iconOnly && typeof children === "string" ? children : undefined}
      aria-label={computedAriaLabel}
      aria-describedby={ariaDescribedBy}
      role={role}
      tabIndex={tabIndex}
      data-testid={testId}
      {...accessibilityProps}
    >
      {loading && <span className={styles.spinner} aria-hidden="true" />}
      {icon && !loading && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      {!iconOnly && children}
    </button>
  );
};

export default Button;
