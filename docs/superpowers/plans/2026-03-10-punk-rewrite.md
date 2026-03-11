# Punk Rewrite Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite the Random Gorsey site's visual identity to a modern punk-informed aesthetic — stripped palette (black/off-white/yellow), aggressive typography, grain textures, snappy animations, and square corners throughout.

**Architecture:** This is a reskin, not a restructure. The three-layer token system stays but gets new values. Components keep their interfaces but change their styling. Motion config gets retimed. No new dependencies needed.

**Tech Stack:** Next.js 16, React 19, Tailwind CSS v4, Framer Motion, Lenis

**Spec:** `docs/superpowers/specs/2026-03-10-punk-rewrite-design.md`

---

## Chunk 1: Foundation — Tokens, Typography, Texture

### Task 1: Strip the color primitives

**Files:**
- Modify: `src/styles/tokens/primitives.css`

- [ ] **Step 1: Replace color primitives with punk palette**

Replace the `@theme` color section in `primitives.css`. Keep neutrals but darken them. Remove multi-hue accents (magenta, blue). Keep yellow as the sole accent. Add gallery slate. Set all radius tokens to 0.

```css
@theme {
  /* Neutral Scale - darker, grittier */
  --color-neutral-50: oklch(92% 0 0deg);    /* off-white text */
  --color-neutral-100: oklch(85% 0 0deg);
  --color-neutral-200: oklch(70% 0 0deg);
  --color-neutral-300: oklch(55% 0 0deg);
  --color-neutral-400: oklch(40% 0 0deg);    /* muted text */
  --color-neutral-500: oklch(33% 0 0deg);
  --color-neutral-600: oklch(27% 0 0deg);    /* dim borders */
  --color-neutral-700: oklch(20% 0 0deg);
  --color-neutral-800: oklch(11% 0 0deg);    /* elevated surface */
  --color-neutral-900: oklch(8% 0 0deg);     /* surface */
  --color-neutral-950: oklch(4% 0 0deg);     /* base black */

  --color-white: oklch(100% 0 0deg);
  --color-black: oklch(0% 0 0deg);

  /* Single accent: Electric Yellow */
  --color-yellow-400: oklch(90% 0.18 85deg);
  --color-yellow-500: oklch(85% 0.18 85deg);

  /* Remove magenta, blue as accent colors — keep only for legacy compat */
  --color-magenta-400: oklch(90% 0.18 85deg);  /* map to yellow */
  --color-magenta-500: oklch(85% 0.18 85deg);  /* map to yellow */
  --color-blue-400: oklch(90% 0.18 85deg);     /* map to yellow */
  --color-blue-500: oklch(85% 0.18 85deg);     /* map to yellow */

  /* Feedback colors stay */
  --color-red-500: oklch(57.7% 0.245 27.325deg);
  --color-green-500: oklch(72.3% 0.219 142.136deg);

  /* Gallery slate — the one "break" color */
  --color-gallery-slate: oklch(15% 0.02 230deg);

  /* Spacing — unchanged */
  --spacing: 0.25rem;

  /* Radius — all zero. Punk has no curves. */
  --radius-sm: 0;
  --radius-md: 0;
  --radius-lg: 0;
  --radius-xl: 0;
  --radius-2xl: 0;

  /* Font families — add mono for labels */
  --font-family-tschick-bold: "Tschick Bold", ui-sans-serif, system-ui, sans-serif;
  --font-family-europa: "Europa Regular", ui-sans-serif, system-ui, sans-serif;
  --font-family-europa-bold: "Europa Bold", ui-sans-serif, system-ui, sans-serif;
  --font-family-europa-light: "Europa Light", ui-sans-serif, system-ui, sans-serif;
  --font-family-europa-unified: "Europa", ui-sans-serif, system-ui, sans-serif;
  --font-display: "Tschick Bold", ui-sans-serif, system-ui, sans-serif;
  --font-family-mono: ui-monospace, "SFMono-Regular", "SF Mono", Consolas, "Liberation Mono", "Courier New", monospace;

  /* Animation — faster */
  --animate-duration: 100ms;
  --ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);

  /* Semantic tokens defaults (dark-first for punk) */
  --color-background: oklch(4% 0 0deg);
  --color-foreground: oklch(92% 0 0deg);
  --color-surface: oklch(8% 0 0deg);
  --color-surface-foreground: oklch(85% 0 0deg);
  --color-surface-elevated: oklch(11% 0 0deg);
  --color-surface-elevated-foreground: oklch(92% 0 0deg);
  --color-primary: oklch(90% 0.18 85deg);   /* yellow */
  --color-primary-foreground: oklch(4% 0 0deg);
  --color-secondary: oklch(11% 0 0deg);
  --color-secondary-foreground: oklch(92% 0 0deg);
  --color-accent: oklch(90% 0.18 85deg);
  --color-accent-foreground: oklch(4% 0 0deg);
  --color-muted: oklch(11% 0 0deg);
  --color-muted-foreground: oklch(40% 0 0deg);
  --color-destructive: oklch(57.7% 0.245 27.325deg);
  --color-destructive-foreground: oklch(92% 0 0deg);
  --color-success: oklch(72.3% 0.219 142.136deg);
  --color-success-foreground: oklch(92% 0 0deg);
  --color-border: oklch(20% 0 0deg);
  --color-input: oklch(20% 0 0deg);
  --color-ring: oklch(40% 0 0deg);
  --color-card: oklch(8% 0 0deg);
  --color-card-foreground: oklch(92% 0 0deg);
  --color-popover: oklch(8% 0 0deg);
  --color-popover-foreground: oklch(92% 0 0deg);

  /* Legacy aliases — all map to yellow now */
  --color-yellow: var(--color-yellow-400);
  --color-magenta: var(--color-yellow-400);
  --color-blue: var(--color-yellow-400);
  --color-green: oklch(87% 0.35 142deg);
  --color-orange: var(--color-yellow-400);
  --color-gray: var(--color-neutral-300);
  --color-gray-medium: var(--color-neutral-500);
  --color-gray-dark: var(--color-neutral-600);
  --color-gray-light: var(--color-neutral-200);
  --color-light-bg: var(--color-neutral-50);
  --color-blue-light: var(--color-yellow-400);
  --color-red: oklch(57.7% 0.245 27.325deg);
  --color-dark: var(--color-neutral-800);
}
```

