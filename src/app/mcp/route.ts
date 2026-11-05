import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import { SITE_ORIGIN } from "@/config/site";
import { createRandomGorseyMcpServer } from "@/lib/mcp-server";

const MAX_REQUEST_BYTES = 64 * 1024;

const errorResponse = (status: number, code: number, message: string) =>
  Response.json(
    { jsonrpc: "2.0", error: { code, message }, id: null },
    { status, headers: { "Cache-Control": "no-store" } }
  );

const allowedOrigin = (request: Request): boolean => {
  const origin = request.headers.get("Origin");
  if (!origin) return true;

  if (origin === SITE_ORIGIN) return true;
  const endpoint = new URL(request.url);
  return ["localhost", "127.0.0.1", "[::1]"].includes(endpoint.hostname) && origin === endpoint.origin;
};

async function handleMcp(request: Request): Promise<Response> {
  if (!allowedOrigin(request)) {
    return errorResponse(403, -32000, "Forbidden origin");
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    maxRequestBodySize: MAX_REQUEST_BYTES,
  });
  const server = createRandomGorseyMcpServer();
  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request);
    const body = response.body ? await response.arrayBuffer() : null;
    const headers = new Headers(response.headers);
    headers.set("Cache-Control", "no-store");
    headers.set("X-Content-Type-Options", "nosniff");
    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  } finally {
    await server.close();
  }
}

export const POST = handleMcp;
const methodNotAllowed = (request: Request) =>
  allowedOrigin(request) ? new Response(null, {
    status: 405,
    headers: { Allow: "POST", "Cache-Control": "no-store" },
  }) : errorResponse(403, -32000, "Forbidden origin");
export const GET = methodNotAllowed;
export const DELETE = methodNotAllowed;
