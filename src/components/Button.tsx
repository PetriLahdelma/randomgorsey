import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BaseComponentProps, Size } from "../types/common";

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
 * CVA button variants configuration
 */
const buttonVariants = cva(
  // Base classes - flex, cursor, transitions, focus states
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-tschick-bold text-base cursor-pointer rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:border-muted",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary:
          "bg-transparent text-primary border border-primary hover:bg-primary/10",
        danger: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        tertiary: "bg-transparent text-primary border-none hover:bg-accent/50",
        success: "bg-success text-white hover:bg-success/90",
      },
      size: {
        small: "h-8 px-3 text-sm",
        medium: "h-10 px-4",
        large: "h-12 px-6 text-lg",
      },
      iconOnly: {
        true: "w-10 h-10 p-0",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      // Icon-only size adjustments
      { iconOnly: true, size: "small", class: "w-8 h-8" },
      { iconOnly: true, size: "large", class: "w-12 h-12" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "medium",
      iconOnly: false,
      fullWidth: false,
    },
  }
);

/**
 * Props for the Button component
 */
export interface ButtonProps
  extends Omit<BaseComponentProps, "children">,
    Omit<VariantProps<typeof buttonVariants>, "iconOnly" | "fullWidth"> {
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
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
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
    },
    ref
  ) => {
    // Accessible label for icon-only buttons
    const computedAriaLabel =
      ariaLabel ||
      (iconOnly && typeof children === "string" ? children : undefined);

    return (
      <button
        ref={ref}
        id={id}
        type={type}
        className={cn(
          buttonVariants({
            variant,
            size,
            iconOnly,
            fullWidth,
          }),
          iconPosition === "right" && "flex-row-reverse",
          loading && "opacity-70",
          className
        )}
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
        {loading && (
          <span
            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {icon && !loading && (
          <span className="inline-flex items-center" aria-hidden="true">
            {icon}
          </span>
        )}
        {!iconOnly && children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
export { Button, buttonVariants };
