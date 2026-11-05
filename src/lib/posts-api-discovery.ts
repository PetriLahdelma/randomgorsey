import { SITE_ORIGIN } from "@/config/site";

export const POSTS_API_PATH = "/api/posts/";
export const POSTS_OPENAPI_PATH = "/openapi.json";
export const POSTS_API_DOCS_PATH = "/api-docs/posts/";
export const API_CATALOG_PATH = "/.well-known/api-catalog";

const absoluteUrl = (path: string) => new URL(path, SITE_ORIGIN).toString();

export const postsApiUrl = absoluteUrl(POSTS_API_PATH);
export const postsOpenApiUrl = absoluteUrl(POSTS_OPENAPI_PATH);
export const postsApiDocsUrl = absoluteUrl(POSTS_API_DOCS_PATH);
export const apiCatalogUrl = absoluteUrl(API_CATALOG_PATH);

export const postsOpenApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Random Gorsey journal posts API",
    version: "1.0.0",
    description:
      "A public, read-only API for paginating the existing Random Gorsey journal archive. This version identifies the OpenAPI document independently from the website package version.",
  },
  servers: [{ url: SITE_ORIGIN }],
  externalDocs: {
    description: "Journal posts API documentation",
    url: postsApiDocsUrl,
  },
  paths: {
    [POSTS_API_PATH]: {
      get: {
        operationId: "listJournalPosts",
        summary: "List journal posts",
        description:
          "Returns journal posts in the same newest-first order used by the website. The endpoint is public and read-only.",
        security: [],
        parameters: [
          {
            name: "offset",
            in: "query",
            required: false,
            description: "Zero-based safe integer number of posts to skip.",
            schema: {
              type: "integer",
              minimum: 0,
              maximum: 9007199254740991,
              default: 0,
            },
          },
          {
            name: "limit",
            in: "query",
            required: false,
            description:
              "Requested page size as a positive safe integer. Values above 12 are accepted but capped at 12.",
            schema: {
              type: "integer",
              minimum: 1,
              maximum: 9007199254740991,
              default: 6,
            },
          },
        ],
        responses: {
          "200": {
            description: "A page of journal posts and the total archive size.",
            headers: {
              "Cache-Control": {
                description: "Shared-cache policy for the archive response.",
                schema: {
                  type: "string",
                  const:
                    "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
                },
              },
            },
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/PostPage" },
              },
            },
          },
          "400": {
            description: "The offset or limit is not a valid integer bound.",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" },
                example: {
                  error:
                    "offset must be zero or greater and limit must be positive",
                },
              },
            },
          },
        },
      },
    },
  },
  components: {
    schemas: {
      PostPage: {
        type: "object",
        additionalProperties: false,
        required: ["posts", "totalPosts"],
        properties: {
          posts: {
            type: "array",
            maxItems: 12,
            items: { $ref: "#/components/schemas/Post" },
          },
          totalPosts: { type: "integer", minimum: 0 },
        },
      },
      Post: {
        type: "object",
        additionalProperties: false,
        required: [
          "id",
          "title",
          "timestamp",
          "contentType",
          "body",
          "author",
        ],
        properties: {
          id: { type: "integer", minimum: 1 },
          title: { type: "string" },
          timestamp: {
            type: "string",
            description:
              "The authored publication timestamp as stored by the journal.",
          },
          contentType: { type: "string" },
          body: {
            type: "string",
            description:
              "Authored HTML. Some posts include third-party player markup whose source URL is part of the original entry.",
          },
          media: { type: "string" },
          mediaWidth: { type: "integer", minimum: 1 },
          mediaHeight: { type: "integer", minimum: 1 },
          avatarColor: { type: "string" },
          author: { type: "string" },
          excerpt: { type: "string" },
          category: {
            type: "string",
            enum: [
              "studio",
              "playlist",
              "scene",
              "release",
              "field-recording",
              "recommendation",
            ],
          },
          tags: { type: "array", items: { type: "string" } },
          featured: { type: "boolean" },
          views: { type: "integer", minimum: 0 },
          likes: { type: "integer", minimum: 0 },
        },
      },
      Error: {
        type: "object",
        additionalProperties: false,
        required: ["error"],
        properties: { error: { type: "string" } },
      },
    },
  },
} as const;

export const postsApiDocumentation = `# Random Gorsey journal posts API

The site exposes one public, read-only endpoint for the existing journal archive.

## List posts

\`GET ${postsApiUrl}\`

- \`offset\`: optional zero-based integer; defaults to \`0\`.
- \`limit\`: optional positive integer; defaults to \`6\`. Requests above \`12\` are accepted but capped at \`12\`.
- Success: \`200 application/json\` with \`posts\` and \`totalPosts\`.
- Invalid bounds: \`400 application/json\` with an \`error\` message.
- Cache policy: \`public, max-age=0, s-maxage=300, stale-while-revalidate=86400\`.

Post bodies contain the authored HTML stored by the journal. Some entries include third-party player markup. This API does not provide authentication, write access, contact-form submission, playback control, or commerce operations.

Machine description: ${postsOpenApiUrl}
`;

export const apiCatalogDocument = {
  linkset: [
    {
      anchor: apiCatalogUrl,
      item: [
        {
          href: postsApiUrl,
          type: "application/json",
          title: "Random Gorsey journal posts API",
        },
      ],
    },
    {
      anchor: postsApiUrl,
      "service-desc": [
        {
          href: postsOpenApiUrl,
          type: "application/vnd.oai.openapi+json;version=3.1",
        },
      ],
      "service-doc": [
        {
          href: postsApiDocsUrl,
          type: "text/markdown",
          hreflang: ["en"],
        },
      ],
    },
  ],
} as const;
