# Testing Patterns

**Analysis Date:** 2026-01-17

## Test Framework

**Runner:**
- Jest (via react-scripts)
- Config: Inline in `package.json` under `"jest"` key
- No separate `jest.config.js`

**Assertion Library:**
- Jest built-in assertions
- `@testing-library/jest-dom` for DOM matchers

**Testing Libraries:**
- `@testing-library/react` v16.3.0
- `@testing-library/dom` v10.4.0
- `@testing-library/user-event` v14.6.1
- `@testing-library/jest-dom` v6.6.3
- `@types/jest` v30.0.0

**Run Commands:**
```bash
npm test                    # Run test suite in watch mode
npm test -- --coverage      # Run with coverage report
npm test -- --watchAll=false # Run once (CI mode)
```

## Test File Organization

**Location:**
- Co-located in `__tests__/` subdirectory within component folder
- Pattern: `src/components/__tests__/ComponentName.test.tsx`
- Pattern: `src/patterns/__tests__/PatternName.test.tsx`

**Naming:**
- `ComponentName.test.tsx` (lowercase `.test.`)
- Match component name exactly

**Structure:**
```
src/
├── components/
│   ├── __tests__/
│   │   ├── Button.test.tsx
│   │   ├── Input.test.tsx
│   │   ├── Modal.test.tsx
│   │   ├── TextArea.test.tsx
│   │   ├── Checkbox.test.tsx
│   │   ├── CookieConsent.test.tsx
│   │   └── PostCard.test.tsx
│   ├── Button.tsx
│   └── ...
├── patterns/
│   ├── __tests__/
│   │   └── Footer.test.tsx
│   └── Footer.tsx
```

## Test Structure

**Suite Organization:**
```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from '../ComponentName';

describe('ComponentName Component', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Standard Pattern - Component Tests:**
```typescript
// From src/components/__tests__/Button.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button Component', () => {
  it('renders the button with children', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('applies the correct variant class', () => {
    render(<Button variant="secondary">Secondary</Button>);
    const button = screen.getByText('Secondary');
    expect(button).toHaveClass('secondary');
  });

  it('handles the onClick event', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('disables the button when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
  });
});
```

**Test Categories:**
1. Renders correctly (smoke test)
2. Applies correct CSS classes/variants
3. Handles user events (click, change, etc.)
4. Respects disabled/loading states
5. Displays error states when applicable

## Mocking

**Global Mocks (from `src/setupTests.ts`):**
```typescript
// Polyfill TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require("util");
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;
(global as typeof globalThis).IntersectionObserver = mockIntersectionObserver;
```

**Jest Module Mocking (from `package.json`):**
```json
{
  "jest": {
    "moduleNameMapper": {
      "^react-router-dom$": "<rootDir>/node_modules/react-router-dom/dist/index.js",
      "^react-router/dom$": "<rootDir>/node_modules/react-router/dist/development/dom-export.js"
    }
  }
}
```

**Function Mocking Pattern:**
```typescript
it('handles the onClick event', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click Me</Button>);
  fireEvent.click(screen.getByText('Click Me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
```

**Browser API Mocking (Cookie example):**
```typescript
// From CookieConsent.test.tsx
const setCookieMock = () => {
  Object.defineProperty(document, 'cookie', {
    writable: true,
    value: '',
  });
};

describe('CookieConsent Component', () => {
  beforeEach(() => {
    setCookieMock();
  });

  it('sets cookie and closes on accept all', () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByText(/accept all/i));
    expect(document.cookie).toContain('cookieConsent=all');
  });
});
```

**What to Mock:**
- Browser APIs: `document.cookie`, `window.IntersectionObserver`
- Event handlers passed as props
- External services (EmailJS when tested)
- Router navigation

**What NOT to Mock:**
- React Testing Library utilities
- Component internal state
- CSS Module imports (handled automatically)

## Fixtures and Factories

**Test Data Pattern:**
```typescript
// From PostCard.test.tsx
const post: Post = {
  id: 1,
  title: 'Test Post',
  timestamp: '2024-01-01',
  contentType: 'image',
  body: 'Some body text',
  media: '/images/test.jpg',
  author: 'RG'
};

describe('PostCard', () => {
  it('renders post title and image', () => {
    render(
      <HelmetProvider>
        <PostCard post={post} />
      </HelmetProvider>
    );
    expect(screen.getByRole('heading', { name: 'Test Post' })).toBeInTheDocument();
  });
});
```

**Location:**
- Test data defined inline within test files
- No separate fixtures directory currently
- Complex test data declared at top of test file

## Provider Wrapping

**Pattern for Components Requiring Providers:**
```typescript
import { HelmetProvider } from 'react-helmet-async';

