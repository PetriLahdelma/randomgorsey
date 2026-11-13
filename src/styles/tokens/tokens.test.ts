import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import {
  assertFresh,
  check,
  collectTokens,
  GENERATED_CSS,
  generateCss,
  TOKEN_SOURCE,
  inventoryMigratedDebt,
  validateTokenReferences,
  validateDocument,
} from "../../../scripts/design-tokens.mjs";

async function sourceDocument(): Promise<Record<string, unknown>> {
  return JSON.parse(await readFile(TOKEN_SOURCE, "utf8")) as Record<string, unknown>;
}

function setNested(document: Record<string, unknown>, keys: string[], value: unknown): void {
  let current = document;
  for (const key of keys.slice(0, -1)) {
    const next = current[key];
    if (!next || typeof next !== "object" || Array.isArray(next)) throw new Error(`Missing object at ${key}`);
    current = next as Record<string, unknown>;
  }
  current[keys.at(-1)!] = value;
}

function getNested(document: Record<string, unknown>, keys: string[]): unknown {
  let current: unknown = document;
  for (const key of keys) {
    if (!current || typeof current !== "object" || Array.isArray(current)) throw new Error(`Missing object at ${key}`);
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function contrastRatio(firstHex: string, secondHex: string): number {
  const luminance = (hex: string) => {
    const channels = hex.slice(1).match(/.{2}/g)?.map((part) => Number.parseInt(part, 16) / 255) ?? [];
    const linear = channels.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
    return 0.2126 * linear[0] + 0.7152 * linear[1] + 0.0722 * linear[2];
  };
  const values = [luminance(firstHex), luminance(secondHex)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

describe("industrial design tokens", () => {
  it("uses pinned DTCG 2025.10 token shapes and bounded namespaces", async () => {
    const document = await sourceDocument();
    const tokens = validateDocument(document);

    expect(document.$schema).toBe("https://www.designtokens.org/schemas/2025.10/format.json");
    expect(tokens.size).toBeGreaterThan(70);
    expect([...tokens.keys()].every((key) => key.startsWith("ds.") || key.startsWith("component."))).toBe(true);
    expect(tokens.get("ds.color.signal.blue")?.value).toMatchObject({
      colorSpace: "srgb",
      components: expect.any(Array),
      hex: "#234bdf",
    });
  });

  it("generates stable CSS without claiming the artist-shell namespace", async () => {
    const document = await sourceDocument();
    const first = generateCss(document);
    const second = generateCss(document);

    expect(first).toBe(second);
    expect(first).toContain("--ds-color-neutral-950: #101210;");
    expect(first).toContain("--component-control-focus-on-dark: var(--ds-color-signal-acid);");
    expect(first).not.toMatch(/--studio-/);
  });

  it("keeps productive control boundaries above the three-to-one contrast threshold", async () => {
    const document = await sourceDocument();
    const field = getNested(document, ["ds", "color", "neutral", "50", "$value", "hex"]);
    const border = getNested(document, ["ds", "color", "neutral", "600", "$value", "hex"]);

    expect(typeof field).toBe("string");
    expect(typeof border).toBe("string");
    expect(contrastRatio(field as string, border as string)).toBeGreaterThanOrEqual(3);
    expect(generateCss(document)).toContain("--component-control-border: var(--ds-color-neutral-600);");
    expect(generateCss(document)).toContain("--component-button-secondary-border: var(--ds-color-neutral-600);");
  });

  it("provides canonical dialog sizing and rejects unknown source references", async () => {
    const document = await sourceDocument();
    const css = generateCss(document);
    const known = new Set([...collectTokens(document).values()].map((token) => `--${token.path.join("-").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()}`));

    expect(css).toContain("--ds-size-content-dialog: 640px;");
    expect(css).not.toContain("--ds-breakpoint-");
    expect(validateTokenReferences("width: var(--ds-size-content-dialog);", known, "fixture.css")).toEqual(["--ds-size-content-dialog"]);
    expect(() => validateTokenReferences("width: var(--ds-size-content-missing);", known, "fixture.css"))
      .toThrow(/fixture\.css references unknown generated token: --ds-size-content-missing/);
  });

  it("rejects bare color strings, unresolved references, cycles and CSS-name collisions", async () => {
    const base = await sourceDocument();
    const clone = () => structuredClone(base);

    const bareColor = clone();
    setNested(bareColor, ["ds", "color", "signal", "blue", "$value"], "#234bdf");
    expect(() => validateDocument(bareColor)).toThrow(/DTCG 2025\.10 object/);

    const inconsistentColor = clone();
    setNested(inconsistentColor, ["ds", "color", "signal", "blue", "$value", "hex"], "#ffffff");
    expect(() => validateDocument(inconsistentColor)).toThrow(/hex fallback does not match/);

    const missingReference = clone();
    setNested(missingReference, ["component", "control", "focus", "$value"], "{ds.color.signal.missing}");
    expect(() => validateDocument(missingReference)).toThrow(/references missing token/);

    const cycle = clone();
    setNested(cycle, ["component", "control", "focus", "$value"], "{component.control.focusOnDark}");
    setNested(cycle, ["component", "control", "focusOnDark", "$value"], "{component.control.focus}");
    expect(() => validateDocument(cycle)).toThrow(/reference cycle/);

    const collision = clone();
    setNested(collision, ["ds", "collision"], {
      $type: "dimension",
      fooBar: { $value: { value: 1, unit: "px" } },
      "foo-bar": { $value: { value: 2, unit: "px" } },
    });
    expect(() => validateDocument(collision)).toThrow(/CSS variable collision/);

    const unsupportedDimension = clone();
    setNested(unsupportedDimension, ["ds", "space", "1", "$value"], { value: 0.25, unit: "em" });
    expect(() => validateDocument(unsupportedDimension)).toThrow(/px\/rem/);
  });

  it("detects hand-edited generated output and validates the checked-in artifact", async () => {
    expect(() => assertFresh("expected", "changed")).toThrow(/generated\.css is stale/);

    const result = await check();
    const generated = await readFile(GENERATED_CSS, "utf8");
    expect(generated).toBe(generateCss(await sourceDocument()));
    expect(result.tokenCount).toBe(collectTokens(await sourceDocument()).size);
    expect(result.debt.files).toContain("src/components/Alert.tsx");
    expect(result.debt.excluded.productionPreserved).toContain("src/components/Button.tsx");
  });

  it("reports bounded debt by colors, named utilities, spacing and motion", async () => {
    const debt = await inventoryMigratedDebt();
    expect(debt.scope).toContain("stories and untouched live page CSS are excluded");
    expect(debt.files).toContain("src/components/Input.tsx");
    expect(debt.files).toContain("src/components/SystemPrimitives.module.css");
    expect(debt.files).not.toContain("src/components/Button.tsx");
    expect(debt.files).not.toContain("src/components/Heading.tsx");
    expect(debt.files.some((file) => file.startsWith("src/components/layout/"))).toBe(false);
    expect(debt.categories).toEqual({
      colorLiterals: expect.any(Number),
      namedTailwindColors: expect.any(Number),
      spacingLiterals: expect.any(Number),
      motionLiterals: expect.any(Number),
    });
    expect(debt.total).toBe(Object.values(debt.categories).reduce((sum, count) => sum + count, 0));
    expect(debt.exceptions.contactParity.categories).toEqual({
      colorLiterals: 11,
      namedTailwindColors: 0,
      spacingLiterals: 14,
      motionLiterals: 0,
    });
    expect(debt.exceptions.staticCssBreakpoints).toEqual([
      expect.objectContaining({ file: "src/components/SystemPrimitives.module.css", value: "30rem", occurrences: 1 }),
    ]);
  });
});
