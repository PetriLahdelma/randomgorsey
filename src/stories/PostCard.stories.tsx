import type { Meta, StoryObj } from "@storybook/react";
import PostCard from "../components/PostCard";
import posts from "@/content/posts";
import { PerformanceProvider } from "@/lib/performance";

const featuredPost = posts[0];
const compactPost = posts[1];

const meta: Meta<typeof PostCard> = {
  title: "Production/Journal/PostCard",
  component: PostCard,
  decorators: [
    (Story) => (
      <PerformanceProvider>
        <div className="studioJournal" style={{ maxWidth: 780, margin: "0 auto" }}><Story /></div>
      </PerformanceProvider>
    ),
  ],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const LatestEntry: Story = {
  args: {
    post: featuredPost,
    headingLevel: 3,
    showFullContent: true,
  },
};

export const CollapsedEntry: Story = {
  args: {
    post: compactPost,
    headingLevel: 3,
    truncateLength: 220,
  },
};

export const MobileEntry: Story = {
  args: {
    post: compactPost,
    headingLevel: 3,
    truncateLength: 160,
  },
  parameters: { viewport: { defaultViewport: "mobile" } },
};
