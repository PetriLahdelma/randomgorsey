import {
  API_CATALOG_PATH,
  apiCatalogDocument,
  apiCatalogUrl,
} from "@/lib/posts-api-discovery";

const PROFILE = "https://www.rfc-editor.org/info/rfc9727";
const CONTENT_TYPE = `application/linkset+json; profile="${PROFILE}"`;
const LINK_HEADER = `<${apiCatalogUrl}>; rel="api-catalog"; type="application/linkset+json"; profile="${PROFILE}"`;

const headers = {
  "Access-Control-Allow-Origin": "*",
  Allow: "GET, HEAD",
  "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  "Content-Type": CONTENT_TYPE,
  Link: LINK_HEADER,
} as const;

export function GET() {
  return new Response(JSON.stringify(apiCatalogDocument), { headers });
}

export function HEAD() {
  return new Response(null, { headers });
}

export { API_CATALOG_PATH };
