# Plan 2: Blog Engine & 56 Posts

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the post data model with category support, create 56 authentic weekly blog posts (Feb 2025–Mar 2026), redesign the homepage as a blog feed with featured post + card grid, and refine the post detail page to a clean reading layout.

**Architecture:** Extend existing Post interface with `category` field. Keep posts as TypeScript objects in `src/posts/`. Organize posts into monthly batch files for manageable file sizes. Update Home.tsx to show featured post card + 2-column grid. Update Post.tsx to centered reading layout with prev/next navigation.

**Tech Stack:** TypeScript, React, Next.js App Router, Framer Motion, CSS Modules

**Spec:** `docs/superpowers/specs/2026-03-11-site-redesign-content-design.md`

**Depends on:** Plan 1 (design system tokens + motion variants)

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `src/components/PostCard.tsx` | Add `category` to Post interface, update card styling to gallery aesthetic |
| Create | `src/posts/2025-02.ts` | Posts 3–6 (Feb 2025, weeks 1–4) |
| Create | `src/posts/2025-03.ts` | Posts 7–10 (Mar 2025) |
| Create | `src/posts/2025-04.ts` | Posts 11–14 (Apr 2025) |
| Create | `src/posts/2025-05.ts` | Posts 15–19 (May 2025, includes existing post 1 rewritten) |
| Create | `src/posts/2025-06.ts` | Posts 20–23 (Jun 2025, includes existing post 2 rewritten) |
| Create | `src/posts/2025-07.ts` | Posts 24–27 (Jul 2025) |
| Create | `src/posts/2025-08.ts` | Posts 28–32 (Aug 2025) |
| Create | `src/posts/2025-09.ts` | Posts 33–36 (Sep 2025) |
| Create | `src/posts/2025-10.ts` | Posts 37–40 (Oct 2025) |
| Create | `src/posts/2025-11.ts` | Posts 41–45 (Nov 2025) |
| Create | `src/posts/2025-12.ts` | Posts 46–49 (Dec 2025) |
| Create | `src/posts/2026-01.ts` | Posts 50–53 (Jan 2026) |
| Create | `src/posts/2026-02.ts` | Posts 54–57 (Feb 2026) |
| Create | `src/posts/2026-03.ts` | Posts 58 (Mar 2026, week 1) |
| Modify | `src/posts/index.ts` | Import all monthly batches, export consolidated |
| Delete | `src/posts/FirstPost.tsx` | Replaced by rewritten content in 2025-05.ts |
| Delete | `src/posts/RandomRecommends.tsx` | Replaced by rewritten content in 2025-06.ts |
| Modify | `src/site/Home.tsx` | Blog feed: featured card + 2-column grid, remove KineticText hero |
| Modify | `src/site/Post.tsx` | Centered reading layout, prev/next navigation |
| Modify | `src/app/posts/[id]/page.tsx` | Update generateStaticParams for new post count |
| Modify | `src/app/page.tsx` | Update metadata description |

---

## Chunk 1: Post Data Model Update

### Task 1: Extend Post interface with category

**Files:**
- Modify: `src/components/PostCard.tsx:12-55`

- [ ] **Step 1: Add PostCategory type and category field**

Add above the Post interface:

```typescript
export type PostCategory = 'studio' | 'playlist' | 'scene' | 'release' | 'field-recording' | 'recommendation';

export const categoryLabels: Record<PostCategory, string> = {
  'studio': 'STUDIO',
  'playlist': 'PLAYLIST',
  'scene': 'SCENE',
  'release': 'RELEASE',
  'field-recording': 'FIELD RECORDING',
  'recommendation': 'RECOMMENDATION',
};
```

Add to the Post interface:

```typescript
/** Post category for display label */
category?: PostCategory;
```

- [ ] **Step 2: Display category label in PostCard**

Add a category label above the date in the PostCard render. Before the `<time>` element:

```tsx
{post.category && (
  <span className="font-mono-label text-xs text-accent tracking-[0.2em] uppercase block mb-1">
    {categoryLabels[post.category]}
  </span>
)}
```

- [ ] **Step 3: Update PostCard styling for gallery aesthetic**

Change the article's border style from `border-l-3 border-accent` to a subtler card:

```tsx
<article
  className={cn(
    "bg-card-gallery border border-card-gallery-border p-8 transition-colors hover:bg-card-gallery-hover",
    onClick && "cursor-pointer",
    className
  )}
```

Note: These classes rely on tokens from Plan 1. If Plan 1 hasn't been applied yet, use inline fallbacks: `bg-[oklch(8%_0_0deg)] border-[oklch(12%_0_0deg)]`.