- [ ] **Step 2: Verify no build errors**

Run: `npx next build 2>&1 | head -30`
Expected: Build starts without CSS parse errors

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens/primitives.css
git commit -m "style: strip color palette to black/off-white/yellow punk scheme"
```

---

### Task 2: Update semantic tokens for dark-first theme

**Files:**
- Modify: `src/styles/tokens/semantic.css`

- [ ] **Step 1: Rewrite semantic.css for punk dark-first defaults**

The `:root` should now default to dark (punk is dark). Remove the `.dark` class — the site is always dark.

```css
:root {
  --color-background: var(--color-neutral-950);
  --color-foreground: var(--color-neutral-50);

  --color-surface: var(--color-neutral-900);
  --color-surface-foreground: var(--color-neutral-100);
  --color-surface-elevated: var(--color-neutral-800);
  --color-surface-elevated-foreground: var(--color-neutral-50);

  --color-primary: var(--color-yellow-400);
  --color-primary-foreground: var(--color-neutral-950);
  --color-secondary: var(--color-neutral-800);
  --color-secondary-foreground: var(--color-neutral-50);
  --color-accent: var(--color-yellow-400);
  --color-accent-foreground: var(--color-neutral-950);

  --color-destructive: var(--color-red-500);
  --color-destructive-foreground: var(--color-neutral-50);
  --color-success: var(--color-green-500);
  --color-success-foreground: var(--color-neutral-50);

  --color-border: var(--color-neutral-700);
  --color-input: var(--color-neutral-700);
  --color-ring: var(--color-neutral-400);
  --color-muted: var(--color-neutral-800);
  --color-muted-foreground: var(--color-neutral-400);

  --color-card: var(--color-surface);
  --color-card-foreground: var(--color-surface-foreground);
  --color-popover: var(--color-surface);
  --color-popover-foreground: var(--color-surface-foreground);

  --space-page: calc(var(--spacing) * 6);
  --space-section: calc(var(--spacing) * 16);
  --space-element: calc(var(--spacing) * 4);
  --space-inline: calc(var(--spacing) * 2);
}
```

Remove the `.dark { ... }` block entirely.

- [ ] **Step 2: Commit**

```bash
git add src/styles/tokens/semantic.css
git commit -m "style: dark-first semantic tokens, remove light mode"
```

---

### Task 3: Strip section overrides, keep only gallery

**Files:**
- Modify: `src/styles/tokens/sections.css`

- [ ] **Step 1: Replace sections.css — remove all overrides except gallery**

```css
@layer base {
  /* Gallery — the one "break" section with cooler slate tones */
  [data-section="gallery"] {
    --color-background: var(--color-gallery-slate);
    --color-foreground: var(--color-neutral-50);
    --color-surface: oklch(18% 0.015 230deg);
    --color-surface-foreground: var(--color-neutral-50);
    --color-border: oklch(22% 0.02 230deg);
  }

  /* Base section styles */
  [data-section] {
    color: var(--color-foreground);
    background-color: var(--color-background);
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/tokens/sections.css
git commit -m "style: remove section color overrides, keep gallery slate only"
```

---

### Task 4: Typography — push headings larger, add mono utility

**Files:**
- Modify: `src/styles/tokens/typography.css`
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Update typography.css h1/h2 scale**

Change the `--text-6xl` and `--text-5xl` tokens to be larger:

```css
/* 6XL - Display text, MAXIMUM IMPACT */
--text-6xl: clamp(3rem, 8vw, 6rem);
--text-6xl--line-height: 0.95;

/* 5XL - Hero headings */
--text-5xl: clamp(2rem, 5vw, 4rem);
--text-5xl--line-height: 1.0;
```

- [ ] **Step 2: Update globals.css heading styles**

In the `@layer base` section, update the heading rules:

```css
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-tschick-bold);
  text-transform: uppercase;
  letter-spacing: -0.02em;
  text-wrap: balance;
  overflow-wrap: break-word;
}

