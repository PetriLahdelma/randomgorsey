import { renderLlmsIndex } from "@/lib/agent-content";

export function GET() {
  return new Response(renderLlmsIndex(), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
