# Codebase Structure

**Analysis Date:** 2026-01-17

## Directory Layout

```
randomgorsey/
├── .storybook/             # Storybook configuration
├── .github/                # GitHub Actions workflows and templates
├── .planning/              # GSD planning documents
│   └── codebase/           # Codebase analysis documents
├── __mocks__/              # Jest mock files
├── mcp/                    # TypeScript MCP server for analysis
├── public/                 # Static assets served directly
│   ├── images/             # Public images (logo, gallery, OG images)
│   └── *.html, *.xml       # HTML templates, sitemap, robots
├── scripts/                # Build and deployment scripts
├── src/                    # Source code root
│   ├── components/         # Reusable UI components
│   │   └── __tests__/      # Component unit tests
│   ├── data/               # Static data modules
│   ├── fonts/              # Custom font files
│   ├── images/             # Source images (imported by webpack)
│   ├── pages/              # Route-level page components
│   │   └── __tests__/      # Page unit tests
│   ├── patterns/           # Layout components (Header, Footer)
│   │   └── __tests__/      # Pattern unit tests
│   ├── posts/              # Blog post content modules
│   ├── stories/            # Storybook component stories
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── videos/             # Video assets (WebM)
├── build/                  # Production build output (generated)
├── coverage/               # Test coverage reports (generated)
└── docs/                   # Project documentation
```

## Directory Purposes

**`src/components/`:**
- Purpose: Reusable UI building blocks
- Contains: 18+ components with their CSS Modules
- Key files: `Button.tsx`, `Input.tsx`, `Modal.tsx`, `PostCard.tsx`, `Select.tsx`, `Alert.tsx`, `index.ts` (barrel export)

**`src/pages/`:**
- Purpose: Route-level page components
- Contains: 7 page components (Home, About, Contact, Gallery, Discography, Listen, NotFound)
- Key files: Each page has `PageName.tsx` + `PageName.module.css`

**`src/patterns/`:**
- Purpose: Shared layout components used across all pages
- Contains: Header.tsx, Footer.tsx with their CSS Modules
- Key files: `Header.tsx` (navigation), `Footer.tsx` (social links, copyright)

**`src/posts/`:**
- Purpose: Blog post content as TypeScript modules
- Contains: Post data objects following the Post interface
- Key files: `FirstPost.tsx`, `RandomRecommends.tsx`

**`src/types/`:**
- Purpose: Shared TypeScript interfaces and type definitions
- Contains: Common types (Size, ColorVariant), form types, declaration files
- Key files: `common.ts` (BaseComponentProps, Size, ColorVariant), `forms.ts`

**`src/utils/`:**
- Purpose: Helper functions and shared logic
- Contains: Validation, security, device detection utilities
- Key files: `validation.ts` (Zod schemas), `security.ts` (sanitization, rate limiting), `isIOS.ts`, `isWebMSupported.ts`

**`src/data/`:**
- Purpose: Static content data
- Contains: Gallery image configuration
- Key files: `galleryImages.ts`

**`src/stories/`:**
- Purpose: Storybook component stories for development/documentation
- Contains: Story files for each component
- Key files: `Button.stories.tsx`, `Input.stories.tsx`, `PostCard.stories.tsx`

**`public/`:**
- Purpose: Static assets served without processing
- Contains: HTML, images, manifest, sitemap, robots.txt
- Key files: `index.html`, `images/logo.jpg`, `images/og.jpg`, `sitemap.xml`

**`scripts/`:**
- Purpose: Build-time scripts for deployment and configuration
- Contains: Post-build scripts, meta generation
- Key files: `copy-404.js`, `copy-cname.js`, `generate-meta.js`, `update-docs.js`

**`.storybook/`:**
- Purpose: Storybook configuration
- Contains: Main config, preview config, custom CSS
- Key files: `main.ts`, `preview.tsx`

**`mcp/`:**
- Purpose: Custom TypeScript MCP server for analysis tools
- Contains: TypeScript checking and linting tools
- Key files: `direct-checker.js`, `typescript-server.js`

## Key File Locations

**Entry Points:**
- `src/index.tsx`: Application bootstrap
- `src/App.tsx`: Router and layout configuration

