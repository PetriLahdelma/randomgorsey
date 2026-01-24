# Phase 2: Token Architecture - Research

**Researched:** 2026-01-17
**Domain:** CSS design tokens, Tailwind v4 @theme directive, cascade layers, section-scoped theming
**Confidence:** HIGH

## Summary

This research addresses how to implement a three-layer token architecture (primitives -> semantics -> section-scoped) in Tailwind CSS v4, establish section personality via `data-section` attributes, and organize CSS with `@layer` for predictable cascade behavior.

Tailwind v4's CSS-first configuration via `@theme` is well-suited for this architecture. The key insight is that `@theme` creates both utility classes AND CSS variables, while regular CSS variables in `:root` or scoped selectors provide the override mechanism for section-specific tokens. The cascade layer order `theme, base, components, utilities` is built into Tailwind v4, with utilities always overriding components and base styles.

**Primary recommendation:** Define primitive tokens in `@theme` (creating utilities), semantic tokens as CSS variables referencing primitives, and section overrides using `[data-section="name"]` selectors in `@layer base` that redefine semantic tokens.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | v4.1.18 | CSS framework with @theme directive | Already installed, CSS-first token system |
| CSS Custom Properties | Native | Token values and scoping | Browser-native, cascading, dynamic |
| CSS Cascade Layers | Native | Predictable specificity | Built into Tailwind v4 |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| class-variance-authority | 0.7.1 | Component variant management | Already used by shadcn/ui components |
| tailwind-merge | 3.4.0 | Merge Tailwind classes safely | Already in cn() utility |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| CSS variables | Style Dictionary | More tooling, overkill for this project size |
| @theme in CSS | JS config file | V3 pattern, loses CSS-first benefits |
| data-section | CSS classes | Classes work but data attributes are more semantic for state |

**Installation:**
```bash
# No additional packages needed - all tools already installed
```

## Architecture Patterns

### Recommended Project Structure
```
src/styles/
├── globals.css           # Main entry point with @import "tailwindcss"
├── tokens/
│   ├── primitives.css    # @theme directive - raw values, creates utilities
│   ├── semantic.css      # Semantic mappings (var references)
│   └── sections.css      # [data-section] scoped overrides
└── layers/
    └── base.css          # @layer base styles (typography, resets)
```

### Pattern 1: Three-Layer Token Architecture

**What:** Hierarchical token system where primitive tokens define raw values, semantic tokens assign meaning, and section tokens override semantics per context.

**When to use:** Always - this is the foundation for the entire token system.

**Example:**
```css
/* primitives.css - Source: Tailwind v4 @theme directive */
@theme {
  /* Primitive color palette - creates utilities like bg-neutral-950 */
  --color-neutral-50: oklch(0.985 0 0);
  --color-neutral-100: oklch(0.970 0 0);
  --color-neutral-950: oklch(0.145 0 0);

  /* Primitive spacing scale */
  --spacing: 0.25rem;  /* Base unit creates p-1, p-2, p-4, etc. */

  /* Primitive radius values */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.625rem;
}

/* semantic.css - CSS variables with meaning */
:root {
  /* Semantic color assignments */
  --color-background: var(--color-neutral-50);
  --color-foreground: var(--color-neutral-950);
  --color-surface: var(--color-neutral-100);
  --color-surface-elevated: var(--color-white);

  /* Semantic spacing */
  --space-section: calc(var(--spacing) * 24);  /* 6rem */
  --space-element: calc(var(--spacing) * 4);   /* 1rem */
}

/* sections.css - Context-specific overrides */
[data-section="hero"] {
  --color-background: var(--color-neutral-950);
  --color-foreground: var(--color-neutral-50);
  --space-section: calc(var(--spacing) * 32);  /* 8rem for hero */
}

[data-section="gallery"] {
  --color-background: var(--color-neutral-100);
  --space-element: calc(var(--spacing) * 6);   /* 1.5rem for gallery */
}

[data-section="listen"] {
  --color-background: oklch(0.15 0.02 270);    /* Slight blue tint */
  --color-foreground: var(--color-neutral-50);
}
```

