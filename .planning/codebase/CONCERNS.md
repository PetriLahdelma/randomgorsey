# Codebase Concerns

**Analysis Date:** 2026-01-17

## Tech Debt

**CSS Class Naming Inconsistency:**
- Issue: Extensive use of kebab-case class names (e.g., `.select-container`, `.error-message`) conflicting with camelCase-only stylelint rule
- Files: `src/App.css`, `src/components/Alert.module.css`, `src/components/Avatar.module.css`, `src/components/Button.module.css`, `src/components/Checkbox.module.css`, `src/components/GroupLabel.module.css`, `src/components/Heading.module.css`, `src/components/Input.module.css`, `src/components/Select.module.css`, and others (50+ violations)
- Impact: Stylelint fails with numerous `selector-class-pattern` errors; lint command reports issues but doesn't fix
- Fix approach: Either update `.stylelintrc.json` to allow kebab-case, or refactor all CSS modules to use camelCase consistently

**CLAUDE.md Documentation Corruption:**
- Issue: Document has repeated text artifacts (e.g., "non-breaking)nor issues (non-breaking)" repeated 10x, "Operationalnalnalnalnalnalnalnal")
- Files: `CLAUDE.md` lines 16, 323
- Impact: Reduces documentation quality and could confuse AI assistants reading the file
- Fix approach: Clean up the repeated/corrupted text manually

**Uncommitted Design System Refactoring:**
- Issue: Design system components moved from `src/components/design-system/` to `src/components/` but changes not committed
- Files: Deleted: `src/components/design-system/Heading.tsx`, `src/components/design-system/Surface.tsx`, `src/components/design-system/Text.tsx`, `src/components/design-system/index.ts` and their CSS modules; Added: `src/components/Heading.tsx`, `src/components/Surface.tsx`, `src/components/Text.tsx`, `src/components/index.ts`
- Impact: Inconsistent state between repository and working directory; potential merge conflicts
- Fix approach: Commit or revert changes to maintain clean git state

**Client-Side Rate Limiting Limitation:**
- Issue: Rate limiter in Contact form uses `name-email` combination as identifier instead of IP/session
- Files: `src/pages/Contact.tsx` line 55
- Impact: Users can bypass rate limiting by changing name/email; doesn't actually prevent spam from same IP
- Fix approach: Move rate limiting to server-side or use fingerprinting/session tokens

**RateLimiter Instance Per Render:**
- Issue: RateLimiter is instantiated inside component body, creating new instance on every render
- Files: `src/pages/Contact.tsx` line 34
- Impact: Rate limiting resets on every render, making it ineffective
- Fix approach: Move RateLimiter to module scope or use useRef/useMemo

## Security Considerations

**Environment Secrets in .env File:**
- Risk: `.env` file contains `EMAILJS_PRIVATE_KEY` which should not be in client-side code
- Files: `.env` line 5
- Current mitigation: File is gitignored, but private key is in working directory
- Recommendations: Remove private key from `.env`; it should only be used server-side. Ensure `.env` is in `.gitignore`

**dangerouslySetInnerHTML Usage:**
- Risk: XSS vulnerability if post body content is not properly sanitized before rendering
- Files: `src/components/PostCard.tsx` line 254-256
- Current mitigation: None visible - `post.body` is rendered directly without sanitization
- Recommendations: Sanitize HTML content before rendering using DOMPurify or similar library

**Console Logging in Production:**
- Risk: Information leakage through console.error/warn/log statements
- Files: `src/pages/Contact.tsx` (lines 49, 106, 117, 148), `src/utils/httpsEnforcement.ts` (lines 53, 55, 100), `src/components/CookieConsent.tsx` (line 28)
- Current mitigation: None
- Recommendations: Strip console statements in production build or use environment-aware logging

## Performance Bottlenecks

**Video Background on Multiple Pages:**
- Problem: WebM video backgrounds loaded on Contact and Gallery pages
- Files: `src/pages/Contact.tsx` lines 193-213, `src/pages/Gallery.tsx` lines 71-89
- Cause: Video files can be large and impact initial page load
- Improvement path: Lazy load videos, use poster images, consider reduced motion preferences

