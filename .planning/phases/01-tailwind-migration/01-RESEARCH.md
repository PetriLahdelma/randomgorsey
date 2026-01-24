# Phase 1: Tailwind Migration - Research

**Researched:** 2026-01-17
**Domain:** CSS architecture migration (CSS Modules -> Tailwind CSS + shadcn/ui + Radix)
**Confidence:** HIGH (verified via official documentation and multiple authoritative sources)

---

## Summary

This phase migrates the Random Gorsey codebase from CSS Modules to Tailwind CSS v4 + shadcn/ui v2 + Radix primitives. The critical finding is that **Tailwind CSS v4 is NOT compatible with Create React App (CRA)** due to CRA's lack of custom PostCSS configuration support. This presents a decision point:

**Option A: Migrate from CRA to Vite FIRST (Recommended)**
- Enables Tailwind CSS v4 with its 100x faster builds and CSS-first configuration
- shadcn/ui CLI has first-class Vite support
- Aligns with React ecosystem direction (CRA was officially sunset in Feb 2025)
- Performance benefits: cold start 12.9x faster, HMR 10.4x faster

**Option B: Stay with CRA, use Tailwind CSS v3.4.1**
- Requires downgrading to Tailwind v3.4.1 (v3.4.x has known CRA compatibility issues)
- May require CRACO for PostCSS configuration
- Limits future flexibility but avoids build system migration

**Primary recommendation:** Migrate to Vite first, then install Tailwind CSS v4 + shadcn/ui. The CRA->Vite migration is well-documented and shadcn/ui has official Vite installation guides.

---

## Standard Stack

The established libraries for this migration:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `tailwindcss` | 4.x | Utility-first CSS framework | CSS-first config, 5x faster builds, Lightning CSS built-in |
| `@tailwindcss/vite` | 4.x | Vite plugin for Tailwind | Best performance with Vite, replaces PostCSS setup |
| `shadcn/ui` | latest | Component library (copy-paste) | Built on Radix, styled with Tailwind, owns the code |
| `radix-ui` | latest | Unstyled accessible primitives | Powers shadcn/ui, WAI-ARIA compliant, 130M+ monthly downloads |

### Supporting (installed by shadcn/ui)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `class-variance-authority` | ^0.7 | Component variant API | Creating components with multiple variants |
| `clsx` | ^2.1 | Conditional class strings | Composing class names conditionally |
| `tailwind-merge` | ^2.5 | Intelligent class merging | Resolving Tailwind class conflicts |
| `lucide-react` | ^0.454 | Icon library | Default shadcn/ui icon set |
| `tw-animate-css` | ^1.2 | Animation utilities | Tailwind animation extensions |

### For Vite Migration (if chosen)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `vite` | ^6.x | Build tool | Replaces react-scripts |
| `@vitejs/plugin-react` | ^4.x | React plugin for Vite | JSX/TSX support |
| `vite-tsconfig-paths` | ^5.x | Path alias resolution | Maintains existing @/ imports |
| `vite-plugin-svgr` | ^4.x | SVG as React components | If using SVG imports |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vite + Tailwind v4 | CRA + Tailwind v3.4.1 | Works but slower, less future-proof |
| shadcn/ui | Chakra UI, MUI | Different philosophy (dependency vs owned code) |
| Radix | Headless UI | Fewer primitives, less flexible |

**Installation (Vite path):**
```bash
# 1. Install Vite dependencies
npm install vite @vitejs/plugin-react vite-tsconfig-paths --save-dev

# 2. Install Tailwind CSS v4
npm install tailwindcss @tailwindcss/vite

# 3. Initialize shadcn/ui (installs CVA, clsx, tailwind-merge, etc.)
npx shadcn@latest init
```

---

## Architecture Patterns

### Recommended Project Structure (Post-Migration)
```
src/
├── components/
│   ├── ui/              # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── Heading.tsx      # Custom components using shadcn patterns
│   ├── Surface.tsx
│   └── Text.tsx
├── lib/
│   └── utils.ts         # cn() helper and other utilities
├── styles/
│   └── globals.css      # Tailwind entry + CSS variables
└── hooks/               # Custom React hooks
```

### Pattern 1: CSS-First Tailwind Configuration (v4)
**What:** Configure Tailwind directly in CSS, not JavaScript
**When to use:** All Tailwind v4 projects
**Example:**
```css
/* src/styles/globals.css */
@import "tailwindcss";

/* Custom CSS variables for theming */
@theme {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0 0);
  --color-primary-foreground: oklch(0.985 0 0);
  /* ... more theme variables */
}

/* Dark mode overrides */
.dark {
  --color-background: oklch(0.145 0 0);
  --color-foreground: oklch(0.985 0 0);
  /* ... */
}
```

