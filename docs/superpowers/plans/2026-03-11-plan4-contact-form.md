# Plan 4: Contact Form — Progressive Disclosure

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the contact form with progressive disclosure — user selects contact reason (booking, collaboration, just saying hello), which reveals relevant fields with smooth Framer Motion animation. Keep all existing security (Zod, rate limiting, honeypot, EmailJS).

**Architecture:** Replace the flat form in `src/site/Contact.tsx` with a multi-step flow. Step 1: name + email + reason selector (3 cards). Step 2: reason-specific fields slide in. All validation and submission logic stays, extended with new field types.

**Tech Stack:** React, TypeScript, Zod v4, Framer Motion, EmailJS, CSS Modules

**Spec:** `docs/superpowers/specs/2026-03-11-site-redesign-content-design.md`

**Depends on:** Plan 1 (design tokens, motion variants)

---

## File Map

| Action | File | Responsibility |
|--------|------|---------------|
| Modify | `src/site/Contact.tsx` | Progressive disclosure form redesign |
| Modify | `src/site/Contact.module.css` | Updated styles for card selector, field groups |
| Modify | `src/utils/validation.ts` | Extended Zod schema for new fields |
| Modify | `src/site/__tests__/Contact.test.tsx` | Updated tests |

---

## Chunk 1: Extended Validation Schema

### Task 1: Extend Zod schema for new contact fields

**Files:**
- Modify: `src/utils/validation.ts`

- [ ] **Step 1: Read current validation.ts**

Read `src/utils/validation.ts` to see the existing `contactFormSchema`.

- [ ] **Step 2: Create extended schemas**

Add alongside the existing schema (don't remove it yet):

```typescript
import { z } from 'zod';

export type ContactReason = 'booking' | 'collaboration' | 'hello';

const baseFields = {
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email').max(200),
};

export const bookingSchema = z.object({
  ...baseFields,
  reason: z.literal('booking'),
  date: z.string().min(1, 'Please provide a date or date range'),
  venue: z.string().min(1, 'Venue or event name is required').max(200),
  location: z.string().min(1, 'Location is required').max(200),
  budget: z.enum(['under-500', '500-1000', '1000-2500', '2500-plus', 'prefer-not-to-say']),
  message: z.string().min(10, 'Please include some details').max(5000),
});

export const collaborationSchema = z.object({
  ...baseFields,
  reason: z.literal('collaboration'),
  projectType: z.enum(['remix', 'track', 'other']),
  timeline: z.string().max(200).optional(),
  message: z.string().min(10, 'Please include some details').max(5000),
});

export const helloSchema = z.object({
  ...baseFields,
  reason: z.literal('hello'),
  message: z.string().min(1, 'Say something!').max(5000),
});

export const contactSchemaByReason = {
  booking: bookingSchema,
  collaboration: collaborationSchema,
  hello: helloSchema,
} as const;
```

- [ ] **Step 3: Verify build**

Run: `npx next build 2>&1 | tail -5`

- [ ] **Step 4: Commit**

```bash
git add src/utils/validation.ts
git commit -m "feat: add progressive disclosure Zod schemas for contact form"
```

---

## Chunk 2: Contact Form Redesign

### Task 2: Rewrite Contact.tsx with progressive disclosure

**Files:**
- Modify: `src/site/Contact.tsx`
- Modify: `src/site/Contact.module.css`

- [ ] **Step 1: Redesign the form component**

New flow:

**Always visible:** Name and email fields at the top.

**Reason selector:** Three cards below. Gallery-styled (dark cards, yellow border on selected):

```tsx
const reasons = [
  { key: 'booking', label: 'Booking & Events', description: 'Gigs, festivals, DJ sets' },
  { key: 'collaboration', label: 'Collaboration', description: 'Remixes, tracks, projects' },
  { key: 'hello', label: 'Just saying hello', description: 'Fan mail, questions, whatever' },
] as const;
```

**Conditional fields:** Based on selected reason, AnimatePresence reveals the appropriate fields:

- **booking**: date input, venue input, location input, budget dropdown, message textarea
- **collaboration**: project type dropdown, timeline input (optional), message textarea
- **hello**: message textarea only

**Budget dropdown options:**
```tsx
<select>
  <option value="">Select budget range</option>
  <option value="under-500">Under €500</option>
  <option value="500-1000">€500 – €1,000</option>
  <option value="1000-2500">€1,000 – €2,500</option>
  <option value="2500-plus">€2,500+</option>
  <option value="prefer-not-to-say">Prefer not to say</option>
</select>
```

**Back button:** When a reason is selected, show a "Change" text link that resets the selection.

**Submit:** Solid yellow button, text "Send". Validates using the reason-specific Zod schema.

**Success:** Replace entire form with inline message: "Got it — I'll get back to you." No modal.

**Security:** Keep all existing security: rate limiter, honeypot field, sanitization. The EmailJS template will receive all fields concatenated in the message body.

- [ ] **Step 2: Update Contact.module.css**

Add styles for reason cards and field transitions:

```css
.reason-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 640px) {
  .reason-cards {
    grid-template-columns: 1fr;
  }
}

.reason-card {
  background: var(--color-card-gallery, oklch(8% 0 0deg));
  border: 1px solid var(--color-card-gallery-border, oklch(12% 0 0deg));
  padding: 1.5rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.reason-card:hover {
  background: var(--color-card-gallery-hover, oklch(10% 0 0deg));
}

.reason-card-selected {
  border-color: var(--color-accent);
}
```

- [ ] **Step 3: Handle EmailJS template**

The EmailJS `send()` call needs to pass all fields. Build a message string from whatever fields are present:

```typescript
const buildEmailMessage = (data: Record<string, string>) => {
  const lines = [];
  if (data.reason) lines.push(`Reason: ${data.reason}`);
  if (data.venue) lines.push(`Venue: ${data.venue}`);
  if (data.location) lines.push(`Location: ${data.location}`);
  if (data.date) lines.push(`Date: ${data.date}`);
  if (data.budget) lines.push(`Budget: ${data.budget}`);
  if (data.projectType) lines.push(`Project Type: ${data.projectType}`);
  if (data.timeline) lines.push(`Timeline: ${data.timeline}`);
  lines.push('');
  lines.push(data.message);
  return lines.join('\n');
};
```

Pass this as the `message` field to EmailJS, along with `name`, `email`, and use the reason as `subject`.

- [ ] **Step 4: Update Contact test**

Read and update `src/site/__tests__/Contact.test.tsx`:
- Test reason card selection
- Test that clicking a reason reveals appropriate fields
- Test form submission with booking fields
- Test form submission with hello (message only)
- Test "Change" link resets selection
- Test validation errors display correctly
- Test success message replaces form

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/site/__tests__/Contact.test.tsx`
Expected: All pass

- [ ] **Step 6: Commit**

```bash
git add src/site/Contact.tsx src/site/Contact.module.css src/site/__tests__/Contact.test.tsx
git commit -m "feat: progressive disclosure contact form with reason-based field groups"
```

---

## Verification

- [ ] Run: `npx vitest run` — all tests pass
- [ ] Run: `npx next build` — build succeeds
- [ ] Visual check: form shows name/email, then 3 reason cards, clicking reveals fields, "Send" submits, success message appears inline
- [ ] Test all three paths: booking (all fields), collaboration (project type + message), hello (message only)
- [ ] Verify rate limiting still works
- [ ] Verify honeypot still works (fill hidden field, submit should silently fail)
