import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const TOKEN_SOURCE = path.join(ROOT, "src/styles/tokens/tokens.json");
export const GENERATED_CSS = path.join(ROOT, "src/styles/tokens/generated.css");
const GLOBALS_CSS = path.join(ROOT, "src/app/globals.css");
const SCHEMA = "https://www.designtokens.org/schemas/2025.10/format.json";
const SUPPORTED_TYPES = new Set([
  "color",
  "dimension",
  "duration",
  "cubicBezier",
  "fontFamily",
  "fontWeight",
]);
const REFERENCE = /^\{([a-zA-Z0-9._-]+)\}$/;

const toKebab = (value) =>
  value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();

const tokenName = (tokenPath) => `--${tokenPath.map(toKebab).join("-")}`;

export const compareCodePoints = (first, second) => first < second ? -1 : first > second ? 1 : 0;

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function collectTokens(document) {
  const tokens = new Map();
  const walk = (node, currentPath, inheritedType) => {
    if (!isObject(node)) throw new Error(`Token group ${currentPath.join(".")} must be an object`);
    const type = node.$type ?? inheritedType;
    if (Object.prototype.hasOwnProperty.call(node, "$value")) {
      if (!type) throw new Error(`Token ${currentPath.join(".")} has no $type`);
      if (!SUPPORTED_TYPES.has(type)) throw new Error(`Token ${currentPath.join(".")} uses unsupported $type ${type}`);
      const pathKey = currentPath.join(".");
      if (tokens.has(pathKey)) throw new Error(`Duplicate token path ${pathKey}`);
      tokens.set(pathKey, { path: currentPath, type, value: node.$value });
      return;
    }
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith("$")) continue;
      walk(value, [...currentPath, key], type);
    }
  };
  for (const [key, value] of Object.entries(document)) {
    if (key.startsWith("$")) continue;
    walk(value, [key], undefined);
  }
  return tokens;
}

function validateColor(value, tokenPath) {
  if (!isObject(value)) throw new Error(`Color ${tokenPath} must use the DTCG 2025.10 object value`);
  if (value.colorSpace !== "srgb") throw new Error(`Color ${tokenPath} must use the srgb color space`);
  if (!Array.isArray(value.components) || value.components.length !== 3) {
    throw new Error(`Color ${tokenPath} must have three srgb components`);
  }
  for (const component of value.components) {
    if (component !== "none" && (typeof component !== "number" || component < 0 || component > 1)) {
      throw new Error(`Color ${tokenPath} has an invalid srgb component`);
    }
  }
  if (value.alpha !== undefined && (typeof value.alpha !== "number" || value.alpha < 0 || value.alpha > 1)) {
    throw new Error(`Color ${tokenPath} has an invalid alpha`);
  }
  if (value.hex !== undefined && !/^#[0-9a-f]{6}(?:[0-9a-f]{2})?$/i.test(value.hex)) {
    throw new Error(`Color ${tokenPath} has an invalid hex fallback`);
  }
  if (value.hex !== undefined) {
    if (value.components.includes("none")) throw new Error(`Color ${tokenPath} cannot pair a hex fallback with none components`);
    const channels = value.hex.slice(1).match(/.{2}/g).map((part) => Number.parseInt(part, 16) / 255);
    const expected = [...value.components, value.alpha ?? 1];
    const comparable = value.hex.length === 9 ? channels : channels.slice(0, 3);
    if (comparable.some((channel, index) => Math.abs(channel - expected[index]) > 0.00001)) {
      throw new Error(`Color ${tokenPath} hex fallback does not match its components`);
    }
  }
}

function validateDimension(value, tokenPath, units) {
  if (!isObject(value) || typeof value.value !== "number" || !units.has(value.unit)) {
    throw new Error(`${tokenPath} must be a numeric ${[...units].join("/")} value`);
  }
}

function validateExplicitValue(token) {
  const tokenPath = token.path.join(".");
  const reference = typeof token.value === "string" ? token.value.match(REFERENCE) : null;
  if (reference) return;
  switch (token.type) {
    case "color":
      validateColor(token.value, tokenPath);
      break;
    case "dimension":
      validateDimension(token.value, tokenPath, new Set(["px", "rem"]));
      break;
    case "duration":
      validateDimension(token.value, tokenPath, new Set(["ms", "s"]));
      break;
    case "cubicBezier":
      if (!Array.isArray(token.value) || token.value.length !== 4 || token.value.some((part) => typeof part !== "number")) {
        throw new Error(`${tokenPath} must be a four-number cubicBezier value`);
      }
      if (token.value[0] < 0 || token.value[0] > 1 || token.value[2] < 0 || token.value[2] > 1) {
        throw new Error(`${tokenPath} cubicBezier x coordinates must be between zero and one`);
      }
      break;
    case "fontFamily":
      if (
        !(typeof token.value === "string") &&
        !(Array.isArray(token.value) && token.value.length > 0 && token.value.every((family) => typeof family === "string"))
      ) {
        throw new Error(`${tokenPath} must be a font family string or list`);
      }
      break;
    case "fontWeight":
      if (!(typeof token.value === "number" || typeof token.value === "string")) {
        throw new Error(`${tokenPath} must be a numeric or named font weight`);
      }
      break;
  }
}

