# Architecture Research: Creative Experimental Website

**Project:** Random Gorsey Artist Portfolio
**Researched:** 2026-01-17
**Focus:** Design system architecture for maximum creative expression while maintaining code quality

## Executive Summary

The challenge: Transform a functional but generic React component library into a bold, experimental design system without creating chaos. The solution is a **layered architecture** that separates *foundations* (consistency, code quality) from *expressions* (creative flexibility, section personalities).

This architecture enables:
- Bold visual identity through expanded design tokens
- Section-specific "personalities" via scoped CSS custom properties
- Coherent animation orchestration through centralized motion configs
- Creative layouts without abandoning structure

**Key insight:** Expression emerges from constraint, not absence of it. The architecture must provide rich constraints (comprehensive tokens, motion presets, composition patterns) that channel creativity rather than restrict it.

---

## Design System Architecture

### Current State Analysis

The existing `variables.css` defines 17 color tokens with basic naming:
```css
:root {
  --color-dark: #282c34;
  --color-white: #fff;
  --color-blue: #00f;
  /* ... basic colors */
}
```

**Limitations for creative expression:**
1. Flat token structure (no semantic layers)
2. No typography tokens
3. No spacing/rhythm tokens
4. No animation/motion tokens
5. No section-scoped variations

### Recommended Token Architecture

Structure tokens in **three layers** for maximum flexibility:

```
Layer 1: Primitives (raw values)
    |
Layer 2: Semantics (purpose-driven aliases)
    |
Layer 3: Components (scoped overrides)
```

#### Layer 1: Primitive Tokens

Raw values with no implied meaning. These never change based on context.

```css
:root {
  /* === COLORS: Primitives === */
  --black: #000;
  --white: #fff;
  --gray-100: #f5f5f5;
  --gray-200: #e0e0e0;
  --gray-300: #ccc;
  --gray-400: #999;
  --gray-500: #666;
  --gray-600: #333;
  --gray-900: #111;

  /* Brand palette - expressive colors */
  --yellow-vivid: #FFD600;
  --yellow-muted: #D4B300;
  --blue-electric: #0066FF;
  --blue-deep: #001AFF;
  --magenta-hot: #FF00AA;
  --green-neon: #00FF66;
  --red-signal: #FF3333;

  /* === TYPOGRAPHY: Primitives === */
  --font-display: "Tschick Bold", sans-serif;
  --font-body: "Europa Regular", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 2rem;      /* 32px */
  --text-4xl: 2.5rem;    /* 40px */
  --text-5xl: 3rem;      /* 48px */
  --text-6xl: 4rem;      /* 64px */
  --text-7xl: 5rem;      /* 80px */

  /* === SPACING: Primitives === */
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-3: 0.75rem;    /* 12px */
  --space-4: 1rem;       /* 16px */
  --space-5: 1.25rem;    /* 20px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-10: 2.5rem;    /* 40px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  --space-20: 5rem;      /* 80px */
  --space-24: 6rem;      /* 96px */

  /* === MOTION: Primitives === */
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --duration-slower: 700ms;
  --duration-glacial: 1000ms;

  --ease-default: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
}
```

#### Layer 2: Semantic Tokens

Purpose-driven aliases that CAN change based on context (themes, sections).

