import { SITE_ORIGIN, toAbsoluteSiteUrl } from "@/config/site";
import { biography, projects } from "@/content/artist";
import { platformLinks, soundcloudPlaylistUrl } from "@/content/platforms";
import posts, { categoryLabels, getPostById } from "@/content/posts";
import { releases } from "@/content/releases";
import galleryImages from "@/data/galleryImages";

export interface AgentDocument {
  title: string;
  markdown: string;
}

const CORE_PATHS = [
  "/",
  "/listen/",
  "/discography/",
  "/about/",
  "/gallery/",
  "/contact/",
] as const;

const decodeEntities = (value: string): string =>
  value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&nbsp;", " ");

const readAttribute = (markup: string, name: string): string | undefined => {
  const match = markup.match(
    new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "i")
  );
  return match?.[1] ?? match?.[2];
};

const providerUrl = (iframe: string): string | undefined => {
  const src = readAttribute(iframe, "src");
  if (!src) return undefined;

  try {
    const url = new URL(decodeEntities(src));
    if (url.hostname === "open.spotify.com") {
      return `${url.origin}${url.pathname.replace("/embed/", "/")}`;
    }
    if (url.hostname === "w.soundcloud.com") {
      const target = url.searchParams.get("url");
      if (!target) return undefined;
      const decoded = new URL(target);
      if (
        decoded.protocol === "https:" &&
        (decoded.hostname === "soundcloud.com" ||
          decoded.hostname.endsWith(".soundcloud.com"))
      ) {
        return decoded.toString();
      }
    }
  } catch {
    return undefined;
  }

  return undefined;
};

export const htmlToMarkdown = (html: string): string => {
  let output = html.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, (iframe) => {
    const title = decodeEntities(readAttribute(iframe, "title") ?? "External media");
    const href = providerUrl(iframe);
    return href ? `\n\n[${title}](${href})\n\n` : "";
  });

  output = output
    .replace(/<strong\b[^>]*>([\s\S]*?)<\/strong>/gi, "**$1**")
    .replace(/<em\b[^>]*>([\s\S]*?)<\/em>/gi, "*$1*")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<p\b[^>]*>/gi, "")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "");

  return decodeEntities(output)
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const document = (
  title: string,
  path: string,
  body: string,
  description?: string
): AgentDocument => ({
  title,
  markdown: [
    `# ${title}`,
    "",
    description ? `> ${description}` : undefined,
    description ? "" : undefined,
    `Canonical URL: ${toAbsoluteSiteUrl(path)}`,
    "",
    body.trim(),
  ]
    .filter((line): line is string => line !== undefined)
    .join("\n")
    .trim()
    .concat("\n"),
});

const renderPlatformLinks = (): string =>
  platformLinks
    .map((platform) => `- [${platform.label}](${platform.href})`)
    .join("\n");

const renderRelease = (release: (typeof releases)[number]): string => {
  const links = [
    `- [Bandcamp](${release.bandcamp})`,
    release.spotify ? `- [Spotify](${release.spotify})` : undefined,
  ].filter((link): link is string => Boolean(link));

  return [
    `## ${release.title}`,
    "",
    `Catalog: ${release.catalog}`,
    `Year: ${release.year}`,
    "",
    ...(release.tracks
      ? ["### Tracklist", "", ...release.tracks.map((track, index) => `${index + 1}. ${track}`), ""]
      : []),
    "### Release links",
    "",
    ...links,
  ].join("\n");
};

const renderPost = (id: number): AgentDocument | null => {
  const post = getPostById(id);
  if (!post) return null;

  const metadata = [
    `Published: ${post.timestamp}`,
    `Author: ${post.author}`,
    post.category ? `Category: ${categoryLabels[post.category]}` : undefined,
    post.tags?.length ? `Tags: ${post.tags.join(", ")}` : undefined,
  ].filter((line): line is string => Boolean(line));

  const media =
    post.media && !post.body.includes(post.media)
      ? `\n\nMedia: ${toAbsoluteSiteUrl(post.media)}`
      : "";

  return document(
    post.title,
    `/posts/${post.id}/`,
    `${metadata.join("\n")}\n\n${htmlToMarkdown(post.body)}${media}`,
    post.excerpt
  );
};

