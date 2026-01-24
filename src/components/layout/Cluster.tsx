import { createElement } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import {
  type ElementWithChildren,
  type PolymorphicProps,
} from "@/types/common";

const DEFAULT_ELEMENT = "div";

/**
 * CVA variant definitions for Cluster component
 * Arranges children horizontally with wrapping
 */
const clusterVariants = cva(
  // Base classes - horizontal flex layout with wrapping
  "flex flex-wrap",
  {
    variants: {
      gap: {
        none: "gap-0",
        xs: "gap-1",
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
      },
      justify: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
      },
      align: {
        start: "items-start",
        center: "items-center",
        end: "items-end",
        baseline: "items-baseline",
        stretch: "items-stretch",
      },
    },
    defaultVariants: {
      gap: "md",
      justify: "start",
      align: "center",
    },
  }
);

type ClusterOwnProps = {
  /** Gap between children */
  gap?: VariantProps<typeof clusterVariants>["gap"];
  /** Horizontal distribution of children */
  justify?: VariantProps<typeof clusterVariants>["justify"];
  /** Vertical alignment of children */
  align?: VariantProps<typeof clusterVariants>["align"];
  /** Component content */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
};

export type ClusterProps<
  T extends ElementWithChildren = typeof DEFAULT_ELEMENT,
> = PolymorphicProps<T, ClusterOwnProps>;

/**
 * Cluster component for horizontal layouts with wrapping
 *
 * @example
 * ```tsx
 * <Cluster gap="sm" justify="center">
 *   <Tag>React</Tag>
 *   <Tag>TypeScript</Tag>
 *   <Tag>Tailwind</Tag>
 * </Cluster>
 *
 * <Cluster as="nav" gap="lg" justify="between" align="center">
 *   <Logo />
 *   <NavLinks />
 * </Cluster>
 * ```
 */
const Cluster = <T extends ElementWithChildren = typeof DEFAULT_ELEMENT>({
  as,
  gap = "md",
  justify = "start",
  align = "center",
  className,
  children,
  ...rest
}: ClusterProps<T>) => {
  const Component = (as || DEFAULT_ELEMENT) as T;

  return createElement(
    Component as React.ElementType,
    {
      className: cn(clusterVariants({ gap, justify, align }), className),
      ...rest,
    },
    children
  );
};

export default Cluster;
export { Cluster, clusterVariants };