### Pattern 2: Section Personality via data-section

**What:** Using `data-section` attributes on container elements to scope token overrides.

**When to use:** When sections need distinct visual personalities that differ from global tokens.

**Example:**
```tsx
// Source: Project requirements FOUND-02
// Page component applying section context
const Gallery: React.FC = () => {
  return (
    <section data-section="gallery" className="min-h-screen">
      {/* All children inherit gallery's token overrides */}
      <div className="bg-background text-foreground">
        {/* Uses [data-section="gallery"] overrides */}
      </div>
    </section>
  );
};
```

```css
/* CSS implementation */
@layer base {
  [data-section="gallery"] {
    /* Override semantic tokens for gallery context */
    --color-background: var(--color-neutral-100);
    --color-surface: var(--color-white);
    --color-accent: oklch(0.72 0.11 178);  /* Gallery-specific accent */
  }
}
```

### Pattern 3: @layer Organization

**What:** CSS cascade layers ensure predictable specificity regardless of selector complexity.

**When to use:** Always - this is built into Tailwind v4's architecture.

**Example:**
```css
/* globals.css - Source: Tailwind v4 documentation */
@import "tailwindcss";

/* Import token files - order matters for cascade */
@import "./tokens/primitives.css";
@import "./tokens/semantic.css";
@import "./tokens/sections.css";

/* Tailwind v4 layer order: theme, base, components, utilities */
@layer base {
  /* Base element styles */
  body {
    @apply text-foreground;
    font-family: var(--font-family-europa);
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-family-tschick-bold);
  }

  /* Section token overrides live in base layer */
  [data-section] {
    /* Sections apply semantic tokens as backgrounds */
    background-color: var(--color-background);
    color: var(--color-foreground);
  }
}

@layer components {
  /* Component-level styles that can be overridden by utilities */
  .card {
    background-color: var(--color-surface);
    border-radius: var(--radius-lg);
    padding: var(--space-element);
  }
}

/* Utilities layer is handled by Tailwind automatically */
```

### Anti-Patterns to Avoid
- **Hard-coding colors in utilities:** Use `bg-background` not `bg-neutral-50` for themeable elements
- **Deep CSS nesting for section styles:** Use flat `[data-section="name"]` selectors
- **!important overrides:** Cascade layers eliminate this need
- **Mixing semantic and primitive in same selector:** Keep layers distinct
- **Defining tokens in @layer components:** Tokens belong in @theme or :root

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Token organization | Custom JSON→CSS pipeline | @theme directive | Native Tailwind v4, generates utilities |
| Class merging | String concatenation | cn() with tailwind-merge | Handles conflicts, deduplication |
| Variant management | Conditional className logic | CVA (class-variance-authority) | Type-safe, composable variants |
| Cascade management | Specificity hacks | @layer directive | Browser-native, predictable |
| Dark mode tokens | Separate token files | .dark selector overrides | shadcn/ui pattern, works with system preference |

**Key insight:** Tailwind v4's CSS-first approach means the token system IS the CSS. No build step, no transformation - just CSS variables and the @theme directive.

## Common Pitfalls

### Pitfall 1: Mixing @theme and :root Token Definitions
**What goes wrong:** Defining the same token in both @theme and :root causes confusion about which creates utilities and which is just a variable.
**Why it happens:** @theme looks like :root but has different behavior.
**How to avoid:**
- Use `@theme` ONLY for primitive tokens that need corresponding utilities
- Use `:root` for semantic tokens that reference primitives
- Use `[data-section]` for section overrides
**Warning signs:** Duplicate token names in different places, utilities not working as expected.

### Pitfall 2: Section Styles Overriding Utility Classes
**What goes wrong:** Styles in `[data-section]` selectors override Tailwind utilities unexpectedly.
**Why it happens:** Misunderstanding cascade layer order or using too-specific selectors.
**How to avoid:**
- Section overrides should only redefine CSS variables, not apply styles directly
- Use `@layer base` for section token overrides (utilities always win)
- Never use !important in section selectors
**Warning signs:** `bg-white` not working inside a section, having to use !important.

