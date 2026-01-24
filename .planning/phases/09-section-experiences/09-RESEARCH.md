# Phase 9: Section Experiences - Research

**Researched:** 2026-01-17
**Domain:** Section-specific visual identities and experiences
**Confidence:** HIGH (all tools/patterns already built, this is composition work)

## Summary

Phase 9 applies the foundation built in Phases 1-8 to create distinct visual personalities for each page section. This is a composition and creative direction phase rather than infrastructure work. The token system (Phase 2), motion system (Phase 4), visual effects (Phase 7), and page transitions (Phase 8) provide all necessary building blocks.

**Current state:** Pages have video backgrounds with inline styles, basic CSS Module styling, and data-section attributes connecting to token overrides. They use pageVariants for enter animations and RevealOnScroll for content reveals, but lack distinct experiential character.

**Gap to close:** Transform pages from "functional with video backgrounds" to "distinct personalities that feel intentionally designed." Each section should have unique motion character, typography treatment, and visual hierarchy while maintaining cohesion through the token system.

**Primary recommendation:** Enhance each page incrementally using the existing toolkit (VideoBackground, KineticText, RevealOnScroll, layout primitives) with section-specific motion timing, unique visual elements, and characteristic interactions.

## Current State Analysis

### Page Inventory

| Page | Video BG | data-section | Content Type | Current Character |
|------|----------|--------------|--------------|-------------------|
| Home | home_canvas.webm | hero | Posts feed | Dark, functional |
| Gallery | logo_canvas.webm | gallery | Image grid + lightbox | Blue/yellow, minimal |
| Listen | rg-glitch-bg.webm | listen | Spotify + SoundCloud embeds | Green/magenta, static |
| About | promo_canvas.webm | about | Bio + side projects | Magenta/yellow, warm |
| Contact | contact_canvas.webm | contact | Form fields | Yellow/blue, professional |
| Discography | FIRGO002_canvas.webm | discography | Album grid | Dark, minimal |
| NotFound | rg-glitch-bg.webm | (none) | Error message | Glitch aesthetic |

### What Each Page Has

**Home.tsx (145 lines)**
- WebM video background (inline styles, fixed position)
- Posts feed with lazy loading
- RevealOnScroll on h1 and each PostCard
- "Load More" and "Back to Top" buttons
- Uses useLenisScrollTo for scroll

**Gallery.tsx (150 lines)**
- WebM video background
- Image grid with hover effects
- AnimatePresence lightbox overlay
- Keyboard navigation (arrows, escape)
- RevealOnScroll on h1 and each image

**Listen.tsx (82 lines)**
- WebM video background
- Spotify iframe embed
- SoundCloud iframe embed
- Static h1 and description text
- No RevealOnScroll usage

**About.tsx (106 lines)**
- WebM video background
- Portrait video/image with fallback
- Long bio text
- Side projects list with card UI
- RevealOnScroll on most elements

**Contact.tsx (326 lines)**
- WebM video background
- Form with validation
- Rate limiting
- Success modal
- Disclaimer text

**Discography.tsx (105 lines)**
- WebM video background
- Album art grid
- Buy links to Bandcamp
- Title with creative line break

### Section Token Overrides (Already Defined)

```css
/* sections.css - existing */
[data-section="hero"]     -> Dark dramatic (neutral-950 bg, yellow accent)
[data-section="gallery"]  -> Light airy (neutral-100 bg, magenta accent)
[data-section="listen"]   -> Purple moody (oklch purple bg, blue accent)
[data-section="contact"]  -> Professional white (white bg, neutral primary)
[data-section="about"]    -> Warm inviting (warm off-white bg, orange accent)
[data-section="discography"] -> Dark with magenta accent
```

## Available Toolkit

### Visual Effects Components

| Component | Capability | Current Usage |
|-----------|------------|---------------|
| VideoBackground | Tier-aware video with poster fallback | NOT USED (pages use inline video) |
| HeroImage | Full-bleed responsive images with Bleed | NOT USED |
| Scene3D | R3F Canvas with tier-scaled quality | NOT USED |
| ParticleField | Instanced particles with tier scaling | NOT USED |

