"use client";

import React from "react";

import { cn } from "@/lib/utils";

type EmbedDescriptor = {
  embedUrl: string;
  fallbackUrl: string;
  height: number;
  provider: "SoundCloud" | "Spotify";
  title: string;
};

type BodyPart =
  | { type: "html"; html: string }
  | { type: "embed"; embed: EmbedDescriptor };

export interface DeferredPostBodyProps {
  className?: string;
  html: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const IFRAME_PATTERN = /<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi;
const ATTRIBUTE_PATTERN = /([\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;

function getAttributes(markup: string): Record<string, string> {
  const attributes: Record<string, string> = {};

  for (const match of markup.matchAll(ATTRIBUTE_PATTERN)) {
    attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? "";
  }

  return attributes;
}

function describeEmbed(markup: string): EmbedDescriptor | null {
  const attributes = getAttributes(markup);

  try {
    const embedUrl = new URL(attributes.src);
    const height = Math.min(420, Math.max(120, Number(attributes.height) || 166));
    const title = attributes.title || "External audio player";

    if (embedUrl.hostname === "w.soundcloud.com") {
      const encodedTrackUrl = embedUrl.searchParams.get("url");
      let fallbackUrl = "https://soundcloud.com/randomgorsey";

      if (encodedTrackUrl) {
        const candidate = new URL(encodedTrackUrl);
        if (
          candidate.protocol === "https:" &&
          (candidate.hostname === "soundcloud.com" ||
            candidate.hostname.endsWith(".soundcloud.com"))
        ) {
          fallbackUrl = candidate.toString();
        }
      }

      return {
        embedUrl: embedUrl.toString(),
        fallbackUrl,
        height,
        provider: "SoundCloud",
        title,
      };
    }

    if (embedUrl.hostname === "open.spotify.com") {
      const fallbackUrl = new URL(
        embedUrl.pathname.replace("/embed/", "/"),
        embedUrl.origin
      );

      return {
        embedUrl: embedUrl.toString(),
        fallbackUrl: fallbackUrl.toString(),
        height,
        provider: "Spotify",
        title,
      };
    }
  } catch {
    return null;
  }

  return null;
}

function splitBody(html: string): BodyPart[] {
  const parts: BodyPart[] = [];
  let cursor = 0;

  for (const match of html.matchAll(IFRAME_PATTERN)) {
    const index = match.index ?? 0;
    const before = html.slice(cursor, index);
    if (before) parts.push({ type: "html", html: before });

    const embed = describeEmbed(match[0]);
    if (embed) {
      parts.push({ type: "embed", embed });
    } else {
      parts.push({
        type: "html",
        html:
          '<p><strong>External media is unavailable.</strong> The original post text is unchanged.</p>',
      });
    }

    cursor = index + match[0].length;
  }

  const after = html.slice(cursor);
  if (after) parts.push({ type: "html", html: after });

  return parts;
}

const DeferredPostBody = React.forwardRef<HTMLDivElement, DeferredPostBodyProps>(
  ({ className, html, onClick }, ref) => {
    const parts = React.useMemo(() => splitBody(html), [html]);
    const [activeEmbedIndex, setActiveEmbedIndex] = React.useState<number | null>(
      null
    );

    React.useEffect(() => {
      setActiveEmbedIndex(null);
    }, [html]);

    return (
      <div ref={ref} className={className} onClick={onClick}>
        {parts.map((part, index) => {
          if (part.type === "html") {
            return (
              <div
                key={`html-${index}`}
                className="postBodySegment"
                dangerouslySetInnerHTML={{ __html: part.html }}
              />
            );
          }

          const { embed } = part;
          const loaded = activeEmbedIndex === index;

          return (
            <section
              key={`embed-${index}`}
              className="my-6 border-2 border-black bg-[var(--studio-paper,#f0f0e6)] p-3 text-black shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#777]"
              aria-label={embed.title}
            >
              {loaded && (
                <div className={embed.provider === "Spotify" ? "studioPlayerViewport studioSquarePlayer" : "studioPlayerViewport"} style={{ "--player-height": `${embed.height}px` } as React.CSSProperties}>
                <iframe
                  title={embed.title}
                  src={embed.embedUrl}
                  width="100%"
                  height={embed.height}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="block w-full border-0 bg-white"
                />
                </div>
              )}
              <div className={cn(
                "flex flex-wrap items-center justify-between gap-3",
                loaded && "mt-3"
              )}>
                <div>
                  <strong className="block font-mono-label text-sm">
                    {embed.provider} player
                  </strong>
                  <span className="text-sm">{embed.title}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={cn(
                      "min-h-11 border-2 border-black bg-[var(--studio-gray,#d8d9d2)] px-4 py-2",
                      "font-mono-label text-sm shadow-[inset_1px_1px_0_#fff,inset_-1px_-1px_0_#777]",
                      "active:shadow-[inset_1px_1px_0_#777,inset_-1px_-1px_0_#fff]"
                    )}
                    onClick={() => setActiveEmbedIndex(loaded ? null : index)}
                  >
                    {loaded ? "Close player" : `Load ${embed.provider}`}
                  </button>
                  <a
                    href={embed.fallbackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-11 border-2 border-black px-4 py-2 font-mono-label text-sm text-black underline"
                  >
                    Open on {embed.provider}
                  </a>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    );
  }
);

DeferredPostBody.displayName = "DeferredPostBody";

export default DeferredPostBody;
