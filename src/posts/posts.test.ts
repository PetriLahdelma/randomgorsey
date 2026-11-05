import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import posts, { getAdjacentPosts, getPostById } from "./index";

const ORIGINAL_POSTS_SHA256 =
  "8892ef3ba60ff56b11020848859db735e568b19e43d0b40d9cd022d4d70c1ffe";

describe("post content contract", () => {
  it("preserves every original record, field, body, and ordering", () => {
    const serialized = JSON.stringify(posts);

    expect(posts).toHaveLength(56);
    expect(new Set(posts.map((post) => post.id))).toHaveLength(56);
    expect(posts.map((post) => post.id)).toEqual([
      56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41,
      40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25,
      24, 23, 22, 2, 21, 20, 19, 18, 17, 16, 15, 1, 14, 13, 12, 11, 10,
      9, 8, 7, 6, 5, 4, 3,
    ]);
    expect(createHash("sha256").update(serialized).digest("hex")).toBe(
      ORIGINAL_POSTS_SHA256
    );
  });

  it("keeps lookup and adjacent navigation aligned with the sorted archive", () => {
    expect(getPostById(56)?.title).toBe("Light Returning");
    expect(getPostById(999_999)).toBeUndefined();
    expect(getAdjacentPosts(55)).toEqual({
      prev: getPostById(56),
      next: getPostById(54),
    });
  });

  it("keeps the complete archive out of client rendering modules", () => {
    const postCardSource = readFileSync(
      path.resolve(process.cwd(), "src/components/PostCard.tsx"),
      "utf8"
    );
    const postPageSource = readFileSync(
      path.resolve(process.cwd(), "src/site/Post.tsx"),
      "utf8"
    );

    expect(postCardSource).toContain("@/content/post-types");
    expect(postCardSource).not.toContain("@/content/posts");
    expect(postPageSource).not.toMatch(/from\s+["'](?:@\/posts|\.\.\/posts)["']/);
  });

  it("keeps every preserved iframe inside the deferred provider allowlist", () => {
    const iframeSources = posts.flatMap((post) =>
      Array.from(
        post.body.matchAll(
          /<iframe\b[^>]*src=["']([^"']+)["'][^>]*>[\s\S]*?<\/iframe>/gi
        ),
        (match) => match[1]
      )
    );
    const hosts = new Set(iframeSources.map((source) => new URL(source).hostname));

    expect(iframeSources).toHaveLength(14);
    expect(hosts).toEqual(new Set(["open.spotify.com", "w.soundcloud.com"]));
  });
});
