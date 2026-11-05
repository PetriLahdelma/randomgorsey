import {
  postsApiDocsUrl,
  postsApiDocumentation,
  postsOpenApiUrl,
} from "@/lib/posts-api-discovery";

const headers = {
  "Access-Control-Allow-Origin": "*",
  Allow: "GET, HEAD",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  "Content-Type": "text/markdown; charset=utf-8",
  Link: `<${postsApiDocsUrl}>; rel="canonical"; type="text/markdown", <${postsOpenApiUrl}>; rel="service-desc"; type="application/vnd.oai.openapi+json;version=3.1"`,
} as const;

export function GET() {
  return new Response(postsApiDocumentation, { headers });
}

export function HEAD() {
  return new Response(null, { headers });
}
