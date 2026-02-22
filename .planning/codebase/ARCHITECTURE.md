# Architecture

**Analysis Date:** 2026-01-17

## Pattern Overview

**Overall:** Component-Based Single Page Application (SPA)

**Key Characteristics:**
- React 19 SPA with client-side routing via React Router DOM
- Lazy-loaded page components with Suspense for code splitting
- CSS Modules for component-scoped styling
- Functional components with TypeScript interfaces
- Centralized component exports via barrel files

## Layers

**Entry Layer:**
- Purpose: Application bootstrap and global providers
- Location: `src/index.tsx`
- Contains: React root rendering, HelmetProvider wrapping
- Depends on: `src/App.tsx`, React DOM
- Used by: Browser runtime

**Application Shell Layer:**
- Purpose: App-level routing, layout, and cross-cutting concerns
- Location: `src/App.tsx`
- Contains: BrowserRouter, Routes, Header/Footer patterns, security initialization
- Depends on: `src/pages/*`, `src/patterns/*`, `src/components/*`, `src/utils/*`
- Used by: Entry layer

**Page Layer:**
- Purpose: Route-level views that compose components
- Location: `src/pages/`
- Contains: Home, About, Contact, Gallery, Discography, Listen, NotFound
- Depends on: `src/components/*`, `src/patterns/*`, `src/utils/*`, `src/data/*`, `src/posts/*`
- Used by: Application Shell (via lazy loading)

**Pattern Layer:**
- Purpose: Shared layout components (Header, Footer)
- Location: `src/patterns/`
- Contains: Header.tsx, Footer.tsx with associated CSS Modules
- Depends on: `src/components/*`, react-router-dom, react-social-icons
- Used by: Application Shell

**Component Layer:**
- Purpose: Reusable UI building blocks
- Location: `src/components/`
- Contains: 18+ components (Button, Input, Modal, Alert, PostCard, Select, etc.)
- Depends on: `src/types/*`, framer-motion, react-icons, @heroicons/react
- Used by: Pages, Patterns, other Components

**Utility Layer:**
- Purpose: Helper functions, validation, security utilities
- Location: `src/utils/`
- Contains: validation.ts, security.ts, httpsEnforcement.ts, isIOS.ts, isWebMSupported.ts
- Depends on: Zod
- Used by: Pages, Components

**Type Layer:**
- Purpose: Shared TypeScript definitions
- Location: `src/types/`
- Contains: common.ts (Size, ColorVariant, BaseComponentProps), forms.ts, declaration files
- Depends on: React types
- Used by: Components, Pages

**Data Layer:**
- Purpose: Static content and configuration
- Location: `src/data/`
- Contains: galleryImages.ts
- Depends on: None
- Used by: Pages

**Content Layer:**
- Purpose: Blog post content as TypeScript modules
- Location: `src/posts/`
- Contains: FirstPost.tsx, RandomRecommends.tsx (Post data objects)
- Depends on: `src/components/PostCard` (for Post interface)
- Used by: Pages (Home)

## Data Flow

**Page Load Flow:**

1. `src/index.tsx` bootstraps React app with HelmetProvider
2. `src/App.tsx` initializes security measures via useEffect
3. React Router matches URL to route
4. Lazy-loaded page component renders via Suspense (Spinner fallback)
5. Page fetches data from `src/data/*` or `src/posts/*`
6. Components render with CSS Module styles

**Contact Form Flow:**

1. User enters data in Input/TextArea components
2. `handleInputChange` validates with Zod schema on each keystroke
3. `handleSend` validates with security sanitization + Zod
4. RateLimiter checks submission frequency
5. EmailJS sends message to configured service
6. Success modal shown, form reset

**State Management:**
- Local component state via useState hooks
- No global state management library
- Props drilling for simple component communication
- URL-based state via React Router

## Key Abstractions

**BaseComponentProps:**
- Purpose: Standard props interface for all components
- Examples: `src/components/Button.tsx`, `src/components/Input.tsx`, `src/components/PostCard.tsx`
- Pattern: Interface extending StylingProps, AccessibilityProps, ComponentState
- Definition: `src/types/common.ts`

**Post:**
- Purpose: Blog post data structure
- Examples: `src/posts/FirstPost.tsx`, `src/posts/RandomRecommends.tsx`
- Pattern: Interface with id, title, timestamp, contentType, body, author
- Definition: `src/components/PostCard.tsx`

**Page Container Pattern:**
- Purpose: Consistent page animation and iOS fallback
- Examples: All pages use `const Container: React.ElementType = isIOS() ? 'div' : motion.div;`
- Pattern: Conditional Framer Motion wrapper based on device detection

**CSS Module Pattern:**
- Purpose: Component-scoped styling
- Examples: Every component has `ComponentName.module.css`
- Pattern: `import styles from './Component.module.css'; styles['class-name']`

## Entry Points

**Main Entry:**
- Location: `src/index.tsx`
- Triggers: Browser loads application
- Responsibilities: Create React root, wrap App with providers, render

**Router Entry:**
- Location: `src/App.tsx` (Routes component)
- Triggers: URL navigation
- Responsibilities: Match URL to page component, manage layout

**Page Entries (7 routes):**
- Location: `src/pages/Home.tsx` (`/`)
- Location: `src/pages/Listen.tsx` (`/listen`)
- Location: `src/pages/About.tsx` (`/about`)
- Location: `src/pages/Contact.tsx` (`/contact`)
- Location: `src/pages/Discography.tsx` (`/discography`)
- Location: `src/pages/Gallery.tsx` (`/gallery`)
- Location: `src/pages/NotFound.tsx` (`/*`)

**Storybook Entry:**
- Location: `.storybook/main.ts`, `.storybook/preview.tsx`
- Triggers: `npm run storybook`
- Responsibilities: Configure and render component stories

## Error Handling

**Strategy:** Layered validation with user feedback

**Patterns:**
- Form validation: Zod schema with `.safeParse()`, errors mapped to UI fields
- Security validation: `validateAndSanitizeContactForm()` returns `{ isValid, errors, sanitizedData }`
- Rate limiting: `RateLimiter` class with `isAllowed()` check before form submission
- Network errors: try/catch with console.error and user-facing error messages
- Loading states: useState for loading, Spinner component as fallback

## Cross-Cutting Concerns

**Logging:**
- console.error for configuration issues and API failures
- console.warn for security events (honeypot triggered)

**Validation:**
- Zod schemas in `src/utils/validation.ts`
- Security sanitization in `src/utils/security.ts`
- Input-level validation with real-time feedback

**Authentication:**
- Not implemented (static site)
- EmailJS uses public key from environment variables

**SEO:**
- react-helmet-async for meta tags
- PageMeta component wraps pages with title, description, path
- react-snap for static HTML generation (configured in package.json)

**Animation:**
- Framer Motion for page transitions and UI interactions
- AnimatePresence for exit animations
- iOS devices receive static rendering (no animations) for performance

**Accessibility:**
- aria-* props throughout components
- BaseComponentProps includes AccessibilityProps interface
- Semantic HTML (header, nav, main, footer, article)
- Keyboard navigation support

---

*Architecture analysis: 2026-01-17*
