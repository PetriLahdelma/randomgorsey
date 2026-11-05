import type { Metadata } from "next";

import Home from "@/site/Home";
import posts from "@/content/posts";
import type { Post } from "@/content/post-types";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Random Gorsey",
  description: "Explore Random Gorsey's latest music and posts.",
  path: "/",
});

export default function HomeRoute() {
  const initialPosts = posts.slice(0, 7);
  const archive: Array<
    Pick<Post, "id" | "title" | "timestamp" | "category">
  > = posts.map(({ id, title, timestamp, category }) => ({
    id,
    title,
    timestamp,
    category,
  }));

  return (
    <Home
      posts={initialPosts}
      archive={archive}
      totalPosts={posts.length}
    />
  );
}
