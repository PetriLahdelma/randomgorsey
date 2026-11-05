import { SITE_ORIGIN, toAbsoluteSiteUrl } from "@/config/site";
import { platformLinks } from "@/content/platforms";
import { releases } from "@/content/releases";

const ARTIST_ID = `${SITE_ORIGIN}/#artist`;

const artistNode = {
  "@type": "Person",
  "@id": ARTIST_ID,
  name: "Random Gorsey",
  url: `${SITE_ORIGIN}/`,
  image: toAbsoluteSiteUrl("/images/portrait.jpg"),
  sameAs: platformLinks.map(({ href }) => href),
} as const;

export const artistStructuredData = {
  "@context": "https://schema.org",
  ...artistNode,
} as const;

const artistReference = { "@id": ARTIST_ID } as const;

const releaseIdentifier = (catalog: string) => ({
  "@type": "PropertyValue",
  propertyID: "Catalog number",
  value: catalog,
});

const releaseImage = (image: string) => toAbsoluteSiteUrl(image);

const [single, ep] = releases;

const singleStructuredData = {
  "@type": "MusicRecording",
  "@id": `${SITE_ORIGIN}/discography/#${single.id}`,
  name: single.title,
  url: single.bandcamp,
  image: releaseImage(single.image),
  byArtist: artistReference,
  identifier: releaseIdentifier(single.catalog),
} as const;

const epId = `${SITE_ORIGIN}/discography/#${ep.id}`;

const epStructuredData = {
  "@type": "MusicAlbum",
  "@id": epId,
  name: ep.title,
  url: ep.bandcamp,
  image: releaseImage(ep.image),
  byArtist: artistReference,
  identifier: releaseIdentifier(ep.catalog),
  track: (ep.tracks ?? []).map((track, index) => ({
    "@type": "MusicRecording",
    "@id": `${epId}/track/${index + 1}`,
    name: track,
    byArtist: artistReference,
    inAlbum: { "@id": epId },
    position: index + 1,
  })),
} as const;

export const discographyStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    artistNode,
    singleStructuredData,
    epStructuredData,
    {
      "@type": "ItemList",
      "@id": `${SITE_ORIGIN}/discography/#releases`,
      name: "Random Gorsey discography",
      numberOfItems: releases.length,
      itemListElement: [singleStructuredData, epStructuredData].map(
        (item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: { "@id": item["@id"] },
        })
      ),
    },
  ],
} as const;

/**
 * JSON-LD is embedded in a script element. Escape characters that can end or
 * alter that element while retaining valid JSON for structured-data parsers.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}