### Motion Components

| Component | Capability | Current Usage |
|-----------|------------|---------------|
| pageVariants | Page enter/exit animations | ALL PAGES |
| RevealOnScroll | Scroll-triggered reveals | 5 OF 6 PAGES (not Listen) |
| KineticText | Character/word animation | NOT USED |
| Custom cursor | 3 variants (default, hover, text) | AVAILABLE |
| staggerContainer/Item | List stagger animations | NOT USED |

### Layout Primitives

| Component | Capability | Current Usage |
|-----------|------------|---------------|
| Stack | Vertical flow with gap variants | NOT USED |
| Cluster | Horizontal wrapping | NOT USED |
| Grid | Container query responsive grid | NOT USED |
| Container | Max-width constraint | NOT USED |
| Bleed | Full-viewport breakout | NOT USED |

### Typography Components

| Component | Capability | Current Usage |
|-----------|------------|---------------|
| Heading | Fluid typography h1-h6 | NOT USED (uses native h1) |
| Text | Body text variants | NOT USED |

## Gap Analysis

### Infrastructure Gaps (None)

All required infrastructure exists. This phase is purely about composition.

### Usage Gaps

1. **Video backgrounds use inline styles** - Should use VideoBackground component for proper tier awareness
2. **No KineticText on any page** - Hero headings miss opportunity for impact
3. **Layout primitives unused** - Pages have ad-hoc container styles
4. **RevealOnScroll inconsistent** - Listen page has no scroll reveals
5. **Cursor variants unused** - No hover state changes on interactive elements
6. **No stagger animations** - Lists appear as single blocks
7. **Scene3D/ParticleField unused** - No WebGL enhancement on any page

### Character Gaps

1. **All pages feel similar** - Same video-behind-content pattern, same motion timing
2. **No section-specific motion** - Every page uses identical pageVariants
3. **Typography treatment uniform** - Same heading style everywhere
4. **No visual anchors** - Missing memorable visual elements per section
5. **Mobile experience stripped** - Same experience everywhere, no section personality

## Creative Direction

### Section Personality Definitions

**Home (Hero)**
- **Character:** Bold entrance, dynamic feed
- **Motion:** Dramatic KineticText headline, staggered post cards
- **Visual:** Full-bleed video, accent-colored typography
- **Interaction:** Load More with stagger, scroll reveals between posts

**Gallery**
- **Character:** Light, airy, spacious
- **Motion:** Graceful image reveals, smooth lightbox transitions
- **Visual:** Clean grid, generous whitespace, subtle shadows
- **Interaction:** Image hover states with cursor variant, keyboard navigation

**Listen**
- **Character:** Immersive, moody, music-focused
- **Motion:** Slow, deliberate reveals, ambient movement
- **Visual:** Purple-tinted darkness, embedded players as focal points
- **Interaction:** Minimal - let the music players be primary interface

**About**
- **Character:** Warm, personal, storytelling
- **Motion:** Reading-paced reveals, natural flow
- **Visual:** Warm tones, portrait as anchor, side project cards
- **Interaction:** Card hovers, text cursor on bio

**Contact**
- **Character:** Professional, approachable, efficient
- **Motion:** Crisp, purposeful animations
- **Visual:** Clean form, clear hierarchy
- **Interaction:** Input focus states, submit button hover

**Discography**
- **Character:** Catalog, curated, collector's view
- **Motion:** Grid reveal stagger, album hover effects
- **Visual:** Album art as heroes, minimal text
- **Interaction:** Album card hovers, buy link emphasis

### Motion Timing Per Section

| Section | Enter Timing | Reveal Timing | Character |
|---------|--------------|---------------|-----------|
| Hero | 0.5s dramatic | 0.3s stagger | Bold, confident |
| Gallery | 0.3s gentle | 0.2s cascade | Light, flowing |
| Listen | 0.6s slow | 0.4s deliberate | Immersive, moody |
| About | 0.4s natural | 0.3s reading-paced | Warm, personal |
| Contact | 0.3s crisp | 0.2s efficient | Professional |
| Discography | 0.4s reveal | 0.15s grid stagger | Curated, catalog |

