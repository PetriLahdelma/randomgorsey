import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BaseComponentProps } from "../types/common";

type HeadingTone = "light" | "dark" | "accent";
type HeadingAlign = "left" | "center" | "right";
type HeadingWeight = "regular" | "medium" | "bold";

const DEFAULT_HEADING_TAG = "h2";

/**
 * CVA variant definitions for Heading component
 * Maps CSS Module styles to Tailwind utilities
 */
const headingVariants = cva(
  // Base classes - always applied
  // Using font-tschick-bold utility class for custom font
  "m-0 font-tschick-bold tracking-[0.08em]",
  {
    variants: {
      level: {
        // clamp(2.4rem, 5vw, 3.4rem) with line-height 1.1
        1: "text-[clamp(2.4rem,5vw,3.4rem)] leading-[1.1]",
        // clamp(1.6rem, 4vw, 2.2rem) with line-height 1.15
        2: "text-[clamp(1.6rem,4vw,2.2rem)] leading-[1.15]",
        // 1.4rem with line-height 1.2
        3: "text-[1.4rem] leading-[1.2]",
        // 1.2rem with line-height 1.2
        4: "text-[1.2rem] leading-[1.2]",
        // 1.05rem with line-height 1.3
        5: "text-[1.05rem] leading-[1.3]",
        // 0.95rem with line-height 1.3
        6: "text-[0.95rem] leading-[1.3]",
      },
      tone: {
        light: "text-white",
        dark: "text-black",
        // Accent uses fuchsia-500 for magenta-like color with better contrast
        accent: "text-fuchsia-500",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
      weight: {
        regular: "font-normal", // 400
        medium: "font-semibold", // 600
        bold: "font-bold", // 700
      },
    },
    defaultVariants: {
      level: 2,
      tone: "dark",
      align: "left",
      weight: "bold",
    },
  }
);

type HeadingOwnProps = BaseComponentProps & {
  /** HTML tag to render */
  as?: React.ElementType;
  /** Visual level */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Tone determines text color */
  tone?: HeadingTone;
  /** Text alignment */
  align?: HeadingAlign;
  /** Weight overrides */
  weight?: HeadingWeight;
  /** Force uppercase (default true) */
  uppercase?: boolean;
  /** Heading content */
  children?: React.ReactNode;
};

type PolymorphicProps<T extends React.ElementType, P> = P &
  Omit<React.ComponentPropsWithoutRef<T>, keyof P>;

export type HeadingProps<
  T extends React.ElementType = typeof DEFAULT_HEADING_TAG,
> = PolymorphicProps<T, HeadingOwnProps>;

const Heading = <T extends React.ElementType = typeof DEFAULT_HEADING_TAG>({
  as,
  level = 2,
  tone = "dark",
  align = "left",
  weight = "bold",
  uppercase = true,
  className,
  style,
  children,
  testId,
  ...rest
}: HeadingProps<T>) => {
  const Component =
    (as as React.ElementType) || (`h${level}` as React.ElementType);

  return (
    <Component
      className={cn(
        headingVariants({ level, tone, align, weight }),
        uppercase && "uppercase",
        className
      )}
      style={style}
      data-testid={testId}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Heading;
export { headingVariants };
