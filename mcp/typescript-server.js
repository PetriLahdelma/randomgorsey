#!/usr/bin/env node

/**
 * TypeScript MCP Server
 * Provides TypeScript code analysis, linting, and checking capabilities
 */

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { CallToolRequestSchema, ListToolsRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class TypeScriptMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'typescript-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'check_typescript',
            description: 'Run TypeScript compiler to check for type errors',
            inputSchema: {
              type: 'object',
              properties: {
                project_path: {
                  type: 'string',
                  description: 'Path to the TypeScript project',
                },
                strict: {
                  type: 'boolean',
                  description: 'Use strict type checking',
                  default: false,
                },
              },
              required: ['project_path'],
            },
          },
          {
            name: 'lint_typescript',
            description: 'Run ESLint on TypeScript files',
            inputSchema: {
              type: 'object',
              properties: {
                project_path: {
                  type: 'string',
                  description: 'Path to the project to lint',
                },
                fix: {
                  type: 'boolean',
                  description: 'Auto-fix linting errors where possible',
                  default: false,
                },
                files: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Specific files to lint (optional)',
                },
              },
              required: ['project_path'],
            },
          },
          {
            name: 'analyze_file',
            description: 'Analyze a specific TypeScript file for issues',
            inputSchema: {
              type: 'object',
              properties: {
                file_path: {
                  type: 'string',
                  description: 'Path to the TypeScript file to analyze',
                },
                include_suggestions: {
                  type: 'boolean',
                  description: 'Include code improvement suggestions',
                  default: true,
                },
              },
              required: ['file_path'],
            },
          },
          {
            name: 'get_project_structure',
            description: 'Get TypeScript project structure and configuration',
            inputSchema: {
              type: 'object',
              properties: {
                project_path: {
                  type: 'string',
                  description: 'Path to the project',
                },
              },
              required: ['project_path'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        const { name, arguments: args } = request.params;

        switch (name) {
          case 'check_typescript':
            return await this.checkTypeScript(args);
          case 'lint_typescript':
            return await this.lintTypeScript(args);
          case 'analyze_file':
            return await this.analyzeFile(args);
          case 'get_project_structure':
            return await this.getProjectStructure(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  async checkTypeScript(args) {
    const { project_path, strict = false } = args;
    
    try {
      const tsConfigPath = path.join(project_path, 'tsconfig.json');
      
      // Check if tsconfig.json exists
      try {
        await fs.access(tsConfigPath);
      } catch {
        return {
          content: [
            {
              type: 'text',
              text: 'No tsconfig.json found in the project directory.',
            },
          ],
        };
      }

      // Run TypeScript compiler check
      let command = `cd "${project_path}" && npx tsc --noEmit`;
      if (strict) {
        command += ' --strict';
      }

      const output = execSync(command, { 
        encoding: 'utf8',
        cwd: project_path 
      });

      return {
        content: [
          {
            type: 'text',
            text: `TypeScript compilation check completed successfully!\n\n${output || 'No type errors found.'}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `TypeScript compilation errors found:\n\n${error.stdout || error.message}`,
          },
        ],
      };
    }
  }

  async lintTypeScript(args) {
    const { project_path, fix = false, files } = args;
    
    try {
      let command = `cd "${project_path}" && npx eslint`;
      
      if (files && files.length > 0) {
        command += ` ${files.join(' ')}`;
      } else {
        command += ` "src/**/*.{ts,tsx}"`;
      }
      
      if (fix) {
        command += ' --fix';
      }
      
      command += ' --ext .ts,.tsx';

      const output = execSync(command, { 
        encoding: 'utf8',
        cwd: project_path 
      });

      return {
        content: [
          {
            type: 'text',
            text: `ESLint check completed!\n\n${output || 'No linting issues found.'}`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `ESLint found issues:\n\n${error.stdout || error.message}`,
          },
        ],
      };
    }
  }

  async analyzeFile(args) {
    const { file_path, include_suggestions = true } = args;
    
    try {
      // Check if file exists
      await fs.access(file_path);
      
      // Read file content
      const content = await fs.readFile(file_path, 'utf8');
      
      let analysis = `Analysis for: ${file_path}\n\n`;
      
      // Basic file statistics
      const lines = content.split('\n');
      analysis += `File Statistics:\n`;
      analysis += `- Lines: ${lines.length}\n`;
      analysis += `- Characters: ${content.length}\n\n`;
      
      // Check for common TypeScript patterns
      const hasInterface = /interface\s+\w+/.test(content);
      const hasType = /type\s+\w+/.test(content);
      const hasEnum = /enum\s+\w+/.test(content);
      const hasGenerics = /<[A-Z]\w*>/.test(content);
      const hasAsyncAwait = /async\s+\w+|await\s+/.test(content);
      
      analysis += `TypeScript Features Detected:\n`;
      analysis += `- Interfaces: ${hasInterface ? 'Yes' : 'No'}\n`;
      analysis += `- Type Aliases: ${hasType ? 'Yes' : 'No'}\n`;
      analysis += `- Enums: ${hasEnum ? 'Yes' : 'No'}\n`;
      analysis += `- Generics: ${hasGenerics ? 'Yes' : 'No'}\n`;
      analysis += `- Async/Await: ${hasAsyncAwait ? 'Yes' : 'No'}\n\n`;
      
      if (include_suggestions) {
        analysis += `Suggestions:\n`;
        
        if (!hasInterface && !hasType) {
          analysis += `- Consider adding interfaces or type definitions for better type safety\n`;
        }
        
        if (content.includes('any')) {
          analysis += `- Found 'any' types - consider using more specific types\n`;
        }
        
        if (!content.includes('export') && !content.includes('import')) {
          analysis += `- Consider adding exports/imports for better modularity\n`;
        }
        
        analysis += `\n`;
      }

      return {
        content: [
          {
            type: 'text',
            text: analysis,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error analyzing file: ${error.message}`,
          },
        ],
      };
    }
  }

  async getProjectStructure(args) {
    const { project_path } = args;
    
    try {
      let structure = `Project Structure Analysis for: ${project_path}\n\n`;
      
      // Check for TypeScript configuration
      const tsConfigPath = path.join(project_path, 'tsconfig.json');
      try {
        const tsConfig = await fs.readFile(tsConfigPath, 'utf8');
        structure += `TypeScript Configuration (tsconfig.json):\n`;
        structure += `${tsConfig}\n\n`;
      } catch {
        structure += `No tsconfig.json found\n\n`;
      }
      
      // Check for package.json
      const packageJsonPath = path.join(project_path, 'package.json');
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        structure += `Project Dependencies:\n`;
        
        if (packageJson.dependencies) {
          structure += `Runtime Dependencies:\n`;
          Object.entries(packageJson.dependencies).forEach(([name, version]) => {
            structure += `  - ${name}: ${version}\n`;
          });
          structure += `\n`;
        }
        
        if (packageJson.devDependencies) {
          structure += `Development Dependencies:\n`;
          Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
            structure += `  - ${name}: ${version}\n`;
          });
          structure += `\n`;
        }
        
        if (packageJson.scripts) {
          structure += `Available Scripts:\n`;
          Object.entries(packageJson.scripts).forEach(([name, command]) => {
            structure += `  - ${name}: ${command}\n`;
          });
          structure += `\n`;
        }
      } catch {
        structure += `No package.json found\n\n`;
      }
      
      // Find TypeScript files
      const findTsFiles = (dir) => {
        try {
          const files = [];
          const entries = fs.readdirSync(dir);
          
          for (const entry of entries) {
            const fullPath = path.join(dir, entry);
            const stat = fs.statSync(fullPath);
            
            if (stat.isDirectory() && !entry.startsWith('.') && entry !== 'node_modules') {
              files.push(...findTsFiles(fullPath));
            } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
              files.push(path.relative(project_path, fullPath));
            }
          }
          
          return files;
        } catch {
          return [];
        }
      };
      
      const tsFiles = findTsFiles(project_path);
      structure += `TypeScript Files Found (${tsFiles.length}):\n`;
      tsFiles.slice(0, 20).forEach(file => {
        structure += `  - ${file}\n`;
      });
      
      if (tsFiles.length > 20) {
        structure += `  ... and ${tsFiles.length - 20} more files\n`;
      }

      return {
        content: [
          {
            type: 'text',
            text: structure,
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error analyzing project structure: ${error.message}`,
          },
        ],
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('TypeScript MCP Server running on stdio');
  }
}

// Run the server
if (require.main === module) {
  const server = new TypeScriptMCPServer();
  server.run().catch(console.error);
}

module.exports = TypeScriptMCPServer;