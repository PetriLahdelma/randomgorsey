# Stack Research: Bold/Experimental Creative Portfolio

**Project:** Random Gorsey Artist Website
**Researched:** 2026-01-17
**Focus:** Design expression tooling for trend-forward portfolio transformation
**Current Stack:** React 19, TypeScript 5.9, Framer Motion 12.23.24, CSS Modules

---

## Typography

### Recommendation: Variable Fonts + Fluid Type System

**Confidence:** HIGH (verified via multiple authoritative sources)

#### Variable Fonts

Variable fonts have hit mainstream adoption in 2025-2026. Browser support is 95%+.

**Why variable fonts matter for bold design:**
- Single file contains weight, width, slant axes - animate smoothly between states
- Text can respond to scroll, hover, or audio input
- Performance win: one file replaces 6-10 font weights

**Implementation approach:**
```css
/* Fluid typography with clamp() */
:root {
  --font-size-base: clamp(1rem, 0.5rem + 1.5vw, 1.25rem);
  --font-size-display: clamp(2.5rem, 1rem + 5vw, 6rem);
}

/* Variable font animation */
@font-face {
  font-family: 'Display';
  src: url('/fonts/display.woff2') format('woff2-variations');
  font-weight: 100 900;
  font-stretch: 75% 125%;
}

.hero-title {
  font-variation-settings: 'wght' 400, 'wdth' 100;
  transition: font-variation-settings 0.3s ease;
}

.hero-title:hover {
  font-variation-settings: 'wght' 900, 'wdth' 125;
}
```

**Recommended variable fonts for experimental design:**
| Font | Style | Source | Why |
|------|-------|--------|-----|
| Instrument Sans | Clean modern sans | Google Fonts | Wide weight range (400-700), professional |
| Space Grotesk | Geometric quirky | Google Fonts | Distinctive character, variable weight |
| Bricolage Grotesque | Expressive display | Google Fonts | Extreme optical size axis for drama |
| Anybody | Experimental | Google Fonts | Width + weight axes for kinetic type |

#### Fluid Typography System

**Add to stack:**
```bash
# No library needed - pure CSS with clamp()
```

**Type scale recommendation:**
```css
:root {
  /* Modular scale: 1.25 ratio (major third) */
  --step--2: clamp(0.64rem, 0.58rem + 0.29vw, 0.80rem);
  --step--1: clamp(0.80rem, 0.73rem + 0.37vw, 1.00rem);
  --step-0: clamp(1.00rem, 0.91rem + 0.46vw, 1.25rem);
  --step-1: clamp(1.25rem, 1.14rem + 0.57vw, 1.56rem);
  --step-2: clamp(1.56rem, 1.42rem + 0.71vw, 1.95rem);
  --step-3: clamp(1.95rem, 1.78rem + 0.89vw, 2.44rem);
  --step-4: clamp(2.44rem, 2.22rem + 1.11vw, 3.05rem);
  --step-5: clamp(3.05rem, 2.78rem + 1.39vw, 3.81rem);
}
```

#### Layout Shift Prevention with Fontaine

**Confidence:** HIGH (verified via UnJS official docs)

**Add to stack:**
```bash
npm install fontaine
```

**Why:** Prevents Cumulative Layout Shift when web fonts load. Uses `size-adjust`, `ascent-override`, `descent-override` to match fallback fonts to custom fonts.

**Current version:** 0.5.0 (March 2025)

---

## Animation & Motion

### Current: Framer Motion 12.23.24

You already have the best React animation library. The question is: how to use it for bold effects?

### Recommendation: Layer Framer Motion + GSAP for Different Use Cases

**Confidence:** HIGH (verified via Motion official docs and multiple tutorials)

#### Framer Motion: Keep for Component Animation

Motion (formerly Framer Motion) excels at:
- Layout animations (industry-leading)
- Gesture interactions (drag, hover, tap)
- AnimatePresence for enter/exit
- Simple scroll-triggered reveals

**Advanced Framer Motion patterns to add:**

```typescript
// 1. Staggered children with orchestration
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

// 2. Layout animations for dramatic state changes
<motion.div layout layoutId="hero-element">
  {/* Element can morph between different layouts */}
</motion.div>

// 3. Scroll-linked animations using useScroll
const { scrollYProgress } = useScroll();
const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
```

#### GSAP ScrollTrigger: Add for Scroll-Driven Scenes

**Confidence:** MEDIUM (verified via GSAP docs, licensing note below)

