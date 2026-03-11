# Plan 1: Design System & Navigation — Dark Gallery

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing punk design system into a dark gallery aesthetic — subtler motion, lighter typography weights, sparser yellow accent usage, refined header/footer — while keeping border-radius: 0 and the core palette.

**Architecture:** Update CSS token layer (primitives + semantic), refine Header and Footer components to match the gallery feel (spaced lettermark, muted nav, minimal footer), and update animation duration tokens.

**Tech Stack:** CSS custom properties (Tailwind v4 @theme), React, Framer Motion, Next.js App Router

**Spec:** `docs/superpowers/specs/2026-03-11-site-redesign-content-design.md`

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `src/styles/tokens/primitives.css` | Animation duration, ease curve updates |
| Modify | `src/styles/tokens/semantic.css` | Card surface token additions |
| Modify | `src/styles/globals.css` | Grain overlay opacity reduction, gallery card class |
| Modify | `src/patterns/Header.tsx` | Gallery-style nav: spaced lettermark, muted links, full-screen mobile overlay |
| Modify | `src/patterns/Footer.tsx` | Streamlined icon-row footer |
| Modify | `src/lib/motion/index.ts` | Slower, subtler animation variants |
| Modify | `src/patterns/__tests__/Header.test.tsx` | Updated test expectations |
| Modify | `src/patterns/__tests__/Footer.test.tsx` | Updated test expectations |

---

## Chunk 1: Token & Style Updates

### Task 1: Update animation tokens

**Files:**
- Modify: `src/styles/tokens/primitives.css:70-71`

- [ ] **Step 1: Update animation duration and ease**

In `src/styles/tokens/primitives.css`, change the animation tokens:

```css
/* Before */
--animate-duration: 100ms;
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1);

/* After */
--animate-duration: 350ms;
--ease-smooth: cubic-bezier(0.22, 1, 0.36, 1);
```

- [ ] **Step 2: Verify build compiles**