### Pitfall 3: Forgetting Foreground Tokens
**What goes wrong:** Section changes background color but text becomes unreadable.
**Why it happens:** Only overriding --color-background without --color-foreground.
**How to avoid:**
- Always define foreground when defining background
- Use semantic pairs: background/foreground, surface/surface-foreground
- Test each section with high contrast mode
**Warning signs:** Text disappearing or low contrast in sections.

### Pitfall 4: Token Naming Conflicts with Tailwind
**What goes wrong:** Custom token names conflict with Tailwind's built-in utilities.
**Why it happens:** Using names like `--color-red` that Tailwind already defines.
**How to avoid:**
- Check Tailwind's default theme before naming
- Use project-specific prefixes for custom primitives
- Rely on semantic names (--color-destructive not --color-red)
**Warning signs:** Unexpected colors appearing, utilities generating wrong values.

### Pitfall 5: Nesting data-section Attributes
**What goes wrong:** Nested sections inherit parent's tokens unexpectedly.
**Why it happens:** CSS cascade - child elements inherit parent variables.
**How to avoid:**
- Design sections as top-level containers, not nested
- If nesting is needed, explicitly reset all tokens in child section
- Consider using CSS `@scope` (future) or BEM-style isolation
**Warning signs:** Inner section has wrong colors, token values "bleeding through".

## Code Examples

Verified patterns from official sources:

### Complete Token File Structure
```css
/* src/styles/tokens/primitives.css */
/* Source: Tailwind v4 @theme documentation */
@theme {
  /* Color primitives - oklch for perceptual uniformity */
  --color-neutral-50: oklch(0.985 0 0);
  --color-neutral-100: oklch(0.970 0 0);
  --color-neutral-200: oklch(0.922 0 0);
  --color-neutral-300: oklch(0.870 0 0);
  --color-neutral-400: oklch(0.708 0 0);
  --color-neutral-500: oklch(0.556 0 0);
  --color-neutral-600: oklch(0.439 0 0);
  --color-neutral-700: oklch(0.371 0 0);
  --color-neutral-800: oklch(0.269 0 0);
  --color-neutral-900: oklch(0.205 0 0);
  --color-neutral-950: oklch(0.145 0 0);

  /* Accent colors */
  --color-yellow-400: oklch(0.88 0.17 85);
  --color-magenta-500: oklch(0.65 0.28 328);
  --color-blue-500: oklch(0.62 0.21 255);

  /* Spacing base (creates p-1, p-2, p-4, etc.) */
  --spacing: 0.25rem;

  /* Radius scale */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.625rem;
  --radius-xl: 1rem;
  --radius-2xl: 1.5rem;

  /* Font families */
  --font-family-tschick-bold: "Tschick Bold", ui-sans-serif, system-ui, sans-serif;
  --font-family-europa: "Europa Regular", ui-sans-serif, system-ui, sans-serif;
  --font-family-europa-bold: "Europa Bold", ui-sans-serif, system-ui, sans-serif;
  --font-family-europa-light: "Europa Light", ui-sans-serif, system-ui, sans-serif;

  /* Animation */
  --animate-duration: 200ms;
  --ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Semantic Token Layer
```css
/* src/styles/tokens/semantic.css */
/* Source: Design token best practices - penpot.app, CSS-Tricks */
:root {
  /* Semantic color mappings */
  --color-background: var(--color-neutral-50);
  --color-foreground: var(--color-neutral-950);
  --color-surface: var(--color-neutral-100);
  --color-surface-foreground: var(--color-neutral-900);
  --color-surface-elevated: var(--color-white);
  --color-surface-elevated-foreground: var(--color-neutral-950);

  /* Interactive states */
  --color-primary: var(--color-neutral-900);
  --color-primary-foreground: var(--color-neutral-50);
  --color-secondary: var(--color-neutral-200);
  --color-secondary-foreground: var(--color-neutral-900);
  --color-accent: var(--color-yellow-400);
  --color-accent-foreground: var(--color-neutral-950);

  /* Feedback colors */
  --color-destructive: oklch(0.577 0.245 27.325);
  --color-destructive-foreground: var(--color-neutral-50);
  --color-success: oklch(0.723 0.219 142.136);
  --color-success-foreground: var(--color-neutral-50);

  /* UI elements */
  --color-border: var(--color-neutral-200);
  --color-input: var(--color-neutral-200);
  --color-ring: var(--color-neutral-400);
  --color-muted: var(--color-neutral-100);
  --color-muted-foreground: var(--color-neutral-500);

  /* Semantic spacing */
  --space-page: calc(var(--spacing) * 6);      /* 1.5rem - page padding */
  --space-section: calc(var(--spacing) * 16);  /* 4rem - between sections */
  --space-element: calc(var(--spacing) * 4);   /* 1rem - between elements */
  --space-inline: calc(var(--spacing) * 2);    /* 0.5rem - inline spacing */
}

