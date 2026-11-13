import type { Meta, StoryObj } from "@storybook/react";
import { SignalLabel } from "./SignalLabel";

const meta = {
  title: "Production/Artwork/SignalLabel",
  component: SignalLabel,
  parameters: { layout: "centered", controls: { disable: true } },
} satisfies Meta<typeof SignalLabel>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