- [ ] **Step 4: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/components/PostCard.tsx
git commit -m "feat: add category field to Post interface and gallery card styling"
```

---

## Chunk 2: Blog Post Content (Batches 1-4: Feb–May 2025)

### Task 2: Create February 2025 posts

**Files:**
- Create: `src/posts/2025-02.ts`

- [ ] **Step 1: Write 4 posts for February 2025**

Create `src/posts/2025-02.ts` with posts 3–6. Each post is a `Post` object. Content guidelines:
- Warm, personal first-person voice
- Reference real Helsinki venues, artists, labels
- Grounded in reality — no fabricated events
- Mix of short (300-400 words) and longer (600-800 words)
- Category variety: studio, playlist, scene, recommendation

```typescript
import { Post } from '../components/PostCard';

const feb2025: Post[] = [
  {
    id: 3,
    title: 'Starting fresh',
    timestamp: '2025-02-03',
    contentType: 'text',
    category: 'studio',
    body: `<p>New year, new approach to the studio. I've been rethinking my entire workflow over the past few weeks...</p>
    <!-- 300-400 words of authentic producer blog content about studio setup, workflow changes, gear decisions -->`,
    author: 'Random Gorsey',
    excerpt: 'Rethinking the studio workflow for 2025.',
  },
  {
    id: 4,
    title: 'Five tracks keeping me warm',
    timestamp: '2025-02-10',
    contentType: 'text',
    category: 'playlist',
    body: `<p>Helsinki in February is exactly as dark as you'd imagine...</p>
    <!-- 400-500 words recommending 5 real tracks with commentary -->`,
    author: 'Random Gorsey',
    excerpt: 'A winter playlist for the darkest month.',
  },
  {
    id: 5,
    title: 'The Kaiku basement on a Tuesday',
    timestamp: '2025-02-17',
    contentType: 'text',
    category: 'scene',
    body: `<p>There's something about a Tuesday night at Kaiku that strips everything back to basics...</p>
    <!-- 300-400 words about the Helsinki club scene, Kaiku venue -->`,
    author: 'Random Gorsey',
    excerpt: 'Midweek magic at Helsinki\'s Kaiku.',
  },
  {
    id: 6,
    title: 'Sampling from cassette',
    timestamp: '2025-02-24',
    contentType: 'text',
    category: 'studio',
    body: `<p>Found a box of old cassettes at a flea market in Kallio last weekend...</p>
    <!-- 400-500 words about sampling workflow, tape warmth, lo-fi production -->`,
    author: 'Random Gorsey',
    excerpt: 'Flea market cassettes and the beauty of tape hiss.',
  },
];

