import posts from "@/content/posts";

const DEFAULT_LIMIT = 6;
const MAX_LIMIT = 12;

function readInteger(value: string | null, fallback: number): number | null {
  if (value === null) return fallback;
  if (!/^\d+$/.test(value)) return null;

  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const offset = readInteger(url.searchParams.get("offset"), 0);
  const requestedLimit = readInteger(
    url.searchParams.get("limit"),
    DEFAULT_LIMIT
  );

  if (offset === null || requestedLimit === null || requestedLimit < 1) {
    return Response.json(
      { error: "offset must be zero or greater and limit must be positive" },
      { status: 400 }
    );
  }

  const limit = Math.min(requestedLimit, MAX_LIMIT);

  return Response.json(
    {
      posts: posts.slice(offset, offset + limit),
      totalPosts: posts.length,
    },
    {
      headers: {
        "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      },
    }
  );
}