```css
:root {
  /* === SURFACE COLORS === */
  --surface-base: var(--black);
  --surface-elevated: var(--gray-900);
  --surface-overlay: rgba(0, 0, 0, 0.92);
  --surface-inverted: var(--white);

  /* === TEXT COLORS === */
  --text-primary: var(--white);
  --text-secondary: var(--gray-400);
  --text-muted: var(--gray-500);
  --text-accent: var(--yellow-vivid);
  --text-inverted: var(--black);

  /* === INTERACTIVE COLORS === */
  --interactive-primary: var(--blue-electric);
  --interactive-hover: var(--blue-deep);
  --interactive-focus: var(--yellow-vivid);
  --interactive-danger: var(--red-signal);
  --interactive-success: var(--green-neon);

  /* === BORDER COLORS === */
  --border-subtle: rgba(255, 255, 255, 0.1);
  --border-default: rgba(255, 255, 255, 0.2);
  --border-strong: rgba(255, 255, 255, 0.4);
  --border-accent: var(--yellow-vivid);

  /* === TYPOGRAPHY SEMANTICS === */
  --heading-font: var(--font-display);
  --body-font: var(--font-body);
  --heading-weight: 700;
  --body-weight: 400;
  --heading-tracking: 0.05em;
  --body-tracking: 0.01em;
  --heading-leading: 1.1;
  --body-leading: 1.6;

  /* === SPACING SEMANTICS === */
  --content-padding: var(--space-6);
  --section-gap: var(--space-16);
  --element-gap: var(--space-4);
  --tight-gap: var(--space-2);
}
```

#### Layer 3: Section Scoping (The Creative Layer)

This is where expression happens. Different sections can redefine semantic tokens to create distinct "personalities" without chaos.

```css
/* === SECTION: Hero === */
[data-section="hero"] {
  --text-primary: var(--white);
  --text-accent: var(--yellow-vivid);
  --heading-size: var(--text-7xl);
  --surface-base: transparent;
  --content-padding: var(--space-20);
}

/* === SECTION: Gallery === */
[data-section="gallery"] {
  --text-primary: var(--white);
  --surface-base: var(--black);
  --element-gap: var(--space-4);
  --surface-elevated: rgba(255, 255, 255, 0.05);
}

/* === SECTION: Listen (Music) === */
[data-section="listen"] {
  --text-accent: var(--magenta-hot);
  --interactive-primary: var(--magenta-hot);
  --border-accent: var(--magenta-hot);
  --surface-base: var(--gray-900);
}

/* === SECTION: Contact === */
[data-section="contact"] {
  --text-accent: var(--green-neon);
  --interactive-primary: var(--green-neon);
  --interactive-focus: var(--green-neon);
}
```

**Why this works:** Components use semantic tokens, which resolve to different primitives based on their section context. One Button component works everywhere but feels unique in each section.

### CSS Cascade Layers Architecture

Use CSS `@layer` to organize styles with predictable override behavior:

```css
/* styles/index.css - Layer declaration (order matters!) */
@layer reset, tokens, base, layouts, components, patterns, utilities, overrides;

/* === LAYER: reset === */
@layer reset {
  /* CSS reset / normalize */
}

/* === LAYER: tokens === */
@layer tokens {
  :root { /* All primitive and semantic tokens */ }
}

/* === LAYER: base === */
@layer base {
  /* Element defaults: body, h1-h6, p, a, etc. */
  body {
    font-family: var(--body-font);
    color: var(--text-primary);
    background: var(--surface-base);
  }
}

/* === LAYER: layouts === */
@layer layouts {
  /* Layout primitives: Stack, Cluster, Grid, etc. */
}

/* === LAYER: components === */
@layer components {
  /* Component styles: Button, Surface, Heading, etc. */
}

/* === LAYER: patterns === */
@layer patterns {
  /* Pattern compositions: Header, Footer, PostCard */
}

/* === LAYER: utilities === */
@layer utilities {
  /* Single-purpose helpers */
}

/* === LAYER: overrides === */
@layer overrides {
  /* Section-specific overrides, one-offs */
}
```

