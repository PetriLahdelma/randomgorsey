import { NextRequest } from "next/server";

import {
  acceptsMarkdown,
  discoveryLinks,
  isPublicContentPath,
  markdownResource,
  preferredRepresentation,
  proxy,
} from "./proxy";

describe("agent content negotiation proxy", () => {
  it("recognizes only canonical content pages", () => {
    expect(isPublicContentPath("/")).toBe(true);
    expect(isPublicContentPath("/listen")).toBe(true);
    expect(isPublicContentPath("/posts/56/")).toBe(true);
    expect(isPublicContentPath("/posts/not-a-number/")).toBe(false);
    expect(isPublicContentPath("/api/posts/")).toBe(false);
  });

  it("requires an explicit positive markdown media range", () => {
    expect(acceptsMarkdown("text/markdown")).toBe(true);
    expect(acceptsMarkdown("text/html;q=0.6, text/markdown;q=0.7")).toBe(true);
    expect(acceptsMarkdown("text/html, text/markdown;q=0.7")).toBe(false);
    expect(acceptsMarkdown("text/markdown;q=0, text/html")).toBe(false);
    expect(acceptsMarkdown("text/html, */*")).toBe(false);
  });

  it("honors quality, specificity, wildcards, and HTML tie-breaking", () => {
    expect(preferredRepresentation("text/html;q=0.5, text/markdown;q=0.9")).toBe(
      "markdown"
    );
    expect(preferredRepresentation("text/html, text/markdown")).toBe("html");
    expect(preferredRepresentation("text/*")).toBe("html");
    expect(preferredRepresentation("*/*")).toBe("html");
    expect(preferredRepresentation("text/*;q=0.8, text/markdown;q=0.5")).toBe(
      "html"
    );
    expect(preferredRepresentation("text/html;q=0, text/*;q=0.5")).toBe(
      "markdown"
    );
    expect(preferredRepresentation("*/*;q=1, text/markdown;q=0")).toBe("html");
    expect(preferredRepresentation("text/html;q=0, text/markdown;q=0")).toBe(
      "none"
    );
    expect(preferredRepresentation("application/json")).toBe("none");
  });

  it("advertises only implemented discovery resources", () => {
    const links = discoveryLinks("/listen/");
    expect(links).toContain(
      '</agent-markdown/listen/>; rel="alternate"; type="text/markdown"'
    );
    expect(links).toContain('</llms.txt>; rel="describedby"; type="text/plain"');
    expect(links).not.toContain('rel="sitemap"');
    expect(links).toContain('</.well-known/api-catalog>; rel="api-catalog"');
  });

  it("maps public resources to stable direct Markdown URLs", () => {
    expect(markdownResource("/")).toBe("/agent-markdown/home/");
    expect(markdownResource("/listen/")).toBe("/agent-markdown/listen/");
    expect(markdownResource("/posts/56/")).toBe("/agent-markdown/posts/56/");
  });

  it("rewrites markdown requests and leaves browser HTML requests in place", () => {
    const markdown = proxy(
      new NextRequest("https://randomgorsey.com/posts/56/", {
        headers: { Accept: "text/markdown" },
      })
    );
    expect(markdown.headers.get("x-middleware-rewrite")).toBe(
      "https://randomgorsey.com/agent-markdown/posts/56/"
    );
    expect(markdown.headers.get("Vary")).toContain("Accept");
    expect(markdown.headers.get("Link")).toContain("/llms.txt");

    const html = proxy(
      new NextRequest("https://randomgorsey.com/posts/56/", {
        headers: { Accept: "text/html" },
      })
    );
    expect(html.headers.get("x-middleware-rewrite")).toBeNull();
    expect(html.headers.get("Vary")).toContain("Accept");
    expect(html.headers.get("Link")).toContain('rel="alternate"');
    expect(html.headers.get("Cache-Control")).toBe("private, no-store");
    expect(html.headers.get("Vercel-CDN-Cache-Control")).toContain("s-maxage=300");
  });

  it("uses a distinct internal cache identity for every negotiated resource", () => {
    const first = proxy(
      new NextRequest("https://randomgorsey.com/posts/55/", {
        headers: { Accept: "text/markdown" },
      })
    );
    const second = proxy(
      new NextRequest("https://randomgorsey.com/posts/56/", {
        headers: { Accept: "text/markdown" },
      })
    );
    const home = proxy(
      new NextRequest("https://randomgorsey.com/", {
        headers: { Accept: "text/markdown" },
      })
    );

    expect(first.headers.get("x-middleware-rewrite")).toBe(
      "https://randomgorsey.com/agent-markdown/posts/55/"
    );
    expect(second.headers.get("x-middleware-rewrite")).toBe(
      "https://randomgorsey.com/agent-markdown/posts/56/"
    );
    expect(home.headers.get("x-middleware-rewrite")).toBe(
      "https://randomgorsey.com/agent-markdown/home"
    );
  });

  it("does not negotiate RSC or prefetch requests", () => {
    const rsc = proxy(
      new NextRequest("https://randomgorsey.com/listen/", {
        headers: { Accept: "text/markdown", RSC: "1" },
      })
    );
    expect(rsc.headers.get("x-middleware-rewrite")).toBeNull();
    expect(rsc.headers.get("Link")).toBeNull();
  });

  it("returns 406 when neither representation is acceptable", async () => {
    const response = proxy(
      new NextRequest("https://randomgorsey.com/about/", {
        headers: { Accept: "text/html;q=0, text/markdown;q=0" },
      })
    );

    expect(response.status).toBe(406);
    expect(response.headers.get("Accept")).toBe("text/html, text/markdown");
    expect(await response.text()).toBe("Not acceptable");
  });
});
