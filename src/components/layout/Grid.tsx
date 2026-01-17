import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * CVA variant definitions for Grid component's inner grid
 * Defines gap spacing variants
 */
const gridVariants = cva(
  // Base classes - CSS Grid layout
  "grid",
  {
    variants: {
      gap: {
        sm: "gap-2",
        md: "gap-4",
        lg: "gap-6",
        xl: "gap-8",
      },
    },
    defaultVariants: {
      gap: "md",
    },
  }
);

type GridColumns = "auto" | "1" | "2" | "3" | "4";

interface GridProps {
  /** Grid content */
  children: React.ReactNode;
  /** Gap between grid items */
  gap?: VariantProps<typeof gridVariants>["gap"];
  /**
   * Column mode:
   * - 'auto': Container query responsive (1->2->3->4 columns based on container width)
   * - '1'-'4': Fixed column count
   * - If minItemWidth is provided, uses auto-fit with minmax
   */
  columns?: GridColumns;
  /**
   * Minimum width for auto-fit grid items (e.g., "250px")
   * When provided, overrides columns prop and uses CSS auto-fit
   */
  minItemWidth?: string;
  /** Additional CSS classes for the grid element */
  className?: string;
  /** Additional CSS classes for the @container wrapper */
  containerClassName?: string;
}

/**
 * Grid component with container query support for responsive layouts.
 * Uses @container queries so the grid responds to its container width,
 * not the viewport width. This enables components to work in different
 * layout contexts (sidebars, modals, main content).
 *
 * @example
 * ```tsx
 * // Container query responsive (default)
 * <Grid>
 *   <Card>1</Card>
 *   <Card>2</Card>
 *   <Card>3</Card>
 * </Grid>
 *
 * // Fixed 3-column layout
 * <Grid columns="3" gap="lg">
 *   <Card>1</Card>
 *   <Card>2</Card>
 *   <Card>3</Card>
 * </Grid>
 *
 * // Auto-fit with minimum item width
 * <Grid minItemWidth="250px">
 *   {items.map(item => <Card key={item.id}>{item.name}</Card>)}
 * </Grid>
 * ```
 */
const Grid = ({
  children,
  gap = "md",
  columns = "auto",
  minItemWidth,
  className,
  containerClassName,
}: GridProps) => {
  // Determine column classes based on mode
  const getColumnClasses = () => {
    // If minItemWidth is provided, use auto-fit with minmax
    if (minItemWidth) {
      return null; // Will use inline style instead
    }

    // Container query responsive columns
    if (columns === "auto") {
      return "grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4";
    }

    // Fixed column counts
    const fixedColumns: Record<GridColumns, string> = {
      auto: "", // handled above
      "1": "grid-cols-1",
      "2": "grid-cols-2",
      "3": "grid-cols-3",
      "4": "grid-cols-4",
    };

    return fixedColumns[columns];
  };

  const columnClasses = getColumnClasses();

  // For minItemWidth, we need inline style for the template
  const gridStyle = minItemWidth
    ? { gridTemplateColumns: `repeat(auto-fit, minmax(${minItemWidth}, 1fr))` }
    : undefined;

  return (
    // Outer wrapper establishes container query context
    <div className={cn("@container", containerClassName)}>
      {/* Inner grid responds to container size */}
      <div
        className={cn(gridVariants({ gap }), columnClasses, className)}
        style={gridStyle}
      >
        {children}
      </div>
    </div>
  );
};

export default Grid;
export { Grid, gridVariants };
export type { GridProps, GridColumns };
