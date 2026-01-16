# Pitfalls Research: Creative Portfolio / Experimental Design

**Domain:** Creative portfolio website with experimental design direction
**Researched:** 2026-01-17
**Overall confidence:** HIGH (multiple sources, verified patterns)

## Executive Summary

Creative portfolios occupy a unique design space where "breaking rules" is expected, but breaking the wrong rules destroys the experience. The line between "bold and intentional" versus "overdone and trying too hard" is real but navigable. This research catalogues the specific failure modes - where creative ambition crosses into user hostility, where trends become dated, and where "experimental" becomes an excuse for half-baked execution.

**The core tension:** Design-literate audiences notice when something is intentionally designed. They also notice when it's pretentiously designed. The difference often comes down to restraint and purpose.

---

## Visual Pitfalls

Where bold becomes dated, desperate, or derivative.

### Pitfall 1: The Webflow Sameness Problem
**What goes wrong:** Sites look "creative" but identical - same rounded corners, same clean animations, same minimal aesthetic that was exciting in 2022 but now reads as template-driven.

**Warning signs:**
- Looking at Awwwards for "inspiration" and copying surface aesthetics
- Using trendy transitions because they exist, not because they serve content
- Design decisions that can't be justified beyond "I saw it somewhere"

**Prevention:**
- Start with content and concept, not visual trends
- Ask "why this choice?" for every visual decision - if the answer is "it looks good," dig deeper
- Reference diverse inspiration (print, architecture, film) not just web portfolios

**When to address:** Phase 1 - establish design direction before building

**Confidence:** HIGH - multiple sources confirm the "everything looks the same" criticism of modern creative portfolios

---

### Pitfall 2: Brutalism Gone Wrong
**What goes wrong:** Brutalism/neo-brutalism used as a shortcut to "edgy" without understanding the aesthetic, resulting in sites that look unfinished, broken, or amateurish rather than intentionally raw.

**Warning signs:**
- Using brutalist elements (large type, harsh colors) without underlying structure
- Inconsistent application - some parts brutalist, others not
- Users genuinely confused whether the site is broken
- "This is what the cool kids are doing" as rationale

**Prevention:**
- Brutalism works when it has internal consistency and clear information hierarchy
- If using raw aesthetics, navigation and core UX must still be intuitive
- Test with users - "intentionally raw" should still be immediately navigable
- Consider if the brutalist aesthetic actually serves the content/personality or is just trend-chasing

**Examples of failure:** Sites featured on Awwwards for aesthetics but criticized for "feeling like placeholders" or "looking incomplete" - the brutalist excuse hiding poor execution.

**When to address:** Phase 1 - core design direction decision

**Confidence:** HIGH - NN/g and multiple design sources cite brutalism/anti-design as frequently misapplied

---

### Pitfall 3: Contrast and Readability Sacrifice
**What goes wrong:** Prioritizing visual drama over legibility. Dark grays on black backgrounds, thin white text on busy images, sacrificing WCAG requirements for aesthetic "sophistication."

**Warning signs:**
- Text that looks fine on your high-end monitor but dies on average screens
- Low contrast rationalized as "sophisticated" or "editorial"
- Dark mode that wasn't properly designed (colors just inverted)
- Logos/graphics disappearing against backgrounds

