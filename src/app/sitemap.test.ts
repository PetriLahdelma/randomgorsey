import { readFileSync } from "node:fs";
import path from "node:path";

import posts from "@/content/posts";

import sitemap from "./sitemap";

describe("agent discovery", () => {
  it("publishes every public page in the sitemap without invented modification dates", () => {
    const entries = sitemap();
    const urls = entries.map(({ url }) => url);

    expect(entries).toHaveLength(6 + posts.length);
    expect(new Set(urls).size).toBe(entries.length);
    expect(urls).toContain("https://randomgorsey.com/");
    expect(urls).toContain("https://randomgorsey.com/listen/");
    expect(urls).toContain("https://randomgorsey.com/posts/56/");
    expect(entries.every((entry) => entry.lastModified === undefined)).toBe(true);
  });

  it("allows AI search and retrieval while reserving content from model training", () => {
    const robots = readFileSync(path.join(process.cwd(), "public", "robots.txt"), "utf8");

    expect(robots).toContain(
      "Content-Signal: search=yes, ai-input=yes, ai-train=no"
    );
    expect(robots).not.toMatch(/Content-Signal:.*\buse=/);
    expect(robots).toMatch(/User-agent: OAI-SearchBot\nAllow: \//);
    expect(robots).toMatch(/User-agent: Claude-SearchBot\nAllow: \//);
    expect(robots).toMatch(/User-agent: GPTBot\nDisallow: \//);
    expect(robots).toMatch(/User-agent: ClaudeBot\nDisallow: \//);
    expect(robots).not.toContain("User-agent: Bytespider");
    expect(robots).not.toContain("User-agent: meta-externalagent");
    expect(robots).toContain("crawler compliance is voluntary");
    expect(robots).toContain("Sitemap: https://randomgorsey.com/sitemap.xml");
  });
});
