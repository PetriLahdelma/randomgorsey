import { createHash } from "node:crypto";

import posts from "@/content/posts";

import {
  AGENT_DOCUMENT_COUNT,
  AGENT_DOCUMENT_PATHS,
  getAgentDocument,
  htmlToMarkdown,
  renderLlmsFull,
  renderLlmsIndex,
} from "./agent-content";

const expectedProviderUrl = (source: string): string => {
  const url = new URL(source.replaceAll("&amp;", "&"));
  if (url.hostname === "open.spotify.com") {
    return `${url.origin}${url.pathname.replace("/embed/", "/")}`;
  }

  const target = url.searchParams.get("url");
  if (!target) throw new Error(`Missing SoundCloud target in ${source}`);
  return new URL(target).toString();
};

describe("agent-readable content", () => {
  it("renders every canonical page and all preserved journal entries", () => {
    expect(AGENT_DOCUMENT_COUNT).toBe(71);
    expect(new Set(AGENT_DOCUMENT_PATHS).size).toBe(71);

    for (const path of AGENT_DOCUMENT_PATHS) {
      const entry = getAgentDocument(path);
      expect(entry, path).not.toBeNull();
      expect(entry?.markdown, path).toContain(`Canonical URL: https://randomgorsey.com${path}`);
    }

    expect(getAgentDocument("/posts/999999/")).toBeNull();
  });

  it("preserves authored post prose and replaces embeds with real provider links", () => {
    let iframeCount = 0;
    for (const post of posts) {
      const entry = getAgentDocument(`/posts/${post.id}/`);
      expect(entry?.markdown).toContain(post.title);
      expect(entry?.markdown).toContain(post.author);
      expect(entry?.markdown).not.toContain("<iframe");
      expect(entry?.markdown).not.toContain("localhost");

      for (const iframe of post.body.matchAll(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi)) {
        const source = iframe[0].match(/src=["']([^"']+)["']/i)?.[1];
        if (!source) throw new Error(`Missing iframe source in post ${post.id}`);
        iframeCount += 1;
        expect(entry?.markdown, `post ${post.id}`).toContain(expectedProviderUrl(source));
      }
    }
    expect(iframeCount).toBe(14);

    const embedded = htmlToMarkdown(
      '<p>Listen.</p><iframe title="Example" src="https://open.spotify.com/embed/track/123?utm_source=generator"></iframe>'
    );
    expect(embedded).toBe("Listen.\n\n[Example](https://open.spotify.com/track/123)");
  });

  it("publishes a factual compact index and deterministic complete archive", () => {
    const index = renderLlmsIndex();
    const full = renderLlmsFull();

    expect(index).toContain("# Random Gorsey");
    expect(index).toContain("Model training is not permitted");
    expect(full).toContain("Light Returning");
    expect(full).toContain("The Customer is Always Right EP");
    expect(full).toContain("### Release links");
    expect(full).not.toContain("Listen and purchase");
    expect(full).toContain("Posing in sunglasses, Helsinki");
    expect(full).toContain("not exposed by the site's read-only posts API");
    expect(full).not.toContain("A person must review and submit");
    expect(full).toContain("71 canonical documents");
    expect(full).not.toMatch(/<(?:p|iframe|strong|em)\b/i);
    expect(full).not.toMatch(/## (Tutorials|Forums|Presets|Similar artists)/i);
    expect(full).not.toContain("localhost");

    expect(createHash("sha256").update(full).digest("hex")).toMatch(/^[a-f0-9]{64}$/);
  });
});
