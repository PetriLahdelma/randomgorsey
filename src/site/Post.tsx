"use client";

import React from "react";
import Link from "next/link";
import { motion, pageVariants } from "@/lib/motion";
import PostCard from "../components/PostCard";
import { getPostById, getAdjacentPosts } from "../posts";
import NotFound from "./NotFound";
import { Container } from "@/components/layout/Container";
import { VideoBackground } from "@/components/effects";

const homeCanvasVideo = "/videos/home_canvas.webm";

interface PostProps {
  postId: number;
}

const Post: React.FC<PostProps> = ({ postId }) => {
  const post = Number.isFinite(postId) ? getPostById(postId) : undefined;

  if (!post) {
    return <NotFound />;
  }

  const { prev, next } = getAdjacentPosts(postId);

  return (
    <>
      <VideoBackground
        src={homeCanvasVideo}
        poster="/images/home-poster.jpg"
        overlayOpacity={0.3}
      />

      <motion.div
        className="relative z-10 min-h-screen text-white"
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Container size="sm" padding="md" className="py-6">
          <Link
            href="/"
            className="font-mono-label text-sm text-neutral-400 no-underline transition-colors hover:text-foreground"
          >
            &larr; Back to home
          </Link>

          <div className="mt-6">
            <PostCard
              post={post}
              headingLevel={1}
              truncateLength={Number.MAX_SAFE_INTEGER}
              showFullContent={true}
            />
          </div>

          <nav className="mt-8 flex items-start justify-between gap-4">
            <div className="flex-1">
              {prev && (
                <Link
                  href={`/posts/${prev.id}`}
                  className="font-mono-label text-sm text-neutral-400 no-underline transition-colors hover:text-accent"
                >
                  &larr; {prev.title}
                </Link>
              )}
            </div>
            <div className="flex-1 text-right">
              {next && (
                <Link
                  href={`/posts/${next.id}`}
                  className="font-mono-label text-sm text-neutral-400 no-underline transition-colors hover:text-accent"
                >
                  {next.title} &rarr;
                </Link>
              )}
            </div>
          </nav>
        </Container>
      </motion.div>
    </>
  );
};

export default Post;
