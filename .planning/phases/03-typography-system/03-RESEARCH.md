# Phase 3: Typography System - Research

**Researched:** 2026-01-17
**Domain:** Typography, Variable Fonts, Fluid Sizing, Tailwind CSS v4
**Confidence:** HIGH

## Summary

This research investigates the requirements for implementing a variable font system with fluid clamp()-based sizing (FOUND-03) for the Random Gorsey website. The current codebase uses static web fonts (Europa family + Tschick Bold) loaded via @font-face declarations with fixed pixel/rem sizing and breakpoint-based responsive adjustments.

The recommended approach is to:
1. Keep existing fonts (Europa/Tschick) but add `font-display: swap` for performance
2. Implement a fluid typography scale using CSS custom properties with clamp() values
3. Extend the existing three-layer token architecture to include typography tokens
4. Create Tailwind v4 @theme-based font-size utilities that generate clamp() values

**Primary recommendation:** Implement a semantic typography token system with fluid clamp() sizing that integrates with the existing Tailwind v4 @theme configuration, keeping current fonts while adding proper font-display optimization.

## Current State Analysis

### Existing Fonts

The project uses four custom fonts located in `src/fonts/`:

| Font | Weight | File Size (woff2) | Purpose |
|------|--------|-------------------|---------|
| Tschick Bold | Bold | 11.4 KB | Headings (h1-h6) |
| Europa Regular | 400 | 20.7 KB | Body text |
| Europa Bold | 700 | 20.8 KB | Emphasized body text |
| Europa Light | 300 | 20.9 KB | Light variant |

**Total font weight:** ~74 KB (woff2 only)

### Current @font-face Configuration

Located in `src/styles/globals.css`:
```css
@font-face {
  font-family: "Europa Bold";
  src: url("../fonts/europa-bold-webfont.woff2") format("woff2"),
    url("../fonts/europa-bold-webfont.woff") format("woff"),
    url("../fonts/europa-bold-webfont.ttf") format("truetype");
}
```

**Issues identified:**
- No `font-display` property (causes FOIT - Flash of Invisible Text)
- Separate font-family names for each weight (Europa Bold, Europa Regular, etc.)
- No font preloading configured in index.html
- Static font families, not variable fonts

### Current Token Configuration

Located in `src/styles/tokens/primitives.css`:
```css
@theme {
  --font-family-tschick-bold: "Tschick Bold", ui-sans-serif, system-ui, sans-serif;
  --font-family-europa: "Europa Regular", ui-sans-serif, system-ui, sans-serif;
  --font-family-europa-bold: "Europa Bold", ui-sans-serif, system-ui, sans-serif;
  --font-family-europa-light: "Europa Light", ui-sans-serif, system-ui, sans-serif;
}
```

### Current Typography Usage

The Heading component already uses some fluid sizing:
```typescript
// src/components/Heading.tsx
level: {
  1: "text-[clamp(2.4rem,5vw,3.4rem)] leading-[1.1]",
  2: "text-[clamp(1.6rem,4vw,2.2rem)] leading-[1.15]",
  3: "text-[1.4rem] leading-[1.2]",  // Not fluid
  ...
}
```

**Issue:** Inconsistent - h1/h2 use clamp(), h3-h6 use fixed sizes.

## Standard Stack

### Core (Keep Existing)

| Library | Version | Purpose | Why Keep |
|---------|---------|---------|----------|
| Europa Regular/Bold/Light | Static | Body typography | Brand identity established |
| Tschick Bold | Static | Display/heading typography | Unique editorial character |
| Tailwind CSS | 4.1.18 | Utility generation | Already integrated |

### Supporting (Add)

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| fontaine (optional) | latest | Fallback font metrics | If CLS from font swap is problematic |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Static Europa | Inter Variable | Inter is free, variable, but loses brand identity |
| Static Europa | Manrope Variable | Similar geometric feel, but different character |
| Custom clamp() | fluid-tailwind plugin | Plugin abstracts away direct control |

**Decision:** Keep existing fonts. Europa and Tschick establish Random Gorsey's visual identity. Variable fonts would require re-establishing brand aesthetics.

## Architecture Patterns

### Recommended Token Structure

Extend the existing three-layer architecture with typography tokens:

```
src/styles/tokens/
├── primitives.css      # Font families, raw size values
├── semantic.css        # Add typography tokens (--text-display, etc.)
├── sections.css        # Section-specific typography overrides (optional)
└── typography.css      # NEW: Fluid type scale definitions
```

