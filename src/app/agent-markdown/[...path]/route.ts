import { SITE_ORIGIN } from "@/config/site";
import { getAgentDocument } from "@/lib/agent-content";

const CACHE_CONTROL =
  "public, max-age=0, s-maxage=300, stale-while-revalidate=86400";

type AgentMarkdownRoute = {
  params: Promise<{ path: string[] }>;
};

function publicPath(segments: string[]): string | null {
  if (segments.length === 1 && segments[0] === "home") return "/";
  if (
    segments.length === 1 &&
    ["about", "contact", "discography", "gallery", "listen"].includes(segments[0])
  ) {
    return `/${segments[0]}/`;
  }
  if (segments.length === 2 && segments[0] === "posts" && /^[1-9]\d*$/.test(segments[1])) {
    return `/posts/${segments[1]}/`;
  }
  return null;
}

async function markdownResponse(
  route: AgentMarkdownRoute,
  includeBody: boolean
): Promise<Response> {
  const { path } = await route.params;
  const pathname = publicPath(path);
  if (!pathname) {
    return new Response("Not found", { status: 404 });
  }

  const document = getAgentDocument(pathname);
  if (!document) {
    return new Response("Not found", { status: 404 });
  }

  const canonicalUrl = new URL(pathname, SITE_ORIGIN).toString();
  const body = includeBody ? document.markdown : null;

  return new Response(body, {
    status: 200,
    headers: {
      "Cache-Control": CACHE_CONTROL,
      "Content-Location": canonicalUrl,
      "Content-Type": "text/markdown; charset=utf-8",
      Link: `<${canonicalUrl}>; rel="canonical"`,
      Vary: "Accept",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export function GET(_request: Request, route: AgentMarkdownRoute) {
  return markdownResponse(route, true);
}

export function HEAD(_request: Request, route: AgentMarkdownRoute) {
  return markdownResponse(route, false);
}
