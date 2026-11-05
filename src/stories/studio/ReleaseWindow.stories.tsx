import type { Meta, StoryObj } from "@storybook/react";
import Image from "next/image";
import { StudioWindow } from "@/components/studio/StudioWindow";
import { releases } from "@/content/releases";
import styles from "./StorySurface.module.css";

const release = releases[0];

function ReleaseWindow() {
  return (
    <StudioWindow
      title={release.title + " · " + release.catalog}
      tone="paper"
      actions={<span>{release.year}</span>}
    >
      <div className={styles.releaseLayout}>
        <Image
          src={release.image}
          alt={release.title + " cover artwork"}
          width={1440}
          height={617}
          sizes="(max-width: 700px) 90vw, 680px"
          style={{ width: "100%", height: "auto" }}
        />
        <div>
          <p className="studioMeta">
            {release.catalog} · {release.year}
          </p>
          <h2 style={{ textTransform: "none" }}>{release.title}</h2>
          <ol style={{ paddingLeft: "1.25rem", lineHeight: 1.7 }}>
            {release.tracks?.map((track) => <li key={track}>{track}</li>)}
          </ol>
          <div className="studioPlatformLinks">
            <a className="studioLink" href={release.bandcamp}>
              Bandcamp
            </a>
            {release.spotify && (
              <a className="studioLink" href={release.spotify}>
                Spotify
              </a>
            )}
          </div>
        </div>
      </div>
    </StudioWindow>
  );
}

const meta = {
  title: "Studio/Compositions/Release",
  component: ReleaseWindow,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(1120px, 100%)", margin: "0 auto" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ReleaseWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CatalogSurface: Story = {};