**When to use GSAP over Framer Motion:**
- Complex timeline sequences with precise timing
- Scroll-pinning effects
- SVG morphing
- Multi-element choreographed animations

**Add to stack (conditionally):**
```bash
npm install gsap
```

**Licensing note:** GSAP is free for most uses but owned by Webflow. Check license if building tools that compete with Webflow.

**Recommended pattern - combine both:**
```typescript
// Framer Motion for component-level
<motion.div whileHover={{ scale: 1.05 }}>
  {/* Interactive UI elements */}
</motion.div>

// GSAP for scroll-driven hero/scene animations
useEffect(() => {
  gsap.to('.hero-text', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom center',
      scrub: true
    },
    y: 100,
    opacity: 0
  });
}, []);
```

### Text Animation: SplitType + Motion

**Confidence:** HIGH (verified via Motion docs and npm)

**Add to stack:**
```bash
npm install split-type
```

Motion now has built-in `splitText()` function (as of recent versions), but SplitType offers more control for complex text animations.

**Why kinetic typography matters for portfolios:**
- Designers expect animated headlines
- Text that responds to scroll creates engagement
- Character-level animation enables dramatic reveals

```typescript
import SplitType from 'split-type';
import { animate, stagger } from 'framer-motion';

// Split text into characters
const text = new SplitType('.hero-title', { types: 'chars' });

// Animate with stagger
animate(text.chars,
  { opacity: [0, 1], y: [20, 0] },
  { delay: stagger(0.03) }
);
```

### Smooth Scroll: Lenis

**Confidence:** HIGH (verified via Lenis official site and GitHub)

**Add to stack:**
```bash
npm install lenis
```

