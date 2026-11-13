import { createElement } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import styles from "./SystemPrimitives.module.css";
import {
  BaseComponentProps,
  type ElementWithChildren,
  type PolymorphicProps,
} from "../types/common";

export type SurfaceVariant = "flat" | "raised" | "inverted";
export type SurfacePadding = "none" | "xs" | "sm" | "md" | "lg";
export type SurfaceRadius = "none" | "sm" | "md" | "lg";

const DEFAULT_ELEMENT = "div";

/**
 * CVA variant definitions for Surface component
 * Maps CSS Module styles to Tailwind utilities
 */
const surfaceVariants = cva(
  styles.surface,
  {
    variants: {
      variant: {
        flat: styles.surfaceFlat,
        raised: styles.surfaceRaised,
        inverted: styles.surfaceInverted,
      },
      padding: {
        none: styles.paddingNone,
        xs: styles.paddingXs,
        sm: styles.paddingSm,
        md: styles.paddingMd,
        lg: styles.paddingLg,
      },
      radius: {
        none: styles.radiusNone,
        sm: styles.radiusSm,
        md: styles.radiusMd,
        lg: styles.radiusLg,
      },
      interactive: {
        true: styles.interactiveSurface,
        false: "",
      },
      fullWidth: {
        true: styles.fullWidth,
        false: "",
      },
    },
    defaultVariants: {
      variant: "flat",
      padding: "md",
      radius: "lg",
      interactive: false,
      fullWidth: true,
    },
  }
);

type SurfaceOwnProps = BaseComponentProps & {
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
};

export type SurfaceProps<
  T extends ElementWithChildren = typeof DEFAULT_ELEMENT,
> = PolymorphicProps<T, SurfaceOwnProps>;

const Surface = <T extends ElementWithChildren = typeof DEFAULT_ELEMENT>({
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
  const Component = (as || DEFAULT_ELEMENT) as T;

  return createElement(
    Component as React.ElementType,
    {
      className: cn(
        surfaceVariants({ variant, padding, radius, interactive, fullWidth }),
        className
      ),
      style,
      "data-testid": testId,
      ...rest,
    },
    children
  );
};

export default Surface;
export { surfaceVariants };