export function getAgentDocument(pathname: string): AgentDocument | null {
  const normalized = pathname === "/" ? "/" : `/${pathname.replace(/^\/+|\/+$/g, "")}/`;
  const postMatch = normalized.match(/^\/posts\/(\d+)\/$/);
  if (postMatch) return renderPost(Number(postMatch[1]));

  if (normalized === "/") {
    const latest = posts.slice(0, 7).map((post) =>
      `- [${post.title}](${toAbsoluteSiteUrl(`/posts/${post.id}/`)}) — ${post.timestamp}`
    );
    return document(
      "Random Gorsey",
      "/",
      [
        "## Music",
        "",
        renderPlatformLinks(),
        "",
        "## Journal",
        "",
        ...latest,
        "",
        `Browse all ${posts.length} entries in [the full archive](${toAbsoluteSiteUrl("/llms-full.txt")}).`,
      ].join("\n"),
      "Helsinki-based producer Random Gorsey. Music, selected releases, journal, images and contact information."
    );
  }

  if (normalized === "/listen/") {
    return document(
      "Listen",
      normalized,
      `${renderPlatformLinks()}\n- [SoundCloud playlist: Tuunz](${soundcloudPlaylistUrl})`,
      "Official playback destinations for Random Gorsey. Third-party players load only after a visitor chooses a source."
    );
  }

  if (normalized === "/discography/") {
    return document(
      "Discography",
      normalized,
      releases.map(renderRelease).join("\n\n"),
      "Selected Random Gorsey releases, factual catalog data, tracklists and official destinations."
    );
  }

  if (normalized === "/about/") {
    const aliases = projects.map((project) => `- [${project.text}](${project.href})`).join("\n");
    return document(
      "About Random Gorsey",
      normalized,
      `${biography.join("\n\n")}\n\nbitmap attachment: [SIGNATURE.JPG](${toAbsoluteSiteUrl("/images/signature-sharp.png")})\n\n## Other projects\n\n${aliases}`,
      "Biography and selected aliases."
    );
  }

  if (normalized === "/gallery/") {
    const images = galleryImages.map((image) =>
      `- [${image.caption}](${toAbsoluteSiteUrl(image.src)}) — ${image.width}×${image.height}`
    );
    return document(
      "Gallery",
      normalized,
      images.join("\n"),
      `${galleryImages.length} images from the Random Gorsey archive.`
    );
  }

  if (normalized === "/contact/") {
    return document(
      "Contact Random Gorsey",
      normalized,
      [
        "The contact page has inquiry paths for booking and events, collaboration, and messages.",
        "",
        "The contact form is available on the website. It is not exposed by the site's read-only posts API. This document does not promise a response time.",
        "",
        `- [Instagram](https://www.instagram.com/randomgorsey/)`,
        `- [SoundCloud](https://soundcloud.com/randomgorsey)`,
      ].join("\n"),
      "Human-facing booking, collaboration and message form."
    );
  }

  return null;
}

export function renderLlmsIndex(): string {
  return [
    "# Random Gorsey",
    "",
    "> Official music, releases, journal, images and contact information for Helsinki-based producer Random Gorsey.",
    "",
    "## Primary resources",
    "",
    `- [Listen](${toAbsoluteSiteUrl("/listen/")}): official platform destinations and playlist.`,
    `- [Discography](${toAbsoluteSiteUrl("/discography/")}): releases, catalog data and tracklists.`,
    `- [Journal](${toAbsoluteSiteUrl("/#journal")}): ${posts.length} authored entries.`,
    `- [About](${toAbsoluteSiteUrl("/about/")}): biography and selected aliases.`,
    `- [Gallery](${toAbsoluteSiteUrl("/gallery/")}): ${galleryImages.length} captioned images.`,
    `- [Contact](${toAbsoluteSiteUrl("/contact/")}): human-facing inquiry form and direct profiles.`,
    "",
    "## Machine-readable resources",
    "",
    `- [Complete site content](${toAbsoluteSiteUrl("/llms-full.txt")})`,
    `- [Sitemap](${toAbsoluteSiteUrl("/sitemap.xml")})`,
    `- [Read-only journal API](${toAbsoluteSiteUrl("/api/posts/")})`,
    `- [Read-only MCP server card](${toAbsoluteSiteUrl("/mcp/server-card/")})`,
    "",
    "Content policy: AI search, retrieval and user-requested summaries are permitted. Model training is not permitted.",
    "",
  ].join("\n");
}

export function renderLlmsFull(): string {
  const sections = [
    ...CORE_PATHS.map((path) => getAgentDocument(path)),
    ...posts.map((post) => getAgentDocument(`/posts/${post.id}/`)),
  ].filter((entry): entry is AgentDocument => Boolean(entry));

  return [
    "# Random Gorsey — Complete Site Content",
    "",
    `> ${sections.length} canonical documents generated from the same content records used by the website.`,
    "",
    "Content policy: AI search, retrieval and user-requested summaries are permitted. Model training is not permitted.",
    "",
    sections.map((entry) => entry.markdown.trim()).join("\n\n---\n\n"),
    "",
  ].join("\n");
}

export const AGENT_DOCUMENT_PATHS = [
  ...CORE_PATHS,
  ...posts.map((post) => `/posts/${post.id}/`),
] as const;

export const AGENT_DOCUMENT_COUNT = AGENT_DOCUMENT_PATHS.length;
export { SITE_ORIGIN };
