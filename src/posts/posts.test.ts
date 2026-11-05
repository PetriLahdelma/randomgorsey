import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";

import posts, { getAdjacentPosts, getPostById } from "./index";

const ORIGINAL_POSTS_SHA256 =
  "8892ef3ba60ff56b11020848859db735e568b19e43d0b40d9cd022d4d70c1ffe";
const APPROVED_RETROSPECTIVE_POSTS_SHA256 =
  "ccf1403f57b4a2b8c5b071e8e069d1c2f3756390be28b6a3080e6f1123e1bcee";

describe("post content contract", () => {
  it("preserves every original record, field, body, and ordering", () => {
    const originalPosts = posts.filter((post) => post.id <= 56);
    const serialized = JSON.stringify(originalPosts);

    expect(originalPosts).toHaveLength(56);
    expect(originalPosts.map((post) => post.id)).toEqual([
      56, 55, 54, 53, 52, 51, 50, 49, 48, 47, 46, 45, 44, 43, 42, 41,
      40, 39, 38, 37, 36, 35, 34, 33, 32, 31, 30, 29, 28, 27, 26, 25,
      24, 23, 22, 2, 21, 20, 19, 18, 17, 16, 15, 1, 14, 13, 12, 11, 10,
      9, 8, 7, 6, 5, 4, 3,
    ]);
    expect(createHash("sha256").update(serialized).digest("hex")).toBe(
      ORIGINAL_POSTS_SHA256
    );
  });

  it("publishes the nine approved retrospective entries in newest-first order", () => {
    expect(posts).toHaveLength(65);
    expect(new Set(posts.map((post) => post.id))).toHaveLength(65);
    expect(posts.slice(0, 9).map(({ id, title, timestamp }) => ({
      id,
      title,
      date: timestamp.slice(0, 10),
    }))).toEqual([
      { id: 65, title: "The List", date: "2026-11-04" },
      { id: 64, title: "Windowlicker Weather", date: "2026-10-27" },
      { id: 63, title: "Too Many Tabs", date: "2026-10-09" },
      { id: 62, title: "Small Machine", date: "2026-09-14" },
      { id: 61, title: "Rain, Again", date: "2026-08-20" },
      { id: 60, title: "The Other Studio", date: "2026-07-02" },
      { id: 59, title: "One Good Hour", date: "2026-05-24" },
      { id: 58, title: "Systems Everywhere", date: "2026-05-08" },
      { id: 57, title: "After the Demos", date: "2026-04-12" },
    ]);
  });

  it("preserves the approved retrospective titles, dates, and prose", () => {
    const approvedContent = posts
      .filter((post) => post.id >= 57 && post.id <= 65)
      .map(({ id, title, timestamp, body }) => ({
        id,
        title,
        date: timestamp.slice(0, 10),
        body,
      }));

    expect(
      createHash("sha256")
        .update(JSON.stringify(approvedContent))
        .digest("hex")
    ).toBe(APPROVED_RETROSPECTIVE_POSTS_SHA256);
  });

  it("keeps lookup and adjacent navigation aligned with the sorted archive", () => {
    expect(getPostById(65)?.title).toBe("The List");
    expect(getPostById(999_999)).toBeUndefined();
    expect(getAdjacentPosts(64)).toEqual({
      prev: getPostById(65),
      next: getPostById(63),
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