### Pattern 1: Fluid Type Scale in @theme

Define fluid font sizes as Tailwind theme variables:

```css
/* src/styles/tokens/typography.css */
@theme {
  /* Fluid type scale - scales between 400px and 1280px viewport */
  --text-display: clamp(2.5rem, 2rem + 2.5vw, 4rem);
  --text-display--line-height: 1.1;
  --text-display--letter-spacing: -0.02em;

  --text-title-lg: clamp(2rem, 1.6rem + 2vw, 3rem);
  --text-title-lg--line-height: 1.15;

  --text-title: clamp(1.5rem, 1.25rem + 1.25vw, 2.25rem);
  --text-title--line-height: 1.2;

  --text-title-sm: clamp(1.25rem, 1.1rem + 0.75vw, 1.75rem);
  --text-title-sm--line-height: 1.25;

  --text-body-lg: clamp(1.125rem, 1rem + 0.5vw, 1.25rem);
  --text-body-lg--line-height: 1.6;

  --text-body: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-body--line-height: 1.6;

  --text-body-sm: clamp(0.875rem, 0.85rem + 0.125vw, 0.9375rem);
  --text-body-sm--line-height: 1.5;

  --text-caption: clamp(0.75rem, 0.725rem + 0.125vw, 0.8125rem);
  --text-caption--line-height: 1.4;
  --text-caption--letter-spacing: 0.02em;

  --text-eyebrow: clamp(0.6875rem, 0.65rem + 0.1875vw, 0.75rem);
  --text-eyebrow--line-height: 1.3;
  --text-eyebrow--letter-spacing: 0.25em;
}
```

**Usage in components:**
```html
<h1 class="text-display font-tschick-bold uppercase">Hero Title</h1>
<p class="text-body font-europa">Body paragraph</p>
```

### Pattern 2: Semantic Typography Mapping

Map semantic names to use cases:

```css
/* In semantic.css */
:root {
  /* Heading typography */
  --typography-h1: var(--text-display);
  --typography-h2: var(--text-title-lg);
  --typography-h3: var(--text-title);
  --typography-h4: var(--text-title-sm);
  --typography-h5: var(--text-body-lg);
  --typography-h6: var(--text-body);

  /* Body typography */
  --typography-body: var(--text-body);
  --typography-body-large: var(--text-body-lg);
  --typography-body-small: var(--text-body-sm);
  --typography-caption: var(--text-caption);
  --typography-eyebrow: var(--text-eyebrow);
}
```

### Pattern 3: Unified Font Family Declaration

Consolidate Europa weights under single font-family:

```css
/* Before: Separate families */
@font-face { font-family: "Europa Bold"; font-weight: 700; ... }
@font-face { font-family: "Europa Regular"; font-weight: 400; ... }

/* After: Single family with weight axis */
@font-face {
  font-family: "Europa";
  font-weight: 300;
  font-display: swap;
  src: url("../fonts/europa-light-webfont.woff2") format("woff2");
}
@font-face {
  font-family: "Europa";
  font-weight: 400;
  font-display: swap;
  src: url("../fonts/europa-regular-webfont.woff2") format("woff2");
}
@font-face {
  font-family: "Europa";
  font-weight: 700;
  font-display: swap;
  src: url("../fonts/europa-bold-webfont.woff2") format("woff2");
}
```

**Benefit:** Use `font-weight: 300/400/700` instead of separate font-family names.

### Anti-Patterns to Avoid

- **Magic numbers in components:** Don't use `text-[1.47rem]` arbitrarily. Use the defined scale tokens.
- **Breakpoint-based sizing for text:** Avoid `text-base md:text-lg lg:text-xl`. Use fluid clamp() instead.
- **Inline clamp() calculations:** Don't repeat `clamp(...)` in every component. Define once in tokens.
- **Separate line-height declarations:** Tailwind v4 supports `--text-*--line-height` for bundled values.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Fluid scaling formula | Custom calc() expressions | `clamp(min, preferred, max)` | clamp() is the standard, well-supported |
| Responsive breakpoints | Media query font-size steps | Single clamp() per size | Less CSS, smoother scaling |
| Fallback font metrics | Manual adjustment | `font-display: swap` (or fontaine if needed) | Browser handles swap gracefully |
| Type scale calculations | Manual math | Fluid Type Scale Calculator | Generates consistent ratios |

**Key insight:** The clamp() function handles all the complexity of responsive typography. Adding media queries on top defeats the purpose and increases maintenance burden.

