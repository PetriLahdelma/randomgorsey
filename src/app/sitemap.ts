import type { MetadataRoute } from "next";

import { SITE_ORIGIN } from "@/config/site";
import posts from "@/content/posts";

const CORE_ROUTES = ["", "about", "contact", "discography", "gallery", "listen"] as const;

const canonicalUrl = (path: string): string =>
  path.length === 0 ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}/${path}/`;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...CORE_ROUTES.map((path) => ({ url: canonicalUrl(path) })),
    ...posts.map((post) => ({ url: canonicalUrl(`posts/${post.id}`) })),
  ];
}
