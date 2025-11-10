#!/usr/bin/env node

/**
 * TypeScript Code Checker CLI
 * Provides command-line interface to interact with TypeScript MCP server
 */

const { spawn } = require('child_process');
const path = require('path');

class TypeScriptChecker {
  constructor() {
    this.serverPath = path.join(__dirname, 'typescript-server.js');
    this.projectPath = process.cwd();
  }

  async checkTypes(options = {}) {
    return this.callTool('check_typescript', {
      project_path: this.projectPath,
      strict: options.strict || false,
    });
  }

  async lint(options = {}) {
    return this.callTool('lint_typescript', {
      project_path: this.projectPath,
      fix: options.fix || false,
      files: options.files || null,
    });
  }

  async analyzeFile(filePath, options = {}) {
    return this.callTool('analyze_file', {
      file_path: path.resolve(filePath),
      include_suggestions: options.includeSuggestions !== false,
    });
  }

  async getProjectStructure() {
    return this.callTool('get_project_structure', {
      project_path: this.projectPath,
    });
  }

  async callTool(toolName, args) {
    return new Promise((resolve, reject) => {
      const child = spawn('node', [this.serverPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: path.dirname(this.serverPath),
      });

      let output = '';
      let error = '';

      child.stdout.on('data', (data) => {
        output += data.toString();
      });

      child.stderr.on('data', (data) => {
        error += data.toString();
      });

      child.on('close', (code) => {
        if (code === 0) {
          try {
            // Parse the MCP response
            const lines = output.trim().split('\n');
            const responses = lines
              .filter(line => line.startsWith('{'))
              .map(line => {
                try {
                  return JSON.parse(line);
                } catch {
                  return null;
                }
              })
              .filter(Boolean);

            resolve(responses);
          } catch (parseError) {
            reject(new Error(`Failed to parse output: ${parseError.message}`));
          }
        } else {
          reject(new Error(`Process exited with code ${code}: ${error}`));
        }
      });

      // Send the tool call request
      const request = {
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/call',
        params: {
          name: toolName,
          arguments: args,
        },
      };

      child.stdin.write(JSON.stringify(request) + '\n');
      child.stdin.end();
    });
  }

  async runCommand(command, args) {
    switch (command) {
      case 'check':
        console.log('🔍 Checking TypeScript types...');
        try {
          const result = await this.checkTypes({ strict: args.includes('--strict') });
          console.log(result);
        } catch (error) {
          console.error('❌ Type check failed:', error.message);
          process.exit(1);
        }
        break;

      case 'lint':
        console.log('🧹 Linting TypeScript files...');
        try {
          const result = await this.lint({ fix: args.includes('--fix') });
          console.log(result);
        } catch (error) {
          console.error('❌ Lint failed:', error.message);
          process.exit(1);
        }
        break;

      case 'analyze':
        const filePath = args[0];
        if (!filePath) {
          console.error('❌ Please provide a file path to analyze');
          process.exit(1);
        }
        console.log(`🔬 Analyzing ${filePath}...`);
        try {
          const result = await this.analyzeFile(filePath);
          console.log(result);
        } catch (error) {
          console.error('❌ Analysis failed:', error.message);
          process.exit(1);
        }
        break;

      case 'structure':
        console.log('📋 Analyzing project structure...');
        try {
          const result = await this.getProjectStructure();
          console.log(result);
        } catch (error) {
          console.error('❌ Structure analysis failed:', error.message);
          process.exit(1);
        }
        break;

      case 'help':
      default:
        this.showHelp();
        break;
    }
  }

  showHelp() {
    console.log(`
TypeScript Code Checker CLI

Usage: npm run ts:check <command> [options]

Commands:
  check [--strict]     Check TypeScript types in the project
  lint [--fix]         Run ESLint on TypeScript files
  analyze <file>       Analyze a specific TypeScript file
  structure           Show project structure and configuration
  help                Show this help message

Examples:
  npm run ts:check check          # Check types
  npm run ts:check check --strict # Check with strict mode
  npm run ts:check lint           # Lint files
  npm run ts:check lint --fix     # Lint and auto-fix
  npm run ts:check analyze src/App.tsx  # Analyze specific file
  npm run ts:check structure      # Show project structure
`);
  }
}

// CLI execution
if (require.main === module) {
  const checker = new TypeScriptChecker();
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  checker.runCommand(command, args).catch(console.error);
}

module.exports = TypeScriptChecker;