**Prevention:**
- Enforce 4.5:1 contrast minimum for body text (WCAG AA)
- Test on multiple devices and lighting conditions
- Dark mode requires its own complete design pass, not just color inversion
- Use dark gray (#1a1a1a) instead of pure black for backgrounds
- Typography weight needs adjustment between light/dark modes

**When to address:** Phase 1 - establish color system with accessibility built in

**Confidence:** HIGH - Smashing Magazine, NN/g, and WCAG documentation verify these patterns

---

### Pitfall 4: Dated Trend Accumulation
**What goes wrong:** Layering multiple "current" trends that will collectively age the site rapidly. Heatmapping gradients, glassmorphism, bento grids, neon accents - individually each can work, together they create a time capsule.

**Warning signs:**
- Design mood board is mostly from Dribbble posts from the last 12 months
- Multiple "2025 web design trends" present simultaneously
- Decisions driven by "this is trending" rather than "this serves the content"

**Prevention:**
- Limit to 1-2 trendy elements maximum; let the rest be timeless
- Favor trends with roots in lasting design principles (editorial typography) over surface fads (specific gradient styles)
- Ask: "Will this choice still feel intentional in 3 years?"
- The PROJECT.md explicitly bans "bento grids" and "startup clichés" - enforce this

**2025-2026 specific traps:**
- Bento box layouts (already oversaturated)
- AI-generated decorative elements
- Glassmorphism beyond subtle accents
- Rainbow gradients

**When to address:** Phase 1 - establish what's in-bounds and out-of-bounds aesthetically

**Confidence:** MEDIUM - trend prediction is inherently uncertain, but multiple sources confirm certain elements are already dated

---

## Motion Pitfalls

Where animation becomes annoying, slow, or hostile.

### Pitfall 5: The Animation Hangover
**What goes wrong:** So much motion that users feel disoriented, nauseous, or simply overwhelmed. We're currently in what one designer called "the Drop Shadow Era of motion" - designers abuse new animation capabilities before developing restraint.

**Warning signs:**
- Multiple elements animating simultaneously
- Animation for its own sake rather than serving content
- Users consciously noticing the animation (when animation is good, it's invisible)
- Continuous looping animations, especially large ones
- Fan noise / CPU spikes during page interaction

**Prevention:**
- One focal animation at a time
- Motion should guide attention, not demand it
- Test on lower-powered devices - if it stutters, simplify
- Ask: "What does this animation communicate?" If the answer is "nothing," remove it
- Framer Motion's power is restraint - use it for meaningful transitions, not decoration

**When to address:** Phase 2 - interaction design, with performance testing

**Confidence:** HIGH - multiple UX sources and web.dev performance documentation

---

### Pitfall 6: Scroll Hijacking
**What goes wrong:** Overriding native scroll behavior, forcing users to consume content at your pace rather than theirs. Described as "the UX crime nobody asked for."

**Warning signs:**
- Parallax effects that require precise scroll speed to work
- Scroll snapping that traps users between sections
- Horizontal scrolling on pages that should scroll vertically
- Any modification to natural scroll momentum
- User testing showing scroll-related frustration

**Prevention:**
- Default: Do not hijack scroll. Period.
- If you must: Only on isolated, clearly bounded experiences (a single hero section, not the whole page)
- Never force users to scroll at your speed
- Test extensively on mobile/tablet - scroll hijacking almost always breaks on touch devices
- Provide escape hatches (skip links, visible navigation)

**Examples of failure:** Apple's Mac Pro page is cited as "one of the worst offenders" - beautiful but frustrating. Many Awwwards winners feature scroll effects that "severely hurt the user experience."

**When to address:** Phase 2 - any scroll-based interactions need careful implementation

**Confidence:** HIGH - NN/g, Web Designer Depot, and multiple UX sources strongly warn against this

---

### Pitfall 7: Preloader Theater
**What goes wrong:** Elaborate loading animations that exist to show off design skill rather than serve users. 3-5 second preloaders for sites that could load instantly feel self-indulgent.

**Warning signs:**
- Static timer preloaders (disappear after X seconds regardless of actual load state)
- Preloaders on subsequent page navigations (not just initial load)
- Complex animated preloaders that themselves require loading
- Users waiting to see content they could already see

**Prevention:**
- Question whether you need a preloader at all - fast sites don't need them
- If needed, make it adaptive (disappears when content is ready, not after arbitrary time)
- Skeleton screens often provide better perceived performance than fancy spinners
- First visit only - subsequent navigations should be instant
- Keep preloader under 1.5 seconds maximum

**When to address:** Phase 2 - page transitions and loading states

**Confidence:** HIGH - Core Web Vitals documentation and UX research strongly support this

---

### Pitfall 8: Accessibility Motion Neglect
**What goes wrong:** Ignoring that 35%+ of adults will experience vestibular dysfunction at some point. Animations can cause genuine physical discomfort - dizziness, nausea, headaches.

**Warning signs:**
- No `prefers-reduced-motion` support
- Parallax scrolling without alternative
- Large-scale zooming/panning animations
- Continuous looping background motion
- No way for users to disable motion

**Prevention:**
- Implement `prefers-reduced-motion` media query throughout
- Provide a manual motion toggle in UI for users who haven't set system preference
- For reduced-motion: Replace animated transitions with instant cuts or subtle fades
- Parallax should disable completely, not just reduce
- Test the reduced-motion experience as a first-class design, not an afterthought

**Implementation:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**When to address:** Phase 2 - bake into animation system from the start

**Confidence:** HIGH - WCAG 2.3.3, web.dev accessibility documentation, Smashing Magazine

---

## Typography Pitfalls

Where expressive becomes illegible or pretentious.

### Pitfall 9: Font Chaos
**What goes wrong:** Using too many typefaces, creating visual noise instead of hierarchy. Common in portfolios where designers want to "show range."

**Warning signs:**
- More than 2-3 font families on a single page
- Different fonts for different sections without system logic
- Display fonts used for body text
- Mixing multiple decorative fonts

**Prevention:**
- Maximum 2-3 font families site-wide
- One for display/headlines, one for body, optionally one for UI/code
- Establish clear typographic scale and stick to it
- If a font doesn't serve a specific, justified purpose, remove it

**When to address:** Phase 1 - typographic system is foundational

**Confidence:** HIGH - Dribbble design blog, Creative Bloq, and typography best practices

---

### Pitfall 10: Illegible "Artsy" Typography
**What goes wrong:** Choosing fonts that prioritize aesthetic over readability. Experimental typography has a place, but not for content users need to actually read.

**Warning signs:**
- Body text in display faces
- Ultra-thin weights at small sizes
- Negative leading on readable content (overlapping lines)
- Custom/experimental fonts for navigation
- Forced letter-spacing that destroys word shapes

**Prevention:**
- Experimental typography only for hero/display moments, never for body content
- Body text: proven readable typefaces (system fonts, well-designed web fonts)
- Test readability at actual use sizes, on actual screens
- If users have to work to read it, they won't

**Acceptable experimental typography zones:**
- Hero headlines
- Section titles (if large)
- Decorative elements not meant to be "read"

**When to address:** Phase 1 - separate display system from reading system

**Confidence:** HIGH - WebFX typography guide, Kreafolk, and readability research

---

### Pitfall 11: Scale Without Hierarchy
**What goes wrong:** Large type everywhere removes the meaning of "large." When everything is bold, nothing is emphasized.

**Warning signs:**
- Multiple competing headlines on a single viewport
- No clear visual entry point on pages
- Users' eyes bouncing rather than flowing
- "Make it bigger" applied uniformly

**Prevention:**
- Establish clear scale system with meaningful steps (e.g., 16/20/28/40/64/96)
- One focal element per viewport (usually)
- Use scale changes purposefully to guide reading order
- Whitespace is as important as scale for hierarchy

**When to address:** Phase 1 - typographic scale system

**Confidence:** HIGH - fundamental design principle with strong consensus

---

## Performance Pitfalls

Where creative becomes sluggish or hostile.

### Pitfall 12: Video Background Syndrome
**What goes wrong:** Video backgrounds that destroy load times, drain batteries, and often don't even work on mobile.

**Warning signs:**
- Video files over 5-10MB
- Videos longer than 30 seconds
- No fallback image for mobile/slow connections
- Videos that autoplay sound
- Continuous looping videos

**Prevention:**
- Compress aggressively (target 5-10MB maximum)
- Provide static image fallback
- Disable video on mobile or connections below threshold
- Keep videos short (under 30 seconds)
- Always muted by default
- Consider: Do you actually need video, or would a static image work?

**Implementation:**
- Use `poster` attribute for fallback image
- Lazy load video until user scrolls to it
- Consider intersection observer to pause off-screen videos

**When to address:** Any phase using video, but establish policy in Phase 1

**Confidence:** HIGH - verified across multiple performance and UX sources

---

### Pitfall 13: WebGL/3D Overreach
**What goes wrong:** Adding WebGL effects because they're impressive, without accounting for performance, mobile support, or whether they actually serve the content. Browser crashes, multi-minute load times, dead mobile experiences.

**Warning signs:**
- 3D models that take 30+ seconds to load
- Effects that only work on high-end desktop hardware
- WebGL as decoration rather than content
- "Works on my machine" syndrome
- Mobile users seeing blank screens or crashes

**Prevention:**
- The PROJECT.md already marks WebGL as out-of-scope - respect this
- If pursuing in v2: Provide graceful fallbacks, optimize models aggressively, use Web Workers
- Test on mid-range hardware, not your development machine
- Consider: Is 3D the right solution, or is it showing off?

**When to address:** Currently out of scope; if revisited, needs dedicated research phase

**Confidence:** HIGH - WebGL performance documentation and portfolio examples

---

### Pitfall 14: Death by Animation Properties
**What goes wrong:** Animating CSS properties that trigger layout recalculation (width, height, margin, padding) instead of compositor-friendly properties (transform, opacity).

**Warning signs:**
- Animations that feel "janky" even on good hardware
- Layout shift during animations
- High CPU usage during transitions
- Inconsistent animation smoothness

**Prevention:**
- Only animate `transform` and `opacity` where possible
- Use `will-change` sparingly and correctly
- Test with Chrome DevTools Performance panel
- Prefer CSS animations over JavaScript for simple transitions
- Break long JavaScript tasks for better INP scores

**Implementation:**
```css
/* Bad - causes layout recalculation */
.element {
  transition: width 0.3s, margin-left 0.3s;
}

/* Good - compositor-only properties */
.element {
  transition: transform 0.3s, opacity 0.3s;
}
```

**When to address:** Phase 2 - animation system implementation

**Confidence:** HIGH - web.dev performance documentation, Core Web Vitals guidance

---

### Pitfall 15: DOM Complexity Explosion
**What goes wrong:** Deep nesting, excessive elements for visual effects, large DOM sizes that tank INP (Interaction to Next Paint) scores.

**Warning signs:**
- DOM size exceeding 1500 nodes
- Nested wrappers for styling purposes
- Layout thrashing in scroll handlers
- Sluggish interactions on content-heavy pages

**Prevention:**
- Minimize DOM depth and element count
- Use CSS for effects rather than extra elements where possible
- Use CSS containment (`contain: content`) for isolated sections
- Batch DOM reads/writes to avoid layout thrashing
- Consider virtualization for long lists

**When to address:** Phase 3 - performance optimization pass

**Confidence:** HIGH - Core Web Vitals 2025 documentation emphasizes INP optimization

---

## Content Pitfalls

Where personality becomes cringe or pretentious.

### Pitfall 16: The Pretentious About Page
**What goes wrong:** Bio copy that's self-important, buzzword-laden, or trying too hard to be clever. Design-literate audiences have a finely tuned cringe detector.

**Warning signs:**
- Third-person bio for a personal site
- "Passionate about creating digital experiences"
- Starting with a quote from someone famous
- Leading with education/credentials over work
- Vague claims without supporting evidence
- Excessive self-importance ("visionary," "thought leader")

**Prevention:**
- First person, conversational, specific
- Show personality through actual opinions, not marketingspeak
- Lead with work, not credentials
- If making claims ("I focus on X"), provide evidence (show X in the work)
- Read it aloud - if it sounds like a LinkedIn profile, rewrite it

**Examples of failure:** Creative director cites portfolios that lead with famous quotes as immediate red flags - "why would you start that sales pitch with someone else's words?"

**When to address:** Phase 3 - content writing phase

**Confidence:** HIGH - multiple portfolio critique sources

---

### Pitfall 17: Context-Free Work Display
**What goes wrong:** Beautiful portfolio pieces with no explanation of the problem, process, or your specific contribution. Leaves viewers guessing.

**Warning signs:**
- Gallery of images without any text
- Large screenshots with no context
- Unclear what role you played in team projects
- No problem/solution framing

**Prevention:**
- For each project: Problem, process, your role, outcome
- Doesn't need to be long - a few sentences can suffice
- Be honest about your contribution on team projects
- Show process, not just polish

**When to address:** Phase 3 - content structure

**Confidence:** HIGH - UXfolio research and creative director interviews

---

### Pitfall 18: Aesthetic Inconsistency
**What goes wrong:** The meta-problem of a portfolio that doesn't practice what it preaches. Claiming to be a typography expert with inconsistent type. Claiming to care about UX with confusing navigation.

**Warning signs:**
- Design quality of portfolio doesn't match quality of work shown
- Inconsistent attention to detail across pages
- The "cobbler's children have no shoes" problem

**Prevention:**
- Apply the same standards to your portfolio as to client work
- Every page, every component, every detail
- If you claim expertise in an area, the portfolio must demonstrate it

**When to address:** Every phase - meta-quality concern

**Confidence:** HIGH - fundamental authenticity principle

---

## Navigation & Interaction Pitfalls

Where creative navigation becomes confusing navigation.

### Pitfall 19: Custom Cursor Crimes
**What goes wrong:** Custom cursors that obscure content, don't work on touch devices, or replace understood affordances with ambiguity.

**Warning signs:**
- Cursor that changes shape based on position in ways that aren't intuitive
- Cursor that blocks interaction on mobile
- Cursor effects that create visual noise
- Users unsure what's clickable

**Prevention:**
- Custom cursors should enhance hover feedback, not replace core functionality
- Always test on touch devices (cursor should be hidden or irrelevant)
- Cursor changes should communicate action, not just decoration
- Keep cursor size reasonable - don't obscure content

**When to address:** Phase 2 - interaction design

**Confidence:** HIGH - Smashing Magazine navigation analysis, HubSpot cursor UX article

---

### Pitfall 20: Navigation Hide and Seek
**What goes wrong:** Hiding navigation for aesthetic reasons. "Out of sight means out of mind." Users who can't find navigation leave.

**Warning signs:**
- Hamburger menu on desktop (where you have space)
- Navigation that appears only on hover or scroll
- No clear indication of current page/section
- Multiple competing navigation systems

**Prevention:**
- Show navigation unless space genuinely forces hiding it
- Always indicate current location
- Consistent navigation across all pages
- Don't make users think about how to navigate

**Statistic:** Nearly 90% of people might leave a site if navigation is hard. 55% of visitors can be lost to poor navigation design.

**When to address:** Phase 1 - navigation is foundational

**Confidence:** HIGH - NN/g navigation research, Smashing Magazine

---

### Pitfall 21: Interaction Ambiguity
**What goes wrong:** Unclear what's interactive. Creative visual design that doesn't communicate affordances.

**Warning signs:**
- Users clicking non-interactive elements expecting something to happen
- Interactive elements that don't look interactive
- Hover states that are so subtle they're invisible
- No focus states for keyboard navigation

**Prevention:**
- Cursor change on interactive elements
- Visible hover states (not just color, but movement/scale)
- Focus states that meet WCAG requirements
- Test with users: "What do you think you can click?"

**When to address:** Phase 2 - interaction design system

**Confidence:** HIGH - fundamental UX principle

---

## Meta Pitfalls

Where "experimental" becomes an excuse.

### Pitfall 22: The Awwwards Trap
**What goes wrong:** Optimizing for awards/recognition rather than actual user experience. Beautiful sites that are frustrating to use.

**Warning signs:**
- Prioritizing visual wow over usability
- "This will look great in a case study" driving decisions
- Ignoring negative user feedback because the design is "intentional"
- Performance sacrificed for visual effects

**Prevention:**
- Design-literate audiences notice bad UX too
- An impressive site that's frustrating to use impresses no one
- Ask: "Would I actually want to use this?"
- Awards are outcomes, not goals

**Example:** Awwwards itself is cited as having "scattered menus" that "frustrate visitors" - the platform celebrating beautiful sites has UX problems.

**When to address:** Every phase - mindset issue

**Confidence:** HIGH - multiple UX professionals critique the Awwwards aesthetic

---

### Pitfall 23: Experimental as Excuse
**What goes wrong:** Using "it's experimental" to justify unfinished work, poor decisions, or lack of testing.

**Warning signs:**
- "It's supposed to be confusing" to justify bad UX
- Shipping before it's ready because "it's a playground"
- Blaming users for not "getting it"
- Technical issues rationalized as aesthetic choices

**Prevention:**
- Experimental means pushing boundaries intentionally, not avoiding standards
- "Experimental" should mean "I tried something new," not "I didn't finish"
- Even experimental work needs internal consistency
- Test with users - their confusion is data, not their problem

**When to address:** Every phase - cultural discipline

**Confidence:** HIGH - this is the core risk for the project

---

### Pitfall 24: Trend Addiction
**What goes wrong:** Constantly adding new trends because they're new, creating a site that's a collage of moments rather than a coherent vision.

**Warning signs:**
- "What's new in 2026 web design?" driving decisions
- Adding features because they're possible, not necessary
- No clear design vision, just collected influences
- Frequent major aesthetic changes

**Prevention:**
- Establish core design principles that outlast trends
- Before adding anything trendy, ask: "Does this serve the vision?"
- "Restraint" is the counter-trend that never dates
- Commit to a direction and refine it, rather than constantly pivoting

**When to address:** Phase 1 - establish durable principles

**Confidence:** MEDIUM - subjective, but multiple sources support the "restraint" counter-argument

---

## Phase-Specific Risk Summary

| Phase | Highest Risk Pitfalls | Prevention Strategy |
|-------|----------------------|---------------------|
| **Phase 1: Foundation** | Trend dating, Font chaos, Navigation hiding, Brutalism misuse | Establish durable design principles before building |
| **Phase 2: Motion/Interaction** | Scroll hijacking, Animation overuse, Accessibility neglect, Custom cursor crimes | Implement prefers-reduced-motion from start, test on low-end devices |
| **Phase 3: Content/Polish** | Pretentious copy, Context-free work, Aesthetic inconsistency | Apply same standards to portfolio as to work shown |
| **Ongoing** | Awwwards trap, Experimental as excuse, Performance degradation | Regular user testing, performance budgets |

---

## Quick Detection Checklist

Before shipping any phase, ask:

### Is it intentional?
- [ ] Can I articulate why each design choice was made?
- [ ] Would I make the same choice if no one was watching?
- [ ] Does this serve the content/user, or just look impressive?

### Is it usable?
- [ ] Can users navigate without thinking about navigation?
- [ ] Do interactions have clear affordances?
- [ ] Does it work on mobile/tablet as well as desktop?

### Is it accessible?
- [ ] Does it work with prefers-reduced-motion enabled?
- [ ] Does text meet contrast requirements?
- [ ] Can keyboard users navigate effectively?

### Is it performant?
- [ ] Does it load quickly on average connections?
- [ ] Do animations run smoothly on mid-range devices?
- [ ] Have you checked Core Web Vitals?

### Will it last?
- [ ] Will this still feel intentional in 2-3 years?
- [ ] Are trendy elements limited and purposeful?
- [ ] Does it have internal consistency?

---

## Sources

### Verified (HIGH confidence)
- [NN/g: Brutalism and Antidesign](https://www.nngroup.com/articles/brutalism-antidesign/)
- [NN/g: Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/)
- [NN/g: Dark Mode Issues](https://www.nngroup.com/articles/dark-mode-users-issues/)
- [NN/g: Menu Design Checklist](https://www.nngroup.com/articles/menu-design/)
- [web.dev: Animations and Performance](https://web.dev/animations-and-performance/)
- [web.dev: prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)
- [Smashing Magazine: Navigation Analysis](https://www.smashingmagazine.com/2012/03/an-analysis-navigation-portfolio-websites/)
- [Smashing Magazine: Reduced Motion Design](https://www.smashingmagazine.com/2020/09/design-reduced-motion-sensitivities/)
- [MDN: prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
- [A List Apart: Safer Web Animation](https://alistapart.com/article/designing-safer-web-animation-for-motion-sensitivity/)

### WebSearch Verified (MEDIUM confidence)
- [Creative Director Portfolio Warning Signs](https://www.linkedin.com/pulse/creative-directors-5-biggest-portfolio-warning-signs-stephen-gates)
- [Web Designer Depot: How Scrolljacking Breaks UX](https://webdesignerdepot.com/how-scrolljacking-breaks-ux-fundamentals/)
- [Envato: Scroll Hijacking](https://elements.envato.com/learn/scroll-hijacking)
- [UXfolio: Creative Portfolio Guide](https://blog.uxfol.io/creative-portfolio/)
- [Sophie Paxton: Stop Gratuitous UI Animation](https://medium.com/@sophie_paxtonUX/stop-gratuitous-ui-animation-9ece9aa9eb97)
- [NitroPack: Core Web Vitals Strategy](https://nitropack.io/blog/core-web-vitals-strategy/)
- [PixelFreeStudio: WebGL Optimization](https://blog.pixelfreestudio.com/how-to-optimize-webgl-for-high-performance-3d-graphics/)
