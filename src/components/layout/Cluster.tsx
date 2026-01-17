import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

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
  /** Underlying element to render */
  as?: React.ElementType;
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

type PolymorphicProps<T extends React.ElementType, P> = P &
  Omit<React.ComponentPropsWithoutRef<T>, keyof P>;

export type ClusterProps<
  T extends React.ElementType = typeof DEFAULT_ELEMENT,
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
const Cluster = <T extends React.ElementType = typeof DEFAULT_ELEMENT>({
  as,
  gap = "md",
  justify = "start",
  align = "center",
  className,
  children,
  ...rest
}: ClusterProps<T>) => {
  const Component = (as || DEFAULT_ELEMENT) as React.ElementType;

  return (
    <Component
      className={cn(clusterVariants({ gap, justify, align }), className)}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Cluster;
export { Cluster, clusterVariants };