### Pattern 2: cn() Utility for Class Composition
**What:** Intelligent class merging that handles Tailwind conflicts
**When to use:** Every component that accepts className prop
**Example:**
```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Usage in component
import { cn } from "@/lib/utils"

const Button = ({ className, variant, ...props }) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md font-medium",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "secondary" && "bg-secondary text-secondary-foreground",
        className // Allow overrides
      )}
      {...props}
    />
  )
}
```

### Pattern 3: class-variance-authority (CVA) for Variants
**What:** Type-safe variant API for components with multiple states
**When to use:** Components with variant/size/state props (Button, Badge, etc.)
**Example:**
```typescript
// Source: shadcn/ui official pattern
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base classes (always applied)
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = ({ className, variant, size, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}
```

### Pattern 4: Incremental Migration with Coexistence
**What:** Run CSS Modules alongside Tailwind during migration
**When to use:** During the migration period only
**Example:**
```typescript
// During migration: CSS Module styles + Tailwind classes coexist
import styles from "./Surface.module.css" // Keep temporarily
import { cn } from "@/lib/utils"

const Surface = ({ className, ...props }) => {
  return (
    <div
      className={cn(
        styles.surface,  // Old CSS Module class (remove later)
        "rounded-lg p-4", // New Tailwind classes
        className
      )}
      {...props}
    />
  )
}
```

### Anti-Patterns to Avoid
- **Importing Tailwind in CSS Modules:** Never import `@import "tailwindcss"` in `.module.css` files - it scopes globally and causes duplicates
- **Multiple Tailwind imports:** Only import Tailwind once in globals.css
- **Using @apply excessively:** Tailwind v4 discourages @apply in separate files; use utility classes directly or CSS variables
- **Hand-rolling accessible components:** Use Radix primitives instead of building dialogs, dropdowns, etc. from scratch

---

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Modal/Dialog | Custom div with backdrop | `@radix-ui/react-dialog` | Focus trapping, escape handling, ARIA |
| Dropdown menu | Custom positioned div | `@radix-ui/react-dropdown-menu` | Keyboard nav, positioning, submenus |
| Tooltip | Title attribute or custom | `@radix-ui/react-tooltip` | Delay handling, positioning, accessibility |
| Accordion | Toggle state DIYs | `@radix-ui/react-accordion` | ARIA, keyboard nav, animation |
| Tabs | Manual tab state | `@radix-ui/react-tabs` | Focus management, ARIA |
| Select/Combobox | Native select styling | `@radix-ui/react-select` | Custom styling + accessibility |
| Toast notifications | Custom positioned alerts | `sonner` (shadcn default) | Queue management, animations |
| Class string building | Template literals | `cn()` with clsx + tailwind-merge | Handles conflicts intelligently |
| Component variants | Switch/if statements | class-variance-authority (CVA) | Type-safe, composable |

**Key insight:** Accessibility is HARD. Radix primitives handle keyboard navigation, focus management, screen reader support, and ARIA attributes. Building these from scratch typically takes 10x longer and still misses edge cases.

---

## Common Pitfalls

### Pitfall 1: Tailwind v4 + CRA Incompatibility
**What goes wrong:** Error: "It looks like you're trying to use tailwindcss directly as a PostCSS plugin"
**Why it happens:** Tailwind v4 moved PostCSS plugin to `@tailwindcss/postcss` package. CRA doesn't support custom PostCSS config without ejecting.
**How to avoid:** Either migrate to Vite OR downgrade to Tailwind v3.4.1
**Warning signs:** Build fails immediately with PostCSS errors

### Pitfall 2: @apply Errors in Tailwind v4
**What goes wrong:** "Cannot apply unknown utility class" in separate CSS files
**Why it happens:** Tailwind v4's CSS-first approach requires explicit reference to main Tailwind config
**How to avoid:** Use utility classes directly in JSX instead of @apply in CSS files
**Warning signs:** Working classes in JSX fail when used with @apply

### Pitfall 3: Duplicate Tailwind Imports
**What goes wrong:** Bloated CSS bundle, cascading issues, JIT compiler confusion
**Why it happens:** Importing Tailwind in multiple CSS files
**How to avoid:** Import Tailwind ONLY in globals.css, never in module files
**Warning signs:** Doubled CSS bundle size, style conflicts

