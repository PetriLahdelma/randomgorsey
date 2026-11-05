import { GET as listPosts } from "@/app/api/posts/route";
import {
  GET as getCatalog,
  HEAD as headCatalog,
} from "@/app/.well-known/api-catalog/route";
import { GET as getDocs } from "@/app/api-docs/posts/route";
import { GET as getOpenApi } from "@/app/openapi.json/route";
import {
  apiCatalogUrl,
  postsApiUrl,
  postsOpenApiDocument,
  postsOpenApiUrl,
} from "@/lib/posts-api-discovery";

describe("public API discovery", () => {
  it("publishes a self-contained RFC 9727 JSON Linkset", async () => {
    const response = getCatalog();
    const catalog = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"'
    );
    expect(response.headers.get("access-control-allow-origin")).toBe("*");
    expect(response.headers.get("link")).toContain(
      `<${apiCatalogUrl}>; rel="api-catalog"`
    );
    expect(catalog).toEqual({
      linkset: [
        expect.objectContaining({
          anchor: apiCatalogUrl,
          item: [expect.objectContaining({ href: postsApiUrl })],
        }),
        expect.objectContaining({
          anchor: postsApiUrl,
          "service-desc": [
            expect.objectContaining({ href: postsOpenApiUrl }),
          ],
          "service-doc": [expect.objectContaining({ hreflang: ["en"] })],
        }),
      ],
    });

    const head = headCatalog();
    expect(head.status).toBe(200);
    expect(await head.text()).toBe("");
    expect(head.headers.get("link")).toBe(response.headers.get("link"));
  });

  it("describes only the existing read-only posts operation", async () => {
    const response = getOpenApi();
    const document = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("content-type")).toBe(
      "application/vnd.oai.openapi+json;version=3.1"
    );
    expect(document).toEqual(postsOpenApiDocument);
    expect(Object.keys(document.paths)).toEqual(["/api/posts/"]);
    expect(Object.keys(document.paths["/api/posts/"])).toEqual(["get"]);
    expect(document.paths["/api/posts/"].get.security).toEqual([]);
    expect(document.components).not.toHaveProperty("securitySchemes");
    expect(JSON.stringify(document)).not.toMatch(
      /contact|oauth|payment|booking|write/i
    );
  });

  it("keeps the discovery description aligned with runtime bounds and caching", async () => {
    const capped = listPosts(
      new Request("https://randomgorsey.com/api/posts/?offset=0&limit=100")
    );
    const cappedBody = await capped.json();
    const invalid = listPosts(
      new Request("https://randomgorsey.com/api/posts/?offset=-1&limit=6")
    );

    expect(cappedBody.posts).toHaveLength(12);
    expect(capped.headers.get("cache-control")).toBe(
      "public, max-age=0, s-maxage=300, stale-while-revalidate=86400"
    );
    expect(invalid.status).toBe(400);
    expect(await invalid.json()).toEqual({
      error: "offset must be zero or greater and limit must be positive",
    });

    const operation = postsOpenApiDocument.paths["/api/posts/"].get;
    expect(operation.parameters[0].schema).toEqual({
      type: "integer",
      minimum: 0,
      maximum: Number.MAX_SAFE_INTEGER,
      default: 0,
    });
    expect(operation.parameters[1].schema).toEqual({
      type: "integer",
      minimum: 1,
      maximum: Number.MAX_SAFE_INTEGER,
      default: 6,
    });
    expect(operation.parameters[1].description).toContain("capped at 12");
    expect(
      operation.responses["200"].headers["Cache-Control"].schema.const
    ).toBe(capped.headers.get("cache-control"));
  });

  it.each([
    ["", 200, 6],
    ["offset=7", 200, 6],
    ["offset=0007&limit=006", 200, 6],
    ["offset=0&limit=1", 200, 1],
    ["offset=0&limit=12", 200, 12],
    ["offset=0&limit=13", 200, 12],
    [`offset=${Number.MAX_SAFE_INTEGER}&limit=1`, 200, 0],
    [`offset=0&limit=${Number.MAX_SAFE_INTEGER}`, 200, 12],
    ["offset=&limit=6", 400, null],
    ["offset=+1&limit=6", 400, null],
    ["offset=1.0&limit=6", 400, null],
    ["offset=1e2&limit=6", 400, null],
    ["offset=0&limit=", 400, null],
    ["offset=0&limit=-1", 400, null],
    [`offset=${Number.MAX_SAFE_INTEGER + 1}&limit=1`, 400, null],
    [`offset=0&limit=${Number.MAX_SAFE_INTEGER + 1}`, 400, null],
  ])(
    "matches the documented query contract for %s",
    async (query, expectedStatus, expectedCount) => {
      const suffix = query ? `?${query}` : "";
      const response = listPosts(
        new Request(`https://randomgorsey.com/api/posts/${suffix}`)
      );

      expect(response.status).toBe(expectedStatus);
      const body = await response.json();
      if (expectedCount === null) {
        expect(body).toEqual({
          error: "offset must be zero or greater and limit must be positive",
        });
      } else {
        expect(body.posts).toHaveLength(expectedCount);
        expect(body.totalPosts).toBe(65);
      }
    }
  );

  it("serves concise human-readable documentation", async () => {
    const response = getDocs();
    const text = await response.text();

    expect(response.headers.get("content-type")).toBe(
      "text/markdown; charset=utf-8"
    );
    expect(text).toContain(`GET ${postsApiUrl}`);
    expect(text).toContain("public, read-only endpoint");
    expect(text).toContain("capped at `12`");
    expect(text).toContain("does not provide authentication");
  });
});
