import { createElement } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
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
  [
    "relative box-border block overflow-hidden",
    "text-foreground bg-surface",
    "border border-border",
    "transition-none",
  ].join(" "),
  {
    variants: {
      variant: {
        flat: "",
        raised: "",
        inverted: "text-foreground bg-surface-elevated border-border",
      },
      padding: {
        none: "p-0",
        xs: "p-[0.35rem]",
        sm: "p-[0.75rem]",
        md: "p-4",
        lg: "p-6",
      },
      radius: {
        none: "",
        sm: "",
        md: "",
        lg: "",
      },
      interactive: {
        true: [
          "cursor-pointer",
          "hover:-translate-y-0.5",
          "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-[3px]",
        ].join(" "),
        false: "",
      },
      fullWidth: {
        true: "w-full",
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
