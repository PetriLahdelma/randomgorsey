import Link from "next/link";

import PostCard from "@/components/PostCard";
import { StudioWindow } from "@/components/studio/StudioWindow";
import type { Post as PostRecord, PostLink } from "@/content/post-types";

interface PostProps {
  post: PostRecord;
  previous?: PostLink;
  next?: PostLink;
}

const Post = ({ post, previous, next }: PostProps) => (
  <div className="studioPage studioArticle">
    <div className="studioPageHeader">
      <Link href="/" className="studioLink">
        &larr; Journal
      </Link>
      <p className="studioKicker">Archive entry {String(post.id).padStart(2, "0")}</p>
    </div>

    <StudioWindow title="Random Gorsey / Journal" tone="paper">
      <PostCard
        post={post}
        headingLevel={1}
        truncateLength={Number.MAX_SAFE_INTEGER}
        showFullContent
        className="m-0 border-0 bg-transparent p-0 text-black hover:bg-transparent"
      />
    </StudioWindow>

    <nav className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Adjacent journal entries">
      <div>
        {previous && (
          <Link href={`/posts/${previous.id}/`} className="studioLink">
            &larr; {previous.title}
          </Link>
        )}
      </div>
      <div className="sm:text-right">
        {next && (
          <Link href={`/posts/${next.id}/`} className="studioLink">
            {next.title} &rarr;
          </Link>
        )}
      </div>
    </nav>
  </div>
);

export default Post;
