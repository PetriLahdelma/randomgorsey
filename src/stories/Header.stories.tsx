import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import Header from "../patterns/Header";
import { version } from "../../package.json";

const meta = {
  title: "Production/Navigation/Header",
  component: Header,
  args: { version },
  parameters: {
    layout: "fullscreen",
    nextjs: { navigation: { pathname: "/listen/" } },
    docs: {
      description: {
        component: "The production site header, including version, current-route state and the keyboard-operable compact navigation.",
      },
    },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const CurrentRoute: Story = {
  parameters: { nextjs: { navigation: { pathname: "/about/" } } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "About" })).toHaveAttribute("aria-current", "page");
  },
};

export const MobileMenu: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};

export const MinimumWidth: Story = {
  parameters: { viewport: { defaultViewport: "narrow" } },
};
