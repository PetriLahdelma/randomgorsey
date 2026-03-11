import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
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
  "btn-signal inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono-label cursor-pointer transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-foreground hover:bg-yellow-500",
        secondary:
          "bg-transparent text-foreground border border-foreground hover:text-accent hover:border-accent",
        danger: "bg-destructive text-destructive-foreground hover:opacity-80",
        tertiary: "bg-transparent text-muted-foreground border border-border hover:text-foreground hover:border-foreground",
        success: "bg-success text-white hover:opacity-80",
      },
      size: {
        small: "h-8 px-3 text-xs",
        medium: "h-10 px-5",
        large: "h-12 px-6 text-sm",
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
  /** Render the button styles onto a child element */
  asChild?: boolean;
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
      asChild = false,
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
    const Comp = asChild ? Slot : "button";

    // Accessible label for icon-only buttons
    const computedAriaLabel =
      ariaLabel ||
      (iconOnly && typeof children === "string" ? children : undefined);

    return (
      <Comp
        ref={ref}
        id={id}
        {...(!asChild ? { type } : {})}
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
            className="inline-block h-4 w-4 animate-spin border-2 border-current border-t-transparent"
            aria-hidden="true"
          />
        )}
        {icon && !loading && (
          <span className="inline-flex items-center" aria-hidden="true">
            {icon}
          </span>
        )}
        {!iconOnly && children}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export default Button;
export { Button, buttonVariants };
