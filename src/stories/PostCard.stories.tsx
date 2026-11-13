import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
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
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: "The production journal entry surface. These stories use real post data and preserve the live Lisa Terminal title context.",
      },
    },
  },
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

export const ExpandAndCollapse: Story = {
  args: {
    post: compactPost,
    headingLevel: 3,
    truncateLength: 120,
    showSocialShare: false,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("button", { name: "Show more content" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(toggle);
    const collapse = canvas.getByRole("button", { name: "Show less content" });
    await expect(collapse).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(collapse);
    await expect(canvas.getByRole("button", { name: "Show more content" })).toBeVisible();
  },
};

export const ActionableTitle: Story = {
  args: {
    post: compactPost,
    headingLevel: 3,
    truncateLength: 160,
    showSocialShare: false,
    onClick: fn(),
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: compactPost.title }));
    await expect(args.onClick).toHaveBeenCalledWith(compactPost);
  },
};
