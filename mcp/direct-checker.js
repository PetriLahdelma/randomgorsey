#!/usr/bin/env node

/**
 * Direct TypeScript Code Checker
 * Simple script to check TypeScript code without MCP protocol overhead
 */

const fs = require("fs").promises;
const path = require("path");
const { execSync } = require("child_process");

class DirectTypeScriptChecker {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
  }

  async checkTypes(options = {}) {
    const { strict = false } = options;

    try {
      const tsConfigPath = path.join(this.projectPath, "tsconfig.json");

      // Check if tsconfig.json exists
      try {
        await fs.access(tsConfigPath);
      } catch {
        return {
          success: false,
          message: "No tsconfig.json found in the project directory.",
        };
      }

      // Run TypeScript compiler check
      let command = `cd "${this.projectPath}" && npx tsc --noEmit`;
      if (strict) {
        command += " --strict";
      }

      const output = execSync(command, {
        encoding: "utf8",
        cwd: this.projectPath,
      });

      return {
        success: true,
        message: `TypeScript compilation check completed successfully!\n\n${
          output || "No type errors found."
        }`,
      };
    } catch (error) {
      return {
        success: false,
        message: `TypeScript compilation errors found:\n\n${
          error.stdout || error.message
        }`,
      };
    }
  }

  async lint(options = {}) {
    const { fix = false, files = null } = options;

    try {
      let command = `cd "${this.projectPath}" && npx eslint`;

      if (files && files.length > 0) {
        command += ` ${files.join(" ")}`;
      } else {
        command += ` "src/**/*.{ts,tsx}"`;
      }

      if (fix) {
        command += " --fix";
      }

      command += " --ext .ts,.tsx";

      const output = execSync(command, {
        encoding: "utf8",
        cwd: this.projectPath,
      });

      return {
        success: true,
        message: `ESLint check completed!\n\n${
          output || "No linting issues found."
        }`,
      };
    } catch (error) {
      return {
        success: false,
        message: `ESLint found issues:\n\n${error.stdout || error.message}`,
      };
    }
  }

  async analyzeFile(filePath, options = {}) {
    const { includeSuggestions = true } = options;

    try {
      // Check if file exists
      await fs.access(filePath);

      // Read file content
      const content = await fs.readFile(filePath, "utf8");

      let analysis = `Analysis for: ${filePath}\n\n`;

      // Basic file statistics
      const lines = content.split("\n");
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
      analysis += `- Interfaces: ${hasInterface ? "Yes" : "No"}\n`;
      analysis += `- Type Aliases: ${hasType ? "Yes" : "No"}\n`;
      analysis += `- Enums: ${hasEnum ? "Yes" : "No"}\n`;
      analysis += `- Generics: ${hasGenerics ? "Yes" : "No"}\n`;
      analysis += `- Async/Await: ${hasAsyncAwait ? "Yes" : "No"}\n\n`;

      if (includeSuggestions) {
        analysis += `Suggestions:\n`;

        if (!hasInterface && !hasType) {
          analysis += `- Consider adding interfaces or type definitions for better type safety\n`;
        }

        if (content.includes("any")) {
          analysis += `- Found 'any' types - consider using more specific types\n`;
        }

        if (!content.includes("export") && !content.includes("import")) {
          analysis += `- Consider adding exports/imports for better modularity\n`;
        }

        analysis += `\n`;
      }

      return {
        success: true,
        message: analysis,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error analyzing file: ${error.message}`,
      };
    }
  }

  async getProjectStructure() {
    try {
      let structure = `Project Structure Analysis for: ${this.projectPath}\n\n`;

      // Check for TypeScript configuration
      const tsConfigPath = path.join(this.projectPath, "tsconfig.json");
      try {
        const tsConfig = await fs.readFile(tsConfigPath, "utf8");
        structure += `TypeScript Configuration (tsconfig.json):\n`;
        structure += `${tsConfig}\n\n`;
      } catch {
        structure += `No tsconfig.json found\n\n`;
      }

      // Check for package.json
      const packageJsonPath = path.join(this.projectPath, "package.json");
      try {
        const packageJson = JSON.parse(
          await fs.readFile(packageJsonPath, "utf8")
        );
        structure += `Project Dependencies:\n`;

        if (packageJson.dependencies) {
          structure += `Runtime Dependencies:\n`;
          Object.entries(packageJson.dependencies).forEach(
            ([name, version]) => {
              structure += `  - ${name}: ${version}\n`;
            }
          );
          structure += `\n`;
        }

        if (packageJson.devDependencies) {
          structure += `Development Dependencies:\n`;
          Object.entries(packageJson.devDependencies).forEach(
            ([name, version]) => {
              structure += `  - ${name}: ${version}\n`;
            }
          );
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
      const findTsFiles = async (dir) => {
        try {
          const files = [];
          const entries = await fs.readdir(dir);

          for (const entry of entries) {
            const fullPath = path.join(dir, entry);
            const stat = await fs.stat(fullPath);

            if (
              stat.isDirectory() &&
              !entry.startsWith(".") &&
              entry !== "node_modules"
            ) {
              const subFiles = await findTsFiles(fullPath);
              files.push(...subFiles);
            } else if (entry.endsWith(".ts") || entry.endsWith(".tsx")) {
              files.push(path.relative(this.projectPath, fullPath));
            }
          }

          return files;
        } catch {
          return [];
        }
      };

      const tsFiles = await findTsFiles(this.projectPath);
      structure += `TypeScript Files Found (${tsFiles.length}):\n`;
      tsFiles.slice(0, 20).forEach((file) => {
        structure += `  - ${file}\n`;
      });

      if (tsFiles.length > 20) {
        structure += `  ... and ${tsFiles.length - 20} more files\n`;
      }

      return {
        success: true,
        message: structure,
      };
    } catch (error) {
      return {
        success: false,
        message: `Error analyzing project structure: ${error.message}`,
      };
    }
  }

  async runAll() {
    console.log("🚀 Running comprehensive TypeScript code check...\n");

    // Check types
    console.log("🔍 1. Checking TypeScript types...");
    const typeResult = await this.checkTypes();
    console.log(typeResult.success ? "✅" : "❌", typeResult.message);
    console.log("\n" + "=".repeat(80) + "\n");

    // Run linting
    console.log("🧹 2. Linting TypeScript files...");
    const lintResult = await this.lint();
    console.log(lintResult.success ? "✅" : "❌", lintResult.message);
    console.log("\n" + "=".repeat(80) + "\n");

    // Get project structure
    console.log("📋 3. Analyzing project structure...");
    const structureResult = await this.getProjectStructure();
    console.log(structureResult.success ? "✅" : "❌", structureResult.message);

    return {
      typeCheck: typeResult.success,
      linting: lintResult.success,
      structure: structureResult.success,
    };
  }
}

// CLI execution
if (require.main === module) {
  const checker = new DirectTypeScriptChecker();
  const command = process.argv[2];
  const args = process.argv.slice(3);

  (async () => {
    try {
      switch (command) {
        case "check":
          console.log("🔍 Checking TypeScript types...");
          const typeResult = await checker.checkTypes({
            strict: args.includes("--strict"),
          });
          console.log(typeResult.success ? "✅" : "❌", typeResult.message);
          if (!typeResult.success) process.exit(1);
          break;

        case "lint":
          console.log("🧹 Linting TypeScript files...");
          const lintResult = await checker.lint({
            fix: args.includes("--fix"),
          });
          console.log(lintResult.success ? "✅" : "❌", lintResult.message);
          if (!lintResult.success) process.exit(1);
          break;

        case "analyze":
          const filePath = args[0];
          if (!filePath) {
            console.error("❌ Please provide a file path to analyze");
            process.exit(1);
          }
          console.log(`🔬 Analyzing ${filePath}...`);
          const analyzeResult = await checker.analyzeFile(
            path.resolve(filePath)
          );
          console.log(
            analyzeResult.success ? "✅" : "❌",
            analyzeResult.message
          );
          if (!analyzeResult.success) process.exit(1);
          break;

        case "structure":
          console.log("📋 Analyzing project structure...");
          const structureResult = await checker.getProjectStructure();
          console.log(
            structureResult.success ? "✅" : "❌",
            structureResult.message
          );
          if (!structureResult.success) process.exit(1);
          break;

        case "all":
          const results = await checker.runAll();
          const allSuccess =
            results.typeCheck && results.linting && results.structure;
          if (!allSuccess) process.exit(1);
          break;

        case "help":
        default:
          console.log(`
TypeScript Code Checker

Usage: npm run ts:check <command> [options]

Commands:
  check [--strict]     Check TypeScript types in the project
  lint [--fix]         Run ESLint on TypeScript files
  analyze <file>       Analyze a specific TypeScript file
  structure           Show project structure and configuration
  all                 Run all checks (types, linting, structure)
  help                Show this help message

Examples:
  npm run ts:check check          # Check types
  npm run ts:check check --strict # Check with strict mode
  npm run ts:check lint           # Lint files
  npm run ts:check lint --fix     # Lint and auto-fix
  npm run ts:check analyze src/App.tsx  # Analyze specific file
  npm run ts:check structure      # Show project structure
  npm run ts:check all           # Run all checks
`);
          break;
      }
    } catch (error) {
      console.error("❌ Error:", error.message);
      process.exit(1);
    }
  })();
}

module.exports = DirectTypeScriptChecker;
