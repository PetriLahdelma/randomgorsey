import { SITE_ORIGIN } from "@/config/site";
import { postsOpenApiUrl } from "@/lib/posts-api-discovery";
import skillIndex from "../../../../public/.well-known/agent-skills/index.json";

const POPPY_VERSION = "0.4";
const POPPY_URL = `${SITE_ORIGIN}/.well-known/poppy.json`;

export const poppyDiscoveryDocument = {
  protocol_version: POPPY_VERSION,
  organization: {
    name: "Random Gorsey",
    domain: new URL(SITE_ORIGIN).hostname,
    logo_uri: `${SITE_ORIGIN}/images/random-gorsey-logo.svg`,
  },
  web: {},
  apis: [
    {
      type: "openapi",
      url: postsOpenApiUrl,
      description:
        "Read-only, paginated access to the public Random Gorsey journal archive.",
    },
  ],
  skill_index: skillIndex,
} as const;

const headers = {
  "Access-Control-Allow-Origin": "*",
  Allow: "GET, HEAD",
  "Cache-Control":
    "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
  "Content-Type": "application/json; charset=utf-8",
  Link: `<${POPPY_URL}>; rel="self"; type="application/json"`,
  "X-Content-Type-Options": "nosniff",
} as const;

export function GET() {
  return new Response(JSON.stringify(poppyDiscoveryDocument), { headers });
}

export function HEAD() {
  return new Response(null, { headers });
}
