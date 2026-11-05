import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";

import { getPostById } from "@/content/posts";
import { StudioWindow } from "@/components/studio/StudioWindow";

import SocialShare from "./SocialShare";

const post = getPostById(56)!;
const args = {
  url: `https://randomgorsey.com/posts/${post.id}/`,
  title: post.title,
  text: post.excerpt,
};

const meta = {
  title: "Components/SocialShare",
  component: SocialShare,
  args,
  parameters: {
    layout: "fullscreen",
    options: { showPanel: false },
    docs: {
      description: {
        component:
          "The production journal share control, using the same square window chrome and system colors as the live artist site.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ display: "grid", minHeight: "100vh", placeItems: "center", padding: "1rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SocialShare>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const PaperSurface: Story = {
  render: (storyArgs) => (
    <StudioWindow title="Journal / Share" tone="paper">
      <SocialShare {...storyArgs} />
    </StudioWindow>
  ),
};

export const DarkSurface: Story = {
  render: (storyArgs) => (
    <StudioWindow title="Journal / Share" tone="dark">
      <SocialShare {...storyArgs} />
    </StudioWindow>
  ),
};

export const OpenMenu: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Share" }));
    await expect(canvas.getByRole("menu", { name: `Share ${post.title}` })).toBeVisible();
    await expect(canvas.getByRole("menuitem", { name: "Close share menu" })).toHaveFocus();
  },
};

export const CopyFeedback: Story = {
  beforeEach: () => {
    const previousClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: fn().mockResolvedValue(undefined) },
    });
    return () => {
      if (previousClipboard) Object.defineProperty(navigator, "clipboard", previousClipboard);
      else Reflect.deleteProperty(navigator, "clipboard");
    };
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Share" }));
    await userEvent.click(canvas.getByRole("menuitem", { name: "Copy link" }));
    await expect(canvas.getByRole("button", { name: "Share" })).toHaveTextContent("Link copied");
    await expect(canvas.getByRole("status")).toHaveTextContent("Link copied to clipboard.");
    await expect(canvas.queryByRole("menu")).not.toBeInTheDocument();
  },
};

export const KeyboardNavigation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Share" });
    await userEvent.click(trigger);
    await expect(canvas.getByRole("menuitem", { name: "Close share menu" })).toHaveFocus();
    const menuItems = canvas.getAllByRole("menuitem");
    await userEvent.keyboard("{ArrowDown}");
    await expect(menuItems[1]).toHaveFocus();
    await userEvent.keyboard("{Escape}");
    await expect(trigger).toHaveFocus();
    await expect(canvas.queryByRole("menu")).not.toBeInTheDocument();
  },
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile" } },
  play: OpenMenu.play,
};
