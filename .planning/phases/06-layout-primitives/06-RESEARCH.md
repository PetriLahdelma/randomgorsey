# Phase 6: Layout Primitives - Research

**Researched:** 2026-01-17
**Domain:** CSS Layout Primitives, Container Queries, Tailwind CSS v4
**Confidence:** HIGH

## Summary

This research investigates the implementation of layout primitives (Stack, Cluster, Grid, Bleed) with intentional grid breaks and container queries for the Random Gorsey project. The goal is to enable composable, responsive layouts where components respond to their container size rather than the viewport.

Tailwind CSS v4 natively supports container queries without plugins, making this implementation straightforward. The layout primitives follow the "Every Layout" philosophy - simple components with single responsibilities that compose together to create complex layouts.

**Primary recommendation:** Build four core layout primitives (Stack, Cluster, Grid, Bleed) as Tailwind-powered React components using the existing CVA pattern, leveraging v4's native container query support for component-level responsiveness.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 4.1.18 | Utility-first CSS with native container queries | Already installed, v4 has built-in @container support |
| class-variance-authority | 0.7.1 | Variant management for component styles | Already established pattern in project |
| tailwind-merge | 3.4.0 | Intelligent class merging | Already established pattern in project |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @radix-ui/react-slot | 1.2.4 | Polymorphic component support | For `asChild` prop pattern |
| clsx | 2.1.1 | Conditional class names | Class composition |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Custom primitives | @bedrock-layout/primitives | Extra dependency, less Tailwind-native |
| Custom primitives | LYTS | TypeScript-first but different design philosophy |
| Container queries plugin | Native CSS @container | Native is better - v4 includes it |

**Installation:**
```bash
# No new dependencies needed - all requirements already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/
├── components/
│   └── layout/              # New directory for layout primitives
│       ├── Stack.tsx        # Vertical spacing component
│       ├── Cluster.tsx      # Horizontal wrapping component
│       ├── Grid.tsx         # Auto-fit responsive grid
│       ├── Bleed.tsx        # Full-width breakout component
│       ├── Container.tsx    # Content width constraint
│       └── index.ts         # Barrel export
├── styles/
│   └── tokens/
│       └── layout.css       # Layout-specific tokens (container sizes, etc.)
└── stories/
    └── layout/              # Layout primitive stories
        ├── Stack.stories.tsx
        ├── Cluster.stories.tsx
        ├── Grid.stories.tsx
        └── Bleed.stories.tsx
```

### Pattern 1: Stack Component
**What:** Arranges children vertically with consistent spacing using Tailwind's gap utilities.
**When to use:** Any vertical content flow - post lists, form fields, section content.
**Example:**
```typescript
// Source: Every Layout Stack pattern + Tailwind utilities
interface StackProps {
  children: React.ReactNode;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  as?: React.ElementType;
  className?: string;
}

const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      xs: "gap-1",      // 0.25rem
      sm: "gap-2",      // 0.5rem
      md: "gap-4",      // 1rem (default)
      lg: "gap-6",      // 1.5rem
      xl: "gap-8",      // 2rem
      '2xl': "gap-12",  // 3rem
    }
  },
  defaultVariants: {
    gap: "md"
  }
});
```

### Pattern 2: Cluster Component
**What:** Arranges children horizontally with wrapping, like words in a paragraph.
**When to use:** Tag lists, button groups, navigation items, any horizontal list that should wrap.
**Example:**
```typescript
// Source: Every Layout Cluster pattern + Tailwind flex utilities
interface ClusterProps {
  children: React.ReactNode;
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  justify?: 'start' | 'center' | 'end' | 'between';
  align?: 'start' | 'center' | 'end' | 'baseline' | 'stretch';
  as?: React.ElementType;
  className?: string;
}

const clusterVariants = cva("flex flex-wrap", {
  variants: {
    gap: {
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
    }
  },
  defaultVariants: {
    gap: "md",
    justify: "start",
    align: "center"
  }
});
```

