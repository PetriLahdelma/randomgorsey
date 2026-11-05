import { NextRequest, NextResponse } from "next/server";

const CORE_PATHS = new Set([
  "/",
  "/about/",
  "/contact/",
  "/discography/",
  "/gallery/",
  "/listen/",
]);

const POST_PATH = /^\/posts\/(\d+)\/$/;
const VERCEL_CONTENT_CACHE =
  "public, s-maxage=300, stale-while-revalidate=86400";
const PREFETCH_HEADERS = [
  "next-router-prefetch",
  "next-router-state-tree",
  "rsc",
] as const;

function normalizedPagePath(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.endsWith("/") ? pathname : `${pathname}/`;
}

export function isPublicContentPath(pathname: string): boolean {
  const normalized = normalizedPagePath(pathname);
  return CORE_PATHS.has(normalized) || POST_PATH.test(normalized);
}

type Representation = "html" | "markdown" | "none";

type MediaRange = {
  mediaType: string;
  quality: number;
};

function qualityValue(parameters: string[]): number {
  const parameter = parameters
    .map((value) => value.trim())
    .find((value) => value.startsWith("q="));
  if (!parameter) return 1;

  const rawValue = parameter.slice(2);
  if (!/^(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)$/.test(rawValue)) return 0;
  return Number(rawValue);
}

function parseAccept(acceptHeader: string): MediaRange[] {
  return acceptHeader.split(",").map((range) => {
    const [mediaType, ...parameters] = range.trim().toLowerCase().split(";");
    return { mediaType, quality: qualityValue(parameters) };
  });
}

function representationQuality(
  ranges: MediaRange[],
  representation: "text/html" | "text/markdown"
): number {
  const [type] = representation.split("/");
  let bestSpecificity = -1;
  let quality = 0;

  for (const range of ranges) {
    const specificity =
      range.mediaType === representation
        ? 2
        : range.mediaType === `${type}/*`
          ? 1
          : range.mediaType === "*/*"
            ? 0
            : -1;

    if (specificity < 0) continue;

    if (specificity > bestSpecificity) {
      bestSpecificity = specificity;
      quality = range.quality;
    } else if (specificity === bestSpecificity) {
      quality = Math.max(quality, range.quality);
    }
  }

  return quality;
}

export function preferredRepresentation(acceptHeader: string | null): Representation {
  if (!acceptHeader) return "html";

  const ranges = parseAccept(acceptHeader);
  const htmlQuality = representationQuality(ranges, "text/html");
  const markdownQuality = representationQuality(ranges, "text/markdown");

  if (htmlQuality === 0 && markdownQuality === 0) return "none";
  if (markdownQuality > htmlQuality) return "markdown";
  return "html";
}

export function acceptsMarkdown(acceptHeader: string | null): boolean {
  return preferredRepresentation(acceptHeader) === "markdown";
}

export function markdownResource(pathname: string): string {
  const canonicalPath = normalizedPagePath(pathname);
  return canonicalPath === "/"
    ? "/agent-markdown/home/"
    : `/agent-markdown${canonicalPath}`;
}

export function discoveryLinks(pathname: string): string {
  const canonicalPath = normalizedPagePath(pathname);
  return [
    `<${markdownResource(canonicalPath)}>; rel="alternate"; type="text/markdown"`,
    `</llms.txt>; rel="describedby"; type="text/plain"`,
    `</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"`,
  ].join(", ");
}

function isPrefetchOrRsc(request: NextRequest): boolean {
  if (PREFETCH_HEADERS.some((header) => request.headers.has(header))) return true;

  const purpose = request.headers.get("purpose") ?? request.headers.get("sec-purpose");
  return purpose?.toLowerCase().includes("prefetch") ?? false;
}

function appendVary(headers: Headers, value: string): void {
  const current = headers.get("Vary");
  const values = new Set(
    (current ? current.split(",") : [])
      .map((entry) => entry.trim())
      .filter(Boolean)
  );
  values.add(value);
  headers.set("Vary", [...values].join(", "));
}

export function proxy(request: NextRequest) {
  if (
    (request.method !== "GET" && request.method !== "HEAD") ||
    !isPublicContentPath(request.nextUrl.pathname) ||
    isPrefetchOrRsc(request)
  ) {
    return NextResponse.next();
  }

  const pathname = normalizedPagePath(request.nextUrl.pathname);
  const responseHeaders = new Headers();
  responseHeaders.set("Link", discoveryLinks(pathname));
  appendVary(responseHeaders, "Accept");

  const representation = preferredRepresentation(request.headers.get("Accept"));
  if (representation === "none") {
    responseHeaders.set("Cache-Control", "private, no-store");
    responseHeaders.set("Accept", "text/html, text/markdown");
    return new NextResponse("Not acceptable", {
      status: 406,
      headers: responseHeaders,
    });
  }

  if (representation === "html") {
    // Next.js currently replaces a Proxy-authored Vary header on HTML with its
    // App Router Vary set. Keep this representation out of shared caches so a
    // negotiated Markdown response can never be reused for a browser request.
    responseHeaders.set("Cache-Control", "private, no-store");
    responseHeaders.set("Vercel-CDN-Cache-Control", VERCEL_CONTENT_CACHE);
    return NextResponse.next({ headers: responseHeaders });
  }

  const rewriteUrl = request.nextUrl.clone();
  rewriteUrl.pathname = markdownResource(pathname);
  rewriteUrl.search = "";

  return NextResponse.rewrite(rewriteUrl, {
    headers: responseHeaders,
  });
}

export const config = {
  matcher: [
    "/((?!api/|agent-markdown/|_next/|images/|fonts/|videos/|favicon.ico|robots.txt|sitemap.xml|llms.txt|llms-full.txt).*)",
  ],
};