h1 {
  font-size: var(--text-6xl);
  line-height: var(--text-6xl--line-height);
  letter-spacing: -0.03em;
}

h2 {
  font-size: var(--text-5xl);
  line-height: var(--text-5xl--line-height);
  letter-spacing: -0.01em;
}
```

- [ ] **Step 3: Add mono utility class and grain overlay to globals.css**

In the `@layer utilities` section, add:

```css
.font-mono-label {
  font-family: var(--font-family-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
}
```

Add grain texture as a new utility:

```css
.grain-overlay {
  position: relative;
}

.grain-overlay::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
  opacity: 0.15;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 200px 200px;
  mix-blend-mode: overlay;
}
```

- [ ] **Step 4: Update body base styles in globals.css**

Set body background to base black:

```css
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  margin: 0;
  font-family: var(--font-family-europa-unified);
  font-size: var(--text-base);
  font-feature-settings: "rlig" 1, "calt" 1;
  line-height: 1.7;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

- [ ] **Step 5: Verify build**

Run: `npx next build 2>&1 | head -30`
Expected: No errors

- [ ] **Step 6: Commit**

```bash
git add src/styles/tokens/typography.css src/styles/globals.css
git commit -m "style: aggressive typography scale, mono labels, grain texture, dark body"
```

---

## Chunk 2: Motion System — Snappier, More Abrupt

### Task 5: Retune motion config

**Files:**
- Modify: `src/lib/motion/config.ts`

- [ ] **Step 1: Replace springs, durations, and eases**

```typescript
export const springs = {
  /** Punk snap — hard, immediate */
  snappy: { stiffness: 500, damping: 30, mass: 1 },
  /** Default — still fast */
  default: { stiffness: 400, damping: 28, mass: 1 },
  /** Gentle — barely */
  gentle: { stiffness: 300, damping: 25, mass: 1 },
  /** Bouncy — use sparingly */
  bouncy: { stiffness: 500, damping: 12, mass: 1 },
  /** Page — quick settle */
  page: { stiffness: 400, damping: 30, mass: 1 },
  /** Dramatic — still fast but heavier */
  dramatic: { stiffness: 500, damping: 30, mass: 1.5 },
} as const;

export const durations = {
  instant: 0,
  fast: 0.08,
  normal: 0.15,
  slow: 0.25,
  slower: 0.35,
} as const;

export const eases = {
  /** Punk ease — fast attack, hard stop */
  default: [0.16, 1, 0.3, 1] as const,
  in: [0.4, 0, 1, 1] as const,
  out: [0.16, 1, 0.3, 1] as const,
  inOut: [0.16, 1, 0.3, 1] as const,
} as const;
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/motion/config.ts
git commit -m "style: retune motion config for punk snap timing"
```

