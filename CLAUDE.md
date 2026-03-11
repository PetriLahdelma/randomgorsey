# Claude AI Assistant Guide

## Project: Random Gorsey Artist Website

### 🎯 Mission Statement

You are assisting with the development of **Random Gorsey**, a professional artist/musician portfolio website. This is a production application serving real users at `https://randomgorsey.com`. Code quality, performance, and user experience are paramount.

### 📊 Current System Status (November 10, 2025)

**🟢 OPERATIONAL STATUS**
- ✅ TypeScript 5.9.3 compilation: CLEAN
- ✅ React 19.2.0 runtime: STABLE  
- ✅ Production build: SUCCESS
- ❌ Test suite: FAILING
- ⚠️ ESLint: 12 minor issues (non-breaking)

**Recent Major Updates Completed**:

- React 18 → 19 migration (November 2025)
- TypeScript 4 → 5 upgrade with module resolution fixes
- Storybook 9 → 10 modernization
- Zod 3 → 4 with breaking changes resolved
- Framer Motion updated to 12.23.24

### 🏗️ Technical Architecture

**Core Stack**:

```
Frontend: React 19.2.0 + TypeScript 5.9.3
Build: Create React App (react-scripts 5.0.1)
Animation: Framer Motion 12.23.24
Validation: Zod 4.1.12
Routing: React Router DOM 7.6.1
Testing: Jest + React Testing Library 16.3.0
Development: Storybook 10.0.6
Type Checking: Custom MCP TypeScript server
```

**Design System**:

- CSS Modules for component isolation
- Global CSS variables for consistency
- Mobile-first responsive design
- Accessibility-compliant components
- Consistent animation patterns with Framer Motion

### 📁 Codebase Map

```
src/
├── 🧩 components/          # 15 reusable UI components
│   ├── Button.tsx          # Primary CTA component
│   ├── Modal.tsx           # Overlay/dialog system
│   ├── Alert.tsx           # Notification system
│   └── __tests__/          # Comprehensive test coverage
├── 📄 pages/               # 7 route-level components
│   ├── Home.tsx            # Landing with hero section
│   ├── Contact.tsx         # Form with Zod validation
│   ├── Gallery.tsx         # Image gallery with lazy loading
│   └── Listen.tsx          # Music streaming integration
├── 🎨 patterns/            # Layout and navigation
├── 📚 stories/             # Storybook component stories
├── 🔧 utils/               # Helper functions and validation
├── 📝 types/               # TypeScript definitions
├── 💾 data/                # Static content and configuration
├── 🎭 fonts/               # Custom typography
└── 🎥 videos/              # Media assets
```

### 🔄 Development Workflow

#### Before Making Changes

```bash
# Always start with a clean state check
npm run ts:check:all       # Comprehensive analysis
npm test                   # Verify existing functionality
npm run build              # Ensure production readiness
```

#### Development Process

1. **Feature Development**: Start with component design in Storybook
2. **Implementation**: Use TypeScript-first approach with proper interfaces
3. **Testing**: Write tests before or alongside implementation
4. **Integration**: Test with existing components and pages
5. **Validation**: Run full type checking and linting

#### Quality Gates

- ✅ TypeScript compilation must be clean
- ✅ All tests must pass
- ✅ Production build must succeed
- ✅ No console errors in development
- ✅ Responsive design verified
- ✅ Accessibility standards met

### 🎨 Code Patterns & Standards

#### Component Architecture

```typescript
// Standard component structure
interface ComponentProps {
  // Always use interfaces, not types
  children?: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

const Component: React.FC<ComponentProps> = ({
  children,
  className,
  variant = "primary",
}) => {
  return (
    <motion.div
      className={cn(styles.container, styles[variant], className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
};
```

#### Form Handling with Zod

```typescript
// Use Zod v4 API (note: error.issues, not error.errors)
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
});

const handleSubmit = (data: FormData) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errors = {};
    result.error.issues.forEach((issue) => {
      errors[issue.path[0]] = issue.message;
    });
    setErrors(errors);
  }
};
```

#### Animation Guidelines

```typescript
// Consistent motion variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

// Performance-conscious animations
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  exit="exit"
  transition={{ duration: 0.3, ease: "easeOut" }}
>
```

### 🚨 Critical Implementation Details

#### Zod v4 Breaking Changes (RESOLVED)

```typescript
// ❌ OLD (v3): error.errors
result.error.errors.forEach(...)

// ✅ NEW (v4): error.issues
result.error.issues.forEach(...)
```

#### TypeScript 5 Module Resolution

```json
// tsconfig.json - Updated for modern imports
{
  "moduleResolution": "bundler", // Changed from "node"
  "target": "es5",
  "strict": true
}
```

#### React 19 Compatibility

