import type { Metadata } from "next";

import Home from "@/site/Home";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Random Gorsey",
  description: "Explore Random Gorsey's latest music and posts.",
  path: "/",
});

export default function HomeRoute() {
  return <Home />;
}
