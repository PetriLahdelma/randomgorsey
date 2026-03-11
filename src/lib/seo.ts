import type { Metadata } from "next";

import { SITE_ORIGIN } from "@/config/site";

interface CreateMetadataOptions {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}

export const siteMetadata = {
  name: "Random Gorsey",
  description: "Explore Random Gorsey's latest music and posts.",
  metadataBase: new URL(SITE_ORIGIN),
};

export function createMetadata({
  title,
  description,
  path,
  type = "website",
}: CreateMetadataOptions): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteMetadata.name,
      type,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