**Configuration:**
- `package.json`: Dependencies and scripts
- `tsconfig.json`: TypeScript compiler options
- `.eslintrc.json`: ESLint rules
- `.stylelintrc.json`: Stylelint rules
- `config-overrides.js`: CRA webpack overrides (MDX support)

**Core Logic:**
- `src/utils/validation.ts`: Zod form schemas
- `src/utils/security.ts`: Input sanitization, rate limiting
- `src/utils/httpsEnforcement.ts`: Security initialization

**Styling:**
- `src/variables.css`: Global CSS variables (colors)
- `src/index.module.css`: Root styles
- `src/App.module.css`: App container styles

**Testing:**
- `src/setupTests.ts`: Jest configuration
- `src/components/__tests__/`: Component tests
- `src/pages/__tests__/`: Page tests
- `src/patterns/__tests__/`: Pattern tests

**Static Assets:**
- `public/images/`: Public images (logo, gallery photos)
- `src/videos/`: WebM background videos
- `src/fonts/`: Custom typography files

## Naming Conventions

**Files:**
- Components: `PascalCase.tsx` (e.g., `Button.tsx`, `PostCard.tsx`)
- CSS Modules: `ComponentName.module.css` (e.g., `Button.module.css`)
- Tests: `ComponentName.test.tsx` (e.g., `Button.test.tsx`)
- Stories: `ComponentName.stories.tsx` (e.g., `Button.stories.tsx`)
- Utilities: `camelCase.ts` (e.g., `validation.ts`, `isIOS.ts`)
- Types: `camelCase.ts` (e.g., `common.ts`, `forms.ts`)
- Data: `camelCase.ts` (e.g., `galleryImages.ts`)

**Directories:**
- Source directories: `lowercase` (e.g., `components`, `pages`, `utils`)
- Test directories: `__tests__`
- Mock directories: `__mocks__`

**Components:**
- Component names: `PascalCase` (e.g., `Button`, `PostCard`)
- Props interfaces: `ComponentNameProps` (e.g., `ButtonProps`, `PostCardProps`)
- CSS class names: `kebab-case` in modules (e.g., `styles['button-primary']`)

**Types:**
- Interfaces: `PascalCase` (e.g., `BaseComponentProps`, `Post`)
- Type aliases: `PascalCase` (e.g., `ButtonVariant`, `Size`)
- Enums: `PascalCase` with `PascalCase` members (e.g., `PostContentType.TEXT`)

## Where to Add New Code

**New Page:**
- Create: `src/pages/NewPage.tsx` (functional component)
- Create: `src/pages/NewPage.module.css` (scoped styles)
- Create: `src/pages/__tests__/NewPage.test.tsx` (unit tests)
- Update: `src/App.tsx` (add lazy import and Route)
- Update: `src/patterns/Header.tsx` (add navigation link if needed)

**New Component:**
- Create: `src/components/NewComponent.tsx` (with TypeScript interface)
- Create: `src/components/NewComponent.module.css` (scoped styles)
- Create: `src/components/__tests__/NewComponent.test.tsx` (unit tests)
- Create: `src/stories/NewComponent.stories.tsx` (Storybook story)
- Update: `src/components/index.ts` (add export)

**New Utility:**
- Create: `src/utils/newUtility.ts` (pure functions)
- Import directly in components/pages as needed

**New Type:**
- Add to `src/types/common.ts` for shared types
- Add to `src/types/forms.ts` for form-related types
- Or create `src/types/newDomain.ts` for domain-specific types

**New Post:**
- Create: `src/posts/NewPost.tsx` (Post object export)
- Update: `src/pages/Home.tsx` (import and add to allPosts array)

**New Static Asset:**
- Public images: `public/images/` (accessible at `/images/filename`)
- Source images: `src/images/` (imported via webpack)
- Videos: `src/videos/` (imported via require())

## Special Directories

**`build/`:**
- Purpose: Production build output
- Generated: Yes (by `npm run build`)
- Committed: No (in .gitignore)

**`coverage/`:**
- Purpose: Jest test coverage reports
- Generated: Yes (by `npm test -- --coverage`)
- Committed: No (in .gitignore)

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes (by `npm install`)
- Committed: No (in .gitignore)

**`.planning/`:**
- Purpose: GSD planning and analysis documents
- Generated: By GSD commands
- Committed: Yes

---

*Structure analysis: 2026-01-17*