---

### Task 6: Retune section variants

**Files:**
- Modify: `src/lib/motion/section-variants.ts`

- [ ] **Step 1: Rewrite all section variants for snappy timing**

Replace the entire file:

```typescript
import type { Variants } from 'framer-motion';
import { springs, durations } from './config';

// All sections use the same snappy timing — no more "personalities"
const sectionEnter = {
  type: 'spring' as const,
  ...springs.snappy,
  delay: 0.05,
};

const sectionExit = { duration: durations.fast };

export const heroVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const galleryVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const listenVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const aboutVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const contactVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

export const discographyVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: { opacity: 1, y: 0, transition: sectionEnter },
  exit: { opacity: 0, transition: sectionExit },
};

// Stagger containers — tight, fast
const punkStagger = {
  initial: {},
  enter: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.02, staggerDirection: -1 } },
};

export const heroStaggerContainer: Variants = punkStagger;
export const galleryStaggerContainer: Variants = punkStagger;
export const discographyStaggerContainer: Variants = punkStagger;
export const aboutStaggerContainer: Variants = punkStagger;

// Card item — no scale, just snap in
export const aboutCardItem: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.snappy },
  },
  exit: { opacity: 0, transition: { duration: durations.fast } },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/motion/section-variants.ts
git commit -m "style: unified snappy section variants, remove per-page motion personalities"
```

---

### Task 7: Retune general variants and kinetic text

**Files:**
- Modify: `src/lib/motion/variants.ts`

- [ ] **Step 1: Update page variants, stagger, and reveal timings**

Update these specific variants (keep the rest unchanged):

`pageVariants` — reduce y offset to 8:
```typescript
export const pageVariants: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.snappy },
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.fast },
  },
};
```

`staggerContainer` — tighter stagger:
```typescript
export const staggerContainer: Variants = {
  initial: {},
  enter: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};
```

`staggerItem` — snap in:
```typescript
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 8 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.snappy },
  },
  exit: { opacity: 0, y: -4 },
};
```

`revealVariants` — faster:
```typescript
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: eases.default,
    },
  },
};
```

`revealContainerVariants` — tighter stagger:
```typescript
export const revealContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};
```

`revealItemVariants`:
```typescript
export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: durations.normal,
      ease: eases.default,
    },
  },
};
```

`textRevealItem` — fast stagger:
```typescript
export const textRevealItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.15,
      ease: eases.default,
    },
  },
};
```

`textRevealDramatic` — less rotation, faster:
```typescript
export const textRevealDramatic: Variants = {
  hidden: { opacity: 0, y: 20, rotateX: -45 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.2,
      ease: eases.default,
    },
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/motion/variants.ts
git commit -m "style: snappier general variants and kinetic text timing"
```

---

## Chunk 3: Component Restyling

### Task 8: Header — text logo + mono nav

**Files:**
- Modify: `src/patterns/Header.tsx`

- [ ] **Step 1: Rewrite Header component**

Replace the entire component body. Key changes:
- Text logo instead of image (remove Image import)
- Mono nav links
- Active state with yellow + underline
- Bottom border only, no background distinction
- Mobile: same pattern, mono styling