function resolveReference(token, tokens, stack = []) {
  const reference = typeof token.value === "string" ? token.value.match(REFERENCE) : null;
  if (!reference) return token;
  const targetPath = reference[1];
  const target = tokens.get(targetPath);
  if (!target) throw new Error(`Token ${token.path.join(".")} references missing token ${targetPath}`);
  if (target.type !== token.type) {
    throw new Error(`Token ${token.path.join(".")} (${token.type}) references ${targetPath} (${target.type})`);
  }
  if (stack.includes(targetPath)) throw new Error(`Token reference cycle: ${[...stack, targetPath].join(" -> ")}`);
  return resolveReference(target, tokens, [...stack, targetPath]);
}

function cssColor(value) {
  if (value.alpha === undefined || value.alpha === 1) {
    if (value.hex) {
      const normalized = value.hex.toLowerCase();
      const compact = normalized.match(/^#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3$/);
      return compact ? `#${compact[1]}${compact[2]}${compact[3]}` : normalized;
    }
    return `color(srgb ${value.components.join(" ")})`;
  }
  return `color(srgb ${value.components.join(" ")} / ${value.alpha})`;
}

function quoteFamily(family) {
  if (/^(sans-serif|serif|monospace|ui-monospace|system-ui)$/.test(family)) return family;
  return `"${family.replaceAll('"', '\\"')}"`;
}

function explicitCssValue(token) {
  switch (token.type) {
    case "color":
      return cssColor(token.value);
    case "dimension":
    case "duration":
      return `${token.value.value}${token.value.unit}`;
    case "cubicBezier":
      return `cubic-bezier(${token.value.join(", ")})`;
    case "fontFamily": {
      const families = Array.isArray(token.value) ? token.value : [token.value];
      return families.map(quoteFamily).join(", ");
    }
    case "fontWeight":
      return String(token.value);
    default:
      throw new Error(`Cannot serialize token type ${token.type}`);
  }
}

export function validateDocument(document) {
  if (document.$schema !== SCHEMA) throw new Error(`tokens.json must pin ${SCHEMA}`);
  if (document.$extensions?.["org.randomgorsey.contract"]?.version !== "2025.10") {
    throw new Error("tokens.json must declare the 2025.10 Random Gorsey token contract");
  }
  const tokens = collectTokens(document);
  const cssNames = new Map();
  for (const [pathKey, token] of tokens) {
    if (!(pathKey.startsWith("ds.") || pathKey.startsWith("component."))) {
      throw new Error(`Token ${pathKey} must be in the ds or component namespace`);
    }
    validateExplicitValue(token);
    resolveReference(token, tokens, [pathKey]);
    const cssName = tokenName(token.path);
    if (cssNames.has(cssName)) throw new Error(`CSS variable collision: ${pathKey} and ${cssNames.get(cssName)} -> ${cssName}`);
    cssNames.set(cssName, pathKey);
  }
  return tokens;
}

export function generateCss(document) {
  const tokens = validateDocument(document);
  const declarations = [...tokens.values()]
    .sort((a, b) => compareCodePoints(tokenName(a.path), tokenName(b.path)))
    .map((token) => {
      const reference = typeof token.value === "string" ? token.value.match(REFERENCE) : null;
      const value = reference
        ? `var(${tokenName(tokens.get(reference[1]).path)})`
        : explicitCssValue(token);
      return `  ${tokenName(token.path)}: ${value};`;
    });
  return [
    "/* This file is generated by scripts/design-tokens.mjs. Do not edit manually. */",
    ":root {",
    ...declarations,
    "}",
    "",
  ].join("\n");
}

export function assertFresh(expected, current) {
  if (current !== expected) throw new Error("generated.css is stale. Run npm run tokens:build.");
}

async function readDocument() {
  return JSON.parse(await readFile(TOKEN_SOURCE, "utf8"));
}

async function listFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory)) {
    const absolute = path.join(directory, entry);
    const info = await stat(absolute);
    if (info.isDirectory()) files.push(...await listFiles(absolute));
    else files.push(absolute);
  }
  return files;
}