export default feb2025;
```

**IMPORTANT for the implementing agent:** The body content shown above is placeholder. You MUST write full, authentic blog post content (300-800 words each) that reads like a real electronic music producer's blog. Reference real artists (Kerri Chandler, Mall Grab, DJ Koze, etc.), real venues (Kaiku, Ääniwalli, Tresor), real gear (Roland SP-404, Ableton, various synths). The posts must be indistinguishable from human-written content.

- [ ] **Step 2: Commit**

```bash
git add src/posts/2025-02.ts
git commit -m "content: add February 2025 blog posts"
```

### Task 3: Create March 2025 posts

**Files:**
- Create: `src/posts/2025-03.ts`

- [ ] **Step 1: Write 4 posts for March 2025**

Same structure as Task 2. Posts 7–10. Suggested topics:
- Post 7 (Mar 3): scene — "First signs of spring in Kallio"
- Post 8 (Mar 10): recommendation — track recommendation with embedded Spotify iframe
- Post 9 (Mar 17): studio — gear or production technique deep dive
- Post 10 (Mar 24): playlist — monthly picks for March

- [ ] **Step 2: Commit**

```bash
git add src/posts/2025-03.ts
git commit -m "content: add March 2025 blog posts"
```

### Task 4: Create April 2025 posts

**Files:**
- Create: `src/posts/2025-04.ts`

- [ ] **Step 1: Write 4-5 posts for April 2025 (posts 11-14/15)**

Suggested topics:
- studio diary, field recording (Helsinki spring sounds), scene report, playlist, recommendation

- [ ] **Step 2: Commit**

```bash
git add src/posts/2025-04.ts
git commit -m "content: add April 2025 blog posts"
```

### Task 5: Create May 2025 posts (replaces FirstPost)

**Files:**
- Create: `src/posts/2025-05.ts`
- Delete: `src/posts/FirstPost.tsx`

- [ ] **Step 1: Write 4-5 posts for May 2025**

Include a rewrite of the original FirstPost (id: 1) with richer content. The original was a generic "welcome to my blog" — rewrite as a proper studio diary or scene report with the warm personal voice. Keep `id: 1` and `timestamp: '2025-05-01'`.

Other posts: mix of categories as before.

- [ ] **Step 2: Delete FirstPost.tsx**

```bash
rm src/posts/FirstPost.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/posts/2025-05.ts
git rm src/posts/FirstPost.tsx
git commit -m "content: add May 2025 posts, replace generic FirstPost"
```

### Task 6: Create June 2025 posts (replaces RandomRecommends)

**Files:**
- Create: `src/posts/2025-06.ts`
- Delete: `src/posts/RandomRecommends.tsx`

- [ ] **Step 1: Write 4-5 posts for June 2025**

Include a rewrite of RandomRecommends (id: 2) with the same Spotify playlist embed but better surrounding content. Keep `id: 2` and `timestamp: '2025-06-21'`. Rewrite the body with more personal commentary.

- [ ] **Step 2: Delete RandomRecommends.tsx**

```bash
rm src/posts/RandomRecommends.tsx
```

- [ ] **Step 3: Commit**

```bash
git add src/posts/2025-06.ts
git rm src/posts/RandomRecommends.tsx
git commit -m "content: add June 2025 posts, replace RandomRecommends"
```

---

## Chunk 3: Blog Post Content (Batches 5-9: Jul 2025–Mar 2026)

### Task 7-13: Create remaining monthly post batches

Follow the same pattern as Tasks 2-6 for the remaining months. One task per month:

| Task | Month | File | Post IDs | Notes |
|------|-------|------|----------|-------|
| 7 | Jul 2025 | `src/posts/2025-07.ts` | 24-27 | Summer in Helsinki, outdoor events |
| 8 | Aug 2025 | `src/posts/2025-08.ts` | 28-32 | Peak summer, Berlin trip references |
| 9 | Sep 2025 | `src/posts/2025-09.ts` | 33-36 | Autumn, back to studio |
| 10 | Oct 2025 | `src/posts/2025-10.ts` | 37-40 | Dark season begins |
| 11 | Nov 2025 | `src/posts/2025-11.ts` | 41-45 | Deep winter studio sessions |
| 12 | Dec 2025 | `src/posts/2025-12.ts` | 46-49 | Year-end reflections, best-of lists |
| 13 | Jan 2026 | `src/posts/2026-01.ts` | 50-53 | New year, fresh start |
| 14 | Feb 2026 | `src/posts/2026-02.ts` | 54-57 | Winter production diary |
| 15 | Mar 2026 | `src/posts/2026-03.ts` | 58 | Latest post (week 1 only) |

Each task follows the same pattern:
- [ ] Write posts with full authentic content
- [ ] Commit with message `content: add [Month Year] blog posts`

**Content arc across the year:**
- **Feb-Apr 2025**: Establishing voice. Studio setup, local scene, getting back into production
- **May-Jul 2025**: Summer energy. Outdoor events, longer days, more social/scene posts
- **Aug-Oct 2025**: Productive stretch. Berlin references, collaboration hints, deeper studio work
- **Nov-Dec 2025**: Introspective. Dark season, year-end reflection, best-of lists
- **Jan-Mar 2026**: Fresh momentum. New year plans, gear changes, looking forward

---

## Chunk 4: Post Index & Route Updates

### Task 16: Update posts index to import all batches

**Files:**
- Modify: `src/posts/index.ts`

- [ ] **Step 1: Rewrite index.ts**

```typescript
import { Post } from '../components/PostCard';
import feb2025 from './2025-02';
import mar2025 from './2025-03';
import apr2025 from './2025-04';
import may2025 from './2025-05';
import jun2025 from './2025-06';
import jul2025 from './2025-07';
import aug2025 from './2025-08';
import sep2025 from './2025-09';
import oct2025 from './2025-10';
import nov2025 from './2025-11';
import dec2025 from './2025-12';
import jan2026 from './2026-01';
import feb2026 from './2026-02';
import mar2026 from './2026-03';

const posts: Post[] = [
  ...feb2025,
  ...mar2025,
  ...apr2025,
  ...may2025,
  ...jun2025,
  ...jul2025,
  ...aug2025,
  ...sep2025,
  ...oct2025,
  ...nov2025,
  ...dec2025,
  ...jan2026,
  ...feb2026,
  ...mar2026,
].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

export const getPostById = (id: number): Post | undefined =>
  posts.find((post) => post.id === id);

export const getAdjacentPosts = (id: number): { prev?: Post; next?: Post } => {
  const index = posts.findIndex((post) => post.id === id);
  return {
    prev: index > 0 ? posts[index - 1] : undefined,
    next: index < posts.length - 1 ? posts[index + 1] : undefined,
  };
};

