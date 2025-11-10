/**
 * Common size variants used across multiple components
 */
export type Size = "small" | "medium" | "large";

/**
 * Color variants used across multiple components
 */
export type ColorVariant =
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger"
  | "info";

/**
 * Common spacing values
 */
export type Spacing = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

/**
 * Breakpoint names for responsive design
 */
export type Breakpoint = "mobile" | "tablet" | "desktop" | "wide";

/**
 * Common component states
 */
export interface ComponentState {
  loading?: boolean;
  disabled?: boolean;
  error?: string;
}

/**
 * Common accessibility props
 */
export interface AccessibilityProps {
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
  "aria-expanded"?: boolean;
  "aria-hidden"?: boolean;
  role?: string;
  tabIndex?: number;
}

/**
 * Common styling props
 */
export interface StylingProps {
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Props for components that can be clicked
 */
export interface ClickableProps {
  onClick?: (event: React.MouseEvent) => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}

/**
 * Base props that most components should have
 */
export interface BaseComponentProps
  extends StylingProps,
    AccessibilityProps,
    ComponentState {
  /** Unique identifier for the component */
  id?: string;
  /** Test ID for testing purposes */
  testId?: string;
  /** Children elements */
  children?: React.ReactNode;
}
