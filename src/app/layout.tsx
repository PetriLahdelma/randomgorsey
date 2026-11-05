import type { Metadata } from "next";

import AppShell from "@/components/AppShell";
import Footer from "@/patterns/Footer";
import { siteMetadata, socialImage } from "@/lib/seo";
import {
  artistStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";
import { GeistPixelSquare } from "geist/font/pixel";
import { version } from "../../package.json";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteMetadata.metadataBase,
  title: {
    default: siteMetadata.name,
    template: `%s | ${siteMetadata.name}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.name,
    description: siteMetadata.description,
    siteName: siteMetadata.name,
    type: "website",
    images: [socialImage],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.name,
    description: siteMetadata.description,
    images: [socialImage.url],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ backgroundColor: "#0a0a0a" }}>
      <body
        className={`${GeistPixelSquare.variable}`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(artistStructuredData),
          }}
        />
        <AppShell footer={<Footer />} version={version}>{children}</AppShell>
      </body>
    </html>
  );
}