## Common Pitfalls

### Pitfall 1: WCAG Zoom Compliance Failure

**What goes wrong:** Font sizes don't scale properly when user zooms to 200%, failing WCAG 1.4.4.
**Why it happens:** clamp() maximum is too restrictive relative to minimum.
**How to avoid:** Ensure maximum font size is at least 2x minimum, or use appropriate viewport units.
**Warning signs:** Text appears "frozen" when browser zooms; can't reach target size at 200% zoom.

```css
/* Bad: max is only 1.6x min - may fail zoom test */
font-size: clamp(1rem, 0.5rem + 2vw, 1.6rem);

/* Good: max is 2x min - passes zoom test */
font-size: clamp(1rem, 0.5rem + 2vw, 2rem);
```

### Pitfall 2: Flash of Invisible Text (FOIT)

**What goes wrong:** Text is invisible for 1-3 seconds while fonts load.
**Why it happens:** Missing `font-display` property in @font-face.
**How to avoid:** Add `font-display: swap` to all @font-face declarations.
**Warning signs:** Blank text areas on initial page load, especially on slow connections.

### Pitfall 3: Layout Shift on Font Swap

**What goes wrong:** Text reflows when custom font loads, causing CLS.
**Why it happens:** Fallback font has different metrics than custom font.
**How to avoid:**
1. Preload critical fonts
2. Use fallback fonts with similar metrics
3. Consider `size-adjust` and `ascent-override` if needed
**Warning signs:** Page content "jumps" after initial load.

### Pitfall 4: Viewport Unit Inaccessibility

**What goes wrong:** Text using pure `vw` units becomes too small or too large at extremes.
**Why it happens:** No min/max bounds on viewport-based sizing.
**How to avoid:** Always use clamp(), never raw `vw` for font-size.
**Warning signs:** Unreadable text on very small or very large screens.

### Pitfall 5: Inconsistent Type Scale

**What goes wrong:** Font sizes across the site don't feel harmonious.
**Why it happens:** Ad-hoc size choices without a mathematical scale.
**How to avoid:** Use a consistent scale ratio (1.25 or 1.333 recommended).
**Warning signs:** Some sizes feel "too close" or "too far" from adjacent sizes.

## Code Examples

### Font Face with font-display: swap

```css
/* Source: https://web.dev/articles/font-best-practices */
@font-face {
  font-family: "Europa";
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  src: url("../fonts/europa-regular-webfont.woff2") format("woff2"),
       url("../fonts/europa-regular-webfont.woff") format("woff");
}
```

### Tailwind v4 Theme Font Configuration

```css
/* Source: https://tailwindcss.com/docs/font-family */
@theme {
  --font-display: "Tschick Bold", ui-sans-serif, system-ui, sans-serif;
  --font-body: "Europa", ui-sans-serif, system-ui, sans-serif;
}
```

### Complete Fluid Type Scale

```css
/* Source: https://www.fluid-type-scale.com/ with 1.25 ratio */
@theme {
  /* Step -2: Caption/Fine Print */
  --text-xs: clamp(0.64rem, 0.6rem + 0.2vw, 0.8rem);
  --text-xs--line-height: 1.4;

  /* Step -1: Small Body */
  --text-sm: clamp(0.8rem, 0.75rem + 0.25vw, 1rem);
  --text-sm--line-height: 1.5;

  /* Step 0: Base/Body */
  --text-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --text-base--line-height: 1.6;

  /* Step 1: Large Body / H6 */
  --text-lg: clamp(1.125rem, 1.05rem + 0.375vw, 1.35rem);
  --text-lg--line-height: 1.5;

  /* Step 2: H5 */
  --text-xl: clamp(1.266rem, 1.15rem + 0.58vw, 1.62rem);
  --text-xl--line-height: 1.4;

  /* Step 3: H4 */
  --text-2xl: clamp(1.424rem, 1.27rem + 0.77vw, 1.944rem);
  --text-2xl--line-height: 1.35;

  /* Step 4: H3 */
  --text-3xl: clamp(1.602rem, 1.4rem + 1.01vw, 2.333rem);
  --text-3xl--line-height: 1.25;

  /* Step 5: H2 */
  --text-4xl: clamp(1.802rem, 1.54rem + 1.31vw, 2.8rem);
  --text-4xl--line-height: 1.2;

  /* Step 6: H1/Display */
  --text-5xl: clamp(2.027rem, 1.69rem + 1.69vw, 3.36rem);
  --text-5xl--line-height: 1.1;

  /* Step 7: Hero Display */
  --text-6xl: clamp(2.281rem, 1.85rem + 2.16vw, 4.032rem);
  --text-6xl--line-height: 1.05;
}
```

