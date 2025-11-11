import React from "react";
import styles from "./Surface.module.css";
import { BaseComponentProps } from "../../types/common";

export type SurfaceVariant = "flat" | "raised" | "inverted";
export type SurfacePadding = "none" | "xs" | "sm" | "md" | "lg";
export type SurfaceRadius = "none" | "sm" | "md" | "lg";

const DEFAULT_ELEMENT = "div";

type SurfaceOwnProps = BaseComponentProps & {
  /** Underlying element to render */
  as?: React.ElementType;
  /** Visual treatment */
  variant?: SurfaceVariant;
  /** Internal padding */
  padding?: SurfacePadding;
  /** Border radius scale */
  radius?: SurfaceRadius;
  /** Enables hover/press affordances */
  interactive?: boolean;
  /** Forces width: 100% */
  fullWidth?: boolean;
  /** Component content */
  children?: React.ReactNode;
};

type PolymorphicProps<T extends React.ElementType, P> = P &
  Omit<React.ComponentPropsWithoutRef<T>, keyof P>;

export type SurfaceProps<
  T extends React.ElementType = typeof DEFAULT_ELEMENT,
> = PolymorphicProps<T, SurfaceOwnProps>;

const Surface = <T extends React.ElementType = typeof DEFAULT_ELEMENT>({
  as,
  variant = "flat",
  padding = "md",
  radius = "lg",
  interactive = false,
  fullWidth = true,
  className,
  style,
  children,
  testId,
  ...rest
}: SurfaceProps<T>) => {
  const Component = (as || DEFAULT_ELEMENT) as React.ElementType;

  const classes = [
    styles.surface,
    styles[variant],
    styles[`pad-${padding}`],
    styles[`radius-${radius}`],
    interactive ? styles.interactive : "",
    fullWidth ? styles['full-width'] : "",
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} style={style} data-testid={testId} {...rest}>
      {children}
    </Component>
  );
};

export default Surface;
