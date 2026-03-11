# Blog Modernization Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Modernize the Random Gorsey journal from a 2005 blog to a 2026 casual artist journal with smooth animations, better timestamps, native media embeds, auto-link styling, image lightbox, and fully rewritten post content.

**Architecture:** Six independent UI/component tasks (timestamps, media styling, scroll fade-in, expand/collapse, auto-links, lightbox) followed by a content rewrite of all 14 post data files. Each UI task modifies 1-2 files. The content rewrite is the largest task (14 files, 56 posts).

**Tech Stack:** React 19, TypeScript 5.9, Next.js 16 App Router, Framer Motion 12, Tailwind v4 with oklch tokens

---

## Chunk 1: UI Features

### Task 1: Timestamp formatting

**Files:**
- Modify: `src/components/PostCard.tsx:117-185`

The PostCard currently renders `post.timestamp` as-is (raw ISO string). Add a formatter that converts `"2025-03-03T14:30"` to `"march 3, 2025 — 2:30 pm"` and also handles legacy `"2025-03-03"` format (no time).

- [ ] **Step 1: Add formatTimestamp utility function to PostCard.tsx**

Add this function above the component definition:

```typescript
function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const month = date.toLocaleString("en-US", { month: "long" }).toLowerCase();
  const day = date.getDate();
  const year = date.getFullYear();

  // If the timestamp includes a time portion (T separator)
  if (iso.includes("T")) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `${month} ${day}, ${year} — ${displayHours}:${displayMinutes} ${ampm}`;
  }

  return `${month} ${day}, ${year}`;
}
```

- [ ] **Step 2: Update the `<time>` element to use the formatter**

Replace the current time element:

```tsx
{/* Old */}
<time
  dateTime={post.timestamp}
  className="font-mono-label text-muted-foreground block mb-2"
>
  {post.timestamp}
</time>

{/* New */}
<time
  dateTime={post.timestamp}
  className="font-mono-label text-muted-foreground block mb-2"
>
  {formatTimestamp(post.timestamp)}
</time>
```

- [ ] **Step 3: Verify in dev server**

Run: `npm run dev` (port 3002)
Expected: Posts with `T` in timestamp show time of day. Posts without show date only. No build errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/PostCard.tsx
git commit -m "feat: casual lowercase timestamp formatting with time of day"
```

---

### Task 2: Native media embed styling

**Files:**
- Modify: `src/components/PostCard.tsx:199-203` (body div className)

Style iframes embedded in post body HTML via Tailwind arbitrary selectors on the body container div.

- [ ] **Step 1: Add iframe styling to the post body div**

Update the body div className to include iframe targeting:

```tsx
{/* Old */}
className="mt-6 mb-3 font-europa text-[1.05rem] leading-[1.7] text-[oklch(65%_0_0deg)] [&>p]:mb-6 [&>p:last-child]:mb-0"

{/* New */}
className="mt-6 mb-3 font-europa text-[1.05rem] leading-[1.7] text-[oklch(65%_0_0deg)] [&>p]:mb-6 [&>p:last-child]:mb-0 [&_iframe]:w-full [&_iframe]:my-6 [&_iframe]:border-0 [&_iframe]:rounded-none [&_iframe]:bg-[oklch(6%_0_0deg)]"
```

- [ ] **Step 2: Strip inline styles from iframe HTML in all post data files**

In each of the 14 post data files, find all occurrences of `style="border-radius: 12px;"` on iframe elements and remove them. Also remove `frameborder="0"` attributes.

Search pattern: `style="border-radius: 12px;"` — remove entirely
Search pattern: `frameborder="0"` — remove entirely

Files to check (grep for `iframe`):
- `src/posts/2025-03.ts`
- `src/posts/2025-05.ts`
- `src/posts/2025-06.ts`
- `src/posts/2025-07.ts`
- `src/posts/2025-08.ts`
- `src/posts/2025-09.ts`
- `src/posts/2025-10.ts`
- `src/posts/2025-11.ts`
- `src/posts/2025-12.ts`
- `src/posts/2026-01.ts`
- `src/posts/2026-02.ts`

- [ ] **Step 3: Verify in dev server**

Run: `npm run dev` (port 3002)
Expected: Spotify/Bandcamp embeds have no border-radius, consistent spacing, dark background. No visual artifacts.

- [ ] **Step 4: Commit**

```bash
git add src/components/PostCard.tsx src/posts/
git commit -m "style: native media embed styling with zero border-radius"
```

---

### Task 3: Scroll fade-in on feed

**Files:**
- Modify: `src/site/Home.tsx:86-116`

Wrap each PostCard in the feed with a `motion.div` using `whileInView`. The `RevealOnScroll` component already exists and does exactly this — use it.

- [ ] **Step 1: Wrap featured post in RevealOnScroll**

```tsx
{/* Old */}
{featuredPost && (
  <section aria-label="Featured post">
    <PostCard ... />
  </section>
)}

