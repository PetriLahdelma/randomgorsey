# TypeScript MCP Language Server

This project now includes a TypeScript Model Context Protocol (MCP) language server for enhanced code analysis and checking capabilities.

## Installation

The TypeScript MCP language server and related tools have been installed with the following packages:

- `@modelcontextprotocol/sdk` - MCP SDK for TypeScript
- `@typescript-eslint/eslint-plugin` - TypeScript-specific ESLint rules
- `@typescript-eslint/parser` - ESLint parser for TypeScript

## Available Scripts

### TypeScript Code Checking

All TypeScript checking scripts use the direct checker for simplicity and speed:

```bash
# Run all checks (types, linting, structure analysis)
npm run ts:check:all

# Check TypeScript types only
npm run ts:check:types

# Check with strict mode
npm run ts:check:types -- --strict

# Run ESLint on TypeScript files
npm run ts:check:lint

# Run ESLint with auto-fix
npm run ts:check:lint:fix

# Analyze a specific TypeScript file
npm run ts:check:analyze src/App.tsx

# Show project structure and configuration
npm run ts:check:structure

# Show help for the checker
npm run ts:check help
```

### MCP Server Scripts

For advanced users who want to use the full MCP protocol:

```bash
# Start the TypeScript MCP server
npm run mcp:server

# Use the MCP checker client
npm run mcp:checker
```

## Features

### Type Checking

- Validates TypeScript compilation without emitting files
- Supports strict mode checking
- Reports type errors and warnings

### ESLint Integration

- Runs TypeScript-specific ESLint rules
- Supports auto-fixing of linting issues
- Configurable rules for TypeScript best practices

### File Analysis

- Analyzes individual TypeScript files
- Detects TypeScript features (interfaces, types, generics, etc.)
- Provides code improvement suggestions
- Shows file statistics and patterns

### Project Structure Analysis

- Analyzes TypeScript configuration (tsconfig.json)
- Shows project dependencies and scripts
- Lists all TypeScript files in the project
- Provides project overview

## Configuration

### ESLint Configuration

The project uses a dedicated `.eslintrc.json` configuration with TypeScript-specific rules:

- `@typescript-eslint/no-unused-vars` - Prevents unused variables
- `@typescript-eslint/no-explicit-any` - Warns about `any` types
- `@typescript-eslint/prefer-const` - Prefers const over let
- `@typescript-eslint/no-var-requires` - Prevents var requires in TypeScript

### MCP Configuration

The MCP server configuration is located in `mcp/config.json` and includes:

- Server command and arguments
- Environment settings
- TypeScript-specific options

## File Structure

```
mcp/
├── config.json              # MCP server configuration
├── typescript-server.js     # Full MCP protocol server
├── typescript-checker.js    # MCP client wrapper
└── direct-checker.js        # Direct TypeScript checker (recommended)
```

## Usage Examples

### Quick Type Check

```bash
npm run ts:check:types
```

### Check and Fix Linting Issues

```bash
npm run ts:check:lint:fix
```

### Comprehensive Analysis

```bash
npm run ts:check:all
```

### Analyze Specific File

```bash
npm run ts:check:analyze src/components/Button.tsx
```

## Integration with Development Workflow

You can integrate these checks into your development workflow:

### Pre-commit Hook Example

Add to your `package.json`:

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run ts:check:all"
    }
  }
}
```

### CI/CD Integration

Add to your CI pipeline:

```bash
npm run ts:check:types
npm run ts:check:lint
```

## Troubleshooting

### Common Issues

1. **"No tsconfig.json found"**

   - Ensure your project has a `tsconfig.json` file
   - Run the command from the project root directory

2. **ESLint configuration errors**

   - Check that all TypeScript ESLint dependencies are installed
   - Verify the `.eslintrc.json` configuration is valid

3. **Permission errors**
   - Ensure the scripts in the `mcp/` directory are executable
   - Run `chmod +x mcp/*.js` if needed

### Getting Help

Run any script with the `help` command to see available options:

```bash
npm run ts:check help
```

## Advanced Usage

### Using the Full MCP Protocol

For integration with MCP-compatible tools, you can use the full protocol server:

1. Start the server:

   ```bash
   npm run mcp:server
   ```

2. Connect your MCP client to the server using stdio transport

3. Available MCP tools:
   - `check_typescript` - Type checking
   - `lint_typescript` - Linting
   - `analyze_file` - File analysis
   - `get_project_structure` - Project structure

The MCP server provides structured JSON responses that can be consumed by compatible development tools and IDEs.