```tsx
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiSolidChevronUp, BiSolidChevronDown } from 'react-icons/bi';
import { cn } from '@/lib/utils';
import Button from '../components/Button';

const navLinks = [
  { to: '/', label: 'Home', title: 'Go to Home page' },
  { to: '/listen/', label: 'Listen', title: 'Go to Listen page' },
  { to: '/about/', label: 'About', title: 'Info about RG' },
  { to: '/contact/', label: 'Contact', title: 'Contact RG' },
  { to: '/discography/', label: 'Disco', title: 'View Discography' },
  { to: '/gallery/', label: 'Gallery', title: 'View Gallery' },
];

const ChevronUp = React.createElement(
  BiSolidChevronUp as React.ComponentType<React.SVGProps<SVGSVGElement>>,
  { className: 'w-4 h-4', 'aria-hidden': 'true' }
);
const ChevronDown = React.createElement(
  BiSolidChevronDown as React.ComponentType<React.SVGProps<SVGSVGElement>>,
  { className: 'w-4 h-4', 'aria-hidden': 'true' }
);

export interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 800);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  React.useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path.replace(/\/$/, ''));
  };

  return (
    <header
      className={cn(
        "relative border-b border-border",
        className
      )}
    >
      <div className="flex items-center justify-between px-6 py-4 mx-auto w-full max-w-5xl">
        <Link href="/" className="font-tschick-bold text-lg text-foreground uppercase tracking-[0.05em] no-underline hover:text-accent">
          Random Gorsey
        </Link>

        <nav aria-label="Main navigation">
          {!isMobile && (
            <ul className="flex gap-6 p-0 m-0 list-none">
              {navLinks.map(link => (
                <li key={link.to}>
                  <Link
                    href={link.to}
                    title={link.title}
                    className={cn(
                      "font-mono-label no-underline whitespace-nowrap",
                      isActive(link.to)
                        ? "text-accent underline underline-offset-4"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {isMobile && (
            <>
              <Button
                variant="tertiary"
                className="flex gap-1 items-center font-mono-label text-foreground bg-transparent border-none"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                onClick={() => setMenuOpen(open => !open)}
                type="button"
                icon={menuOpen ? ChevronUp : ChevronDown}
              >
                Menu
              </Button>
              {menuOpen && (
                <ul
                  id="mobile-menu"
                  className={cn(
                    "absolute top-full right-0 left-0 z-[1000]",
                    "flex flex-col items-center",
                    "py-4 px-0 m-0",
                    "bg-background border-t border-border",
                    "list-none"
                  )}
                >
                  {navLinks.map(link => (
                    <li key={link.to} className="my-2">
                      <Link
                        href={link.to}
                        title={link.title}
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          "font-mono-label text-sm no-underline",
                          isActive(link.to)
                            ? "text-accent underline underline-offset-4"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -10`

- [ ] **Step 3: Commit**

```bash
git add src/patterns/Header.tsx
git commit -m "style: punk header — text logo, mono nav, active states"
```

---

### Task 9: Footer — mono abbreviations

**Files:**
- Modify: `src/patterns/Footer.tsx`

- [ ] **Step 1: Rewrite Footer component**

Replace icon components with monospace text abbreviations. Keep same URLs.

```tsx
import React from 'react';
import { cn } from '@/lib/utils';

const socialLinks = [
  { label: 'SP', title: 'Spotify', url: 'https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q?si=TCP19UlhTpyHb7w0UOukmg' },
  { label: 'SC', title: 'Soundcloud', url: 'https://soundcloud.com/randomgorsey' },
  { label: 'IG', title: 'Instagram', url: 'https://www.instagram.com/random_gorsey?igsh=am42eWcwNGdnY3hm&utm_source=qr' },
  { label: 'YT', title: 'YouTube', url: 'https://www.youtube.com/@randomgorsey8125' },
  { label: 'BC', title: 'Bandcamp', url: 'https://randomgorsey.bandcamp.com' },
];

export interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={cn(
        "sticky bottom-0 z-[1000]",
        "px-6 py-3",
        "mt-auto",
        "border-t border-border",
        "bg-background",
        className
      )}
    >
      <div className="flex items-center justify-between mx-auto max-w-5xl">
        <span className="font-mono-label text-muted-foreground">
          &copy; {new Date().getFullYear()} Random Gorsey
        </span>
        <div className="flex gap-5">
          {socialLinks.map(link => (
            <a
              key={link.label}
              href={link.url}
              title={link.title}
              aria-label={link.title}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono-label text-muted-foreground hover:text-accent no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

- [ ] **Step 2: Commit**

```bash
git add src/patterns/Footer.tsx
git commit -m "style: punk footer — mono abbreviations, minimal layout"
```

---

### Task 10: Button — square, mono, punk

**Files:**
- Modify: `src/components/Button.tsx`

- [ ] **Step 1: Update buttonVariants CVA config**

Replace the base classes and variant definitions:

```typescript
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono-label cursor-pointer transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-foreground hover:bg-yellow-500",
        secondary:
          "bg-transparent text-foreground border border-foreground hover:text-accent hover:border-accent",
        danger: "bg-destructive text-destructive-foreground hover:opacity-80",
        tertiary: "bg-transparent text-muted-foreground border border-border hover:text-foreground hover:border-foreground",
        success: "bg-success text-white hover:opacity-80",
      },
      size: {
        small: "h-8 px-3 text-xs",
        medium: "h-10 px-5",
        large: "h-12 px-6 text-sm",
      },
      iconOnly: {
        true: "w-10 h-10 p-0",
        false: "",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    compoundVariants: [
      { iconOnly: true, size: "small", class: "w-8 h-8" },
      { iconOnly: true, size: "large", class: "w-12 h-12" },
    ],
    defaultVariants: {
      variant: "primary",
      size: "medium",
      iconOnly: false,
      fullWidth: false,
    },
  }
);
```

Key changes:
- `font-mono-label` instead of `font-tschick-bold`
- `transition-none` — instant state changes
- `rounded` class removed (radius is 0 from tokens)
- Primary is yellow bg
- Secondary is bordered
- Focus ring uses accent color

- [ ] **Step 2: Remove `rounded` from loading spinner in the component**

Change the loading spinner class from `"inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"` to `"inline-block h-4 w-4 animate-spin border-2 border-current border-t-transparent"`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Button.tsx
git commit -m "style: punk buttons — square, mono text, instant hover"
```