### Pitfall 4: Environment Variable Prefix Change (CRA->Vite)
**What goes wrong:** undefined errors for env variables
**Why it happens:** Vite uses `VITE_` prefix, CRA uses `REACT_APP_`
**How to avoid:** Rename all env vars, update `process.env.REACT_APP_*` to `import.meta.env.VITE_*`
**Warning signs:** Environment variables returning undefined

### Pitfall 5: CSS Module Scoping Conflicts
**What goes wrong:** Tailwind utilities don't apply as expected
**Why it happens:** CSS Modules scope everything including Tailwind classes if imported wrong
**How to avoid:** Keep Tailwind in globals.css, never import Tailwind inside .module.css
**Warning signs:** Tailwind classes getting hashed like module classes

### Pitfall 6: index.html Location in Vite
**What goes wrong:** Vite can't find entry point
**Why it happens:** CRA keeps index.html in public/, Vite expects it at root
**How to avoid:** Move index.html to root, add `<script type="module" src="/src/main.tsx"></script>`
**Warning signs:** 404 on all routes in development

### Pitfall 7: SVG Import Syntax Change (CRA->Vite)
**What goes wrong:** "does not provide an export named 'default'"
**Why it happens:** Vite handles SVG imports differently than CRA
**How to avoid:** Use `vite-plugin-svgr`, import with `?react` suffix
**Warning signs:** SVG imports fail with module errors

---

## Code Examples

### Example 1: Vite Configuration (Post-Migration)
```typescript
// vite.config.ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: "build", // Match CRA output for gh-pages compatibility
  },
})
```

### Example 2: Global CSS Setup (Tailwind v4)
```css
/* src/styles/globals.css */
@import "tailwindcss";

@theme {
  /* Color tokens using oklch (Tailwind v4 default) */
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0 0);
  --color-primary-foreground: oklch(0.985 0 0);
  --color-secondary: oklch(0.97 0 0);
  --color-secondary-foreground: oklch(0.205 0 0);
  --color-muted: oklch(0.97 0 0);
  --color-muted-foreground: oklch(0.556 0 0);
  --color-accent: oklch(0.97 0 0);
  --color-accent-foreground: oklch(0.205 0 0);
  --color-destructive: oklch(0.577 0.245 27.325);
  --color-destructive-foreground: oklch(0.577 0.245 27.325);
  --color-border: oklch(0.922 0 0);
  --color-input: oklch(0.922 0 0);
  --color-ring: oklch(0.708 0 0);

  /* Border radius tokens */
  --radius-lg: 0.625rem;
  --radius-md: 0.5rem;
  --radius-sm: 0.375rem;
}

.dark {
  --color-background: oklch(0.145 0 0);
  --color-foreground: oklch(0.985 0 0);
  /* ... dark mode overrides */
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### Example 3: components.json (shadcn/ui Configuration)
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### Example 4: Migrated Heading Component
```typescript
// src/components/Heading.tsx - AFTER migration
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const headingVariants = cva(
  "font-bold tracking-tight",
  {
    variants: {
      level: {
        1: "text-4xl md:text-5xl lg:text-6xl",
        2: "text-3xl md:text-4xl",
        3: "text-2xl md:text-3xl",
        4: "text-xl md:text-2xl",
        5: "text-lg md:text-xl",
        6: "text-base md:text-lg",
      },
      tone: {
        light: "text-white",
        dark: "text-foreground",
        accent: "text-primary",
      },
      align: {
        left: "text-left",
        center: "text-center",
        right: "text-right",
      },
    },
    defaultVariants: {
      level: 2,
      tone: "dark",
      align: "left",
    },
  }
)

interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
  uppercase?: boolean
}

