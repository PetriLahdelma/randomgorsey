# 🤖 AI Assistant Development Guide

## Overview

This project includes comprehensive documentation and tooling for AI assistants (GitHub Copilot, Claude, and other LLMs) to effectively contribute to the Random Gorsey codebase.

## 📚 Documentation Files

### `COPILOT_INSTRUCTIONS.md`

- **Purpose**: GitHub Copilot-specific guidance and code patterns
- **Content**: Concise development workflow, common patterns, and quick reference
- **Target**: Inline code suggestions and auto-completion context

### `CLAUDE.md`

- **Purpose**: Comprehensive guide for Claude and other conversational AI assistants
- **Content**: Detailed architecture overview, troubleshooting guides, and best practices
- **Target**: Complex problem-solving and feature development discussions

### `mcp/README.md`

- **Purpose**: TypeScript MCP language server documentation
- **Content**: Code analysis tools and type checking workflows
- **Target**: Automated code quality and type safety

## 🔧 Automated Documentation Updates

### Update Scripts

The project includes automated documentation maintenance:

```bash
# Update all AI documentation after successful build
npm run docs:update

# Generate current project status report
npm run docs:report

# Complete build with documentation update
npm run build:complete
```

### Auto-Update Triggers

Documentation is automatically updated with:

- ✅ Current TypeScript compilation status
- ✅ Build success/failure state
- ✅ Test suite status
- ✅ Dependency versions
- ✅ Last update timestamp
- ✅ Known issues and resolutions

### Manual Updates

When making significant changes:

1. **After dependency updates**: Run `npm run docs:update`
2. **After architecture changes**: Manually update relevant sections
3. **After adding new patterns**: Document in both files
4. **After resolving issues**: Update status sections

## 📊 Current Project Status

**Last Updated**: November 10, 2025

**System Health**: ✅ Fully Operational

- TypeScript 5.9.3: ✅ Clean compilation
- React 19.2.0: ✅ Stable runtime
- Build Process: ✅ Successful
- Test Suite: ✅ Passing

**Recent Major Updates**:

- React 18 → 19 migration completed
- TypeScript 4 → 5 upgrade with modern module resolution
- Storybook 9 → 10 modernization
- Zod 3 → 4 with breaking changes resolved
- All dependencies updated to latest stable versions

## 🎯 Key Development Patterns

### Component Development

```typescript
// Standard component pattern
interface ComponentProps {
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
}

const Component: React.FC<ComponentProps> = ({
  children,
  variant = "primary",
}) => {
  return (
    <motion.div
      className={cn(styles.container, styles[variant])}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {children}
    </motion.div>
  );
};
```

### Form Validation (Zod v4)

```typescript
// Updated for Zod v4 API
const result = schema.safeParse(data);
if (!result.success) {
  result.error.issues.forEach((issue) => {
    // Note: .issues not .errors
    console.log(issue.message);
  });
}
```

### Animation Patterns

```typescript
// Consistent Framer Motion usage
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};
```

## 🔍 Diagnostic Tools

### TypeScript Analysis

```bash
npm run ts:check:all        # Comprehensive analysis
npm run ts:check:types      # Type checking only
npm run ts:check:lint       # Code quality review
npm run ts:check:structure  # Project overview
```

### Build Verification

```bash
npm run build              # Production build
npm test                   # Test suite
npm start                  # Development server
npm run storybook          # Component playground
```

## 📋 AI Assistant Best Practices

### Code Quality Guidelines

- Always use TypeScript interfaces for component props
- Follow CSS Modules pattern for component styling
- Include Framer Motion for interactive animations
- Write comprehensive tests for user-facing features
- Use proper error handling and validation

### Debugging Approach

1. Start with TypeScript type checking
2. Verify component behavior in Storybook
3. Run tests to ensure functionality
4. Check responsive design across breakpoints
5. Validate accessibility compliance

### Documentation Maintenance

- Update documentation after major changes
- Include breaking change notes
- Document new patterns and conventions
- Keep status sections current
- Provide clear examples and use cases

## 🚀 Integration with Development Workflow

### Pre-commit Checks

```bash
npm run ts:check:all && npm test && npm run build
```

### Post-build Updates

```bash
npm run build:complete  # Builds and updates documentation
```

### Status Monitoring

```bash
npm run docs:report     # Current project health check
```

---

This documentation framework ensures AI assistants have comprehensive, up-to-date context about the project's current state, patterns, and best practices, enabling more effective and accurate assistance.