### Pattern 3: Grid Component with Container Queries
**What:** Responsive grid that adjusts column count based on container width, not viewport.
**When to use:** Card grids, image galleries, feature lists.
**Example:**
```typescript
// Source: Tailwind v4 container queries + CSS Grid
interface GridProps {
  children: React.ReactNode;
  minItemWidth?: string;  // e.g., "250px" or "16rem"
  gap?: 'sm' | 'md' | 'lg';
  as?: React.ElementType;
  className?: string;
}

// Container wrapper enables container queries
const Grid = ({ children, minItemWidth = "250px", gap = "md", className }: GridProps) => (
  <div className={cn("@container", className)}>
    <div className={cn(
      "grid",
      "grid-cols-1 @sm:grid-cols-2 @lg:grid-cols-3 @xl:grid-cols-4",
      gap === "sm" && "gap-2",
      gap === "md" && "gap-4",
      gap === "lg" && "gap-6"
    )}>
      {children}
    </div>
  </div>
);

// Or with CSS Grid auto-fit for truly intrinsic sizing:
// grid-cols-[repeat(auto-fit,minmax(250px,1fr))]
```

### Pattern 4: Bleed Component (Full-Width Breakout)
**What:** Allows content to break out of contained layout to full viewport width.
**When to use:** Hero images, full-bleed banners, emphasized sections within contained layouts.
**Example:**
```typescript
// Source: Josh Comeau/Ryan Mulligan full-bleed CSS Grid technique
interface BleedProps {
  children: React.ReactNode;
  className?: string;
}

// Method 1: Viewport calculation (simpler, potential scrollbar issues)
const Bleed = ({ children, className }: BleedProps) => (
  <div className={cn(
    "relative left-1/2 w-screen -translate-x-1/2",
    className
  )}>
    {children}
  </div>
);

// Method 2: Named grid lines (more robust, requires grid parent)
// Parent uses: grid-cols-[1fr_minmax(0,600px)_1fr]
// Child uses: col-span-full or col-[1/-1]
```

### Pattern 5: Container Query Responsive Layout
**What:** Layout component that uses container queries for responsive behavior.
**When to use:** Components that need to adapt based on their container, not viewport.
**Example:**
```typescript
// Source: Tailwind CSS v4 container query documentation
const ResponsiveCard = () => (
  <div className="@container">
    {/* Vertical on small containers, horizontal on larger */}
    <div className="flex flex-col @md:flex-row gap-4">
      <div className="@md:w-1/3">
        <img src="..." className="w-full" />
      </div>
      <div className="@md:w-2/3">
        <h3>Title</h3>
        <p>Description</p>
      </div>
    </div>
  </div>
);
```

### Anti-Patterns to Avoid
- **Margin for spacing:** Don't use margin-bottom on children; use gap on parent (Stack/Cluster pattern)
- **Fixed breakpoints for layout:** Use container queries for component layout, viewport queries for page layout
- **100vw without scrollbar handling:** `w-screen` can cause horizontal scroll when vertical scrollbar is present
- **Deep nesting of layout components:** Compose at most 2-3 levels; beyond that, create a combined layout

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Spacing between items | Margin on each child | Flex/Grid gap | Gap handles edge cases, no :last-child rules |
| Responsive columns | Media queries per breakpoint | Container queries | Components adapt to context, not viewport |
| Full-width breakout | Complex calc() | Established `left-1/2 w-screen -translate-x-1/2` pattern | Well-tested, predictable behavior |
| Auto-fit grid | Manual column counts | `grid-cols-[repeat(auto-fit,minmax(x,1fr))]` | Algorithmic, no breakpoints needed |
| Polymorphic components | Props spreading | Radix Slot or `as` prop | Type-safe, predictable |

**Key insight:** Layout primitives should be "dumb" - they handle spacing and flow, not styling or content concerns. Keep them simple and composable.