it('renders with required providers', () => {
  render(
    <HelmetProvider>
      <ComponentRequiringHelmet />
    </HelmetProvider>
  );
});
```

**Providers Commonly Needed:**
- `HelmetProvider` for components using `react-helmet-async`
- `BrowserRouter` for components using `react-router-dom` (not shown in current tests but may be needed)

## Coverage

**Requirements:** No enforced coverage threshold

**View Coverage:**
```bash
npm test -- --coverage --watchAll=false
```

**Coverage Output:**
- Located in `coverage/` directory
- HTML report available

## Test Types

**Unit Tests:**
- Focus: Individual component behavior
- Scope: Props, events, rendering, state changes
- Location: `__tests__/` directories

**Integration Tests:**
- Limited; mostly component-level tests
- Components tested with child components when needed

**E2E Tests:**
- Not configured
- No Cypress/Playwright setup detected

## Common Patterns

**Testing Element Presence:**
```typescript
// By text content
expect(screen.getByText('Click Me')).toBeInTheDocument();

// By placeholder
expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();

// By role
expect(screen.getByRole('button')).toBeInTheDocument();
expect(screen.getByRole('textbox')).toBeInTheDocument();
expect(screen.getByRole('checkbox')).toBeInTheDocument();
expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();

// By test ID
fireEvent.click(screen.getByTestId('modal-overlay'));

// By title attribute
expect(screen.getByTitle('Bandcamp')).toBeInTheDocument();

// By alt text
expect(screen.getByAltText('Test Post')).toHaveAttribute('title', 'Test Post');
```

**Testing CSS Classes:**
```typescript
expect(button).toHaveClass('secondary');
expect(button).toHaveClass('disabled');
```

**Testing Attributes:**
```typescript
expect(element).toBeDisabled();
expect(element).toBeChecked();
expect(element).toHaveAttribute('title', 'Expected Title');
expect(element).toHaveAttribute('aria-label', 'Close modal');
```

**Testing User Events:**
```typescript
// Click events
fireEvent.click(screen.getByText('Button'));
fireEvent.click(screen.getByRole('button'));

// Change events
fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Value' } });

// Keyboard events (not shown in current tests but standard pattern)
fireEvent.keyDown(element, { key: 'Enter' });
```

**Async Testing:**
```typescript
// Not heavily used in current tests
// Standard pattern for async operations:
import { waitFor } from '@testing-library/react';

it('handles async operation', async () => {
  render(<AsyncComponent />);
  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});
```

**Regex Matching for Text:**
```typescript
// Case-insensitive matching
expect(screen.getByText(/cookie notice/i)).toBeInTheDocument();
expect(screen.getByText(/accept all/i)).toBeInTheDocument();
```

## Setup File

**Location:** `src/setupTests.ts`

**Contents:**
```typescript
import "@testing-library/jest-dom";

// Polyfill TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require("util");
(global as any).TextEncoder = TextEncoder;
(global as any).TextDecoder = TextDecoder;

// Mock IntersectionObserver
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;
(global as typeof globalThis).IntersectionObserver = mockIntersectionObserver;
```

## Test Files Inventory

| File | Component | Test Count |
|------|-----------|------------|
| `src/components/__tests__/Button.test.tsx` | Button | 4 |
| `src/components/__tests__/Input.test.tsx` | Input | 3 |
| `src/components/__tests__/TextArea.test.tsx` | TextArea | 3 |
| `src/components/__tests__/Modal.test.tsx` | Modal | 3 |
| `src/components/__tests__/Checkbox.test.tsx` | Checkbox | 3 |
| `src/components/__tests__/CookieConsent.test.tsx` | CookieConsent | 2 |
| `src/components/__tests__/PostCard.test.tsx` | PostCard | 1 |
| `src/patterns/__tests__/Footer.test.tsx` | Footer | 1 |

**Components Without Tests:**
- `Alert.tsx`
- `Avatar.tsx`
- `Badge.tsx`
- `Caption.tsx`
- `GroupLabel.tsx`
- `Label.tsx`
- `PageMeta.tsx`
- `Select.tsx`
- `SocialShare.tsx`
- `Spinner.tsx`
- `Heading.tsx`
- `Surface.tsx`
- `Text.tsx`
- All page components (`Home.tsx`, `Contact.tsx`, etc.)
- `Header.tsx` pattern

## Writing New Tests

**Template for Component Test:**
```typescript
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ComponentName from '../ComponentName';

describe('ComponentName', () => {
  it('renders with default props', () => {
    render(<ComponentName requiredProp="value" />);
    expect(screen.getByText('Expected content')).toBeInTheDocument();
  });

  it('applies variant styling', () => {
    render(<ComponentName variant="secondary" requiredProp="value" />);
    expect(screen.getByRole('button')).toHaveClass('secondary');
  });

  it('handles click events', () => {
    const handleClick = jest.fn();
    render(<ComponentName onClick={handleClick} requiredProp="value" />);
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('respects disabled state', () => {
    render(<ComponentName disabled requiredProp="value" />);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

---

*Testing analysis: 2026-01-17*
