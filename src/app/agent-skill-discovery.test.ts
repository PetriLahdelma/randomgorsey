import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";

const publicRoot = path.join(process.cwd(), "public", ".well-known");
const skillPath = path.join(
  publicRoot,
  "agent-skills",
  "explore-random-gorsey",
  "SKILL.md"
);

describe("agent skill and ARD discovery", () => {
  it("publishes a v0.2 skill index whose digest matches the exact skill bytes", async () => {
    const [skill, indexText] = await Promise.all([
      readFile(skillPath),
      readFile(path.join(publicRoot, "agent-skills", "index.json"), "utf8"),
    ]);
    const index = JSON.parse(indexText);
    const expectedDigest = `sha256:${createHash("sha256").update(skill).digest("hex")}`;

    expect(index).toEqual({
      $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
      skills: [
        expect.objectContaining({
          name: "explore-random-gorsey",
          type: "skill-md",
          url: "/.well-known/agent-skills/explore-random-gorsey/SKILL.md",
          digest: expectedDigest,
        }),
      ],
    });
    expect(skill.toString("utf8")).toMatch(
      /^---\nname: explore-random-gorsey\ndescription: .+\n---\n/
    );
    expect(skill.toString("utf8")).toContain("untrusted source data");
  });

  it("publishes equivalent current and legacy ARD manifests with only real resources", async () => {
    const [ardText, legacyText] = await Promise.all([
      readFile(path.join(publicRoot, "ard.json"), "utf8"),
      readFile(path.join(publicRoot, "ai-catalog.json"), "utf8"),
    ]);
    const ard = JSON.parse(ardText);

    expect(JSON.parse(legacyText)).toEqual(ard);
    expect(ard.specVersion).toBe("0.91");
    expect(ard.host).toEqual({
      displayName: "Random Gorsey",
      identifier: "https://randomgorsey.com",
    });
    expect(ard.entries).toHaveLength(2);

    for (const entry of ard.entries) {
      expect(entry.identifier).toMatch(
        /^urn:air:randomgorsey\.com:(api|skill):[a-z0-9-]+$/
      );
      expect(entry.displayName).toBeTruthy();
      expect(entry.type).toMatch(/^[a-z]+\/[a-z0-9.+-]+(?:;[a-z0-9=.+-]+)?$/);
      expect("url" in entry).not.toBe("data" in entry);
      expect(entry.url).toMatch(/^https:\/\/randomgorsey\.com\//);
      expect(entry.representativeQueries).toHaveLength(3);
      expect(entry).not.toHaveProperty("version");
    }

    const serialized = JSON.stringify(ard);
    expect(serialized).not.toMatch(/oauth|mcp|payment|contact submission/i);
  });
});