async function validateNamespaces() {
  const cssFiles = (await listFiles(path.join(ROOT, "src")))
    .filter((file) => file.endsWith(".css") && file !== GENERATED_CSS);
  const collisions = [];
  for (const file of cssFiles) {
    const source = await readFile(file, "utf8");
    if (/--(?:ds|component)-[a-z0-9-]+\s*:/i.test(source)) collisions.push(path.relative(ROOT, file));
    if (file !== path.join(ROOT, "src/styles/studio.css") && /--studio-[a-z0-9-]+\s*:/i.test(source)) {
      collisions.push(`${path.relative(ROOT, file)} (reserved --studio-* declaration)`);
    }
  }
  if (collisions.length > 0) throw new Error(`Generated token namespace is also declared in: ${collisions.join(", ")}`);
}

async function validateImportOrder() {
  const source = await readFile(GLOBALS_CSS, "utf8");
  const expected = [
    "../styles/tokens/generated.css",
    "../styles/tokens/primitives.css",
    "../styles/tokens/semantic.css",
    "../styles/tokens/sections.css",
    "../styles/tokens/typography.css",
    "../styles/studio.css",
  ];
  const positions = expected.map((item) => source.indexOf(`@import "${item}";`));
  if (positions.some((position) => position < 0) || positions.some((position, index) => index > 0 && position <= positions[index - 1])) {
    throw new Error(`globals.css token imports must be ordered: ${expected.join(" -> ")}`);
  }
}

const MODERNIZED_COMPONENTS = new Set([
  "Alert",
  "Avatar",
  "Badge",
  "Caption",
  "Checkbox",
  "GroupLabel",
  "Input",
  "Label",
  "Modal",
  "Select",
  "Spinner",
  "Surface",
  "Text",
  "TextArea",
]);

const MIGRATION_EXCLUSIONS = {
  productionPreserved: ["src/components/Button.tsx", "src/components/Heading.tsx"],
  structural: ["src/components/layout/**"],
  contactParity: ["src/components/forms/FormField.module.css"],
};

async function migratedFiles() {
  const componentsRoot = path.join(ROOT, "src/components");
  const candidates = await listFiles(componentsRoot);
  return candidates
    .filter((file) => !/(?:^|\/)(?:__tests__)(?:\/|$)|\.test\.[cm]?[jt]sx?$/.test(file))
    .filter((file) => {
      const relative = path.relative(componentsRoot, file);
      const extension = path.extname(file);
      if (!(extension === ".tsx" || extension === ".css")) return false;
      if (relative.startsWith(`forms${path.sep}`)) return true;
      const basename = path.basename(file).replace(/(?:\.module)?\.(?:tsx|css)$/, "");
      if (basename === "SystemPrimitives") return true;
      return MODERNIZED_COMPONENTS.has(basename);
    })
    .map((file) => path.relative(ROOT, file))
    .sort();
}

async function referenceFiles() {
  const roots = [path.join(ROOT, "src/components"), path.join(ROOT, "src/stories")];
  const candidates = (await Promise.all(roots.map(listFiles))).flat();
  return candidates
    .filter((file) => /\.(?:css|mdx|ts|tsx)$/.test(file))
    .filter((file) => !/(?:^|\/)(?:__tests__)(?:\/|$)|\.test\.[cm]?[jt]sx?$/.test(file))
    .map((file) => path.relative(ROOT, file))
    .sort();
}

