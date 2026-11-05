export type PostCategory =
  | "studio"
  | "playlist"
  | "scene"
  | "release"
  | "field-recording"
  | "recommendation";

export const categoryLabels: Record<PostCategory, string> = {
  studio: "STUDIO",
  playlist: "PLAYLIST",
  scene: "SCENE",
  release: "RELEASE",
  "field-recording": "FIELD RECORDING",
  recommendation: "RECOMMENDATION",
};

export enum PostContentType {
  TEXT = "text",
  IMAGE = "image",
  VIDEO = "video",
  AUDIO = "audio",
  LINK = "link",
  PLAYLIST = "playlist",
}

export interface Post {
  id: number;
  title: string;
  timestamp: string;
  contentType: PostContentType | string;
  body: string;
  media?: string;
  mediaWidth?: number;
  mediaHeight?: number;
  avatarColor?: string;
  author: string;
  excerpt?: string;
  category?: PostCategory;
  tags?: string[];
  featured?: boolean;
  views?: number;
  likes?: number;
}

export type PostLink = Pick<Post, "id" | "title">;
