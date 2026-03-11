# Punk Rewrite — Design Spec

## Summary

Rewrite Random Gorsey's visual identity to a "modern punk-informed" aesthetic: clean structure with punk attitude through typography, texture, color restraint, and anti-polish details. Functional but with edge.

## Color System

Stripped-down palette replacing the current multi-hue section system:

| Token | Value | Usage |
|-------|-------|-------|
| Base black | `oklch(4% 0 0deg)` / #0a0a0a | Primary background |
| Surface | `oklch(8% 0 0deg)` / #141414 | Cards, elevated areas |
| Elevated | `oklch(11% 0 0deg)` / #1a1a1a | Popovers, modals |
| Off-white | `oklch(92% 0 0deg)` / #e8e8e8 | Primary text |
| Muted | `oklch(40% 0 0deg)` / #555 | Secondary text |
| Dim | `oklch(27% 0 0deg)` / #333 | Borders, dividers |
| Accent | `oklch(90% 0.18 85deg)` / #FFE500 | Electric yellow — links, highlights, primary buttons |
| Gallery slate | `oklch(15% 0.02 230deg)` / #1c2530 | Gallery page background only |

### Section overrides

- All section-specific color overrides removed except gallery
- Gallery page gets `gallery slate` as background with a cooler border tone
- Every other page: black + off-white + yellow only
- Variation through value (black vs dark gray backgrounds), not hue

## Typography

No font changes. Same files, same families:

- **Headings**: Tschick Bold — used more aggressively. Oversized scales, uppercase, tight/negative letter-spacing at large sizes. Clamp-based fluid sizing stays.
- **Body**: Europa (unified family, weight 300/400/700) — 15-16px, generous line-height (1.7). No changes.
- **Labels/metadata (NEW role)**: System monospace (`ui-monospace, 'SFMono-Regular', Consolas, monospace`). 11-12px, uppercase, wide letter-spacing (0.12-0.2em). Used for dates, nav links, categories, status text, button labels.

### Heading scale adjustments

Push h1 larger and tighten tracking:
- h1: `clamp(3rem, 8vw, 6rem)`, letter-spacing: `-0.02em`
- h2: `clamp(2rem, 5vw, 4rem)`, letter-spacing: `0`
- h3-h6: current scale, unchanged

## Texture & Grit

Heavily distressed (60% clean, 40% raw):

1. **Grain overlay**: SVG feTurbulence noise texture applied via `::after` pseudo-element on dark backgrounds. ~15-20% opacity. Applied to `[data-section]` containers and cards.
2. **Hard dividers**: Straight, blunt lines. 2-3px solid yellow or #333. No decoration, no clip-path — just a hard edge. Punk is direct, not decorative.
3. **Image treatment**: `contrast(1.2) brightness(0.95)` filter on gallery images. Optional scanline overlay on hover via repeating-linear-gradient.
4. **Border-radius**: 0 everywhere. Cards, buttons, inputs, avatars — all square corners. Remove all `--radius-*` tokens or set to 0.
5. **Borders**: 1px solid #222-#333. Visible, utilitarian, not subtle.

## Components

### Header
- Replace image logo with text: "RANDOM GORSEY" in Tschick Bold, uppercase
- Nav links in monospace, uppercase, wide letter-spacing
- Active link: yellow with underline (text-underline-offset: 4px)
- Inactive: muted gray (#666)
- Layout: flex row, logo left, nav right. Single bottom border, no background distinction
- Mobile: same hamburger pattern, mono styling

### Footer
- Social links as monospace text abbreviations (SP, SC, IG, YT, BC) instead of icon components
- Still link to same URLs
- Copyright in mono, single line
- Layout: flex row, copyright left, socials right. Top border only
- Remove Digitaltableteur branding image (keep as text link if needed)

### Buttons
- Square corners (border-radius: 0)
- Monospace text, uppercase, letter-spacing: 0.1em
- Primary: solid yellow bg, black text
- Secondary: 1px border off-white, off-white text
- Tertiary: 1px border #333, muted text
- Hover: instant color swap (no transition duration, or 50ms max)
- No transform effects on hover

### Post Cards
- Remove card background/container styling
- Left border accent: 3px solid yellow
- Padding-left for content indentation
- Date in mono above title
- "Read more" link in yellow mono with underline
- No shadows, no hover scale

### Side Project Cards (About page)
- Same left-border pattern as post cards
- Remove bg-white/10 backgrounds, hover:scale transforms
- Keep avatar images but square crop (border-radius: 0)

## Animation & Motion

### Timing
- Default transition: 80-150ms
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` — fast attack, hard stop
- Replace all `ease-out` / `easeOut` with this curve

### Framer Motion adjustments
- `heroVariants`: reduce duration to 0.15s, use sharp spring (stiffness: 500, damping: 30)
- `staggerItem`: stagger delay 0.03s (from ~0.1s), duration 0.12s
- `aboutCardItem`: same snappy timing
- Scroll reveal: 0.15s duration, y offset 8px max, no scale

### KineticText
- Keep char/word splitting
- Faster stagger: 0.02s between characters
- Sharper spring: stiffness 600, damping 25

### Lenis
- Tighten lerp value (0.15 → 0.25 or higher) for snappier scroll response

### Page transitions
- Replace smooth crossfade with hard cut
- Brief yellow accent flash (20ms background-color: yellow → content appears)

## Page-Specific Notes

### Home
- Video background: keep, increase overlay opacity to 0.4 for better text contrast against grain
- KineticText "Latest Posts": larger scale, tighter tracking
- Post list: left-border editorial style

### About
- Video background: keep
- Portrait video: square crop (border-radius: 0), keep autoplay
- Side project cards: left-border style, no hover transforms

### Gallery
- Background: gallery slate (#1c2530) instead of black
- Images: high-contrast filter, square corners
- Spacing between images maintained

### Listen
- Loses purple tint, becomes standard black
- Yellow accent on play controls and active states

### Contact
- Loses white/clean aesthetic, becomes black with yellow accents
- Form inputs: square corners, 1px #333 border, mono labels
- Submit button: solid yellow

### Discography
- Loses magenta accent, uses yellow
- Album cards: square corners, left-border or bottom-border accent

## What Changes

- Token system primitives and semantics (stripped palette)
- Section overrides (removed except gallery)
- Border-radius (0 everywhere)
- Header (text logo + mono nav)
- Footer (mono abbreviations)
- Post cards (left-border editorial)
- Buttons (square, mono, uppercase)
- All surfaces (grain texture overlay)
- Animation timing (snappier)
- Typography roles (add mono for labels)
- Dividers (hard, blunt lines)
- Hover states (instant, no gradual transitions)

## What Stays

- Next.js App Router architecture
- Three-layer token system (restructured values)
- Framer Motion (retimed)
- Lenis smooth scroll (tightened)
- Component file structure and naming
- Video backgrounds
- Intersection observer patterns
- KineticText component (faster timing)
- Container/Stack layout components
- SEO/metadata system
- Font files (Europa + Tschick Bold)
- All page routes and data
