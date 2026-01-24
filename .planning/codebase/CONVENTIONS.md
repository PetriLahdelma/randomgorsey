# Coding Conventions

**Analysis Date:** 2026-01-17

## Naming Patterns

**Files:**
- Components: PascalCase (e.g., `Button.tsx`, `PostCard.tsx`, `CookieConsent.tsx`)
- CSS Modules: PascalCase matching component (e.g., `Button.module.css`)
- Utilities: camelCase (e.g., `validation.ts`, `isIOS.ts`, `security.ts`)
- Tests: `ComponentName.test.tsx` in `__tests__/` subdirectory
- Stories: `ComponentName.stories.tsx` in `src/stories/`

**Functions:**
- camelCase for all functions: `handleSend`, `sanitizeText`, `isValidEmail`
- Event handlers prefixed with `handle`: `handleClick`, `handleChange`, `handleOverlayClick`
- Boolean utility functions prefixed with `is`: `isIOS()`, `isValidEmail()`, `isWebMSupported()`

**Variables:**
- camelCase for all variables: `menuOpen`, `formErrors`, `sanitizedData`
- State setters use `set` prefix: `setName`, `setEmail`, `setLoading`

**Types/Interfaces:**
- PascalCase for all types and interfaces
- Props interfaces suffixed with `Props`: `ButtonProps`, `InputProps`, `PostCardProps`
- Component interfaces use descriptive names: `Post`, `ContactFormData`, `ValidationResult`

**CSS Classes (in CSS Modules):**
- camelCase or kebab-case (per stylelint rule): `button`, `iconOnly`, `text-with-icon`
- Variant classes match prop values: `.primary`, `.secondary`, `.danger`
- Size classes match prop values: `.small`, `.medium`, `.large`

## Code Style

**Formatting:**
- No Prettier config detected; relies on ESLint rules
- Double quotes for strings in TSX: `"primary"`, `"Enter text"`
- Semicolons required
- 2-space indentation

**Linting:**
- ESLint with `react-app` and `react-app/jest` presets
- TypeScript rules:
  - `@typescript-eslint/no-explicit-any`: warn
  - `@typescript-eslint/explicit-function-return-type`: off
  - `@typescript-eslint/explicit-module-boundary-types`: off
  - `@typescript-eslint/no-non-null-assertion`: warn

**Stylelint:**
- Config: `stylelint-config-standard`, `stylelint-config-css-modules`, `stylelint-config-recess-order`
- Class pattern: camelCase or PascalCase only
- Max nesting depth: 3
- No IDs in selectors
- No `!important`
- No named colors (use variables)
- Properties ordered by Recess order

## Import Organization

**Order:**
1. React imports: `import React from "react";`
2. External library imports: `import { motion } from "framer-motion";`
3. Internal component imports: `import Button from "../components/Button";`
4. Utility imports: `import { contactFormSchema } from "../utils/validation";`
5. Type imports: `import { BaseComponentProps } from "../types/common";`
6. CSS Module imports (last): `import styles from "./Component.module.css";`

**Path Aliases:**
- No path aliases configured; use relative paths
- Pattern: `../components/`, `../utils/`, `../types/`

## Component Architecture

**Standard Component Structure:**
```typescript
// 1. Imports
import React from "react";
import styles from "./Component.module.css";
import { BaseComponentProps } from "../types/common";

// 2. Type definitions (exported for reuse)
export type ComponentVariant = "primary" | "secondary";

export interface ComponentProps extends BaseComponentProps {
  /** JSDoc comment for prop */
  variant?: ComponentVariant;
  children?: React.ReactNode;
}

// 3. Component implementation with React.FC
const Component: React.FC<ComponentProps> = ({
  variant = "primary",
  children,
  className,
  ...accessibilityProps
}) => {
  // Class name combination pattern
  const classNames = [
    styles.component,
    styles[variant],
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classNames} {...accessibilityProps}>
      {children}
    </div>
  );
};

// 4. Default export
export default Component;
```

**Props Patterns:**
- Use `interface` for props (not `type`)
- Extend `BaseComponentProps` for common props (className, style, id, testId, error, loading)
- Extend `Omit<BaseComponentProps, "children">` when children are handled differently
- All optional props have defaults in destructuring
- Spread `accessibilityProps` to underlying elements

