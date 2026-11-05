import type { Metadata } from "next";

import Discography from "@/site/Discography";
import { createMetadata } from "@/lib/seo";
import {
  discographyStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";

export const metadata: Metadata = createMetadata({
  title: "Discography",
  description: "Browse the official releases from Random Gorsey.",
  path: "/discography/",
});

export default function DiscographyRoute() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(discographyStructuredData),
        }}
      />
      <Discography />
    </>
  );
}