---

### Task 11: PostCard — editorial left-border style

**Files:**
- Modify: `src/components/PostCard.tsx`

- [ ] **Step 1: Restyle PostCard**

Key changes to the component:
- Remove Surface wrapper, use a plain `article` with left border
- Date in mono above title
- "Read More" link in yellow mono with underline
- Remove shadows, hover scale, rounded corners
- Remove Avatar component usage (or make it square)

Replace the return statement starting from the `<Surface>` element. The card should render as:

```tsx
return (
  <article
    id={id}
    className={cn(
      "border-l-3 border-accent pl-5 py-4 mb-6",
      onClick && "cursor-pointer",
      className
    )}
    style={style}
    onClick={onClick ? handleCardClick : undefined}
    role={onClick ? "button" : "article"}
    tabIndex={onClick ? 0 : undefined}
    data-testid={testId}
    {...(onClick
      ? {
          onKeyDown: (e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCardClick();
            }
          },
        }
      : {})}
    {...accessibilityProps}
  >
    {/* Date */}
    <time
      dateTime={post.timestamp}
      className="font-mono-label text-muted-foreground block mb-2"
    >
      {post.timestamp}
    </time>

    {/* Title */}
    <Heading
      level={headingLevel}
      className={cn(
        "m-0 mb-2 text-foreground",
        isCompactTitle && "text-[clamp(1.2rem,5vw,1.4rem)]"
      )}
      tone="light"
    >
      {post.title}
    </Heading>

    {/* Body */}
    <div
      className="mt-2 mb-3 font-europa text-[1.05rem] leading-[1.7] text-muted-foreground"
      dangerouslySetInnerHTML={{ __html: displayBody }}
    />

    {/* Read more + share */}
    <div className="flex flex-wrap gap-3 items-center mt-3">
      {hasLongContent && (
        <button
          onClick={toggleExpanded}
          className="p-0 font-mono-label text-accent underline underline-offset-4 cursor-pointer bg-transparent border-none hover:text-foreground"
          aria-expanded={expanded}
          aria-label={expanded ? "Show less content" : "Show more content"}
        >
          {expanded ? "Show Less" : "Read More"}
        </button>
      )}
      {showSocialShare && (
        <div className="ml-auto">
          <SocialShare url={postUrl} title={post.title} text={shareText} />
        </div>
      )}
    </div>

    {/* Media */}
    {post.media && post.contentType === PostContentType.IMAGE && (
      <Image
        src={post.media}
        alt={post.title}
        title={post.title}
        width={post.mediaWidth ?? 1200}
        height={post.mediaHeight ?? 675}
        sizes="100vw"
        className="w-full mt-3"
      />
    )}
    {post.media && post.contentType === PostContentType.VIDEO && (
      <video
        src={post.media}
        controls
        className="w-full mt-3"
        preload="metadata"
        aria-label={`Video: ${post.title}`}
      />
    )}
    {post.media && post.contentType === PostContentType.AUDIO && (
      <audio
        src={post.media}
        controls
        className="w-full mt-3"
        preload="metadata"
        aria-label={`Audio: ${post.title}`}
      />
    )}
  </article>
);
```

Remove unused imports: `Avatar`, `Surface`, `Text`. Keep `Heading`, `Image`, `SocialShare`.

