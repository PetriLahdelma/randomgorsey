import type { Meta, StoryObj } from "@storybook/react";
import Footer from "../patterns/Footer";

const meta = {
  title: "Production/Navigation/Footer",
  component: Footer,
  parameters: { layout: "fullscreen" },
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

export const Desktop: Story = {};

export const Mobile: Story = {
  parameters: { viewport: { defaultViewport: "mobile" } },
};
