import type { Metadata } from "next";

import Contact from "@/site/Contact";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: "Send a message to Random Gorsey.",
  path: "/contact/",
});

export default function ContactRoute() {
  return <Contact />;
}