## Technical Approach

### Pattern: Section-Specific Variants

Create section-specific motion variants that extend base variants:

```typescript
// src/lib/motion/section-variants.ts
export const heroVariants: Variants = {
  initial: { opacity: 0, y: 40 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.dramatic, delay: 0.2 },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

export const galleryVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', ...springs.gentle },
  },
  exit: { opacity: 0 },
};
// ... for each section
```

### Pattern: Page Enhancement Structure

Each enhanced page follows this structure:

```tsx
const EnhancedPage: React.FC = () => {
  return (
    <>
      <PageMeta {...meta} />
      <VideoBackground src={video} poster={poster} />
      <motion.div
        data-section="section-name"
        variants={sectionVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Container size="prose">
          <Stack gap="section">
            <RevealOnScroll>
              <KineticText as="h1" variant="dramatic">
                Page Title
              </KineticText>
            </RevealOnScroll>
            {/* Content */}
          </Stack>
        </Container>
      </motion.div>
    </>
  );
};
```

### Pattern: Mobile Experience Parity

Mobile gets same personality through:
1. VideoBackground poster fallback (already tier-aware)
2. Same motion variants (just no video playback)
3. Touch-friendly interactions (no custom cursor)
4. Same typography and color treatment

## Execution Order

### Plan 09-01: Section Variants Infrastructure
- Create `src/lib/motion/section-variants.ts`
- Define per-section motion timing and character
- Export alongside existing variants
- **Dependency:** None (builds on Phase 4)

### Plan 09-02: Home Enhancement
- Replace inline video with VideoBackground
- Add KineticText hero headline
- Apply stagger to post cards
- Use Container + Stack layout
- **Dependency:** 09-01

### Plan 09-03: Gallery Enhancement
- Replace inline video with VideoBackground
- Add stagger to image grid using Grid primitive
- Enhance lightbox transitions
- Add cursor variants to images
- **Dependency:** 09-01

### Plan 09-04: Listen Enhancement
- Replace inline video with VideoBackground
- Add slow ambient reveals
- KineticText on headline
- Container + Stack for layout
- **Dependency:** 09-01

### Plan 09-05: About Enhancement
- Replace inline video with VideoBackground
- KineticText on headline
- Text cursor on bio paragraphs
- Card stagger for side projects
- Container + Stack layout
- **Dependency:** 09-01

### Plan 09-06: Contact Enhancement
- Replace inline video with VideoBackground
- Crisp form field animations
- Container + Stack layout
- Form validation feedback polish
- **Dependency:** 09-01

### Plan 09-07: Discography Enhancement
- Replace inline video with VideoBackground
- Grid with stagger for albums
- Album card hover effects
- KineticText on title
- **Dependency:** 09-01

### Plan 09-08: Final Polish and Integration
- Cross-page transition testing
- Mobile experience verification
- Performance audit
- Visual consistency review
- **Dependency:** 09-02 through 09-07

## Mobile Considerations

### What Mobile Gets

1. **Same color personalities** - Tokens work identically
2. **Same motion** - pageVariants and RevealOnScroll work on touch
3. **Poster images** - VideoBackground shows poster (tier 0/1 + mobile)
4. **Native cursor** - No custom cursor on touch devices
5. **Same layout** - Container/Stack responsive by default

### What Mobile Skips

1. **Video playback** - Battery conscious, poster only
2. **Custom cursor** - Native touch feedback preferred
3. **Complex WebGL** - Tier scaling handles gracefully
4. **Hover states** - Touch has active states instead

### Testing Checklist

- [ ] iOS Safari viewport (dvh handling)
- [ ] Android Chrome touch scrolling
- [ ] Reduced motion preference honored
- [ ] Poster images load correctly
- [ ] Touch targets appropriately sized

## Risk Assessment

### Low Risk

- **All infrastructure exists** - Pure composition work
- **Incremental enhancement** - Each page can be done independently
- **Existing fallbacks** - VideoBackground has graceful degradation
- **Token system works** - Section overrides proven in Phase 2

### Medium Risk

