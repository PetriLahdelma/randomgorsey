import { describe, expect, it } from "vitest";

import { platformLinks } from "@/content/platforms";
import { releases } from "@/content/releases";
import {
  artistStructuredData,
  discographyStructuredData,
  serializeJsonLd,
} from "./structured-data";

describe("structured data", () => {
  it("describes the artist only with verified public identities", () => {
    expect(artistStructuredData).toMatchObject({
      "@type": "Person",
      "@id": "https://randomgorsey.com/#artist",
      name: "Random Gorsey",
      url: "https://randomgorsey.com/",
      image: "https://randomgorsey.com/images/portrait.jpg",
      sameAs: platformLinks.map(({ href }) => href),
    });
    expect(JSON.stringify(artistStructuredData)).not.toContain("Organization");
  });

  it("maps the verified single, EP, and track list without invented releases", () => {
    const graph = discographyStructuredData["@graph"];
    const recording = graph.find((node) => node["@type"] === "MusicRecording");
    const album = graph.find((node) => node["@type"] === "MusicAlbum");
    const itemList = graph.find((node) => node["@type"] === "ItemList");

    expect(recording).toMatchObject({
      name: releases[0].title,
      url: releases[0].bandcamp,
    });
    expect(album).toMatchObject({
      name: releases[1].title,
      url: releases[1].bandcamp,
    });
    expect(recording).not.toHaveProperty("copyrightYear");
    expect(album).not.toHaveProperty("copyrightYear");
    expect(recording).not.toHaveProperty("datePublished");
    expect(album).not.toHaveProperty("datePublished");
    expect("track" in album! && album.track.map(({ name }) => name)).toEqual(
      releases[1].tracks
    );
    expect(itemList).toMatchObject({ numberOfItems: releases.length });
  });

  it("escapes script-breaking characters while staying parseable JSON", () => {
    const serialized = serializeJsonLd({
      text: "</script><script>alert('x')</script>&\u2028\u2029",
    });

    expect(serialized).not.toContain("<");
    expect(serialized).not.toContain(">");
    expect(serialized).not.toContain("&");
    expect(JSON.parse(serialized)).toEqual({
      text: "</script><script>alert('x')</script>&\u2028\u2029",
    });
  });
});
