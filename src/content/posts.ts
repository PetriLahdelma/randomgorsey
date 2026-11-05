import feb2025 from "../posts/2025-02";
import mar2025 from "../posts/2025-03";
import apr2025 from "../posts/2025-04";
import may2025 from "../posts/2025-05";
import jun2025 from "../posts/2025-06";
import jul2025 from "../posts/2025-07";
import aug2025 from "../posts/2025-08";
import sep2025 from "../posts/2025-09";
import oct2025 from "../posts/2025-10";
import nov2025 from "../posts/2025-11";
import dec2025 from "../posts/2025-12";
import jan2026 from "../posts/2026-01";
import feb2026 from "../posts/2026-02";
import mar2026 from "../posts/2026-03";
import apr2026 from "../posts/2026-04";
import may2026 from "../posts/2026-05";
import jul2026 from "../posts/2026-07";
import aug2026 from "../posts/2026-08";
import sep2026 from "../posts/2026-09";
import oct2026 from "../posts/2026-10";
import nov2026 from "../posts/2026-11";
import type { Post } from "./post-types";

export {
  categoryLabels,
  PostContentType,
} from "./post-types";
export type { Post, PostCategory, PostLink } from "./post-types";

const posts: Post[] = [
  ...feb2025,
  ...mar2025,
  ...apr2025,
  ...may2025,
  ...jun2025,
  ...jul2025,
  ...aug2025,
  ...sep2025,
  ...oct2025,
  ...nov2025,
  ...dec2025,
  ...jan2026,
  ...feb2026,
  ...mar2026,
  ...apr2026,
  ...may2026,
  ...jul2026,
  ...aug2026,
  ...sep2026,
  ...oct2026,
  ...nov2026,
].sort(
  (a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
);

export const getPostById = (id: number): Post | undefined =>
  posts.find((post) => post.id === id);

export const getAdjacentPosts = (
  id: number
): { prev: Post | undefined; next: Post | undefined } => {
  const index = posts.findIndex((post) => post.id === id);
  if (index === -1) return { prev: undefined, next: undefined };

  return {
    prev: index > 0 ? posts[index - 1] : undefined,
    next: index < posts.length - 1 ? posts[index + 1] : undefined,
  };
};

export default posts;
