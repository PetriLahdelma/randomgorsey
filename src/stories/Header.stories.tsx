import type { Meta, StoryObj } from "@storybook/react";
import Header from "../patterns/Header";
import { version } from "../../package.json";

const meta = {
  title: "Production/Navigation/Header",
  component: Header,
  args: { version },
  parameters: {
    layout: "fullscreen",
    nextjs: { navigation: { pathname: "/listen/" } },
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {};

export const MobileMenu: Story = {
  parameters: {
    viewport: { defaultViewport: "mobile" },
  },
};