- [ ] **Step 2: Commit**

```bash
git add src/components/PostCard.tsx
git commit -m "style: punk post cards — left-border editorial, mono dates, no Surface"
```

---

### Task 12: Input — punk form styling

**Files:**
- Modify: `src/components/Input.tsx`

- [ ] **Step 1: Update input base classes**

Change the `inputClasses` cn() call. Replace the current classes with:

```typescript
const inputClasses = cn(
  "w-full max-w-full box-border font-europa bg-background text-foreground",
  "border border-border",
  "ring-offset-background",
  "placeholder:text-muted-foreground placeholder:font-mono-label placeholder:text-xs placeholder:uppercase placeholder:tracking-widest",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:border-accent",
  "disabled:cursor-not-allowed disabled:opacity-40",
  sizeClasses[size],
  error && "border-destructive focus-visible:ring-destructive",
  icon && "pl-10",
  loading && "opacity-70",
  className
);
```

Key changes: removed `rounded`, focus ring uses accent, placeholders are mono uppercase.

- [ ] **Step 2: Update label styling**

Change the Label className from `"mb-2 font-bold text-primary"` to `"mb-2 font-mono-label text-muted-foreground"`.

- [ ] **Step 3: Commit**

```bash
git add src/components/Input.tsx
git commit -m "style: punk inputs — square corners, mono labels, accent focus"
```

---

## Chunk 4: Page Restyling

### Task 13: Home page — punk treatment

**Files:**
- Modify: `src/site/Home.tsx`

- [ ] **Step 1: Update Home page styling**

Changes:
- Add `grain-overlay` class to the main container
- Increase overlay opacity to 0.4
- Update KineticText className for larger scale
- Update button styles

In the `<VideoBackground>` component, change `overlayOpacity={0.3}` to `overlayOpacity={0.4}`.

In the `<KineticText>` component, change className to:
```
"mb-8 font-display uppercase tracking-[-0.02em]"
```

In the main `<motion.div>`, add `grain-overlay` to the className:
```
"relative z-10 min-h-screen text-foreground grain-overlay"
```

Remove `data-section="hero"` since hero section overrides are gone.

Update "Back to Top" button className to remove the custom border/bg overrides:
```tsx
<Button
  variant="secondary"
  onClick={() => scrollTo(0)}
  aria-label="Back to top"
>
  Back to Top
</Button>
```

- [ ] **Step 2: Commit**

```bash
git add src/site/Home.tsx
git commit -m "style: punk home page — grain overlay, larger headings, clean buttons"
```

---

### Task 14: About page — punk treatment

**Files:**
- Modify: `src/site/About.tsx`

- [ ] **Step 1: Update About page**

Changes:
- Add `grain-overlay` to main container
- Remove `data-section="about"` (no more about overrides)
- Square portrait video (remove `rounded-full`)
- Side project cards: left-border style, remove hover transforms
- Square avatar images (remove `rounded-full`)

Update the portrait video className:
```
"w-24 md:w-32 shadow-xl"
```

Update side project card markup — replace the `<div className="flex items-center gap-4 p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-white/10">` with:
```
"flex items-center gap-4 py-3 border-l-3 border-accent pl-4"
```

Update side project avatar images — replace `"w-12 h-12 rounded-full object-cover"` with `"w-12 h-12 object-cover"`.

Remove `group-hover:text-accent transition-colors` from links and replace with `text-foreground hover:text-accent no-underline`.

Remove `className="group cursor-pointer"` from `<motion.li>` elements.

- [ ] **Step 2: Commit**

```bash
git add src/site/About.tsx
git commit -m "style: punk about page — square portraits, left-border cards, grain"
```

---

### Task 15: Listen page — punk treatment

**Files:**
- Modify: `src/site/Listen.tsx`

- [ ] **Step 1: Update Listen page**

Changes:
- Remove `data-section="listen"` (no more listen overrides)
- Add `grain-overlay` to container
- Remove `rounded-xl` from iframes
- Update text colors to use token classes instead of hardcoded white/opacity

Update the main `<motion.div>` className:
```
"relative z-10 min-h-screen py-16 grain-overlay"
```

Remove `data-section="listen"`.

Update iframe classNames from `"w-full rounded-xl"` to `"w-full"`.

Update SoundCloud attribution links: replace `text-white/60 hover:text-white/80` with `text-muted-foreground hover:text-foreground`.

