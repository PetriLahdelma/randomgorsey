import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

describe("original Random Gorsey vector logo", () => {
  it.each(["random-gorsey-logo.svg", "random-gorsey-logo-white.svg"])("preserves the twelve native Illustrator glyph paths in %s", (name) => {
    const svg=readFileSync(path.resolve(process.cwd(),"public/images",name),"utf8");
    const curves=Array.from(svg.matchAll(/<path d="([^"]+)"/g), match=>match[1]);
    expect(curves).toHaveLength(12);
    expect(svg).not.toMatch(/<(?:image|text|script|foreignObject)\b/);
    expect(createHash("sha256").update(curves.join("\n")).digest("hex")).toBe("195115dd86110fa53ce9a5d8488cd97281ef9ae127754ced7938f2ad34087ca6");
  });
});
