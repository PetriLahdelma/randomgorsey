import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion, pageVariants } from "@/lib/motion";
import PageMeta from "../components/PageMeta";
import PostCard from "../components/PostCard";
import { getPostById } from "../posts";
import NotFound from "./NotFound";
import { Container } from "@/components/layout/Container";
import { Stack } from "@/components/layout/Stack";
import Button from "../components/Button";
import { VideoBackground } from "@/components/effects";
import homeCanvasVideo from "../videos/home_canvas.webm";

const stripHtml = (value: string) =>
  value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const Post: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const post = Number.isFinite(postId) ? getPostById(postId) : undefined;

  if (!post) {
    return <NotFound />;
  }

  const description =
    post.excerpt || stripHtml(post.body).slice(0, 160);

  return (
    <>
      <PageMeta
        title={`${post.title} | Random Gorsey`}
        description={description}
        path={`/posts/${post.id}`}
      />

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
          <Stack gap="lg">
            <div className="flex justify-start">
              <Link to="/">
                <Button
                  variant="secondary"
                  className="border border-white/50"
                  aria-label="Back to home"
                >
                  Back to Home
                </Button>
              </Link>
            </div>

            <PostCard
              post={post}
              headingLevel={1}
              truncateLength={Number.MAX_SAFE_INTEGER}
            />
          </Stack>
        </Container>
      </motion.div>
    </>
  );
};

export default Post;