{/* New */}
{featuredPost && (
  <RevealOnScroll as="section" aria-label="Featured post">
    <PostCard ... />
  </RevealOnScroll>
)}
```

- [ ] **Step 2: Wrap each post in the feed with RevealOnScroll**

```tsx
{/* Old */}
{remainingPosts.map((post) => (
  <PostCard
    key={post.id}
    id={`post-${post.id}`}
    post={post}
    headingLevel={3}
  />
))}

{/* New */}
{remainingPosts.map((post) => (
  <RevealOnScroll key={post.id} amount={0.2}>
    <PostCard
      id={`post-${post.id}`}
      post={post}
      headingLevel={3}
    />
  </RevealOnScroll>
))}
```

Note: `RevealOnScroll` already respects `prefers-reduced-motion` via `useReducedMotion()` and defaults to `once={true}`. Set `amount={0.2}` to trigger at 20% visibility.

- [ ] **Step 3: Verify in dev server**

Run: `npm run dev` (port 3002)
Expected: Posts fade in as they scroll into view. Animation plays once. Reduced-motion users see instant appearance.

- [ ] **Step 4: Commit**

```bash
git add src/site/Home.tsx
git commit -m "feat: scroll fade-in animations on blog feed"
```

---

### Task 4: Smooth expand/collapse animation

**Files:**
- Modify: `src/components/PostCard.tsx:107-124,199-215`

Replace the instant show/hide of post body with an animated height transition using Framer Motion's `AnimatePresence` and `motion.div`.

- [ ] **Step 1: Add AnimatePresence import**

PostCard.tsx already imports from `@/lib/motion` indirectly, but uses React directly. Add the import:

```typescript
import { motion, AnimatePresence } from "framer-motion";
```

- [ ] **Step 2: Replace body rendering with animated version**

The current body section (around lines 199-215) needs to be restructured. Replace the body div and Read More section with:

```tsx
{/* Body — animated expand/collapse */}
<AnimatePresence initial={false} mode="wait">
  <motion.div
    key={expanded ? "full" : "truncated"}
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    transition={{
      height: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
      opacity: { duration: 0.2 },
    }}
    style={{ overflow: "hidden" }}
  >
    <div
      className="mt-6 mb-3 font-europa text-[1.05rem] leading-[1.7] text-[oklch(65%_0_0deg)] [&>p]:mb-6 [&>p:last-child]:mb-0 [&_iframe]:w-full [&_iframe]:my-6 [&_iframe]:border-0 [&_iframe]:rounded-none [&_iframe]:bg-[oklch(6%_0_0deg)]"
      dangerouslySetInnerHTML={{ __html: displayBody }}
    />
  </motion.div>
</AnimatePresence>