/* Dark mode semantic overrides */
.dark {
  --color-background: var(--color-neutral-950);
  --color-foreground: var(--color-neutral-50);
  --color-surface: var(--color-neutral-900);
  --color-surface-foreground: var(--color-neutral-100);
  --color-surface-elevated: var(--color-neutral-800);
  --color-surface-elevated-foreground: var(--color-neutral-50);

  --color-primary: var(--color-neutral-50);
  --color-primary-foreground: var(--color-neutral-900);
  --color-secondary: var(--color-neutral-800);
  --color-secondary-foreground: var(--color-neutral-100);

  --color-border: var(--color-neutral-800);
  --color-input: var(--color-neutral-800);
  --color-ring: var(--color-neutral-600);
  --color-muted: var(--color-neutral-800);
  --color-muted-foreground: var(--color-neutral-400);
}
```

### Section-Scoped Token Overrides
```css
/* src/styles/tokens/sections.css */
/* Source: Requirements FOUND-02, section personality system */
@layer base {
  /* Hero section - dramatic, high contrast */
  [data-section="hero"] {
    --color-background: var(--color-neutral-950);
    --color-foreground: var(--color-neutral-50);
    --color-surface: var(--color-neutral-900);
    --color-surface-foreground: var(--color-neutral-100);
    --color-accent: var(--color-yellow-400);
    --color-accent-foreground: var(--color-neutral-950);
    --space-section: calc(var(--spacing) * 24);  /* Extra breathing room */
  }

  /* Gallery section - light, airy */
  [data-section="gallery"] {
    --color-background: var(--color-neutral-100);
    --color-foreground: var(--color-neutral-900);
    --color-surface: var(--color-white);
    --color-surface-foreground: var(--color-neutral-950);
    --color-accent: var(--color-magenta-500);
    --space-element: calc(var(--spacing) * 6);  /* More space between images */
  }

  /* Listen section - moody, immersive */
  [data-section="listen"] {
    --color-background: oklch(0.12 0.015 280);  /* Slight purple tint */
    --color-foreground: var(--color-neutral-100);
    --color-surface: oklch(0.18 0.02 280);
    --color-surface-foreground: var(--color-neutral-50);
    --color-accent: var(--color-blue-500);
  }

  /* Contact section - professional, clean */
  [data-section="contact"] {
    --color-background: var(--color-white);
    --color-foreground: var(--color-neutral-900);
    --color-surface: var(--color-neutral-50);
    --color-surface-foreground: var(--color-neutral-800);
    --color-primary: var(--color-neutral-950);
    --color-primary-foreground: var(--color-white);
  }

  /* About section - warm, personal */
  [data-section="about"] {
    --color-background: oklch(0.98 0.01 60);  /* Warm off-white */
    --color-foreground: var(--color-neutral-900);
    --color-accent: oklch(0.72 0.14 50);  /* Warm accent */
  }
}
```

### Using Tokens in Components
```tsx
// Source: shadcn/ui component patterns
// Button component using semantic tokens
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
  // Base styles use semantic tokens
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-border bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Component automatically adapts to section context
// Inside [data-section="hero"], primary becomes light-on-dark
// Inside [data-section="contact"], primary becomes dark-on-light
```

### Page Component with Section Context
```tsx
// Source: Project page structure analysis
import React from "react";

