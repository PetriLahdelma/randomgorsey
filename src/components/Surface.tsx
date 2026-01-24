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
  // Base classes - always applied
  // Position, box model, colors, border, shadow, and transitions
  [
    "relative box-border block overflow-hidden",
    "text-black bg-white",
    "border border-black/[0.14]",
    "rounded-xl", // 0.75rem default
    "shadow-[0_18px_30px_rgb(0_0_0/0.18)]",
    "transition-[transform,box-shadow,background-color,border-color,color]",
    "duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)]",
  ].join(" "),
  {
    variants: {
      variant: {
        // Flat: lighter shadow
        flat: "shadow-[0_12px_22px_rgb(0_0_0/0.15)]",
        // Raised: heavier shadow
        raised: "shadow-[0_24px_45px_rgb(0_0_0/0.35)]",
        // Inverted: dark background, light text
        inverted: [
          "text-white bg-black/[0.92]",
          "border-white/[0.2]",
          "shadow-[0_25px_50px_rgb(0_0_0/0.45)]",
        ].join(" "),
      },
      padding: {
        none: "p-0",
        xs: "p-[0.35rem]",
        sm: "p-[0.75rem]",
        md: "p-4", // 1rem
        lg: "p-6", // 1.5rem
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-[0.35rem]",
        md: "rounded-[0.5rem]",
        lg: "rounded-xl", // 0.75rem
      },
      interactive: {
        true: [
          "cursor-pointer",
          "hover:shadow-[0_30px_50px_rgb(0_0_0/0.45)] hover:-translate-y-0.5",
          "focus-visible:shadow-[0_30px_50px_rgb(0_0_0/0.45)] focus-visible:-translate-y-0.5",
          "focus-visible:outline-2 focus-visible:outline-[#ff0] focus-visible:outline-offset-[3px]",
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
