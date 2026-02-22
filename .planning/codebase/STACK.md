# Technology Stack

**Analysis Date:** 2026-01-17

## Languages

**Primary:**
- TypeScript 5.9.3 - All application code (`src/**/*.ts`, `src/**/*.tsx`)
- JavaScript (ES5 target) - Compiled output

**Secondary:**
- CSS Modules - Component styling (`src/**/*.module.css`)
- HTML - Entry template (`public/index.html`)
- JSON - Configuration files

## Runtime

**Environment:**
- Node.js (implied by package.json ecosystem)
- Browser runtime (React SPA)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present
- Note: Uses `--legacy-peer-deps` due to React 19 ecosystem transition

## Frameworks

**Core:**
- React 19.2.0 - UI framework
- React DOM 19.2.0 - DOM rendering
- React Router DOM 7.6.1 - Client-side routing

**Animation:**
- Framer Motion 12.23.24 - Declarative animations and gestures

**SEO:**
- react-helmet-async 2.0.5 - Document head management

**Validation:**
- Zod 4.1.12 - Schema validation (uses `error.issues` API, not `error.errors`)

**Testing:**
- Jest (via react-scripts) - Test runner
- @testing-library/react 16.3.0 - React component testing
- @testing-library/jest-dom 6.6.3 - DOM matchers
- @testing-library/user-event 14.6.1 - User interaction simulation
- @testing-library/dom 10.4.0 - DOM queries

**Build/Dev:**
- Create React App (react-scripts 5.0.1) - Build toolchain
- Webpack 5.99.9 - Bundler (via CRA)
- Storybook 10.0.6 - Component development
- gh-pages 6.3.0 - Deployment to GitHub Pages

**Linting/Formatting:**
- ESLint 8.57.1 - JavaScript/TypeScript linting
- @typescript-eslint/eslint-plugin 8.46.4 - TypeScript-specific rules
- Stylelint 16.20.0 - CSS linting
- stylelint-config-standard 39.0.1 - Standard CSS rules
- stylelint-config-css-modules 4.4.0 - CSS Modules support
- stylelint-config-recess-order 7.4.0 - Property ordering

## Key Dependencies

**Critical:**
- react 19.2.0 - UI framework
- react-router-dom 7.6.1 - Routing
- framer-motion 12.23.24 - Animations
- zod 4.1.12 - Validation (breaking changes from v3 resolved)
- @emailjs/browser 4.4.1 - Client-side email sending

**UI/Icons:**
- @heroicons/react 2.2.0 - SVG icons
- react-icons 5.5.0 - Icon library (includes Bandcamp icon)
- react-social-icons 6.24.0 - Social media icons

**Infrastructure:**
- axios 1.10.0 - HTTP client (dev dependency)
- cheerio 1.1.0 - HTML parsing (dev dependency, likely for scripts)
- semver 7.5.4 - Version parsing (dev dependency)

**MCP Integration:**
- @modelcontextprotocol/sdk 1.21.1 - Custom TypeScript checker integration

## Configuration

**TypeScript (`tsconfig.json`):**
```json
{
  "target": "es5",
  "lib": ["dom", "dom.iterable", "esnext"],
  "strict": true,
  "moduleResolution": "bundler",
  "jsx": "preserve",
  "noEmit": true,
  "isolatedModules": true
}
```

**ESLint (`.eslintrc.json`):**
- Extends: react-app, react-app/jest
- Warns on: `@typescript-eslint/no-explicit-any`, `@typescript-eslint/no-non-null-assertion`
- Disabled: `explicit-function-return-type`, `explicit-module-boundary-types`

**Stylelint (`.stylelintrc.json`):**
- max-nesting-depth: 3
- selector-max-id: 0
- declaration-no-important: true
- color-named: never
- selector-class-pattern: camelCase or PascalCase

**Environment Variables:**
- `REACT_APP_EMAILJS_SERVICE_ID` - EmailJS service configuration
- `REACT_APP_EMAILJS_TEMPLATE_ID` - EmailJS template ID
- `REACT_APP_EMAILJS_PUBLIC_KEY` - EmailJS public key
- `EMAILJS_PRIVATE_KEY` - EmailJS private key (server-side only)

**Build:**
- `react-scripts build` - Production build
- `react-snap` - Static HTML generation for SEO (puppeteer-based)
- Post-build scripts: `copy-404.js`, `copy-cname.js`

## Platform Requirements

**Development:**
- Node.js (version not pinned, no `.nvmrc`)
- npm
- Modern browser for testing

**Production:**
- GitHub Pages hosting
- Domain: https://randomgorsey.com
- Static file serving (SPA with client-side routing)
- 404.html fallback for SPA routing

**Browser Support (`browserslist`):**
- Production: >0.2%, not dead, not op_mini all
- Development: last 1 chrome/firefox/safari version

## Custom Tooling

**MCP TypeScript Checker (`mcp/`):**
- `direct-checker.js` - Standalone TypeScript checking script
- `typescript-server.js` - MCP server for TypeScript analysis
- `typescript-checker.js` - TypeScript checking utilities
- Commands: `npm run ts:check:types`, `ts:check:lint`, `ts:check:all`

**Build Scripts (`scripts/`):**
- `copy-404.js` - Copies 404.html for SPA routing
- `copy-cname.js` - Copies CNAME for custom domain
- `generate-meta.js` - Metadata generation
- `update-docs.js` - Documentation updates
- `ensure-source-map-quick-sort.js` - Source map handling

---

*Stack analysis: 2026-01-17*
