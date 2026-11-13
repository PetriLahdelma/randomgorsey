import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
import Footer from "../patterns/Footer";

const meta = {
  title: "Production/Navigation/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
    controls: { disable: true },
    docs: {
      description: {
        component: "The production footer with the complete external channel row, contact route, cookie preferences and in-page return action.",
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: "100vh", display: "grid", alignItems: "end" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Desktop: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const externalLabels = ["Spotify", "SoundCloud", "Bandcamp", "Instagram", "YouTube"];
    for (const label of externalLabels) {
      const link = canvas.getByRole("link", { name: label });
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
    await expect(canvas.getByRole("button", { name: "Cookie preferences" })).toBeVisible();
  },
};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile" } },
};

export const MinimumWidth: Story = {
  parameters: { viewport: { defaultViewport: "narrow" } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "Random Gorsey — Home" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "YouTube" })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Back to top" })).toBeVisible();
  },
};
