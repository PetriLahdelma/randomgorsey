# GitHub Copilot Instructions

## Project Overview: Random Gorsey Website

**Random Gorsey** is a modern React-based artist/musician website built with TypeScript. This is a production website deployed at `https://randomgorsey.com` featuring a portfolio, contact form, gallery, discography, and listening sections.

### 🏗️ Architecture & Tech Stack

**Frontend Framework**: React 19.2.0 with TypeScript 5.9.3
**Build Tool**: Create React App (react-scripts 5.0.1)
**Animation**: Framer Motion 12.23.24
**Routing**: React Router DOM 7.6.1
**Styling**: CSS Modules + Global CSS Variables
**Form Validation**: Zod 4.1.12 (recently updated)
**Email Service**: EmailJS for contact form
**Testing**: Jest + React Testing Library
**Development Tools**: Storybook 10.0.6, ESLint, Stylelint
**Type Checking**: Custom MCP TypeScript server

### 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Alert.tsx       # Notification component
│   ├── Avatar.tsx      # Profile picture component
│   ├── Button.tsx      # Primary button component
│   ├── Modal.tsx       # Dialog/overlay component
│   └── __tests__/      # Component tests
├── pages/              # Route-level components
│   ├── Home.tsx        # Landing page
│   ├── About.tsx       # Artist biography
│   ├── Contact.tsx     # Contact form (uses Zod validation)
│   ├── Gallery.tsx     # Image gallery
│   ├── Discography.tsx # Music releases
│   ├── Listen.tsx      # Music streaming links
│   └── NotFound.tsx    # 404 page
├── patterns/           # Layout components
│   ├── Header.tsx      # Navigation bar
│   └── Footer.tsx      # Site footer
├── posts/              # Blog/content components
├── stories/            # Storybook stories
├── data/               # Static data files
├── utils/              # Helper functions
├── types/              # TypeScript type definitions
└── fonts/              # Custom font files
```

### 🔧 Development Workflow

#### Essential Commands
```bash
npm start                    # Development server
npm run build               # Production build
npm test                    # Run tests
npm run storybook          # Component development
npm run ts:check:all       # Comprehensive TypeScript checking
npm run ts:check:types     # Type checking only
npm run ts:check:lint      # ESLint checking
npm run lint               # CSS linting
```

#### Key Development Patterns

**Component Creation**:
- Use TypeScript interfaces for props
- Create accompanying CSS Module files
- Include Storybook stories for complex components
- Write tests for user-facing components

**Styling Approach**:
- CSS Modules for component-specific styles
- Global CSS variables in `variables.css`
- Responsive design with mobile-first approach
- Consistent design system with reusable components

**Animation Guidelines**:
- Use Framer Motion for page transitions and interactions
- Import: `import { motion } from 'framer-motion'`
- Consistent animation variants for enter/exit
- Performance-conscious animations

### 🎯 Current Status (November 2025)

**Recent Major Updates**:
- ✅ React 18 → 19 upgrade completed
- ✅ TypeScript 4 → 5 migration finished
- ✅ Storybook 9 → 10 updated
- ✅ Zod 3 → 4 with API changes resolved
- ✅ All dependencies updated to latest versions

**Known Issues**:
- ESLint 8 (react-scripts limitation prevents ESLint 9)
- 12 minor linting issues (code quality, not breaking)
- Some Storybook stories need type annotation updates

**Build Status**: ✅ All systems operational
- TypeScript compilation: ✅ No errors
- Production build: ✅ Successful
- Tests: ✅ Passing

### 📝 Code Style Guidelines

**TypeScript**:
```typescript
// Prefer interface over type for component props
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
}

// Use proper typing for event handlers
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // ...
};
```

**React Patterns**:
```typescript
// Functional components with TypeScript
const Component: React.FC<Props> = ({ prop1, prop2 }) => {
  const [state, setState] = useState<string>('');
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Component content */}
    </motion.div>
  );
};
```

**CSS Modules**:
```css
/* Component.module.css */
.container {
  padding: var(--spacing-md);
  background: var(--color-background);
}

.title {
  font-family: var(--font-primary);
  color: var(--color-text-primary);
}
```

### 🔍 Debugging & Testing

**TypeScript Checking**:
- Use `npm run ts:check:types` for compilation errors
- Use `npm run ts:check:lint` for code quality issues
- Use `npm run ts:check:all` for comprehensive analysis

**Component Testing**:
```typescript
// Use React Testing Library patterns
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('should handle user interaction', async () => {
  const user = userEvent.setup();
  render(<Component />);
  
  await user.click(screen.getByRole('button'));
  expect(screen.getByText('Expected text')).toBeInTheDocument();
});
```

### 🚀 Deployment

**Production Build**:
- Automatic optimization and bundling
- Static site generation with react-snap
- Deployed to GitHub Pages
- Custom domain: randomgorsey.com

**Build Process**:
1. TypeScript compilation
2. Webpack bundling
3. react-snap static generation
4. File optimization and copying

### 💡 AI Assistant Guidelines

**When adding new features**:
1. Check existing patterns in similar components
2. Use TypeScript interfaces for all props
3. Include CSS Module styling
4. Add Framer Motion animations for interactions
5. Write tests for user-facing functionality
6. Update Storybook if component is reusable

**When fixing bugs**:
1. Run `npm run ts:check:types` first
2. Check component tests
3. Verify responsive behavior
4. Test animation performance
5. Ensure accessibility standards

**When updating dependencies**:
1. Check for breaking changes in major versions
2. Update TypeScript types if needed
3. Test build process after updates
4. Update this documentation

---

**Last Updated**: November 10, 2025
**Build Status**: ✅ Operational
**TypeScript**: ✅ No errors
**Tests**: ✅ Passing