Run: `npx next build 2>&1 | head -20`
Expected: Build starts without CSS errors

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens/primitives.css
git commit -m "style: slow animation tokens for gallery aesthetic"
```

### Task 2: Add card surface tokens

**Files:**
- Modify: `src/styles/tokens/semantic.css`

- [ ] **Step 1: Read current semantic.css**

Read `src/styles/tokens/semantic.css` to understand existing structure.

- [ ] **Step 2: Add gallery card tokens**

Add these tokens to the semantic layer (inside the existing `@theme` or `:root` block):

```css
--color-card-gallery: oklch(8% 0 0deg);
--color-card-gallery-border: oklch(12% 0 0deg);
--color-card-gallery-hover: oklch(10% 0 0deg);
```

- [ ] **Step 3: Commit**

```bash
git add src/styles/tokens/semantic.css
git commit -m "style: add gallery card surface tokens"
```

### Task 3: Reduce grain overlay opacity

**Files:**
- Modify: `src/styles/globals.css`

- [ ] **Step 1: Read globals.css to find grain overlay**

Search for `.grain-overlay` or grain-related styles in `src/styles/globals.css`.

- [ ] **Step 2: Reduce grain opacity**

Find the grain overlay opacity value and reduce it (e.g., from `0.15` or `0.2` to `0.06`). The grain should be texture, not noise.

- [ ] **Step 3: Commit**

```bash
git add src/styles/globals.css
git commit -m "style: reduce grain overlay opacity for gallery feel"
```

---

## Chunk 2: Header Refinement

### Task 4: Redesign Header for gallery aesthetic

**Files:**
- Modify: `src/patterns/Header.tsx`
- Modify: `src/patterns/__tests__/Header.test.tsx`

- [ ] **Step 1: Read existing Header test**

Read `src/patterns/__tests__/Header.test.tsx` to understand current test expectations.

- [ ] **Step 2: Update Header component**

Modify `src/patterns/Header.tsx` with these changes:

1. **Logo/lettermark**: Change from `font-tschick-bold text-lg` to `font-europa-light text-sm tracking-[0.25em] uppercase` — lighter weight, more letter-spacing
2. **Nav links**: Change from `font-mono-label` to `text-neutral-400 text-sm tracking-wide` — muted grey, no mono font. Keep yellow for active state.
3. **Mobile menu**: Replace the dropdown list with a full-screen overlay (`fixed inset-0 z-50 bg-background flex flex-col items-center justify-center gap-8`). Links should be large (`text-2xl`).
4. **Nav labels**: Change "Disco" to "Discography" in the `navLinks` array. Change "Home" to show only on mobile (desktop shows logo as home link).

Key changes to `navLinks`:
```typescript
const navLinks = [
  { to: '/listen/', label: 'Listen', title: 'Listen to music' },
  { to: '/about/', label: 'About', title: 'About Random Gorsey' },
  { to: '/contact/', label: 'Contact', title: 'Get in touch' },
  { to: '/discography/', label: 'Discography', title: 'View releases' },
  { to: '/gallery/', label: 'Gallery', title: 'Photo gallery' },
];
```

The logo `<Link href="/">` already serves as the Home link on desktop. Add "Home" as first item in mobile overlay only.

- [ ] **Step 3: Update Header tests**

Update tests in `src/patterns/__tests__/Header.test.tsx` to match new nav structure:
- Update expected link labels (no more "Disco", no "Home" in desktop nav)
- Update expected styling classes if tests check for specific class names
- Add test for mobile overlay behavior if not already covered

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/patterns/__tests__/Header.test.tsx`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/patterns/Header.tsx src/patterns/__tests__/Header.test.tsx
git commit -m "feat: redesign header for dark gallery aesthetic"
```

---

## Chunk 3: Footer Refinement

### Task 5: Streamline Footer

**Files:**
- Modify: `src/patterns/Footer.tsx`
- Modify: `src/patterns/__tests__/Footer.test.tsx`

- [ ] **Step 1: Read existing Footer**

Read `src/patterns/Footer.tsx` and `src/patterns/__tests__/Footer.test.tsx`.

- [ ] **Step 2: Simplify Footer to icon row**

The footer should be a single row with streaming/social icons and a copyright line. No sitemap, no fat footer. Structure:

```tsx
<footer className="border-t border-neutral-800 py-8">
  <Container size="sm" padding="md">
    <div className="flex flex-col items-center gap-4">
      {/* Social/streaming icon links */}
      <div className="flex gap-6">
        {socialLinks.map(link => (
          <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
             className="text-neutral-500 hover:text-accent transition-colors"
             aria-label={link.label}>
            {link.icon}
          </a>
        ))}
      </div>
      {/* Copyright */}
      <p className="text-neutral-600 text-xs tracking-wide">
        &copy; {new Date().getFullYear()} Random Gorsey
      </p>
    </div>
  </Container>
</footer>
```

Keep existing social links: Spotify, SoundCloud, Instagram, YouTube, Bandcamp.

- [ ] **Step 3: Update Footer tests**

Update test expectations to match simplified footer structure.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/patterns/__tests__/Footer.test.tsx`
Expected: All tests pass

- [ ] **Step 5: Commit**

```bash
git add src/patterns/Footer.tsx src/patterns/__tests__/Footer.test.tsx
git commit -m "feat: streamline footer to minimal icon row"
```

---

## Chunk 4: Motion Variants

### Task 6: Update Framer Motion variants for gallery feel

**Files:**
- Modify: `src/lib/motion/index.ts`

- [ ] **Step 1: Read existing motion variants**

Read `src/lib/motion/index.ts` to see all exported variants.

- [ ] **Step 2: Update variants for subtler motion**

Update the key variant objects:
- Change `duration` values from `0.1`/`0.15` range to `0.35`/`0.5` range
- Change `ease` to use the smoother cubic-bezier
- Reduce `y` offsets (e.g., `y: 20` → `y: 12`)
- Make stagger delays longer (`0.04` → `0.06`)

Do NOT rename or remove any exported variants — other files import them. Only change the values inside.

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/lib/motion/index.ts
git commit -m "style: soften motion variants for gallery aesthetic"
```

---

## Verification

After all tasks complete:

- [ ] Run full test suite: `npx vitest run`
- [ ] Run build: `npx next build`
- [ ] Visual check: `npm run dev` — verify header shows spaced lettermark, nav is muted, footer is minimal icon row, animations feel slower/smoother
