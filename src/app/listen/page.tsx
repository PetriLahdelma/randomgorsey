import type { Metadata } from "next";

import Listen from "@/site/Listen";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Listen",
  description: "Stream songs and playlists from Random Gorsey.",
  path: "/listen/",
});

export default function ListenRoute() {
  return <Listen />;
}
