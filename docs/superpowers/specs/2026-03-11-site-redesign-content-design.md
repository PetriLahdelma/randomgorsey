# Random Gorsey Site Redesign & Content Overhaul

**Date**: 2026-03-11
**Status**: Approved

## Overview

Full redesign of randomgorsey.com — shifting from punk template energy to a dark gallery aesthetic inspired by The Knife's anti-template, art-forward philosophy. Includes rewriting all page content with a warm/personal voice, creating a 56-post blog archive (weekly from Feb 2025), and upgrading the contact form with progressive disclosure.

## Design Direction

**Philosophy**: Dark gallery. Content breathes, design disappears, photography and writing lead. The Knife's restraint applied to Random Gorsey's existing punk palette.

**Artist Persona**: Active electronic music producer based in Helsinki. No mention of design career or hiatus. Warm, personal voice — not press kit, not corporate.

## Design System Changes

### Palette
- Keep near-black background (`oklch(4% 0 0deg)`) and electric yellow accent (`oklch(90% 0.18 85deg)`)
- Yellow used more sparingly — labels, single CTAs, active states. Punctuation, not decoration.

### Typography
- Keep Tschick Bold (display) and Europa (body)
- Shift toward lighter weights and more letter-spacing
- Headings: large but thin, not shouty. Dial back aggressive caps to intentional moments.

### Cards
- Subtle cards (`#111` on `#0a0a0a`, thin `#1a1a1a` borders)
- Generous padding (32px+)
- Asymmetric layouts — featured content larger, secondary smaller. No uniform grids.

### Motion
- Keep Framer Motion, make subtler
- Slow fades, gentle reveals on scroll
- Current 100ms snaps become 300-400ms eases

### Constants
- Border-radius: stays at 0 (distinctive)
- Grain overlay: keep, reduce opacity (texture not noise)

## Navigation

- Minimal transparent header
- "RANDOM GORSEY" left-aligned, spaced uppercase (letter-spacing: 6px, weight 400)
- Nav links right-aligned, muted grey, no caps. Active page in yellow.
- Mobile: hamburger with full-screen overlay
- Footer: streaming/social icon row + copyright. No fat footer.

## Pages

### Home (Blog Feed)
- No traditional hero section. Video background retained as ambient element (subtle, behind content). Land directly on content.
- Featured post: full-width card, large title (light weight, 22-28px), excerpt, date, optional image. Yellow "LATEST" label.
- Post grid below: 2-column asymmetric cards. Title + date, no excerpts.
- Infinite scroll via IntersectionObserver (existing pattern).
- Subtle category labels: "STUDIO", "PLAYLIST", "SCENE" in muted text.

### Post Detail (`/posts/[id]`)
- Single-column reading layout, max-width ~680px centered
- Large title, date, category label
- Europa body text at comfortable reading size
- Embedded Spotify/SoundCloud players inline
- Previous / Next navigation at bottom
- No sidebar, no related posts widget

### Listen
- Two sections: Spotify embed + SoundCloud embed
- Large streaming CTAs below as dark cards with platform icons
- No hero, no filler text

### About
- Single column, max-width ~680px
- First-person warm bio. Helsinki, lo-fi house, nostalgia.
- DJ Pizza Hut alias mentioned naturally in text
- One photo, not a press shot grid
- Inline links to side projects
- Reads as active artist

### Discography
- Two releases as full-width cards
- Album art, title, catalog number, year, track listing
- Bandcamp purchase link (yellow CTA), streaming links (secondary)
- Reverse chronological: So Long Spectrum (2022), The Customer Is Always Right EP (2021)

### Gallery
- Existing 16 images with lightbox and keyboard navigation
- Shift to masonry/asymmetric grid (not uniform squares)
- Captions on hover or below, muted text
- Helsinki/Berlin venue photos

