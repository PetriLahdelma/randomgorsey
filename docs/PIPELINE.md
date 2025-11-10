# CI/CD Pipeline Documentation

## 🚀 Overview

The Random Gorsey project uses a robust CI/CD pipeline with GitHub Actions to ensure code quality, security, and reliable deployments.

## 📋 Pipeline Structure

### 1. PR Review Workflow (`.github/workflows/pr-review.yml`)

**Triggers**: Pull requests to `main` branch
**Purpose**: Automated code quality review and validation

**Jobs**:

- **Code Quality Review**:

  - TypeScript type checking
  - ESLint linting
  - Test suite execution
  - Production build validation
  - Bundle size analysis
  - Automated PR comment with results

- **Security Scan**:
  - NPM security audit
  - Hardcoded secrets detection
  - Dependency vulnerability check

**Features**:

- ✅ Comprehensive quality report posted as PR comment
- ✅ Automatic status checks for merge protection
- ✅ Bundle size monitoring
- ✅ Security vulnerability scanning
- ✅ EmailJS credential leak detection

### 2. Deployment Workflow (`.github/workflows/deploy.yml`)

**Triggers**: Push to `main` branch
**Purpose**: Secure production deployment to GitHub Pages

**Jobs**:

- **Pre-deployment Validation**:

  - TypeScript checking
  - Test execution
  - Security audit
  - Build verification

- **Production Deployment**:
  - Sitemap generation
  - Production build
  - CNAME setup
  - GitHub Pages deployment
  - Post-deployment verification

## 🔒 Security Features

### Environment Variables Protection

- Scans for hardcoded EmailJS credentials
- Validates `.env` file exclusion from git
- Checks for common secret patterns

### Dependency Security

- Automated NPM audit on every PR
- High/critical vulnerability detection
- Security-first dependency management

### Code Quality Gates

All PRs must pass:

- TypeScript type checking
- ESLint validation
- Test suite
- Production build
- Security scans

## 📊 Quality Metrics

### Automated Checks

- **TypeScript**: Zero type errors required
- **ESLint**: No linting issues allowed
- **Tests**: All tests must pass
- **Build**: Production build must succeed
- **Security**: No high/critical vulnerabilities

### Manual Review Guidelines

- Code follows existing design patterns
- CSS Modules properly implemented
- Accessibility standards maintained
- Mobile responsiveness verified
- Performance considerations addressed

## 🚦 Branch Protection

### Main Branch Rules

- Require PR reviews before merging
- Require status checks to pass
- Require up-to-date branches
- Restrict push access
- CODEOWNERS file enforcement

### Status Checks Required

- `Code Quality Review` - Overall quality gate (TypeScript + Build critical, ESLint + Tests warnings)
- `Security Scan` - Security validation (Production dependencies + secrets)

**Note**: The pipeline uses job success/failure for status indication rather than commit statuses to avoid GitHub API permission issues. Critical checks (TypeScript, Build) will fail the job if they don't pass, while warnings (ESLint, Tests) are reported but don't block merging.

## 📝 Templates & Guidelines

### Pull Request Template

- Comprehensive checklist for contributors
- Quality gates documentation
- Security considerations
- Design system compliance

### Issue Templates

- **Bug Report**: Structured bug reporting
- **Feature Request**: Enhancement proposals
- Browser/device compatibility tracking

### CODEOWNERS

- Automatic review assignments
- Security-sensitive file protection
- Documentation review requirements

## 🔧 Local Development

### Required Scripts

```bash
# Quality checks (run before creating PR)
npm run ts:check:types    # TypeScript validation
npm run lint              # ESLint checking
npm test                  # Test execution
npm run build            # Production build

# Advanced TypeScript analysis
npm run ts:check:all     # Comprehensive analysis
npm run ts:check:analyze # File-by-file analysis
npm run ts:check:structure # Project structure
```

### Pre-commit Checklist

- [ ] All TypeScript types valid
- [ ] No linting errors
- [ ] All tests passing
- [ ] Environment variables not hardcoded
- [ ] Build succeeds locally
- [ ] Security audit clean

## ⚡ Performance Monitoring

### Bundle Analysis

- Automatic bundle size reporting
- JavaScript file size tracking
- Performance regression detection

### Deployment Verification

- Post-deployment site accessibility
- HTTPS and domain configuration
- Sitemap and meta file generation

## 🚨 Failure Handling

### PR Review Failures

- Detailed failure reports in PR comments
- Clear actionable feedback
- Links to relevant documentation
- Re-run capabilities

### Deployment Failures

- Pre-deployment validation prevents bad deployments
- Rollback procedures available
- Monitoring and alerting in place

### Common Issues & Troubleshooting

#### GitHub API Permissions Error
**Error**: `Resource not accessible by integration` when creating commit statuses

**Solution**: The workflow now uses job success/failure instead of commit statuses to avoid permission issues. Ensure these permissions are set:
```yaml
permissions:
  contents: read
  pull-requests: write
  checks: write
  statuses: write  # Optional, fallback approach
```

#### React 19 Dependency Conflicts
**Error**: NPM dependency resolution errors during security updates

**Solution**: Use `--legacy-peer-deps` flag or accept that some dev dependencies may have warnings due to React 19 migration timing.

#### Storybook Build Failures  
**Error**: Storybook fails to build after dependency updates

**Solution**: Check Storybook compatibility with React 19 and consider updating to latest Storybook version or temporarily disable Storybook builds.
- Rollback procedures available
- Monitoring and alerting in place

## 📚 Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [React Testing Best Practices](https://testing-library.com/docs/react-testing-library/intro/)
- [TypeScript Configuration](https://www.typescriptlang.org/tsconfig)
- [EmailJS Security Guidelines](https://www.emailjs.com/docs/introduction/security/)

## 🔄 Pipeline Evolution

This pipeline is designed to:

- Scale with project growth
- Adapt to new security requirements
- Support multiple deployment environments
- Maintain high code quality standards
- Enable confident continuous deployment

---

_Last updated: November 10, 2025_
_Pipeline version: 2.0_
