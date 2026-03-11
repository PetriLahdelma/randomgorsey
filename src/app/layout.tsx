import type { Metadata } from "next";

import AppShell from "@/components/AppShell";
import { siteMetadata } from "@/lib/seo";
import {
  GeistPixelSquare,
  GeistPixelGrid,
  GeistPixelCircle,
  GeistPixelTriangle,
  GeistPixelLine,
} from "geist/font/pixel";

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
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.name,
    description: siteMetadata.description,
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
        className={`${GeistPixelSquare.variable} ${GeistPixelGrid.variable} ${GeistPixelCircle.variable} ${GeistPixelTriangle.variable} ${GeistPixelLine.variable}`}
      >
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