- All hooks and patterns updated
- No breaking changes detected in current codebase
- Type definitions fully compatible

### 🔍 Diagnostic Commands

#### TypeScript Analysis

```bash
npm run ts:check:types      # Compilation errors only
npm run ts:check:lint       # Code quality and style
npm run ts:check:structure  # Project overview
npm run ts:check:analyze    # Single file analysis
npm run ts:check:all        # Complete diagnostic
```

#### Testing Strategy

```bash
npm test                    # Run test suite
npm test -- --coverage     # With coverage report
npm test -- --watch        # Watch mode for TDD
```

#### Build Verification

```bash
npm run build              # Production build
npm run storybook          # Component playground
npm start                  # Development server
```

### 🎯 Common Tasks & Solutions

#### Adding New Component

1. Create component file with TypeScript interface
2. Add CSS Module for styling
3. Create Storybook story
4. Write comprehensive tests
5. Export from appropriate index file

#### Debugging Type Issues

1. Use `npm run ts:check:types` for specific errors
2. Check imports and module resolution
3. Verify interface definitions
4. Ensure proper generic typing

#### Performance Optimization

1. Use React.memo for pure components
2. Implement proper key props for lists
3. Lazy load heavy components with React.lazy
4. Optimize images and assets

#### Animation Debugging

1. Check Framer Motion import syntax
2. Verify motion variants structure
3. Test performance with Chrome DevTools
4. Ensure proper cleanup in useEffect

### 📈 Monitoring & Maintenance

#### Health Indicators

- TypeScript compilation: Should be 0 errors
- Test coverage: Maintain >80% for critical paths
- Bundle size: Monitor main chunk size
- Performance: Core Web Vitals compliance

#### Regular Maintenance Tasks

- Dependency updates (monthly)
- Type definition updates
- Test suite maintenance
- Documentation updates
- Performance audits

### 🚀 Deployment Process

#### Pre-deployment Checklist

- [ ] All tests passing
- [ ] TypeScript compilation clean
- [ ] Production build successful
- [ ] No console errors/warnings
- [ ] Responsive design verified
- [ ] SEO metadata updated

#### Build Pipeline

1. `npm run build` - Creates optimized production build
2. App Router metadata and static assets are emitted into the Next build output
3. Asset optimization and compression
4. Vercel deploys the production build from the connected branch

### 🌐 Viewing the Live Site (For AI Agents)

When you need to view the live website for visual verification, layout inspection, or user experience review, use the **Vercel Agent Browser** CLI tool instead of running tests.

#### Installation (if not already available)

```bash
npm install -g agent-browser
agent-browser install  # Downloads Chromium
```

#### Viewing the Production Site

```bash
# Open the live site
agent-browser open https://randomgorsey.com

# Take a snapshot to see interactive elements
agent-browser snapshot

# Navigate pages
agent-browser click @e1  # Click element by ref from snapshot

# Capture screenshots for review
agent-browser screenshot home.png

# Get text content from elements
agent-browser get text @e2

# Close when done
agent-browser close
```

#### Common Viewing Tasks

| Task | Command |
|------|---------|
| View homepage | `agent-browser open https://randomgorsey.com` |
| View gallery | `agent-browser open https://randomgorsey.com/gallery` |
| View contact page | `agent-browser open https://randomgorsey.com/contact` |
| Check mobile layout | `agent-browser viewport 375 812` then `agent-browser snapshot` |
| Full page screenshot | `agent-browser screenshot --full-page page.png` |

#### When to Use Agent Browser vs Tests

- **Agent Browser**: Visual verification, layout review, UX inspection, checking animations, viewing live content
- **Tests**: Functional verification, regression testing, CI/CD pipelines, component behavior

#### Important Notes

- Agent Browser reduces token usage by ~93% compared to raw HTML parsing
- Use `snapshot` to get a condensed accessibility tree with element refs (@e1, @e2, etc.)
- For cloud/headless environments, configure Browserbase credentials
- This is for **viewing only** - do not use for automated testing

### 💡 AI Assistant Best Practices

#### When Writing Code

- Always use TypeScript interfaces for props
- Follow existing patterns and conventions
- Include proper error handling
- Write self-documenting code with clear variable names
- Add JSDoc comments for complex functions

#### When Debugging

- Start with TypeScript checking
- Isolate issues in Storybook when possible
- Check browser console for runtime errors
- Use React DevTools for component debugging
- Verify network requests in DevTools

#### When Making Changes

- Test locally before suggesting changes
- Consider backward compatibility
- Update tests when modifying behavior
- Document breaking changes clearly
- Consider performance implications

---

**🔄 Last Updated**: November 10, 2025
**📊 System Status**: ✅ Fully Operational  
**🏗️ Build Health**: ✅ Passing All Checks  
**📋 Next Review**: December 2025
