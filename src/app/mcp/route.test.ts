import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { vi } from "vitest";
import { DELETE, GET, POST } from "./route";

const endpoint = "https://randomgorsey.com/mcp/";
const accept = "application/json, text/event-stream";

const rpc = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new Request(endpoint, {
      method: "POST",
      headers: {
        Accept: accept,
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    })
  );

const request = (id: number, method: string, params: object = {}) => ({
  jsonrpc: "2.0",
  id,
  method,
  params,
});

describe("public read-only MCP server", () => {
  it("closes the stateless server after each request", async () => {
    const close = vi.spyOn(McpServer.prototype, "close");
    try {
      const response = await rpc(request(10, "tools/list"));
      expect(response.status).toBe(200);
      expect(close).toHaveBeenCalledTimes(1);
    } finally {
      close.mockRestore();
    }
  });
  it("negotiates the current stable protocol without creating a session", async () => {
    const response = await rpc(
      request(1, "initialize", {
        protocolVersion: "2025-11-25",
        capabilities: {},
        clientInfo: { name: "test-client", version: "1.0.0" },
      })
    );
    const message = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toContain("application/json");
    expect(response.headers.get("Mcp-Session-Id")).toBeNull();
    expect(message.result.protocolVersion).toBe("2025-11-25");
    expect(message.result.capabilities.tools).toEqual({ listChanged: true });
    expect(message.result.serverInfo.name).toBe("com.randomgorsey/public-content");
  });

  it("lists only bounded read-only tools", async () => {
    const response = await rpc(
      request(2, "tools/list"),
      { "MCP-Protocol-Version": "2025-11-25" }
    );
    const message = await response.json();

    expect(response.status).toBe(200);
    expect(message.result.tools.map((tool: { name: string }) => tool.name)).toEqual([
      "list_journal_posts",
      "get_journal_post",
      "list_releases",
    ]);
    for (const tool of message.result.tools) {
      expect(tool.annotations).toMatchObject({
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      });
    }
  });

  it("returns public journal records and verified releases", async () => {
    const journal = await rpc(
      request(3, "tools/call", {
        name: "list_journal_posts",
        arguments: { offset: 0, limit: 2 },
      }),
      { "MCP-Protocol-Version": "2025-11-25" }
    );
    const journalMessage = await journal.json();
    expect(journalMessage.result.structuredContent.posts).toHaveLength(2);
    expect(journalMessage.result.structuredContent.totalPosts).toBe(56);
    expect(journalMessage.result.structuredContent.posts[0].canonicalUrl).toMatch(
      /^https:\/\/randomgorsey\.com\/posts\/\d+\/$/
    );

    const releasesResponse = await rpc(
      request(4, "tools/call", {
        name: "list_releases",
        arguments: {},
      }),
      { "MCP-Protocol-Version": "2025-11-25" }
    );
    const releaseMessage = await releasesResponse.json();
    expect(releaseMessage.result.structuredContent.releases).toHaveLength(2);
    expect(releaseMessage.result.structuredContent.releases[0]).toMatchObject({
      title: "So Long Spectrum",
      catalog: "FIRGO2100004",
    });
  });

  it("reads journal prose as source data and reports missing IDs as tool errors", async () => {
    const found = await rpc(
      request(5, "tools/call", {
        name: "get_journal_post",
        arguments: { id: 56 },
      }),
      { "MCP-Protocol-Version": "2025-11-25" }
    );
    const foundMessage = await found.json();
    expect(foundMessage.result.isError).not.toBe(true);
    expect(foundMessage.result.structuredContent.bodyMarkdown).toBeTruthy();
    expect(foundMessage.result.structuredContent.canonicalUrl).toBe(
      "https://randomgorsey.com/posts/56/"
    );

    const missing = await rpc(
      request(6, "tools/call", {
        name: "get_journal_post",
        arguments: { id: 999999 },
      }),
      { "MCP-Protocol-Version": "2025-11-25" }
    );
    expect((await missing.json()).result.isError).toBe(true);
  });

  it("accepts standard notifications with 202 and no response body", async () => {
    const response = await rpc({
      jsonrpc: "2.0",
      method: "notifications/initialized",
    });
    expect(response.status).toBe(202);
    expect(await response.text()).toBe("");
  });

  it("rejects oversized requests before processing them", async () => {
    const response = await rpc(request(11, "tools/call", {
      name: "get_journal_post",
      arguments: { id: 56, padding: "x".repeat(70_000) },
    }), { "MCP-Protocol-Version": "2025-11-25" });
    expect(response.status).toBe(413);
  });

  it("rejects browser origins outside the site", async () => {
    const response = await rpc(request(7, "tools/list"), {
      Origin: "https://attacker.example",
      "MCP-Protocol-Version": "2025-11-25",
    });
    expect(response.status).toBe(403);
    expect((await response.json()).error.message).toBe("Forbidden origin");
    const spoofedHost = await POST(new Request("https://attacker.example/mcp/", {
      method: "POST",
      headers: { Accept: accept, "Content-Type": "application/json", Origin: "https://attacker.example" },
      body: JSON.stringify(request(8, "tools/list")),
    }));
    expect(spoofedHost.status).toBe(403);
  });

  it("rejects unsolicited GET streams and stateful session deletion", async () => {
    const getResponse = await GET(
      new Request(endpoint, { headers: { Accept: "text/event-stream" } })
    );
    expect(getResponse.status).toBe(405);
    expect(getResponse.headers.get("Allow")).toBe("POST");

    const deleteResponse = await DELETE(
      new Request(endpoint, { method: "DELETE" })
    );
    expect(deleteResponse.status).toBe(405);
  });
});
