import {
  platformLinks,
  soundcloudEmbedUrl,
  soundcloudPlaylistUrl,
  spotifyEmbedUrl,
  type PlatformId,
} from "@/content/platforms";

export type EmbedProvider = Extract<PlatformId, "spotify" | "soundcloud">;

export const playerDetails: Record<
  EmbedProvider,
  {
    label: string;
    src: string;
    title: string;
    height: number;
    frameHeight: number;
    directHref: string;
    allow: string;
  }
> = {
  spotify: {
    label: "Spotify",
    src: spotifyEmbedUrl,
    title: "Spotify player",
    height: 352,
    frameHeight: 368,
    directHref: platformLinks.find((platform) => platform.id === "spotify")!.href,
    allow: "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture",
  },
  soundcloud: {
    label: "SoundCloud",
    src: soundcloudEmbedUrl,
    title: "SoundCloud player",
    height: 300,
    frameHeight: 304,
    directHref: soundcloudPlaylistUrl,
    allow: "autoplay",
  },
};
