import { GET as current } from "@/app/mcp/server-card/route";
import { GET as legacy } from "@/app/.well-known/mcp/server-card.json/route";
import { MCP_SERVER_NAME, MCP_SERVER_VERSION } from "@/lib/mcp-server";

describe("MCP discovery cards", () => {
  it("advertises the same real server and transport in current and legacy formats", async () => {
    const response = current();
    const document = await response.json();
    const compatibility = await legacy().json();
    expect(response.headers.get("content-type")).toContain("application/mcp-server-card+json");
    expect(document.name).toBe(MCP_SERVER_NAME);
    expect(document.version).toBe(MCP_SERVER_VERSION);
    expect(document.remotes[0]).toEqual({ type: "streamable-http", url: "https://randomgorsey.com/mcp/", supportedProtocolVersions: ["2025-11-25", "2025-06-18"] });
    expect(compatibility.serverInfo.name).toBe(document.name);
    expect(compatibility.serverInfo.version).toBe(document.version);
    expect(compatibility.transport.endpoint).toBe(document.remotes[0].url);
    expect(compatibility.capabilities.tools).toEqual({});
  });
});