## Common Pitfalls

### Pitfall 1: Container Query Context Loss
**What goes wrong:** Container queries don't work because `@container` class is on the wrong element.
**Why it happens:** The element with `@container` becomes the query container; children query it.
**How to avoid:** Always add `@container` to the direct parent of the responsive content.
**Warning signs:** Container query styles never apply regardless of parent size.

### Pitfall 2: Bleed Component Scrollbar Issues
**What goes wrong:** `w-screen` causes horizontal scrollbar when vertical scrollbar is present.
**Why it happens:** `100vw` includes scrollbar width, but content area doesn't.
**How to avoid:** Use `w-dvw` (dynamic viewport width) or CSS calc with custom properties for scrollbar.
**Warning signs:** Horizontal scroll appears on pages with long content.

### Pitfall 3: Gap vs Space-Between Confusion
**What goes wrong:** Uneven spacing in Cluster/Stack components.
**Why it happens:** Mixing `gap` with `justify-between` or using margin alongside gap.
**How to avoid:** Use gap exclusively for spacing; use justify/align for distribution.
**Warning signs:** First/last items have different spacing than middle items.

### Pitfall 4: Nested Container Query Ambiguity
**What goes wrong:** Inner container query matches outer container instead of intended one.
**Why it happens:** Container queries match the nearest ancestor container by default.
**How to avoid:** Use named containers (`@container/name`) for nested scenarios.
**Warning signs:** Layout changes at unexpected sizes or doesn't change when expected.

### Pitfall 5: Over-Engineering Grid Breakpoints
**What goes wrong:** Complex grid with many breakpoint-specific column counts.
**Why it happens:** Trying to match exact designs at every width.
**How to avoid:** Use `auto-fit` or `auto-fill` with `minmax()` for intrinsic responsiveness.
**Warning signs:** Multiple `@sm:grid-cols-X @md:grid-cols-Y @lg:grid-cols-Z` patterns.

## Code Examples

Verified patterns from official sources:

### Tailwind v4 Container Query Setup
```typescript
// Source: https://tailwindcss.com/docs/responsive-design#container-queries
// Parent establishes container context
<div className="@container">
  {/* Child responds to parent's size, not viewport */}
  <div className="flex flex-col @md:flex-row gap-4">
    <div className="@md:w-1/2">Column 1</div>
    <div className="@md:w-1/2">Column 2</div>
  </div>
</div>
```

### Custom Container Size Token
```css
/* Source: Tailwind v4 @theme directive */
@import "tailwindcss";
@theme {
  /* Custom container query breakpoints */
  --container-xs: 20rem;   /* 320px */
  --container-sm: 24rem;   /* 384px */
  --container-md: 28rem;   /* 448px */
  --container-lg: 32rem;   /* 512px */
  --container-xl: 36rem;   /* 576px */
}
```

### Full-Bleed Section in Grid Layout
```css
/* Source: Ryan Mulligan - Layout Breakouts with CSS Grid */
.content-grid {
  --gap: clamp(1rem, 6vw, 3rem);
  --content: min(600px, 100% - var(--gap) * 2);

  display: grid;
  grid-template-columns:
    [full-start] minmax(var(--gap), 1fr)
    [content-start] var(--content) [content-end]
    minmax(var(--gap), 1fr) [full-end];
}

.content-grid > * {
  grid-column: content;
}

.content-grid > .full-bleed {
  grid-column: full;
}
```

### Tailwind Arbitrary Grid for Breakouts
```html
<!-- Source: Tailwind arbitrary value syntax -->
<div class="grid grid-cols-[minmax(1rem,1fr)_minmax(0,600px)_minmax(1rem,1fr)]">
  <!-- Normal content in center column -->
  <div class="col-start-2">Regular content</div>

  <!-- Full-bleed spans all columns -->
  <div class="col-span-full bg-black text-white p-8">
    Full-width section
  </div>
</div>
```

