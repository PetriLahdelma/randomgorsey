import type { Metadata } from "next";

import Discography from "@/site/Discography";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Discography",
  description: "Browse the official releases from Random Gorsey.",
  path: "/discography/",
});

export default function DiscographyRoute() {
  return <Discography />;
}