export function validateTokenReferences(source, knownVariables, file = "source") {
  const references = [...source.matchAll(/var\(\s*(--(?:ds|component)-[a-z0-9-]+)/gi)].map((match) => match[1]);
  const unknown = [...new Set(references.filter((reference) => !knownVariables.has(reference)))];
  if (unknown.length > 0) throw new Error(`${file} references unknown generated token${unknown.length === 1 ? "" : "s"}: ${unknown.join(", ")}`);
  return references;
}

async function validateSourceReferences(tokens) {
  const knownVariables = new Set([...tokens.values()].map((token) => tokenName(token.path)));
  for (const file of await referenceFiles()) {
    validateTokenReferences(await readFile(path.join(ROOT, file), "utf8"), knownVariables, file);
  }
}

const DEBT_PATTERNS = {
  colorLiterals: /(?:#[0-9a-f]{3,8}\b|(?:rgb|hsl|oklch)\()/gi,
  namedTailwindColors: /\b(?:bg|text|border|outline|ring|shadow)-(?:neutral|gray|slate|zinc|stone|red|green|yellow|blue|fuchsia|white|black|primary|secondary|accent|background|foreground|muted|destructive|success|border|ring|input|card|popover)(?:-[a-z0-9]+)*/gi,
  spacingLiterals: /(?:\b\d+(?:\.\d+)?(?:px|rem|em)\b|\b(?:p[trblxy]?|m[trblxy]?|gap|space-[xy]|min-[wh]|max-[wh]|[wh]|inset[xy]?|top|right|bottom|left)-\d+(?:\.\d+)?\b)/gi,
  motionLiterals: /(?:\b\d+(?:\.\d+)?m?s\b|\bduration\s*:\s*\d+(?:\.\d+)?\b|cubic-bezier\([^)]*\))/gi,
};

function debtCounts(source) {
  return Object.fromEntries(
    Object.entries(DEBT_PATTERNS).map(([key, pattern]) => {
      pattern.lastIndex = 0;
      return [key, (source.match(pattern) ?? []).length];
    })
  );
}

function sumDebt(counts) {
  return Object.values(counts).reduce((sum, count) => sum + count, 0);
}

export async function inventoryMigratedDebt() {
  const files = await migratedFiles();
  const categories = Object.fromEntries(Object.keys(DEBT_PATTERNS).map((key) => [key, 0]));
  const byFile = {};
  const contactParityFile = "src/components/forms/FormField.module.css";
  const contactParitySource = await readFile(path.join(ROOT, contactParityFile), "utf8").catch(() => "");
  const contactParityCategories = debtCounts(contactParitySource.replace(/--(?:ds|component)-[a-z0-9-]+/gi, ""));
  const staticBreakpointExceptions = [];
  for (const file of files) {
    if (file === contactParityFile) continue;
    let source = (await readFile(path.join(ROOT, file), "utf8"))
      .replace(/--(?:ds|component)-[a-z0-9-]+/gi, "");
    if (file === "src/components/SystemPrimitives.module.css") {
      const matches = source.match(/@media\s*\(width\s*<=\s*30rem\)/g) ?? [];
      if (matches.length > 0) {
        staticBreakpointExceptions.push({ file, value: "30rem", occurrences: matches.length, rationale: "CSS media queries cannot consume custom properties" });
        source = source.replace(/30rem/g, "0");
      }
    }
    const counts = debtCounts(source);
    const total = sumDebt(counts);
    if (total > 0) byFile[file] = { ...counts, total };
    for (const [key, count] of Object.entries(counts)) categories[key] += count;
  }
  return {
    scope: "modernized generic component implementations and CSS only; stories and untouched live page CSS are excluded",
    files,
    excluded: MIGRATION_EXCLUSIONS,
    categories,
    total: sumDebt(categories),
    byFile,
    exceptions: {
      contactParity: {
        files: MIGRATION_EXCLUSIONS.contactParity,
        categories: contactParityCategories,
        total: sumDebt(contactParityCategories),
        rationale: "These raw values preserve the pinned live Contact presentation and require a separate parity-approved migration",
      },
      staticCssBreakpoints: staticBreakpointExceptions,
    },
  };
}

export async function build() {
  const css = generateCss(await readDocument());
  await writeFile(GENERATED_CSS, css, "utf8");
  return css;
}

export async function check() {
  const document = await readDocument();
  const tokens = validateDocument(document);
  const css = generateCss(document);
  const current = await readFile(GENERATED_CSS, "utf8").catch(() => "");
  assertFresh(css, current);
  await validateNamespaces();
  await validateImportOrder();
  await validateSourceReferences(tokens);
  const debt = await inventoryMigratedDebt();
  if (debt.total > 0) throw new Error(`Undocumented raw values remain in modernized generic components: ${JSON.stringify(debt.byFile)}`);
  const contactBudget = { colorLiterals: 11, namedTailwindColors: 0, spacingLiterals: 14, motionLiterals: 0 };
  for (const [key, count] of Object.entries(debt.exceptions.contactParity.categories)) {
    if (count > contactBudget[key]) throw new Error(`Contact parity ${key} debt grew from ${contactBudget[key]} to ${count}`);
  }
  if (debt.exceptions.staticCssBreakpoints.reduce((sum, item) => sum + item.occurrences, 0) > 1) {
    throw new Error("Undocumented static breakpoint debt was added");
  }
  return { tokenCount: tokens.size, debt };
}

async function main() {
  const command = process.argv[2];
  if (command === "build") {
    const css = await build();
    console.log(`Generated ${path.relative(ROOT, GENERATED_CSS)} (${css.length} bytes).`);
    return;
  }
  if (command === "check") {
    const result = await check();
    console.log(`Validated ${result.tokenCount} tokens.`);
    console.log(`Migration debt scope: ${result.debt.scope}.`);
    console.log(`Migration debt counts: ${JSON.stringify(result.debt.categories)}; total=${result.debt.total}.`);
    return;
  }
  throw new Error("Usage: node scripts/design-tokens.mjs <build|check>");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
