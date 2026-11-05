export interface Release {
  id: string;
  title: string;
  catalog: string;
  year: number;
  image: string;
  bandcamp: string;
  spotify?: string;
  tracks?: string[];
}

export const releases: Release[] = [
  {
    id: "so-long-spectrum",
    title: "So Long Spectrum",
    catalog: "FIRGO2100004",
    year: 2021,
    image: "/images/so-long-spectrum-cover.jpg",
    bandcamp: "https://randomgorsey.bandcamp.com/track/so-long-spectrum",
    spotify: "https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q",
    tracks: ["So long spectrum"],
  },
  {
    id: "customer-is-always-right",
    title: "The Customer is Always Right EP",
    catalog: "RDGY 01",
    year: 2021,
    image: "/images/customerisalwaysright.jpg",
    bandcamp: "https://randomgorsey.bandcamp.com/album/the-customer-is-always-right",
    spotify: "https://open.spotify.com/artist/54Vv9rlCqX2nW2V0tXw33q",
    tracks: ["Chillax Karen", "The Customer is Always Right", "Fuck Face Masks"],
  },
];