export default posts;
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -10`
Expected: Build succeeds, all 58 static post pages generated

- [ ] **Step 3: Commit**

```bash
git add src/posts/index.ts
git commit -m "feat: consolidate all monthly post batches in index"
```

---

## Chunk 5: Homepage Blog Feed

### Task 17: Redesign Home.tsx as blog feed

**Files:**
- Modify: `src/site/Home.tsx`

- [ ] **Step 1: Rewrite Home.tsx**

Replace the current hero-with-posts layout. New structure:

1. VideoBackground stays (ambient, behind content)
2. No KineticText "Latest Posts" hero headline
3. Featured post: first post rendered as a large full-width card with title, excerpt, date, category
4. Post grid: remaining posts in 2-column CSS Grid
5. Infinite scroll: keep IntersectionObserver pattern, load 10 posts initially then 10 per batch
6. No "Back to Top" button (gallery aesthetic — let them scroll)

Key layout:

```tsx
{/* Featured post */}
<article className="bg-card-gallery border border-card-gallery-border p-8 md:p-12 mb-6">
  <span className="font-mono-label text-xs text-accent tracking-[0.2em]">LATEST</span>
  <h2 className="text-2xl md:text-3xl font-europa-light mt-3 mb-4 leading-tight tracking-tight">
    <Link href={`/posts/${featuredPost.id}`} className="text-foreground hover:text-accent no-underline">
      {featuredPost.title}
    </Link>
  </h2>
  <p className="text-neutral-400 text-sm leading-relaxed">{featuredPost.excerpt}</p>
  <time className="text-neutral-600 text-xs mt-4 block">{featuredPost.timestamp}</time>
</article>

{/* Post grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {remainingPosts.map(post => (
    <Link key={post.id} href={`/posts/${post.id}`} className="no-underline">
      <article className="bg-card-gallery border border-card-gallery-border p-6 h-full transition-colors hover:bg-card-gallery-hover">
        {post.category && (
          <span className="font-mono-label text-[10px] text-neutral-500 tracking-[0.2em] uppercase">{categoryLabels[post.category]}</span>
        )}
        <h3 className="text-base font-europa mt-2 mb-1 text-foreground">{post.title}</h3>
        <time className="text-neutral-600 text-xs">{post.timestamp}</time>
      </article>
    </Link>
  ))}
</div>
```

- [ ] **Step 2: Update home test**

Read and update `src/site/__tests__/Home.test.tsx` to match new structure.

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/site/__tests__/Home.test.tsx`
Expected: Pass

- [ ] **Step 4: Commit**

```bash
git add src/site/Home.tsx src/site/__tests__/Home.test.tsx
git commit -m "feat: redesign homepage as blog feed with featured post and grid"
```

---

## Chunk 6: Post Detail Page

### Task 18: Refine Post detail page

**Files:**
- Modify: `src/site/Post.tsx`

- [ ] **Step 1: Rewrite Post.tsx**

Clean reading layout:
1. Max-width ~680px centered (use `Container size="prose"`)
2. Large title, date, category label at top
3. Body text in Europa at comfortable reading size
4. Previous / Next navigation at bottom using `getAdjacentPosts()`
5. No "Back to Home" button — prev/next is the navigation
6. Keep VideoBackground ambient

```tsx
import { getPostById, getAdjacentPosts } from '../posts';
import { categoryLabels } from '../components/PostCard';

// In render:
const { prev, next } = getAdjacentPosts(postId);

// Bottom navigation:
<nav className="flex justify-between items-center pt-12 mt-12 border-t border-neutral-800">
  {prev ? (
    <Link href={`/posts/${prev.id}`} className="text-neutral-400 hover:text-accent text-sm no-underline">
      &larr; {prev.title}
    </Link>
  ) : <span />}
  {next ? (
    <Link href={`/posts/${next.id}`} className="text-neutral-400 hover:text-accent text-sm no-underline text-right">
      {next.title} &rarr;
    </Link>
  ) : <span />}
</nav>
```

- [ ] **Step 2: Verify build**

Run: `npx next build 2>&1 | tail -10`
Expected: All post pages generate

- [ ] **Step 3: Commit**

```bash
git add src/site/Post.tsx
git commit -m "feat: clean reading layout with prev/next for post detail"
```

### Task 19: Update page metadata

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Update home page metadata**

Change description to something more fitting:

```typescript
export const metadata: Metadata = createMetadata({
  title: 'Random Gorsey',
  description: 'Lo-fi house and electronic music from Helsinki. Blog, releases, and more.',
  path: '/',
});
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "content: update homepage metadata"
```

---

## Verification

After all tasks complete:

- [ ] Run: `npx vitest run` — all tests pass
- [ ] Run: `npx next build` — all 58+ static pages generate
- [ ] Visual check: homepage shows featured post + grid, post detail has prev/next, categories display correctly