### Stack Component with CVA
```typescript
// Source: Project pattern (Surface.tsx) + Every Layout
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const stackVariants = cva("flex flex-col", {
  variants: {
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      '2xl': "gap-12",
      section: "gap-16",  // Match --space-section token
    }
  },
  defaultVariants: {
    gap: "md"
  }
});

interface StackProps extends VariantProps<typeof stackVariants> {
  children: React.ReactNode;
  as?: React.ElementType;
  className?: string;
}

export const Stack = ({ children, gap, as: Component = 'div', className }: StackProps) => (
  <Component className={cn(stackVariants({ gap }), className)}>
    {children}
  </Component>
);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| @media viewport queries | @container queries | CSS native 2023, Tailwind v4 2024 | Components adapt to context |
| Container query plugin | Native Tailwind v4 support | Tailwind 4.0 (Dec 2024) | No plugin needed |
| margin-bottom spacing | Flexbox/Grid gap | CSS gap widely supported 2020+ | Cleaner, no :last-child hacks |
| calc(100vw - scrollbar) | dvw/dvh units | 2022+ browser support | Simpler full-width handling |

**Deprecated/outdated:**
- `@tailwindcss/container-queries` plugin: Unnecessary in Tailwind v4, native support included
- `-webkit-fill-available` hacks: Use `dvh` units instead
- Complex margin collapsing patterns: Use gap-based spacing

## Open Questions

Things that couldn't be fully resolved:

1. **Named Grid Lines in Tailwind**
   - What we know: Tailwind doesn't have built-in named line utilities, but arbitrary values work
   - What's unclear: Best practice for defining reusable named-line grid patterns
   - Recommendation: Use arbitrary grid-cols with custom CSS for the content-grid pattern

2. **Bleed Component Scrollbar Handling**
   - What we know: `w-screen` can cause scrollbar issues; `w-dvw` is better
   - What's unclear: Browser support for dvw in project's browserslist
   - Recommendation: Test `w-dvw` first; fall back to `w-screen` with `overflow-x: hidden` on body if needed

3. **Container Query Units (cqw, cqh)**
   - What we know: Tailwind supports arbitrary values like `w-[50cqw]`
   - What's unclear: Performance implications of heavy cqw usage
   - Recommendation: Use sparingly for specific effects; prefer container breakpoints for layout

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4.0 Blog](https://tailwindcss.com/blog/tailwindcss-v4) - Container queries, @theme directive
- [Tailwind CSS Responsive Design Docs](https://tailwindcss.com/docs/responsive-design) - Container query syntax and variants
- [Ryan Mulligan - Layout Breakouts](https://ryanmulligan.dev/blog/layout-breakouts/) - CSS Grid full-bleed technique
- [Every Layout](https://every-layout.dev/layouts/) - Stack, Cluster, Grid, Cover primitives

### Secondary (MEDIUM confidence)
- [Tailwind Labs GitHub Discussion #14544](https://github.com/tailwindlabs/tailwindcss/discussions/14544) - Full-bleed utility approaches
- [Bedrock Layout Primitives](https://github.com/Bedrock-Layouts/Bedrock) - React layout component patterns

### Tertiary (LOW confidence)
- [Medium - Tailwind CSS 4 @theme](https://medium.com/@sureshdotariya/tailwind-css-4-theme-the-future-of-design-tokens-at-2025-guide-48305a26af06) - Design tokens approach

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using existing project dependencies and patterns
- Architecture: HIGH - Based on Every Layout + Tailwind official docs
- Container queries: HIGH - Native Tailwind v4 feature, well-documented
- Bleed pattern: MEDIUM - Multiple valid approaches, needs testing
- Pitfalls: HIGH - Based on documented issues and best practices

**Research date:** 2026-01-17
**Valid until:** 2026-03-17 (60 days - stable domain, CSS spec finalized)