**Confidence: HIGH** - CSS `@layer` is supported in all modern browsers (Chrome 99+, Firefox 97+, Safari 15.4+) and is the recommended approach for design system CSS organization per [CSS-Tricks](https://css-tricks.com/organizing-design-system-component-patterns-with-css-cascade-layers/).

---

## Component Patterns

### Current Pattern Analysis

Existing components use a solid foundation:
- Polymorphic `as` prop (Surface, Heading)
- CSS Modules for scoping
- BaseComponentProps for consistency
- TypeScript interfaces

**Gap:** Components are designed for consistency, not variation. They need patterns that enable creative composition.

### Compound Component Pattern

For complex, flexible UI elements that share state:

```tsx
// Example: Expressive Card with shared context
interface CardContextValue {
  variant: 'default' | 'featured' | 'minimal';
  isHovered: boolean;
}

const CardContext = createContext<CardContextValue | null>(null);

const Card = ({ variant = 'default', children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <CardContext.Provider value={{ variant, isHovered }}>
      <Surface
        variant={variant === 'featured' ? 'raised' : 'flat'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {children}
      </Surface>
    </CardContext.Provider>
  );
};

Card.Image = ({ src, alt }) => {
  const { isHovered } = useContext(CardContext);
  return (
    <motion.img
      src={src}
      alt={alt}
      animate={{ scale: isHovered ? 1.05 : 1 }}
    />
  );
};

Card.Title = ({ children }) => <Heading level={3}>{children}</Heading>;
Card.Body = ({ children }) => <Text>{children}</Text>;
Card.Actions = ({ children }) => <div className={styles.actions}>{children}</div>;

// Usage - flexible composition
<Card variant="featured">
  <Card.Image src="..." alt="..." />
  <Card.Title>Bold Title</Card.Title>
  <Card.Body>Description</Card.Body>
  <Card.Actions>
    <Button>View</Button>
  </Card.Actions>
</Card>
```

### Slot Pattern for Layout Flexibility

Enable creative layouts without prop explosion:

```tsx
interface SectionProps {
  children: React.ReactNode;
  personality?: 'hero' | 'gallery' | 'listen' | 'contact' | 'default';
}

const Section = ({ children, personality = 'default' }: SectionProps) => {
  return (
    <section data-section={personality} className={styles.section}>
      {children}
    </section>
  );
};

// Slot components for layout regions
Section.Background = ({ children }) => (
  <div className={styles.background}>{children}</div>
);

Section.Content = ({ width = 'default', children }) => (
  <div className={cn(styles.content, styles[width])}>{children}</div>
);

Section.Overlay = ({ children }) => (
  <div className={styles.overlay}>{children}</div>
);

// Usage - each page composes differently
<Section personality="hero">
  <Section.Background>
    <video autoPlay muted loop src="..." />
  </Section.Background>
  <Section.Overlay>
    <GradientMask />
  </Section.Overlay>
  <Section.Content width="narrow">
    <Heading level={1}>Random Gorsey</Heading>
  </Section.Content>
</Section>
```

### Polymorphic Component Enhancement

Extend existing polymorphic pattern for more expression:

```tsx
// Enhanced Heading with display variants
interface HeadingProps<T extends React.ElementType> {
  as?: T;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  tone?: 'light' | 'dark' | 'accent' | 'gradient';
  display?: 'default' | 'hero' | 'section' | 'label';
  animate?: boolean;
  children: React.ReactNode;
}

// Gradient text for hero moments
const gradientStyles = {
  backgroundImage: 'linear-gradient(135deg, var(--yellow-vivid), var(--magenta-hot))',
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
};
```

### Layout Primitives

Create foundational layout components that enable creative composition:

```tsx
// Stack: Vertical rhythm
interface StackProps {
  gap?: Spacing;
  align?: 'start' | 'center' | 'end' | 'stretch';
  children: React.ReactNode;
}

// Cluster: Horizontal grouping with wrap
interface ClusterProps {
  gap?: Spacing;
  justify?: 'start' | 'center' | 'end' | 'between';
  children: React.ReactNode;
}

// Grid: Responsive grid with named areas
interface GridProps {
  columns?: number | 'auto-fit' | 'auto-fill';
  minWidth?: string;
  gap?: Spacing;
  children: React.ReactNode;
}

// Bleed: Break out of container (for full-width sections)
interface BleedProps {
  horizontal?: boolean;
  vertical?: boolean;
  children: React.ReactNode;
}
```

**Confidence: HIGH** - These patterns are well-documented in [Frontend Mastery](https://frontendmastery.com/posts/advanced-react-component-composition-guide/) and align with React 19 best practices.

---

## Animation Architecture

### Current State

The codebase uses Framer Motion inconsistently:
- Some pages use `motion.div` with inline animation configs
- iOS detection disables animations entirely
- No shared motion presets or orchestration

### Centralized Motion Configuration

Create a single source of truth for animation behaviors:

```tsx
// src/motion/config.ts

// === SPRING PRESETS ===
export const springs = {
  // Snappy interactions (buttons, toggles)
  snappy: { stiffness: 400, damping: 30, mass: 1 },

  // Default UI transitions
  default: { stiffness: 100, damping: 15, mass: 1 },

  // Gentle, organic movement
  gentle: { stiffness: 50, damping: 15, mass: 1 },

  // Bouncy, playful (use sparingly)
  bouncy: { stiffness: 300, damping: 10, mass: 1 },

  // Smooth page transitions
  page: { stiffness: 80, damping: 20, mass: 1 },

  // Heavy, dramatic (hero elements)
  dramatic: { stiffness: 60, damping: 12, mass: 2 },
} as const;

// === DURATION PRESETS (for tween) ===
export const durations = {
  instant: 0,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.7,
  glacial: 1.0,
} as const;

// === EASE PRESETS ===
export const eases = {
  default: [0.4, 0, 0.2, 1],
  in: [0.4, 0, 1, 1],
  out: [0, 0, 0.2, 1],
  inOut: [0.4, 0, 0.2, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
} as const;
```

### Variant System for Orchestration

Define reusable variant sets for common patterns:

```tsx
// src/motion/variants.ts
import { Variants } from 'framer-motion';
import { springs, durations } from './config';

// === PAGE TRANSITIONS ===
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.page }
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: durations.fast }
  },
};

// === STAGGER CONTAINERS ===
export const staggerContainer: Variants = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// === STAGGER ITEMS ===
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.default }
  },
  exit: { opacity: 0, y: -10 },
};

// === REVEAL ON SCROLL ===
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.gentle }
  },
};

// === HOVER LIFT ===
export const hoverLift: Variants = {
  rest: { y: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' },
  hover: {
    y: -4,
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    transition: { type: 'spring', ...springs.snappy }
  },
};

// === SCALE TAP ===
export const scaleTap: Variants = {
  rest: { scale: 1 },
  tap: { scale: 0.97 },
};

// === HERO ENTRANCE ===
export const heroVariants: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 30 },
  enter: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      ...springs.dramatic,
      delay: 0.2,
    },
  },
};
```

### Gesture Configuration

Standardize gesture behaviors:

```tsx
// src/motion/gestures.ts

// === DRAG CONFIGS ===
export const dragConfigs = {
  // Constrained drag (within bounds)
  bounded: {
    drag: true,
    dragConstraints: { top: 0, bottom: 0, left: 0, right: 0 },
    dragElastic: 0.1,
  },

  // Free drag with momentum
  free: {
    drag: true,
    dragMomentum: true,
    dragTransition: { bounceStiffness: 300, bounceDamping: 20 },
  },

  // Horizontal only (carousels)
  horizontal: {
    drag: 'x' as const,
    dragConstraints: { left: 0, right: 0 },
    dragElastic: 0.2,
  },
};

// === HOVER/TAP CONFIGS ===
export const interactionConfigs = {
  button: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { type: 'spring', stiffness: 400, damping: 17 },
  },

  card: {
    whileHover: { y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.15)' },
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },

  link: {
    whileHover: { x: 4 },
    transition: { type: 'spring', stiffness: 400, damping: 25 },
  },
};
```

### Animation Provider Pattern

Wrap app with animation context for global control:

```tsx
// src/motion/AnimationProvider.tsx
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion';

interface AnimationProviderProps {
  children: React.ReactNode;
  reducedMotion?: boolean;
}

export const AnimationProvider = ({
  children,
  reducedMotion = false
}: AnimationProviderProps) => {
  // Respect system preference
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  const shouldReduceMotion = reducedMotion || prefersReducedMotion;

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion={shouldReduceMotion ? 'always' : 'never'}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
};
```

**Confidence: HIGH** - Based on official Framer Motion documentation and [Maxime Heckel's advanced patterns guide](https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/).

---

## CSS Strategy

### Section Personalities Without Chaos

The key insight: Use CSS custom properties scoped to `data-section` attributes. Components remain unchanged; only their token values differ per section.

```css
/* === Base Section Styling === */
[data-section] {
  position: relative;
  padding: var(--section-padding, var(--space-16)) var(--content-padding);
}

/* === Hero Section: Bold, immersive === */
[data-section="hero"] {
  --section-padding: var(--space-24);
  --heading-size: var(--text-7xl);
  --text-accent: var(--yellow-vivid);

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

[data-section="hero"] h1 {
  font-size: var(--heading-size);
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* === Gallery Section: Grid-focused === */
[data-section="gallery"] {
  --element-gap: var(--space-4);
  --surface-elevated: rgba(255, 255, 255, 0.03);
}

/* === Listen Section: Music vibes === */
[data-section="listen"] {
  --text-accent: var(--magenta-hot);
  --interactive-primary: var(--magenta-hot);
  --surface-base: linear-gradient(180deg, var(--gray-900), var(--black));
}

/* === Contact Section: Action-oriented === */
[data-section="contact"] {
  --text-accent: var(--green-neon);
  --interactive-primary: var(--green-neon);
  --border-accent: var(--green-neon);
}
```

### Breaking Grid Intentionally

For experimental layouts, create specific utility patterns:

```css
/* === Bleed Utilities === */
.bleed-full {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
}

.bleed-left {
  margin-left: calc(-50vw + 50%);
  padding-left: calc(50vw - 50%);
}

.bleed-right {
  margin-right: calc(-50vw + 50%);
  padding-right: calc(50vw - 50%);
}

/* === Overlap Utilities === */
.overlap-up {
  margin-top: calc(-1 * var(--space-16));
  position: relative;
  z-index: 1;
}

.overlap-down {
  margin-bottom: calc(-1 * var(--space-16));
  position: relative;
}

/* === Asymmetric Grid === */
.grid-asymmetric {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--element-gap);
}

.grid-asymmetric-reverse {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--element-gap);
}

/* === Offset Elements === */
.offset-left {
  transform: translateX(calc(-1 * var(--space-8)));
}

.offset-right {
  transform: translateX(var(--space-8));
}
```

### Typography Expression

Enable expressive typography without abandoning consistency:

```css
/* === Display Typography === */
.text-hero {
  font-family: var(--font-display);
  font-size: clamp(var(--text-4xl), 8vw, var(--text-7xl));
  font-weight: var(--heading-weight);
  line-height: var(--heading-leading);
  letter-spacing: var(--heading-tracking);
  text-transform: uppercase;
}

.text-section {
  font-family: var(--font-display);
  font-size: clamp(var(--text-2xl), 4vw, var(--text-4xl));
  font-weight: var(--heading-weight);
  line-height: var(--heading-leading);
  letter-spacing: var(--heading-tracking);
  text-transform: uppercase;
}

/* === Gradient Text === */
.text-gradient {
  background: linear-gradient(135deg, var(--yellow-vivid), var(--magenta-hot));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

.text-gradient-accent {
  background: linear-gradient(135deg, var(--text-accent), var(--interactive-primary));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}

/* === Kinetic Typography Prep === */
.text-split {
  display: inline-flex;
  overflow: hidden;
}

.text-split > span {
  display: inline-block;
}
```

**Confidence: HIGH** - Pattern validated by [Piccalilli's theming approach](https://piccalil.li/blog/how-were-approaching-theming-with-modern-css/) and [Smashing Magazine's CSS custom properties strategy](https://www.smashingmagazine.com/2018/05/css-custom-properties-strategy-guide/).

---

## Build Order

The architecture has dependencies. Build in this order to avoid rework:

### Phase 1: Foundation (Must be first)

**What:** Expanded token system, CSS layer structure
**Why first:** Everything else depends on tokens. Components cannot reference semantic tokens that don't exist.

Deliverables:
1. Expanded `variables.css` with three-layer token structure
2. CSS `@layer` declaration file
3. Updated base element styles using tokens

**Enables:** All subsequent phases

### Phase 2: Motion Foundation

**What:** Centralized motion config, variant presets, AnimationProvider
**Why second:** Motion patterns should exist before components adopt them.

Deliverables:
1. `src/motion/config.ts` - springs, durations, eases
2. `src/motion/variants.ts` - reusable variant definitions
3. `src/motion/gestures.ts` - gesture configurations
4. `src/motion/AnimationProvider.tsx` - app wrapper

**Enables:** Phase 4 (component motion), Phase 5 (page animations)

### Phase 3: Layout Primitives

**What:** Stack, Cluster, Grid, Bleed components
**Why third:** These are the building blocks for page layouts.

Deliverables:
1. `Stack` component
2. `Cluster` component
3. `Grid` component
4. `Bleed` component
5. CSS utility classes for layout breaks

**Enables:** Phase 5 (page compositions)

### Phase 4: Component Enhancement

**What:** Update existing components to use tokens, add motion, add variants
**Why fourth:** Components now have tokens to reference and motion configs to use.

Deliverables:
1. Enhanced `Button` with motion and tone variants
2. Enhanced `Surface` with section-aware theming
3. Enhanced `Heading` with display variants
4. New compound components (Card, Section)

**Enables:** Phase 5 (page compositions)

### Phase 5: Page Compositions

**What:** Apply architecture to actual pages, create section personalities
**Why last:** Requires all previous phases.

Deliverables:
1. Home page with hero section personality
2. Gallery with gallery section styling
3. Listen page with music section personality
4. Contact with contact section styling
5. Page transitions with AnimatePresence

---

## Summary: Architecture Principles

| Principle | Implementation |
|-----------|----------------|
| **Expression through constraint** | Rich token system channels creativity |
| **Composition over configuration** | Compound components, slot patterns |
| **Scoped variation** | `data-section` attributes + CSS custom properties |
| **Centralized motion** | Single config file, variant presets |
| **Layered cascade** | CSS `@layer` for predictable overrides |
| **Polymorphic flexibility** | `as` prop on foundational components |

---

## Sources

### HIGH Confidence (Official Documentation)
- [Framer Motion Transitions](https://motion.dev/docs/react-transitions) - Official motion configuration docs
- [CSS @layer MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@layer) - Official cascade layers reference

### MEDIUM Confidence (Expert Sources)
- [Advanced Animation Patterns - Maxime Heckel](https://blog.maximeheckel.com/posts/advanced-animation-patterns-with-framer-motion/) - Orchestration patterns
- [CSS Custom Properties Strategy - Smashing Magazine](https://www.smashingmagazine.com/2018/05/css-custom-properties-strategy-guide/) - Token scoping approach
- [Theming with Modern CSS - Piccalilli](https://piccalil.li/blog/how-were-approaching-theming-with-modern-css/) - Section theming pattern
- [Organizing Design Systems with Cascade Layers - CSS-Tricks](https://css-tricks.com/organizing-design-system-component-patterns-with-css-cascade-layers/) - Layer architecture
- [Advanced React Component Composition - Frontend Mastery](https://frontendmastery.com/posts/advanced-react-component-composition-guide/) - Compound components
- [Breaking the Grid - Secret Stache](https://www.secretstache.com/blog/how-to-effectively-break-out-of-the-grid/) - Experimental layout patterns

### LOW Confidence (Community Sources)
- Various design system comparisons (MUI, Radix, shadcn/ui trends)
- Spring animation value recommendations (community-derived defaults)
