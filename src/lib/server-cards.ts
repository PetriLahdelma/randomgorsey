import { SITE_ORIGIN } from "@/config/site";
import { MCP_SERVER_NAME, MCP_SERVER_TITLE, MCP_SERVER_VERSION } from "@/lib/mcp-server";

const endpoint = `${SITE_ORIGIN}/mcp/`;
const description = "Read-only access to Random Gorsey's public journal and releases.";

export const currentServerCard = {
  $schema: "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
  name: MCP_SERVER_NAME,
  title: MCP_SERVER_TITLE,
  description,
  version: MCP_SERVER_VERSION,
  websiteUrl: SITE_ORIGIN,
  remotes: [{ type: "streamable-http", url: endpoint, supportedProtocolVersions: ["2025-11-25", "2025-06-18"] }],
} as const;

// Compatibility with the older discovery format still used by the scanner.
export const legacyServerCard = {
  serverInfo: { name: MCP_SERVER_NAME, title: MCP_SERVER_TITLE, version: MCP_SERVER_VERSION },
  description,
  url: endpoint,
  transport: { type: "streamable-http", endpoint },
  protocolVersion: "2025-11-25",
  capabilities: { tools: {} },
} as const;

export function cardResponse(card: object, contentType: string, head = false) {
  return new Response(head ? null : JSON.stringify(card), {
    headers: {
      "Content-Type": `${contentType}; charset=utf-8`,
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
