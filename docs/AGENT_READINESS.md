# Agent-readable site

The public site exposes its existing content and read-only journal API to agents. It does not expose a messaging, booking, payment, or account-management API.

## Discovery and content

- `/robots.txt` publishes the artist's chosen AI-use preferences and the sitemap location.
- `/sitemap.xml` lists the six public section pages and all journal entries, without fabricated modification dates.
- `/llms.txt` is the concise content map; `/llms-full.txt` is generated from the same records as the site.
- The home page, section pages and journal entries support `Accept: text/markdown`. Their `Link` headers also point to explicit Markdown representations.
- `/.well-known/api-catalog` and `/openapi.json` describe the existing read-only `/api/posts/` endpoint. `/api-docs/posts/` provides human-readable documentation.
- `/.well-known/agent-skills/index.json` indexes one read-only source-discovery skill. `/.well-known/ard.json` and its legacy `ai-catalog.json` alias catalog the real API description and skill.
- `/.well-known/poppy.json` declares anonymous website browsing and the public API under Poppy draft 0.4. It does not claim OAuth, sessions, or a company agent.
- Browsers implementing the experimental WebMCP API receive a bounded, read-only journal-listing tool; unsupported browsers remain unchanged. See [WEBMCP.md](WEBMCP.md).

The content and metadata derive from `src/content`, `src/data/galleryImages.ts`, and `src/lib/agent-content.ts`. Update those sources when the site changes; do not reinstate static LLM snapshots or the retired metadata generator.

## AI-use policy

The artist permits search and user-requested AI summaries, and does not permit model training. The site expresses this with `Content-Signal: search=yes, ai-input=yes, ai-train=no` and selectively disallows documented training crawlers. These signals are usage preferences, not technical enforcement; not every crawler honors them.

Google currently combines Gemini model training and Gemini grounding under `Google-Extended`. At the artist's direction it is blocked to prioritize no training, which also limits Gemini grounding. Ordinary Google Search is unaffected. See [Google's crawler documentation](https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers).

## Boundaries

OAuth, protected-resource metadata, agent registration, A2A, a remote MCP server, and commerce protocols are not advertised because the site does not implement them. DNS-AID is also absent: its draft records advertise callable agents, and this site does not operate such a service. These are not missing prerequisites for reading the artist's public content.

WebMCP, Agent Skills discovery, ARD and Poppy are evolving drafts. Recheck their official specifications before changing their contracts. If a real remote agent is added later, reassess its security, discovery and DNS requirements separately.
