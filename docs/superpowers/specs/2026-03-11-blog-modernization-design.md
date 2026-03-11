# Blog Modernization Design Spec

> Modernize the Random Gorsey journal from a 2005 blog feel to a 2026 casual artist journal.

## Goal

Transform the blog into a personal, casual journal that feels modern and alive. Not a music magazine, not a club scene report. A producer sharing what's happening in their world, sometimes in a paragraph, sometimes in a sentence.

## Features

### 1. Timestamps with time of day

- Change all 56 post `timestamp` fields from `"YYYY-MM-DD"` to `"YYYY-MM-DDTHH:MM"` format
- Display as casual lowercase: "march 3, 2025 — 2:30 pm"
- Assign realistic times per post (afternoon/evening for studio, morning for casual check-ins)
- Update the `<time>` element in PostCard to format using this new display style

### 2. Native media embed styling

- Style existing iframes (Spotify, Bandcamp) via CSS in the PostCard body container
- Target `[&_iframe]`: full-width, consistent vertical spacing, dark background matching card
- Remove hard-coded `style="border-radius: 12px;"` from iframe HTML in post data
- Remove `frameborder="0"` artifacts
- Zero border-radius per punk aesthetic
- Pure CSS changes, no component restructuring

### 3. Scroll fade-in on feed

- Wrap each PostCard in Home.tsx feed with a `motion.div` using `whileInView`
- Animation: opacity 0 → 1, y 20px → 0
- Triggers once when 20% of card is visible, does not re-animate
- Staggered entrance when multiple cards enter simultaneously
- Respects `prefers-reduced-motion`: instant render, no animation
- PostCard component itself unchanged

### 4. Smooth expand/collapse

- Wrap post body in PostCard with Framer Motion `AnimatePresence` + height animation
- Collapsed: clips to truncated height. Expanded: animates to auto height
- Duration ~300ms using `--ease-smooth` cubic-bezier curve
- "Read More" / "Show Less" text cross-fades during transition
- No layout shift: cards below smoothly push down
- Applied directly in PostCard.tsx

### 5. Auto-link styling

- Utility function that processes post HTML body before rendering
- Detects bare URLs (http/https) not already inside `<a>` or `<iframe>` tags
- Wraps them in styled anchor tags: accent color, underline, `target="_blank"`, `rel="noopener"`
- No link preview cards, just clean styled text links
- Runs at render time, does not mutate source data

### 6. Image lightbox gallery

- New `Lightbox` component: full-screen dark overlay, image centered and scaled to fit
- Left/right arrows + swipe gestures to navigate between images in that post
- Keyboard: arrow keys navigate, Escape closes
- Single images: enlarge on click (no navigation controls)
- Multiple images: full gallery navigation
- No thumbnails or filmstrip strip, minimal design
- Triggered by click handler on post body container intercepting `<img>` clicks
- Only activates when post actually contains images, no placeholder behavior

### 7. Rewrite all 56 posts

**Voice:**
- Casual, personal. Like texting a friend or writing a quick journal entry
- No club scene reporting. Remove club reviews, DJ set recaps, venue commentary
- Fewer artist name-drops. Mention stuff occasionally, not as the focus
- No polished essay structure
- Studio = home studio, always
- Minimal em dashes

**Length distribution across 56 posts:**
- ~10 ultra-short (1-3 sentences, quick check-in energy)
- ~20 short (a paragraph or two)
- ~20 medium (studio diary, listening notes, personal reflection)
- ~6 longer form (production deep-dive or personal milestone)

**Content categories:**
- Studio diary (gear, process, creative blocks, breakthroughs)
- Listening notes (what's on repeat, why it works, kept brief)
- Personal reflections (Helsinki life, seasons, mood)
- Occasional release updates (EP progress, demos)

**What stays:** All existing Spotify/Bandcamp embeds. Post IDs. Categories. The narrative arc across 14 months (learning, experimenting, finishing an EP).

**Each post gets a realistic time of day added to its timestamp.**

### 8. Lighter body copy (already done)

- PostCard body text changed from `text-muted-foreground` (oklch 40%) to `oklch(65% 0 0deg)`

## Non-goals

- No search functionality
- No newsletter signup
- No table of contents
- No reading progress bar
- No estimated read time
- No related posts
- No category filter pills
- No tag filtering
- No dummy/placeholder content

## Files affected

- `src/components/PostCard.tsx` — timestamp display, expand/collapse animation, auto-link utility, image click handler, iframe styling
- `src/site/Home.tsx` — scroll fade-in wrappers
- `src/components/Lightbox.tsx` — new component
- `src/posts/2025-02.ts` through `src/posts/2026-03.ts` — all 14 data files rewritten
