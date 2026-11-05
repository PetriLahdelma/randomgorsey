export type PlatformId = "spotify" | "soundcloud" | "bandcamp";

export interface PlatformLink {
  id: PlatformId;
  label: string;
  href: string;
}

export const platformLinks: PlatformLink[] = [
  { id: "spotify", label: "Spotify", href: "https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q" },
  { id: "soundcloud", label: "SoundCloud", href: "https://soundcloud.com/randomgorsey" },
  { id: "bandcamp", label: "Bandcamp", href: "https://randomgorsey.bandcamp.com" },
];

export const spotifyEmbedUrl =
  "https://open.spotify.com/embed/artist/54Vv9rlCqX2nW2V0tXw33q?utm_source=generator";
export const soundcloudPlaylistUrl = "https://soundcloud.com/randomgorsey/sets/tuunz";
export const soundcloudEmbedUrl =
  "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/2029288998&color=%23d7ff44&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true";
