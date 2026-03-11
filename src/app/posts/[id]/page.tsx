import type { Metadata } from "next";
import { notFound } from "next/navigation";

import Post from "@/site/Post";
import posts, { getPostById } from "@/posts";
import { createMetadata } from "@/lib/seo";

type PostPageProps = {
  params: Promise<{ id: string }>;
};

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

export async function generateStaticParams() {
  return posts.map((post) => ({
    id: String(post.id),
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { id } = await params;
  const postId = Number(id);
  const post = Number.isFinite(postId) ? getPostById(postId) : undefined;

  if (!post) {
    return createMetadata({
      title: "404 - Page Not Found",
      description: "The page you requested could not be found.",
      path: "/",
    });
  }

  const description = post.excerpt || stripHtml(post.body).slice(0, 160);

  return createMetadata({
    title: post.title,
    description,
    path: `/posts/${post.id}/`,
    type: "article",
  });
}

export default async function PostRoute({ params }: PostPageProps) {
  const { id } = await params;
  const postId = Number(id);

  if (!Number.isFinite(postId) || !getPostById(postId)) {
    notFound();
  }

  return <Post postId={postId} />;
}
