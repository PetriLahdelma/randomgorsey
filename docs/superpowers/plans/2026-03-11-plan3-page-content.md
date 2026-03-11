# Plan 3: Page Content Rewrite

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite all page content (About, Listen, Discography, Gallery, 404) with warm personal voice. Active artist persona — no mention of design career or hiatus.

**Architecture:** Modify existing site components in `src/site/`. Content changes only — layout adjustments to match gallery aesthetic where needed.

**Tech Stack:** React, TypeScript, Next.js, Framer Motion

**Spec:** `docs/superpowers/specs/2026-03-11-site-redesign-content-design.md`

**Depends on:** Plan 1 (design tokens)

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `src/site/About.tsx` | Rewritten bio, active artist voice, no hiatus |
| Modify | `src/site/Listen.tsx` | Cleaner layout, streaming CTAs |
| Modify | `src/site/Discography.tsx` | Gallery-styled release cards |
| Modify | `src/site/Gallery.tsx` | Masonry grid via CSS columns |
| Modify | `src/site/NotFound.tsx` | "Lost in the mix." minimal |
| Modify | `src/site/Gallery.module.css` | Masonry layout styles |
| Modify | `src/app/about/page.tsx` | Updated metadata |
| Modify | `src/app/listen/page.tsx` | Updated metadata |
| Modify | `src/app/discography/page.tsx` | Updated metadata |

---

## Chunk 1: About Page

### Task 1: Rewrite About page

**Files:**
- Modify: `src/site/About.tsx`

- [ ] **Step 1: Rewrite bio content**

Replace all three bio paragraphs. New content (first person, warm, active):

Paragraph 1: Introduction — Helsinki-based, lo-fi house and electronic music. Warm, nostalgic sound with soulful chords and minimalist grooves. Mention the mid-paced, high-energy approach.

Paragraph 2: Musical journey — self-taught, driven by instinct. Doesn't belong to any scene. Acts on instinct, goes wherever creativity takes. Influenced by the Helsinki and Berlin electronic scenes.

Paragraph 3: Current — actively producing, exploring new tools and sounds. Always looking for fresh processes. Inspired by raw energy and aestheticism.

**Remove**: "Currently on hiatus focusing on his design career" — replace with forward-looking language about current production.

**Remove**: "he studied graphic design in the UK" — no design career references.

**Keep**: DJ Pizza Hut alias mention, side projects section, HoverWords effect, portrait video.

- [ ] **Step 2: Update side projects text**

Change "Random Gorsey is also involved in several side projects, including:" to something more natural like just removing the formal intro — let the cards speak for themselves with a simple "Other projects" heading.

- [ ] **Step 3: Run About test**

Run: `npx vitest run src/site/__tests__/About.test.tsx`
Expected: Pass (may need test content updates)

- [ ] **Step 4: Update About metadata**

In `src/app/about/page.tsx`, update the description to match new bio tone.

- [ ] **Step 5: Commit**

```bash
git add src/site/About.tsx src/app/about/page.tsx src/site/__tests__/About.test.tsx
git commit -m "content: rewrite About page — active artist voice, no hiatus"
```

---

## Chunk 2: Listen Page

### Task 2: Clean up Listen page

**Files:**
- Modify: `src/site/Listen.tsx`

- [ ] **Step 1: Read current Listen.tsx**

Read the file to understand current structure.

- [ ] **Step 2: Update layout**

Two sections clearly separated:
1. **Spotify** — embedded player (keep existing embed)
2. **SoundCloud** — embedded player (keep existing embed)

Below the players, add streaming CTA cards:

```tsx
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12">
  <a href="https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q" target="_blank" rel="noopener noreferrer"
     className="bg-card-gallery border border-card-gallery-border p-6 text-center no-underline hover:bg-card-gallery-hover transition-colors">
    <span className="text-foreground text-sm font-europa">Spotify</span>
  </a>
  <a href="https://soundcloud.com/randomgorsey" target="_blank" rel="noopener noreferrer"
     className="bg-card-gallery border border-card-gallery-border p-6 text-center no-underline hover:bg-card-gallery-hover transition-colors">
    <span className="text-foreground text-sm font-europa">SoundCloud</span>
  </a>
  <a href="https://randomgorsey.bandcamp.com" target="_blank" rel="noopener noreferrer"
     className="bg-card-gallery border border-card-gallery-border p-6 text-center no-underline hover:bg-card-gallery-hover transition-colors">
    <span className="text-foreground text-sm font-europa">Bandcamp</span>
  </a>
</div>
```