### Font Preloading in index.html

```html
<!-- Source: https://developer.chrome.com/docs/lighthouse/performance/font-display -->
<head>
  <!-- Preload critical fonts -->
  <link rel="preload" href="/src/fonts/europa-regular-webfont.woff2"
        as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/src/fonts/Tschick-Bold.woff2"
        as="font" type="font/woff2" crossorigin>
</head>
```

### Updated Heading Component Usage

```tsx
// After typography tokens are defined
const headingVariants = cva(
  "m-0 font-display tracking-[0.08em] uppercase",
  {
    variants: {
      level: {
        1: "text-6xl",  // Uses --text-6xl with clamp()
        2: "text-5xl",
        3: "text-4xl",
        4: "text-3xl",
        5: "text-2xl",
        6: "text-xl",
      },
      // ... other variants
    },
  }
);
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Media query breakpoints for font-size | clamp() fluid typography | 2021-2022 | Single declaration, smooth scaling |
| Multiple font files per weight | Variable fonts | 2020-2021 | Smaller total payload, interpolation |
| Generic system fallbacks | Adjusted fallback metrics | 2022-2023 | Reduced CLS on font swap |
| font-display: auto | font-display: swap | 2020 | Eliminated FOIT |

**Note:** Variable fonts are ideal but require font files that support variation axes. Europa and Tschick are static fonts, so this optimization would require sourcing new font files.

## Open Questions

### 1. Variable Font Upgrade

**What we know:** Europa and Tschick are static fonts with separate files per weight.
**What's unclear:** Whether variable versions exist or if alternatives should be sourced.
**Recommendation:** Keep static fonts for Phase 3. Variable font migration could be a separate future enhancement if needed.

### 2. Font Subsetting

**What we know:** Current fonts are ~20KB each (woff2). Could be smaller with subsetting.
**What's unclear:** What character sets are actually used on the site.
**Recommendation:** Defer subsetting optimization. Current total (~74KB) is acceptable.

### 3. Section-Specific Typography

**What we know:** sections.css already supports section-scoped color tokens.
**What's unclear:** Whether typography should also vary by section.
**Recommendation:** Start with global typography tokens. Section overrides can be added later if needed.

## Sources

### Primary (HIGH confidence)

- [Tailwind CSS v4 font-size documentation](https://tailwindcss.com/docs/font-size) - Theme variable configuration
- [Tailwind CSS v4 font-family documentation](https://tailwindcss.com/docs/font-family) - @theme font configuration
- [Tailwind CSS v4 theme documentation](https://tailwindcss.com/docs/theme) - @theme directive usage

### Secondary (MEDIUM confidence)

- [Smashing Magazine: Modern Fluid Typography Using CSS Clamp](https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/) - clamp() patterns
- [web.dev: Fluid Typography with Baseline CSS](https://web.dev/articles/baseline-in-action-fluid-type) - Modern fluid type approach
- [Chrome Developers: font-display](https://developer.chrome.com/docs/lighthouse/performance/font-display) - Font loading optimization
- [Fluid Type Scale Calculator](https://www.fluid-type-scale.com/) - Type scale generation tool
- [CSS-Tricks: font-display](https://css-tricks.com/almanac/properties/f/font-display/) - font-display values explained

### Tertiary (LOW confidence - for reference)

- [GitHub tailwindcss discussions](https://github.com/tailwindlabs/tailwindcss/discussions/13890) - Community patterns for custom fonts
- [David Hellmann: tailwindcss-fluid-type plugin](https://github.com/davidhellmann/tailwindcss-fluid-type) - Plugin approach (not recommended for this project)

## Metadata

**Confidence breakdown:**

| Area | Level | Reason |
|------|-------|--------|
| Fluid typography with clamp() | HIGH | Verified with Tailwind docs and multiple authoritative sources |
| Tailwind v4 @theme configuration | HIGH | Official documentation verified |
| font-display: swap | HIGH | Web.dev and Chrome DevTools documentation |
| Font preloading | MEDIUM | Multiple sources agree, but implementation depends on build setup |
| Type scale ratios | MEDIUM | Multiple tools recommend 1.25-1.333 but final values need testing |

**Research date:** 2026-01-17
**Valid until:** 2026-03-17 (60 days - typography patterns are stable)
