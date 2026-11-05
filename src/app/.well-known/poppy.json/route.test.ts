import { GET as getPosts } from "@/app/api/posts/route";
import posts from "@/content/posts";
import skillIndex from "../../../../public/.well-known/agent-skills/index.json";

import { GET, HEAD, poppyDiscoveryDocument } from "./route";

describe("Poppy draft 0.4 discovery", () => {
  it("publishes only the signed-out website and real read-only OpenAPI", async () => {
    const response = GET();

    expect(response.status).toBe(200);
    expect(response.headers.get("Content-Type")).toBe(
      "application/json; charset=utf-8"
    );
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(response.headers.get("Allow")).toBe("GET, HEAD");
    expect(await response.json()).toEqual(poppyDiscoveryDocument);
    expect(poppyDiscoveryDocument).toEqual({
      protocol_version: "0.4",
      organization: {
        name: "Random Gorsey",
        domain: "randomgorsey.com",
        logo_uri:
          "https://randomgorsey.com/images/random-gorsey-logo.svg",
      },
      web: {},
      apis: [
        {
          type: "openapi",
          url: "https://randomgorsey.com/openapi.json",
          description:
            "Read-only, paginated access to the public Random Gorsey journal archive.",
        },
        {
          type: "mcp",
          url: "https://randomgorsey.com/mcp/",
          description: "Read-only tools for the public journal and releases.",
        },
      ],
      skill_index: skillIndex,
    });

    const serialized = JSON.stringify(poppyDiscoveryDocument);
    expect(poppyDiscoveryDocument).not.toHaveProperty("agent");
    expect(serialized).not.toMatch(
      /authorization|oauth|token|session|conversation|booking|payment/i
    );
  });

  it("embeds the canonical Agent Skills index without a divergent copy", () => {
    expect(poppyDiscoveryDocument.skill_index).toBe(skillIndex);
    expect(poppyDiscoveryDocument.skill_index.skills).toHaveLength(1);
    expect(poppyDiscoveryDocument.skill_index.skills[0].digest).toMatch(
      /^sha256:[a-f0-9]{64}$/
    );
  });

  it("supports HEAD without returning a document body", async () => {
    const response = HEAD();

    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
    expect(response.headers.get("Content-Type")).toBe(
      "application/json; charset=utf-8"
    );
  });

  it("does not add identity or state behavior to the public posts API", async () => {
    const plain = getPosts(
      new Request("https://randomgorsey.com/api/posts/?offset=0&limit=2")
    );
    const withPoppySession = getPosts(
      new Request("https://randomgorsey.com/api/posts/?offset=0&limit=2", {
        headers: { "Poppy-Session": "opaque-unverified-session-value" },
      })
    );

    expect(withPoppySession.status).toBe(200);
    expect(await withPoppySession.json()).toEqual(await plain.json());
    expect(JSON.parse(JSON.stringify(poppyDiscoveryDocument))).not.toHaveProperty(
      "auth"
    );
    expect(posts).toHaveLength(56);
  });
});