{/* Read more + share */}
<div className="flex flex-wrap gap-3 items-center mt-3">
  {hasLongContent && (
    <motion.button
      onClick={toggleExpanded}
      className="p-0 font-mono-label text-accent underline underline-offset-4 cursor-pointer bg-transparent border-none hover:text-foreground"
      aria-expanded={expanded}
      aria-label={expanded ? "Show less content" : "Show more content"}
      key={expanded ? "less" : "more"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {expanded ? "Show Less" : "Read More"}
    </motion.button>
  )}
  {showSocialShare && (
    <div className="ml-auto">
      <SocialShare url={postUrl} title={post.title} text={shareText} />
    </div>
  )}
</div>
```

- [ ] **Step 3: Verify in dev server**

Run: `npm run dev` (port 3002)
Expected: Clicking "Read More" smoothly expands the content. Clicking "Show Less" smoothly collapses. No layout jump. Button text cross-fades.

- [ ] **Step 4: Commit**

```bash
git add src/components/PostCard.tsx
git commit -m "feat: smooth expand/collapse animation on post cards"
```

---

### Task 5: Auto-link styling

**Files:**
- Modify: `src/components/PostCard.tsx`

Add a utility function that detects bare URLs in post body HTML and wraps them in styled anchor tags. Must not affect URLs already inside `<a>` or `<iframe>` tags.

- [ ] **Step 1: Add autoLinkUrls utility function**

Add above the component definition:

```typescript
function autoLinkUrls(html: string): string {
  // Match URLs not already inside href="..." or src="..."
  // Strategy: split on existing tags, only process text nodes
  const tagPattern = /<[^>]+>/g;
  const parts = html.split(tagPattern);
  const tags = html.match(tagPattern) || [];

  let result = "";
  let insideAnchorOrIframe = false;

  for (let i = 0; i < parts.length; i++) {
    let textPart = parts[i];

    if (!insideAnchorOrIframe) {
      // Replace bare URLs in text content
      textPart = textPart.replace(
        /(https?:\/\/[^\s<>"']+)/g,
        '<a href="$1" target="_blank" rel="noopener" class="text-accent underline underline-offset-4 hover:text-foreground transition-colors">$1</a>'
      );
    }

    result += textPart;

    if (i < tags.length) {
      const tag = tags[i];
      if (/<(a|iframe)\b/i.test(tag)) insideAnchorOrIframe = true;
      if (/<\/(a|iframe)>/i.test(tag)) insideAnchorOrIframe = false;
      result += tag;
    }
  }

  return result;
}
```

- [ ] **Step 2: Apply autoLinkUrls to displayBody before rendering**

Update the `dangerouslySetInnerHTML` line:

```tsx
{/* Old */}
dangerouslySetInnerHTML={{ __html: displayBody }}

{/* New */}
dangerouslySetInnerHTML={{ __html: autoLinkUrls(displayBody) }}
```

- [ ] **Step 3: Verify in dev server**

Run: `npm run dev` (port 3002)
Expected: Any bare URLs in post body text become yellow underlined links. Existing Spotify/Bandcamp iframes are unaffected. No broken HTML.

- [ ] **Step 4: Commit**

```bash
git add src/components/PostCard.tsx
git commit -m "feat: auto-link bare URLs in post body content"
```

---

### Task 6: Image lightbox gallery

**Files:**
- Create: `src/components/Lightbox.tsx`
- Modify: `src/components/PostCard.tsx`

New component for full-screen image viewing with navigation between multiple images.

- [ ] **Step 1: Create the Lightbox component**

Create `src/components/Lightbox.tsx`:

```tsx
"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

interface LightboxProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  onClose,
  onNavigate,
}) => {
  const hasMultiple = images.length > 1;

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (hasMultiple && e.key === "ArrowRight")
        onNavigate((currentIndex + 1) % images.length);
      if (hasMultiple && e.key === "ArrowLeft")
        onNavigate((currentIndex - 1 + images.length) % images.length);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, hasMultiple, onClose, onNavigate]);

  // Prevent body scroll while open
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-neutral-400 hover:text-white text-2xl font-mono-label bg-transparent border-none cursor-pointer z-10"
          aria-label="Close lightbox"
        >
          &times;
        </button>

        {/* Image */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="relative max-w-[90vw] max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={images[currentIndex]}
            alt=""
            width={1200}
            height={800}
            className="object-contain max-h-[90vh] w-auto"
            sizes="90vw"
          />
        </motion.div>

        {/* Navigation arrows */}
        {hasMultiple && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(
                  (currentIndex - 1 + images.length) % images.length
                );
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-3xl font-mono-label bg-transparent border-none cursor-pointer"
              aria-label="Previous image"
            >
              &larr;
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNavigate((currentIndex + 1) % images.length);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-3xl font-mono-label bg-transparent border-none cursor-pointer"
              aria-label="Next image"
            >
              &rarr;
            </button>

            {/* Counter */}
            <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono-label text-sm text-neutral-400">
              {currentIndex + 1} / {images.length}
            </span>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default Lightbox;
```

- [ ] **Step 2: Add lightbox state and image click handler to PostCard**

Add state and handler inside the PostCard component:

```typescript
// Lightbox state
const [lightboxOpen, setLightboxOpen] = React.useState(false);
const [lightboxIndex, setLightboxIndex] = React.useState(0);
const [bodyImages, setBodyImages] = React.useState<string[]>([]);
const bodyRef = React.useRef<HTMLDivElement>(null);

// Collect images from rendered body HTML
React.useEffect(() => {
  if (bodyRef.current) {
    const imgs = bodyRef.current.querySelectorAll("img");
    const srcs = Array.from(imgs)
      .map((img) => img.src)
      .filter(Boolean);
    setBodyImages(srcs);
  }
}, [expanded, displayBody]);

// Handle image clicks in post body
const handleBodyClick = React.useCallback(
  (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === "IMG") {
      e.stopPropagation();
      const src = (target as HTMLImageElement).src;
      const index = bodyImages.indexOf(src);
      if (index !== -1) {
        setLightboxIndex(index);
        setLightboxOpen(true);
      }
    }
  },
  [bodyImages]
);
```

- [ ] **Step 3: Add ref and click handler to body div, render Lightbox**

Update the body div to include the ref and click handler:

```tsx
<div
  ref={bodyRef}
  onClick={handleBodyClick}
  className="mt-6 mb-3 font-europa ..."
  dangerouslySetInnerHTML={{ __html: autoLinkUrls(displayBody) }}
/>
```

Add Lightbox render at the end of the article, before the closing `</article>`:

```tsx
{/* Lightbox */}
{lightboxOpen && bodyImages.length > 0 && (
  <Lightbox
    images={bodyImages}
    currentIndex={lightboxIndex}
    onClose={() => setLightboxOpen(false)}
    onNavigate={setLightboxIndex}
  />
)}
```

Add the import at the top of PostCard.tsx:

```typescript
import Lightbox from "./Lightbox";
```

- [ ] **Step 4: Add cursor pointer to images in post body**

Add to the body div className: `[&_img]:cursor-zoom-in`

- [ ] **Step 5: Verify build**

Run: `npx next build`
Expected: Build succeeds with all 64 routes. No TypeScript errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/Lightbox.tsx src/components/PostCard.tsx
git commit -m "feat: image lightbox gallery for post body images"
```

---

## Chunk 2: Content Rewrite

### Task 7: Rewrite all 56 posts

**Files:**
- Modify: `src/posts/2025-02.ts`
- Modify: `src/posts/2025-03.ts`
- Modify: `src/posts/2025-04.ts`
- Modify: `src/posts/2025-05.ts`
- Modify: `src/posts/2025-06.ts`
- Modify: `src/posts/2025-07.ts`
- Modify: `src/posts/2025-08.ts`
- Modify: `src/posts/2025-09.ts`
- Modify: `src/posts/2025-10.ts`
- Modify: `src/posts/2025-11.ts`
- Modify: `src/posts/2025-12.ts`
- Modify: `src/posts/2026-01.ts`
- Modify: `src/posts/2026-02.ts`
- Modify: `src/posts/2026-03.ts`

Rewrite every post following the voice and content rules from the spec. This is the largest task.

**Voice rules:**
- Casual, personal. Like texting a friend or writing a quick journal entry
- No club scene reporting. Remove club reviews, DJ set recaps, venue commentary (Ääniwalli, Kaiku, etc.)
- Fewer artist name-drops. Mention stuff occasionally, not as the focus
- No polished essay structure
- Studio = home studio, always
- Minimal em dashes

**Length distribution across 56 posts (approximate):**
- ~10 ultra-short (1-3 sentences, quick check-in energy): e.g. "Heyyyy. Don't really have time to write now, but peace and luv. TTYL"
- ~20 short (a paragraph or two)
- ~20 medium (studio diary, listening notes, personal reflection)
- ~6 longer form (production deep-dive or personal milestone)

**Content categories:**
- Studio diary (gear, process, creative blocks, breakthroughs)
- Listening notes (what's on repeat, why it works, kept brief)
- Personal reflections (Helsinki life, seasons, mood)
- Occasional release updates (EP progress, demos)

**What to preserve:**
- All post IDs (unchanged)
- All existing Spotify/Bandcamp iframe embeds (keep the embed HTML, may move within restructured body)
- Post categories (unchanged)
- The overall narrative arc: Feb 2025 starting out → learning/experimenting → field recordings → tape processing → finishing an EP by Mar 2026
- Author field ("Random Gorsey")

**What to add:**
- Time of day to every timestamp: change from `"YYYY-MM-DD"` to `"YYYY-MM-DDTHH:MM"`
- Assign realistic times (afternoon/evening for studio posts, morning for casual check-ins, late night for listening posts)

**What to remove from iframe HTML (if not already done in Task 2):**
- `style="border-radius: 12px;"` attribute
- `frameborder="0"` attribute

**Process: Rewrite each file one at a time, committing after each.**

- [ ] **Step 1: Rewrite `src/posts/2025-02.ts`** (4 posts, IDs 2-5)

Read the file, rewrite all posts following voice rules, add timestamps with time, remove iframe inline styles. Commit.

- [ ] **Step 2: Rewrite `src/posts/2025-03.ts`** (4 posts, IDs 7-10)

- [ ] **Step 3: Rewrite `src/posts/2025-04.ts`** (4 posts, IDs 11-14)

- [ ] **Step 4: Rewrite `src/posts/2025-05.ts`** (5 posts, IDs 1, 15-18)

- [ ] **Step 5: Rewrite `src/posts/2025-06.ts`** (4 posts)

- [ ] **Step 6: Rewrite `src/posts/2025-07.ts`** (4 posts)

- [ ] **Step 7: Rewrite `src/posts/2025-08.ts`** (4 posts)

- [ ] **Step 8: Rewrite `src/posts/2025-09.ts`** (4 posts)

- [ ] **Step 9: Rewrite `src/posts/2025-10.ts`** (4 posts)

- [ ] **Step 10: Rewrite `src/posts/2025-11.ts`** (5 posts)

- [ ] **Step 11: Rewrite `src/posts/2025-12.ts`** (4 posts)

- [ ] **Step 12: Rewrite `src/posts/2026-01.ts`** (4 posts)

- [ ] **Step 13: Rewrite `src/posts/2026-02.ts`** (4 posts)

- [ ] **Step 14: Rewrite `src/posts/2026-03.ts`** (2 posts)

- [ ] **Step 15: Verify build**

Run: `npx next build`
Expected: Build succeeds with all 64 routes. No TypeScript errors. Post sorting still works correctly with new timestamp format.

- [ ] **Step 16: Final commit**

```bash
git add src/posts/
git commit -m "content: rewrite all 56 posts with casual journal voice"
```
