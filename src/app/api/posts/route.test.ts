import posts from "@/content/posts";
import { GET } from "./route";

describe("GET /api/posts", () => {
  it("returns the requested archive slice and total", async () => {
    const response = GET(
      new Request("http://localhost/api/posts?offset=7&limit=6")
    );
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.totalPosts).toBe(56);
    expect(result.posts).toEqual(posts.slice(7, 13));
  });

  it("caps page size at twelve", async () => {
    const response = GET(
      new Request("http://localhost/api/posts?offset=0&limit=100")
    );
    const result = await response.json();

    expect(result.posts).toHaveLength(12);
  });

  it.each([
    "offset=-1&limit=6",
    "offset=nope&limit=6",
    "offset=0&limit=0",
    "offset=0&limit=1.5",
  ])("rejects invalid bounds: %s", async (query) => {
    const response = GET(new Request(`http://localhost/api/posts?${query}`));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: "offset must be zero or greater and limit must be positive",
    });
  });
});
