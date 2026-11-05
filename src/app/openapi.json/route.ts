import {
  postsOpenApiDocument,
  postsOpenApiUrl,
} from "@/lib/posts-api-discovery";

const CONTENT_TYPE = "application/vnd.oai.openapi+json;version=3.1";
const headers = {
  "Access-Control-Allow-Origin": "*",
  Allow: "GET, HEAD",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  "Content-Type": CONTENT_TYPE,
  Link: `<${postsOpenApiUrl}>; rel="self"; type="${CONTENT_TYPE}"`,
} as const;

export function GET() {
  return new Response(JSON.stringify(postsOpenApiDocument), { headers });
}

export function HEAD() {
  return new Response(null, { headers });
}
