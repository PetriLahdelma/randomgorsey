import type { Meta, StoryObj } from "@storybook/react";

import { StudioPageHeader } from "@/components/studio/StudioPageHeader";
import galleryImages from "@/data/galleryImages";

const meta = {
  title: "Studio/Page Header",
  component: StudioPageHeader,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(58rem, 100%)" }}>
        <Story />
      </div>
    ),
  ],
  args: {
    kicker: "External playback",
    title: "Listen",
    lead: "Recordings & selections.",
  },
} satisfies Meta<typeof StudioPageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Listen: Story = {};

export const Discography: Story = {
  args: {
    kicker: "Selected recordings / 2021",
    title: "Discography",
    lead: "Two documents from the catalog. Artwork, tracklists and original platform destinations.",
  },
};

export const Gallery: Story = {
  args: {
    kicker: `${galleryImages.length} images / Helsinki & Berlin`,
    title: "Gallery",
    lead: "Covers, rooms, lights, weather and the things that survived the night.",
  },
};

export const About: Story = {
  args: {
    kicker: "Helsinki / producer / DJ",
    title: "About",
    lead: "The work is the introduction. A few facts sit beside it.",
  },
};

export const Mobile: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};