- **Visual balance** - Need to ensure distinct but cohesive
- **Performance** - More effects = more careful testing needed
- **Subjective quality** - "Intentionally designed" is judgment call

### Mitigation

- Review each page enhancement before moving to next
- Test on multiple devices after each plan
- Get feedback on visual direction early

## Common Pitfalls

### Pitfall 1: Over-Animation
**What goes wrong:** Adding animation to everything, creating visual noise
**Why it happens:** Enthusiasm for new tools
**How to avoid:** Each animation must serve a purpose (guide attention, show state, create delight)
**Warning signs:** More than 3 animated elements visible simultaneously

### Pitfall 2: Breaking Mobile
**What goes wrong:** Forgetting mobile testing, features that work on desktop fail on touch
**Why it happens:** Development on desktop, async mobile testing
**How to avoid:** Test each page on mobile after enhancement
**Warning signs:** Touch scroll issues, video playback problems, layout breaks

### Pitfall 3: Losing Cohesion
**What goes wrong:** Each section so unique it doesn't feel like same site
**Why it happens:** Over-indexing on "distinct personalities"
**How to avoid:** Keep token system, same base components, consistent interaction patterns
**Warning signs:** Header/footer feel disconnected from page, jarring transitions

### Pitfall 4: Performance Regression
**What goes wrong:** Page load time increases, animation stutters
**Why it happens:** Adding heavy effects without tier awareness
**How to avoid:** Use existing tier-aware components, test on lower-end devices
**Warning signs:** Lighthouse performance score drops, visible frame drops

## Code Examples

### VideoBackground Migration

```tsx
// Before (inline styles)
{isWebMSupported() && (
  <video
    autoPlay muted loop playsInline
    style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: -1 }}
  >
    <source src={videoSrc} type="video/webm" />
  </video>
)}

// After (component)
import { VideoBackground } from '@/components/effects';
import poster from '@/images/home-poster.jpg';
import videoSrc from '@/videos/home_canvas.webm';

<VideoBackground src={videoSrc} poster={poster} />
```

### KineticText Hero

```tsx
// Before
<RevealOnScroll>
  <h1>Latest Posts</h1>
</RevealOnScroll>

// After
<RevealOnScroll>
  <KineticText as="h1" splitBy="chars" variant="dramatic">
    Latest Posts
  </KineticText>
</RevealOnScroll>
```

### Stagger Container Pattern

```tsx
// Posts list with stagger
<motion.div
  variants={staggerContainer}
  initial="initial"
  animate="enter"
>
  {posts.map(post => (
    <motion.div key={post.id} variants={staggerItem}>
      <PostCard post={post} />
    </motion.div>
  ))}
</motion.div>
```

### Layout Primitive Usage

```tsx
// Before (inline max-width)
<div className={styles['home-container']}>

// After (Container + Stack)
<Container size="sm" padding="md">
  <Stack gap="lg">
    {/* content */}
  </Stack>
</Container>
```

## Open Questions

1. **Poster images needed** - Do poster images exist for each video background?
   - What we know: Videos are in src/videos/, need matching posters
   - What's unclear: Whether to extract frames or use existing images
   - Recommendation: Use first frame extraction or existing brand images

2. **NotFound page section** - Should NotFound have its own section tokens?
   - What we know: Currently has no data-section attribute
   - What's unclear: Whether to create error-specific tokens
   - Recommendation: Add data-section="error" with glitch-appropriate styling

## Sources

### Primary (HIGH confidence)
- Phase 1-8 completion summaries in STATE.md
- Existing component implementations in src/
- Token definitions in src/styles/tokens/

### Secondary (MEDIUM confidence)
- Framer Motion documentation for variant patterns
- Tailwind CSS documentation for responsive utilities

### Tertiary (LOW confidence)
- Creative direction suggestions based on content analysis
- Mobile considerations based on VideoBackground implementation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All components exist and are documented
- Architecture: HIGH - Patterns established in previous phases
- Pitfalls: MEDIUM - Based on common motion/effects issues

**Research date:** 2026-01-17
**Valid until:** Phase completion (composition work, patterns stable)