**Base Props Interface (from `src/types/common.ts`):**
```typescript
interface BaseComponentProps {
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  testId?: string;
  children?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  error?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  role?: string;
  tabIndex?: number;
}
```

## Error Handling

**Form Validation Pattern (with Zod v4):**
```typescript
const result = schema.safeParse(data);
if (!result.success) {
  const errors: Record<string, string> = {};
  result.error.issues.forEach((issue) => {
    errors[issue.path[0] as string] = issue.message;
  });
  setFormErrors(errors);
  return;
}
```

**Security Validation Pattern:**
```typescript
const validation = validateAndSanitizeContactForm(data);
if (!validation.isValid) {
  setFormErrors(validation.errors);
  return;
}
const sanitizedData = validation.sanitizedData;
```

**Async Error Handling:**
```typescript
emailjs.send(...)
  .then(() => {
    // Success handling
  })
  .catch((error) => {
    console.error("EmailJS error:", error);
    setFormErrors({ general: "Failed to send message." });
  });
```

## Logging

**Framework:** Browser console

**Patterns:**
- `console.error()` for actual errors: `console.error("EmailJS error:", error);`
- `console.warn()` for suspicious activity: `console.warn("Honeypot field filled - potential spam");`
- No logging in production-ready code except error cases

## Comments

**When to Comment:**
- JSDoc comments for component descriptions and complex props
- Inline comments for non-obvious logic
- Section comments for code organization in longer files

**JSDoc Pattern:**
```typescript
/**
 * Reusable Button component with various styling options
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={() => console.log('clicked')}>
 *   Primary Button
 * </Button>
 * ```
 */
```

**Prop Documentation:**
```typescript
interface ComponentProps {
  /** Visual style variant of the button */
  variant?: ButtonVariant;
  /** Whether the button is disabled */
  disabled?: boolean;
}
```

## Function Design

**Size:** Keep functions focused; extract helpers for complex logic

**Parameters:**
- Destructure props in function signature
- Provide defaults for optional parameters
- Use TypeScript interfaces for complex parameter objects

**Return Values:**
- Components return JSX or `null`
- Utility functions return typed values
- Validation functions return result objects with `isValid`, `errors`, `sanitizedData`

## Module Design

**Exports:**
- Components use default exports: `export default Button;`
- Types and interfaces use named exports: `export interface ButtonProps`
- Utilities use named exports: `export function sanitizeText()`

**Barrel Files:**
- Types have barrel exports in `src/types/` directory
- No component barrel file currently in use

## Accessibility

**Required Patterns:**
- All interactive elements need `aria-label` or visible label
- Icon-only buttons require `aria-label`: `aria-label="Close modal"`
- Form inputs linked to labels via `id`/`htmlFor`
- Error messages use `role="alert"`
- Modal dialogs use `role="dialog"` and `aria-modal="true"`
- Keyboard navigation supported for custom interactive elements

**Test IDs:**
- Use `data-testid` for test selectors: `data-testid="modal-overlay"`
- Pass through `testId` prop which maps to `data-testid`

## Animation Pattern

**Framer Motion with iOS Fallback:**
```typescript
import { motion } from "framer-motion";
import { isIOS } from "../utils/isIOS";

const Container: React.ElementType = isIOS() ? "div" : motion.div;

<Container
  {...(!isIOS() && {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  })}
>
```

## CSS Module Patterns

**Class Combination:**
```typescript
const classNames = [
  styles.base,
  styles[variant],
  styles[size],
  condition ? styles.active : "",
  className || "",
]
  .filter(Boolean)
  .join(" ");
```

**CSS Variable Usage:**
```css
@import url("../variables.css");

.button {
  color: var(--color-white);
  background-color: var(--color-blue);
}
```

**Available CSS Variables (from `src/variables.css`):**
- Colors: `--color-dark`, `--color-white`, `--color-black`, `--color-blue`, `--color-green`, `--color-red`, `--color-orange`, `--color-yellow`, `--color-magenta`
- Grays: `--color-gray`, `--color-gray-medium`, `--color-gray-dark`, `--color-gray-light`
- Backgrounds: `--color-light-bg`

---

*Convention analysis: 2026-01-17*