Update description text: replace `"font-sans text-lg text-section-foreground/80"` with `"font-europa text-lg text-muted-foreground"`.

Update KineticText className: replace `"font-heading text-4xl uppercase tracking-wide text-section-foreground"` with `"font-display uppercase tracking-[-0.02em]"`.

- [ ] **Step 2: Commit**

```bash
git add src/site/Listen.tsx
git commit -m "style: punk listen page — dark base, no rounded embeds, grain"
```

---

### Task 16: Gallery page — slate break + punk

**Files:**
- Modify: `src/site/Gallery.tsx`

- [ ] **Step 1: Update Gallery page**

Gallery keeps `data-section="gallery"` (the one break section). Changes:
- Add `grain-overlay` to container
- Square image corners (remove `rounded-lg`)
- Remove hover scale transforms
- Add image contrast filter

Update image className from `"w-full rounded-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"` to `"w-full contrast-[1.2] brightness-[0.95]"`.

Add `grain-overlay` to the gallery container div.

- [ ] **Step 2: Commit**

```bash
git add src/site/Gallery.tsx
git commit -m "style: punk gallery — slate bg, square images, high contrast filter"
```

---

### Task 17: Discography page — punk treatment

**Files:**
- Modify: `src/site/Discography.tsx`

- [ ] **Step 1: Update Discography page**

Changes:
- Remove `data-section="discography"`
- Replace fuchsia/orange colors with accent/foreground tokens
- Square album art (remove `rounded-lg`)
- Remove hover scale transforms
- BUY button: yellow primary style
- Add `grain-overlay`

Update main container className: remove `text-fuchsia-700 bg-section-background`, add `text-foreground grain-overlay`.

Update album art container: replace `"relative mx-auto h-48 w-48 overflow-hidden rounded-lg shadow-lg transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-xl"` with `"relative mx-auto h-48 w-48 overflow-hidden"`.

Update catalog text: replace `"text-sm text-fuchsia-700/70"` with `"font-mono-label text-muted-foreground"`.

Update BUY button: replace `"mt-3 inline-block rounded bg-fuchsia-700 px-6 py-2 font-semibold text-orange-500 transition-colors hover:text-white"` with `"mt-3 inline-block bg-accent text-accent-foreground px-6 py-2 font-mono-label hover:bg-yellow-500"`.

- [ ] **Step 2: Commit**

```bash
git add src/site/Discography.tsx
git commit -m "style: punk discography — yellow accent, square album art, mono labels"
```

---

### Task 18: Contact page — punk treatment

**Files:**
- Modify: `src/site/Contact.tsx`

- [ ] **Step 1: Update Contact page**

Changes:
- Remove `data-section="contact"`
- Add `grain-overlay` to container
- Contact module CSS styles will inherit from updated tokens (square corners, dark bg)

Update the `<motion.div>` — remove `data-section="contact"`, add `grain-overlay` to the className of the inner container.

- [ ] **Step 2: Commit**

```bash
git add src/site/Contact.tsx
git commit -m "style: punk contact page — dark base, grain overlay"
```

---

## Chunk 5: Surface Component + Cleanup

### Task 19: Update Surface component

**Files:**
- Modify: `src/components/Surface.tsx`

- [ ] **Step 1: Update Surface base classes**

Remove `rounded-xl` from the base cva string. Remove the dramatic shadow. Update to:

Base classes should include:
```
"relative box-border block overflow-hidden"
"text-foreground bg-surface"
"border border-border"
"transition-none"
```

Remove the inverted/flat variant color overrides that reference light mode colors (white/black). The token system handles this now.

- [ ] **Step 2: Commit**

```bash
git add src/components/Surface.tsx
git commit -m "style: punk surface — square corners, no shadows, token-based colors"
```

---

### Task 20: Verify build and visual check

- [ ] **Step 1: Run full build**

Run: `npx next build`
Expected: Build succeeds with no errors

- [ ] **Step 2: Run dev server for visual verification**

Run: `npx next dev`
Check: Homepage, About, Listen, Gallery, Discography, Contact pages all load with punk styling

- [ ] **Step 3: Final commit with any fixes**

Fix any remaining issues found during visual check, commit.

```bash
git add -A
git commit -m "style: punk rewrite — final visual fixes and cleanup"
```