**Why Lenis over native scroll:**
- Ultra-lightweight (3KB)
- Works with `position: sticky` (others don't)
- Syncs perfectly with GSAP ScrollTrigger
- Creates the "buttery" feel expected on creative sites

**Current best practice:** Lenis + Framer Motion/GSAP is the stack used by top creative agencies (Awwwards-level sites).

---

## CSS Techniques

### Modern CSS for Bold Layouts

**Confidence:** HIGH (all features have 95%+ browser support)

#### Container Queries

**Why:** Components that adapt to their container, not viewport. Essential for design systems and flexible cards.

```css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}
```

**Browser support:** 97%+ (Chrome 105+, Safari 16+, Firefox 110+)

#### CSS Subgrid

**Why:** Child elements align to parent grid without redefining layout. Critical for cards with variable content.

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.gallery-item {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3;
}
```

**Browser support:** 97%+ (Chrome 117+, Safari 16+, Firefox 71+)

#### CSS :has() Selector

**Why:** The "parent selector" enables layout changes based on content. No JavaScript needed for conditional styling.

```css
/* Card with image gets different layout */
.card:has(img) {
  display: grid;
  grid-template-columns: 200px 1fr;
}

/* Card without image centers content */
.card:not(:has(img)) {
  text-align: center;
}

/* Tight spacing when heading followed by paragraph */
h1:has(+ p) {
  margin-bottom: 0.5rem;
}
```

**Browser support:** 97%+ (Chrome 105+, Safari 15.4+, Firefox 121+)

#### CSS Scroll-Driven Animations

**Confidence:** MEDIUM (Chrome/Firefox support, Safari 26 beta)

**Why:** Scroll-linked animations without JavaScript. Runs on compositor thread for 60fps.

```css
@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.reveal {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 10% cover 30%;
}
```

**Progressive enhancement:**
```css
@supports ((animation-timeline: scroll()) and (animation-range: 0% 100%)) {
  /* Scroll-driven animations */
}
```

---

## Experimental Tools (Optional)

### React Three Fiber (3D)

**Confidence:** MEDIUM (powerful but heavy)

**When to consider:**
- Hero section with 3D element
- Interactive 3D showcase
- WebGL effects

**Why NOT to default to:**
- Significant bundle size impact
- Performance requires careful optimization
- Overkill for most portfolio needs

**If using:**
```bash
npm install @react-three/fiber @react-three/drei
```

**Recommendation:** Only add if there's a specific 3D concept. Don't add "because it's cool."

### Shader Effects

**Confidence:** LOW (advanced, niche)

For distortion effects, image transitions, or canvas-based backgrounds.

Options:
- `gl-react` - React bindings for WebGL shaders
- `@react-three/postprocessing` - Post-processing effects for R3F

**Recommendation:** Skip unless there's a specific effect in mind. High effort, niche appeal.

---

## What to Avoid

### Overused / Dated

| Avoid | Why | What Instead |
|-------|-----|--------------|
| Heavy parallax scrolling | Causes nausea, slow load, feels 2015 | Subtle micro-parallax or scroll-driven CSS |
| Full-screen hero videos | Slow, distracting, bandwidth hog | Bold typography + subtle motion |
| Lottie for everything | Overused, often gratuitous | Targeted use or GSAP/Motion animations |
| Scroll-jacking | Users want control | Lenis smooth scroll (enhances, doesn't hijack) |
| Generic card hover effects | "Lift on hover" is everywhere | Contextual, meaningful interactions |
| Glassmorphism everywhere | Trend peaked 2022-2023 | Use sparingly for specific UI elements |

### Performance Hogs

| Avoid | Why |
|-------|-----|
| Unoptimized 3D scenes | WebGL tanks mobile performance |
| Multiple animation libraries | Bundle bloat, conflicting approaches |
| Unsubsetted fonts | 400KB font files destroy load time |
| Canvas backgrounds without purpose | GPU drain for decoration |

### Anti-Patterns for Creative Sites

| Anti-Pattern | Why Bad |
|--------------|---------|
| Animating everything | No hierarchy, overwhelming, accessibility nightmare |
| Dark mode only | Assumes audience preference, accessibility issues |
| No reduced motion respect | Excludes users with vestibular disorders |
| Loading screens | Users leave before content loads |

---

## Recommendations Summary

### Add to Stack (Prioritized)

| Priority | Package | Version | Purpose | Confidence |
|----------|---------|---------|---------|------------|
| 1 | Variable fonts (self-hosted) | N/A | Animated typography, performance | HIGH |
| 2 | `lenis` | ^1.1 | Smooth scroll foundation | HIGH |
| 3 | `split-type` | ^0.3 | Text animation splits | HIGH |
| 4 | `fontaine` | ^0.5 | Font loading CLS prevention | HIGH |
| 5 | `gsap` | ^3.12 | Complex scroll animations | MEDIUM |

### Keep As-Is

| Package | Notes |
|---------|-------|
| `framer-motion` 12.23 | Already best-in-class for React |
| CSS Modules | Fine for this project size |
| TypeScript | Non-negotiable |

### Do Not Add

| Package | Reason |
|---------|--------|
| `@react-three/fiber` | Only if specific 3D concept emerges |
| `locomotive-scroll` | Lenis is lighter and more compatible |
| Additional CSS framework | CSS Modules + modern CSS is sufficient |

---

## Installation Summary

```bash
# Core additions
npm install lenis split-type fontaine

# Optional (add when needed for complex scroll scenes)
npm install gsap
```

---

## Sources

### Typography
- [FontsArena: Design Trends 2025](https://fontsarena.com/blog/design-trends-2025-variable-fonts-responsive-typography-studio-workflows/)
- [Elegant Themes: Optimal Typography 2025](https://www.elegantthemes.com/blog/design/optimal-typography-for-web-design)
- [UnJS Fontaine](https://github.com/unjs/fontaine)

### Animation
- [Motion Official Docs](https://motion.dev/)
- [Motion: GSAP vs Motion Comparison](https://motion.dev/docs/gsap-vs-motion)
- [Luxis Design: Advanced Framer Motion 2025](https://www.luxisdesign.io/blog/advanced-framer-motion-animation-techniques-for-2025)
- [Lenis Official](https://lenis.darkroom.engineering/)
- [SplitType GitHub](https://github.com/lukePeavey/SplitType)

### CSS
- [MDN: Container Queries](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Containment/Container_queries)
- [Frontend Masters: Modern CSS 2025](https://frontendmasters.com/blog/what-you-need-to-know-about-modern-css-2025-edition/)
- [Scroll-Driven Animations](https://scroll-driven-animations.style/)
- [LogRocket: CSS :has() Selector](https://blog.logrocket.com/blog/different-ways-to-use-css-has/)

### Design Trends
- [Muzli: Top 100 Creative Portfolios 2025](https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/)
- [The Hoop Studio: Design Trends 2026](https://www.thehoopstudio.com/resources/insights/design-trends-to-leave-behind-and-whats-next-for-web-in-2026)
- [Website Designers: Overused Trends](https://websitedesigners.com/blog/web-design-trends-that-are-overused-and-what-to-try-instead/)