**Gallery Page Navigation Bug:**
- Problem: Navigation callbacks reference stale `currentIndex` state
- Files: `src/pages/Gallery.tsx` lines 36-44
- Cause: `navigateLeft/navigateRight` use `currentIndex` directly instead of callback form
- Impact: Rapid navigation can skip images or navigate incorrectly
- Improvement path: Use functional state updates with previous index value

## Fragile Areas

**Contact Page Component:**
- Files: `src/pages/Contact.tsx` (327 lines - largest file in codebase)
- Why fragile: High complexity with multiple concerns (form state, validation, rate limiting, email sending, modal, loading states)
- Safe modification: Extract form logic to custom hook, separate validation concerns
- Test coverage: `src/pages/__tests__/Contact.test.tsx` exists but coverage unclear

**iOS-Specific Animation Handling:**
- Files: `src/pages/Contact.tsx`, `src/pages/Gallery.tsx`
- Why fragile: Manual conditional rendering based on `isIOS()` check, duplicating component logic
- Safe modification: Consider using CSS-based approach or framer-motion's built-in reduced motion support
- Test coverage: Likely untested for iOS-specific paths

## Dependencies at Risk

**High Severity Security Vulnerabilities:**
- Risk: npm audit reports multiple high/critical vulnerabilities
- Packages: `@modelcontextprotocol/sdk` (ReDoS, DNS rebinding), `body-parser` (DoS), `form-data` (weak random), `node-forge` (ASN.1 issues), `brace-expansion` (ReDoS), `glob` (command injection)
- Impact: Potential security exploits, particularly in dev dependencies
- Migration plan: Run `npm audit fix` to address fixable vulnerabilities; update or replace vulnerable packages

**Outdated Dependencies:**
- Packages with updates available: `eslint` (8.57.1 -> 9.x), `react`/`react-dom` (19.2.0 -> 19.2.3), `storybook` (10.0.6 -> 10.1.11), `stylelint` (16.x -> 17.0.0), `zod` (4.1.12 -> 4.3.5), `framer-motion` (12.23.24 -> 12.26.2)
- Impact: Missing bug fixes, security patches, and new features
- Migration plan: Update dependencies monthly per CLAUDE.md guidelines

**React 19 Ecosystem Compatibility:**
- Risk: Package.json notes `--legacy-peer-deps` required due to React 19 transition
- Impact: Some dependencies not fully compatible (react-helmet-async, eslint-plugin-jest)
- Migration plan: Monitor for updated packages, test compatibility when updating

## Test Coverage Gaps

**No Unit Tests for Utilities:**
- What's not tested: `src/utils/security.ts`, `src/utils/validation.ts`, `src/utils/httpsEnforcement.ts`, `src/utils/isIOS.ts`, `src/utils/isWebMSupported.ts`
- Files: All files in `src/utils/`
- Risk: Security-critical validation and sanitization code has no test coverage
- Priority: High - security utilities should have comprehensive tests

**Design System Components:**
- What's not tested: `src/components/Heading.tsx`, `src/components/Surface.tsx`, `src/components/Text.tsx`
- Files: Listed above (newly relocated components)
- Risk: Component behavior may break without detection
- Priority: Medium - new components should have basic rendering tests

**Test Suite Warning:**
- What's not tested: React 19 suspended resource completion not wrapped in `act()`
- Files: `src/App.test.tsx`
- Risk: Tests may have race conditions or incomplete assertions
- Priority: Low - warning doesn't fail tests but indicates improper async handling

## Missing Critical Features

**No Server-Side Validation:**
- Problem: All validation is client-side only; malicious users can bypass
- Blocks: Truly secure form handling
- Recommendation: EmailJS handles some server-side, but consider adding edge function for validation

**No CAPTCHA Implementation:**
- Problem: Only honeypot field for spam protection
- Blocks: Robust bot prevention
- Recommendation: Add reCAPTCHA or hCaptcha as documented in SECURITY.md

**No Error Boundary:**
- Problem: React errors can crash entire application
- Blocks: Graceful error handling and user experience
- Recommendation: Implement Error Boundary component at App level

---

*Concerns audit: 2026-01-17*