### Contact (Progressive Disclosure)
- Centered, max-width ~560px. Title: "Get in touch"
- Name + email always visible
- Three reason cards (dark gallery style, yellow border on selection):
  - **Booking & Events** → date, venue/event name, location, budget range, message
  - **Collaboration** → project type dropdown (remix/track/other), timeline, message
  - **Just saying hello** → message only
- Selected card highlights, others collapse, fields slide in via Framer Motion
- "Back" link to change selection
- Submit: solid yellow button, "Send"
- Success: inline message replacing form, "Got it — I'll get back to you."
- Keep existing security: Zod v4, rate limiting, honeypot, sanitization, EmailJS

### 404
- "Lost in the mix." + link home. Minimal.

## Blog Content (56 Posts)

Weekly posts from February 2025 through March 2026. Indistinguishable from human-written producer content, benchmarked against real electronic music artist blogs.

### Post Types
- **Studio diary** — production process, gear, sessions
- **Monthly picks** — curated playlist with commentary per track
- **Scene report** — Helsinki/Berlin venues, nights, observations
- **Release notes** — behind a track or EP
- **Field recordings** — found sounds, sampling adventures
- **Guest recommendations** — tracks from artists in the scene

### Content Guidelines
- Warm, personal tone (not press kit)
- Reference real artists, venues, labels (Kaiku, Ääniwalli, Tresor, Birgit, etc.)
- Grounded in reality — no fabricated events or relationships
- Mix of short posts (300-400 words) and longer pieces (600-800 words)
- Embedded Spotify/SoundCloud players where tracks are referenced

## Technical Details

### Post Data Model

```typescript
interface Post {
  id: number;              // numeric, used in URL: /posts/[id]
  title: string;
  date: string;            // ISO date string
  category: 'studio' | 'playlist' | 'scene' | 'release' | 'field-recording' | 'recommendation';
  excerpt: string;         // 1-2 sentences for card display
  body: React.ReactNode;   // JSX content with inline embeds
  coverImage?: string;     // optional, path relative to /public/images/posts/
  embeds?: Array<{         // Spotify/SoundCloud iframe embeds
    platform: 'spotify' | 'soundcloud';
    url: string;
  }>;
}
```

### Routing
- Post detail: `src/app/posts/[id]/page.tsx` (existing pattern, numeric IDs)
- All other pages keep existing URL structure: `/`, `/listen`, `/about`, `/discography`, `/gallery`, `/contact`
- `generateStaticParams()` for static generation of all 56 posts

### Video Background
- Existing `HeroImage.tsx` video component used as fixed/absolute background behind the blog feed on homepage
- Low opacity, blurred or darkened so content remains readable
- Poster image fallback (existing pattern)

### Blog Feed
- Posts sorted newest-first
- Initial load: 10 posts, then 10 per batch via IntersectionObserver
- Categories are decorative labels only — no filtering, no category pages
- Post grid uses CSS Grid with `grid-column: span 2` for featured post, single span for others

### Gallery
- CSS `columns` property for masonry layout (no JS library needed)

### Contact Form
- Budget range: dropdown with ranges ("Under €500", "€500–€1000", "€1000–€2500", "€2500+", "Prefer not to say")
- Streaming embeds in posts use iframe (Spotify/SoundCloud oEmbed URLs)

### SEO
- Each post generates Open Graph metadata via Next.js `generateMetadata()`
- Title, description (from excerpt), and optional OG image (from coverImage)
- Existing `src/lib/seo.ts` patterns extended for posts

### Image Handling
- Post images stored in `/public/images/posts/`
- Next.js `<Image>` component for optimization
- WebP format preferred

### Responsive Breakpoints
- Mobile (< 640px): single column, hamburger nav
- Tablet (640–1024px): 2-column post grid
- Desktop (> 1024px): 2-column post grid with wider cards

### Stack
- Next.js App Router (existing)
- Posts stored as TypeScript objects in `/src/posts/`
- Existing CSS token system (primitives → semantic → sections)
- CSS Modules for component isolation
- Framer Motion for all animation
- EmailJS for contact form (existing)
- Zod v4 validation (`.error.issues` not `.error.errors`)
