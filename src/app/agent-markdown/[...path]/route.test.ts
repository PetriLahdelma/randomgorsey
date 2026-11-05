import { GET, HEAD } from "./route";

const markdownRequest = (method = "GET") =>
  new Request("https://randomgorsey.com/agent-markdown/internal/", {
    method,
  });

const route = (...path: string[]) => ({ params: Promise.resolve({ path }) });

describe("path-specific negotiated Markdown route", () => {
  it("returns the canonical document with cache-safe negotiation headers", async () => {
    const response = await GET(markdownRequest(), route("posts", "56"));

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "text/markdown; charset=utf-8"
    );
    expect(response.headers.get("Content-Location")).toBe(
      "https://randomgorsey.com/posts/56/"
    );
    expect(response.headers.get("Link")).toBe(
      '<https://randomgorsey.com/posts/56/>; rel="canonical"'
    );
    expect(response.headers.get("Vary")).toBe("Accept");
    expect(response.headers.get("Cache-Control")).toContain("s-maxage=300");
    expect(await response.text()).toContain("# ");
  });

  it("keeps distinct post destinations and documents separate", async () => {
    const first = await GET(markdownRequest(), route("posts", "55"));
    const second = await GET(markdownRequest(), route("posts", "56"));
    const [firstBody, secondBody] = await Promise.all([first.text(), second.text()]);

    expect(first.headers.get("Content-Location")).toBe(
      "https://randomgorsey.com/posts/55/"
    );
    expect(second.headers.get("Content-Location")).toBe(
      "https://randomgorsey.com/posts/56/"
    );
    expect(firstBody).not.toBe(secondBody);
  });

  it("supports HEAD without emitting a body", async () => {
    const response = await HEAD(markdownRequest("HEAD"), route("gallery"));

    expect(response.status).toBe(200);
    expect(await response.text()).toBe("");
  });

  it("serves direct routes and rejects malformed or unknown documents", async () => {
    const direct = await GET(
      new Request("https://randomgorsey.com/agent-markdown/listen/"),
      route("listen")
    );
    expect(direct.status).toBe(200);
    expect(direct.headers.get("Content-Location")).toBe(
      "https://randomgorsey.com/listen/"
    );
    expect((await GET(markdownRequest(), route("unsupported"))).status).toBe(404);
    expect((await GET(markdownRequest(), route("posts", "999999"))).status).toBe(404);
  });
});
