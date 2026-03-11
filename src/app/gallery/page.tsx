import type { Metadata } from "next";

import Gallery from "@/site/Gallery";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Gallery",
  description: "Photo gallery featuring Random Gorsey visuals.",
  path: "/gallery/",
});

export default function GalleryRoute() {
  return <Gallery />;
}
