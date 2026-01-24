import { Post } from "../components/PostCard";
import FirstPost from "./FirstPost";
import RandomRecommends from "./RandomRecommends";

const posts: Post[] = [FirstPost, RandomRecommends];

export const getPostById = (id: number): Post | undefined =>
  posts.find((post) => post.id === id);

export default posts;