const Listen: React.FC = () => {
  return (
    <main data-section="listen" className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-[var(--space-page)]">
        <h1 className="text-foreground">Listen to Music</h1>
        {/* All components inside inherit listen section's tokens */}
        <div className="bg-surface rounded-lg p-[var(--space-element)]">
          {/* Card uses surface color from listen section context */}
        </div>
      </div>
    </main>
  );
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| JS config file (tailwind.config.js) | CSS-first @theme directive | Tailwind v4 (Jan 2025) | Tokens defined in CSS, not JS |
| HSL color format | OKLCH color format | Tailwind v4 / shadcn/ui 2025 | Better perceptual uniformity |
| @tailwind directives | @import "tailwindcss" | Tailwind v4 | Single import, cleaner CSS |
| Plugin-based customization | @layer and @utility | Tailwind v4 | Native CSS features |
| Specificity wars | CSS Cascade Layers | Tailwind v4 | Predictable cascade |

**Deprecated/outdated:**
- `@tailwind base/components/utilities` - replaced by single @import
- JS-based theme extension - use @theme directive instead
- HSL color values - OKLCH preferred for modern displays
- !important overrides - use @layer instead

## Open Questions

Things that couldn't be fully resolved:

1. **Nested Section Behavior**
   - What we know: CSS variables cascade to children, [data-section] overrides work
   - What's unclear: Best pattern if sections need to nest (hero within gallery)
   - Recommendation: Design pages to avoid nesting; if needed, explicitly reset tokens in inner section

2. **Animation Token Scope**
   - What we know: @theme supports --animate-* and --ease-* namespaces
   - What's unclear: How section-scoped animation timing should work
   - Recommendation: Keep animation tokens global for Phase 4 (Motion Foundation), defer section-specific timing

3. **Dark Mode + Section Interaction**
   - What we know: .dark selector works for global dark mode
   - What's unclear: Should sections have dark mode variants? (e.g., [data-section="hero"].dark)
   - Recommendation: Start with global dark mode only; section personalities override both modes

## Sources

### Primary (HIGH confidence)
- [Tailwind CSS v4 Theme Variables](https://tailwindcss.com/docs/theme) - @theme directive, namespaces, overrides
- [Tailwind CSS v4 Functions and Directives](https://tailwindcss.com/docs/functions-and-directives) - @layer, @utility, @variant
- [Tailwind CSS v4 Adding Custom Styles](https://tailwindcss.com/docs/adding-custom-styles) - @layer base/components/utilities
- [shadcn/ui Tailwind v4](https://ui.shadcn.com/docs/tailwind-v4) - @theme inline, color configuration

### Secondary (MEDIUM confidence)
- [CSS-Tricks: Theming With Variables](https://css-tricks.com/theming-with-variables-globals-and-locals/) - Global vs local CSS variable patterns
- [Chromatic: Scoped Theming](https://chromatichq.com/insights/scoped-theming-css-variables/) - Section-based variable scoping
- [Wawandco: Multiple Portals with Tailwind](https://wawand.co/blog/posts/managing-multiple-portals-with-tailwind/) - Context-driven theming in Tailwind v4
- [Penpot: Design Tokens and CSS Variables](https://penpot.app/blog/the-developers-guide-to-design-tokens-and-css-variables/) - Three-tier token architecture

### Tertiary (LOW confidence)
- Medium articles on Tailwind v4 theming - General patterns verified against official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Using installed tools, official Tailwind v4 documentation
- Architecture: HIGH - Patterns verified against official docs and working examples
- Pitfalls: MEDIUM - Based on common issues in community discussions, some extrapolated

**Research date:** 2026-01-17
**Valid until:** 2026-03-17 (Tailwind v4 is stable, patterns unlikely to change)