const Heading = ({
  as,
  level = 2,
  tone,
  align,
  uppercase = true,
  className,
  children,
  ...props
}: HeadingProps) => {
  const Component = as || (`h${level}` as keyof JSX.IntrinsicElements)

  return (
    <Component
      className={cn(
        headingVariants({ level, tone, align }),
        uppercase && "uppercase",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Heading
```

### Example 5: Storybook Configuration for Tailwind
```typescript
// .storybook/preview.tsx
import type { Preview } from '@storybook/react'
import '../src/styles/globals.css' // Import Tailwind
import React from 'react'
import { MemoryRouter } from 'react-router-dom'

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
}

export default preview
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js | CSS-first @theme directive | Tailwind v4 (Jan 2025) | No JS config needed |
| `@tailwind base/components/utilities` | `@import "tailwindcss"` | Tailwind v4 (Jan 2025) | Single import |
| PostCSS with autoprefixer | Lightning CSS built-in | Tailwind v4 (Jan 2025) | Faster builds, less config |
| tailwindcss as PostCSS plugin | @tailwindcss/postcss package | Tailwind v4 (Jan 2025) | Breaking change |
| Create React App | Vite | CRA sunset Feb 2025 | 10x faster dev builds |
| CRACO for CRA customization | Vite native config | Ongoing | Simpler setup |

**Deprecated/outdated:**
- Create React App (CRA): Officially sunset Feb 2025, no longer recommended by React team
- `@tailwind` directives: Replaced by `@import "tailwindcss"` in v4
- tailwind.config.js: Still works but CSS-first is preferred in v4
- postcss-import: No longer needed in Tailwind v4 (handled automatically)
- autoprefixer: No longer needed in Tailwind v4 (Lightning CSS handles it)

---

## Migration Decision Matrix

| Factor | Vite + Tailwind v4 | CRA + Tailwind v3.4.1 |
|--------|--------------------|-----------------------|
| Build performance | 5x faster builds, 100x faster incremental | Baseline |
| Dev server startup | ~1.2s cold start | ~15s cold start |
| Tailwind features | CSS-first config, @theme directive | JS config only |
| shadcn/ui support | First-class CLI support | Manual installation |
| Future-proof | React ecosystem direction | End of life |
| Migration effort | ~2-4 hours | ~1 hour |
| Risk | Build system change | Known compatibility issues |
| Storybook compat | Works with @tailwindcss/vite | Works with PostCSS |

**Recommendation:** The migration effort to Vite is a one-time cost that unlocks significant benefits. Given that this project is already on modern React 19 and TypeScript 5, the Vite migration is low-risk.

---

## Open Questions

Things that couldn't be fully resolved:

1. **GitHub Pages deployment with Vite**
   - What we know: Vite outputs to `dist/` by default, can be configured to `build/`
   - What's unclear: Does gh-pages script need modification?
   - Recommendation: Configure `build.outDir: "build"` in vite.config.ts to match existing

2. **react-snap compatibility with Vite**
   - What we know: Project uses react-snap for static HTML generation
   - What's unclear: Whether react-snap works with Vite output
   - Recommendation: May need to replace with vite-plugin-ssr or similar; verify in implementation

3. **Storybook 10 + Tailwind v4 via Vite plugin**
   - What we know: Storybook has webpack preset for CRA, Tailwind integration documented
   - What's unclear: Exact config for Storybook 10 + @tailwindcss/vite
   - Recommendation: May need to import compiled CSS rather than use Vite plugin in Storybook

---

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 PostCSS Installation](https://tailwindcss.com/docs/installation/using-postcss) - Official v4 setup
- [Tailwind CSS v4 Announcement](https://tailwindcss.com/blog/tailwindcss-v4) - Feature overview
- [shadcn/ui Vite Installation](https://ui.shadcn.com/docs/installation/vite) - Official guide
- [shadcn/ui Manual Installation](https://ui.shadcn.com/docs/installation/manual) - Configuration details
- [shadcn/ui Tailwind v4 Guide](https://ui.shadcn.com/docs/tailwind-v4) - v4 compatibility
- [Storybook Tailwind Recipe](https://storybook.js.org/recipes/tailwindcss) - Integration steps

### Secondary (MEDIUM confidence)
- [CRA to Vite Migration Guide](https://dev.to/sahi11k/migrating-from-create-react-app-to-vite-a-step-by-step-guide-1b4k) - Community walkthrough
- [Tailwind v3 CRA Guide](https://v3.tailwindcss.com/docs/guides/create-react-app) - Official but for v3
- [shadcn-ui-cra GitHub](https://github.com/ahmadaccino/shadcn-ui-cra) - CRA starter template
- [CSS Modules to Tailwind Migration](https://auslake.vercel.app/blog/migration-tailwindcss) - Real-world experience

### Tertiary (LOW confidence)
- [TailwindCSS 3.4+ CRA Issue #18481](https://github.com/tailwindlabs/tailwindcss/issues/18481) - Known compatibility issue
- [Tailwind v4 CRA Discussion #17232](https://github.com/tailwindlabs/tailwindcss/discussions/17232) - Community solutions

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified via official documentation
- Architecture patterns: HIGH - shadcn/ui official patterns
- Pitfalls: HIGH - Multiple sources confirm CRA/v4 incompatibility
- Migration strategy: MEDIUM - Vite migration well-documented but project-specific

**Research date:** 2026-01-17
**Valid until:** 2026-02-17 (30 days - Tailwind v4 is stable release)