Remove any filler text. No hero, no description paragraph. Just the players and CTAs.

- [ ] **Step 3: Run Listen test**

Run: `npx vitest run src/site/__tests__/Listen.test.tsx`

- [ ] **Step 4: Commit**

```bash
git add src/site/Listen.tsx src/site/__tests__/Listen.test.tsx
git commit -m "content: clean up Listen page with streaming CTAs"
```

---

## Chunk 3: Discography, Gallery, 404

### Task 3: Update Discography page

**Files:**
- Modify: `src/site/Discography.tsx`

- [ ] **Step 1: Read current Discography.tsx**

Read the file to understand current structure and data.

- [ ] **Step 2: Restyle as gallery cards**

Each release as a full-width card in the gallery style:
- Album art (large, use existing images)
- Title, catalog number, year
- Track listing if available
- Bandcamp link as yellow CTA button
- Spotify/Apple Music as secondary text links
- Reverse chronological: So Long Spectrum (2022) first

- [ ] **Step 3: Run Discography test**

Run: `npx vitest run src/site/__tests__/Discography.test.tsx`

- [ ] **Step 4: Commit**

```bash
git add src/site/Discography.tsx src/site/__tests__/Discography.test.tsx
git commit -m "content: restyle Discography as gallery release cards"
```

### Task 4: Update Gallery to masonry layout

**Files:**
- Modify: `src/site/Gallery.tsx`
- Modify: `src/site/Gallery.module.css`

- [ ] **Step 1: Read current Gallery.tsx and Gallery.module.css**

Understand the existing grid and lightbox implementation.

- [ ] **Step 2: Switch to CSS columns masonry**

In `Gallery.module.css`, add:

```css
.masonry {
  columns: 3;
  column-gap: 1rem;
}

.masonry-item {
  break-inside: avoid;
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .masonry {
    columns: 2;
  }
}

@media (max-width: 480px) {
  .masonry {
    columns: 1;
  }
}
```

Update the gallery grid container in `Gallery.tsx` to use the masonry class. Keep lightbox and keyboard navigation intact.

- [ ] **Step 3: Add caption styling**

Captions should appear below each image in muted text:

```tsx
<figcaption className="text-neutral-500 text-xs mt-2 mb-0">{image.caption}</figcaption>
```

- [ ] **Step 4: Run Gallery test**

Run: `npx vitest run src/site/__tests__/Gallery.test.tsx`

- [ ] **Step 5: Commit**

```bash
git add src/site/Gallery.tsx src/site/Gallery.module.css src/site/__tests__/Gallery.test.tsx
git commit -m "feat: switch Gallery to CSS masonry layout"
```

### Task 5: Update 404 page

**Files:**
- Modify: `src/site/NotFound.tsx`

- [ ] **Step 1: Simplify 404**

Replace current content with minimal:

```tsx
<Container size="sm" padding="md" className="min-h-[60vh] flex flex-col items-center justify-center">
  <h1 className="text-4xl font-europa-light text-foreground mb-4">Lost in the mix.</h1>
  <Link href="/" className="text-neutral-400 hover:text-accent text-sm no-underline">
    Back to home
  </Link>
</Container>
```

Keep VideoBackground if currently present.

- [ ] **Step 2: Update NotFound test**

Run: `npx vitest run src/site/__tests__/NotFound.test.tsx`

- [ ] **Step 3: Commit**

```bash
git add src/site/NotFound.tsx src/site/NotFound.module.css src/site/__tests__/NotFound.test.tsx
git commit -m "content: minimal 404 — Lost in the mix"
```

---

## Verification

- [ ] Run: `npx vitest run` — all tests pass
- [ ] Run: `npx next build` — build succeeds
- [ ] Visual check all pages: About reads as active artist, Listen is clean, Discography has gallery cards, Gallery is masonry, 404 is minimal
