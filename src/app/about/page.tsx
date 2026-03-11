import type { Metadata } from "next";

import About from "@/site/About";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "About",
  description: "Helsinki-based electronic music producer making warm, nostalgic lo-fi house. Soulful chords, minimalist grooves.",
  path: "/about/",
});

export default function AboutRoute() {
  return <About />;
}
