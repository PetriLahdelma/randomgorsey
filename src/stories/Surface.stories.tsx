import type { Meta, StoryObj } from "@storybook/react";
import Surface from "../components/Surface";

const meta: Meta<typeof Surface> = {
  title: "Components/Surface",
  component: Surface,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["flat", "raised", "inverted"],
    },
    padding: {
      control: { type: "select" },
      options: ["none", "xs", "sm", "md", "lg"],
    },
    radius: {
      control: { type: "select" },
      options: ["none", "sm", "md", "lg"],
    },
    interactive: {
      control: { type: "boolean" },
    },
    fullWidth: {
      control: { type: "boolean" },
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-xl mx-auto">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "flat",
    padding: "lg",
    radius: "lg",
    children: "Surface content aligned with Random Gorsey styling.",
  },
};

export const Flat: Story = {
  args: {
    variant: "flat",
    padding: "lg",
    radius: "lg",
    children: "Flat surface with subtle depth.",
  },
};

export const Raised: Story = {
  args: {
    variant: "raised",
    padding: "lg",
    radius: "lg",
    children: "Raised surface for emphasis.",
  },
};

export const Inverted: Story = {
  args: {
    variant: "inverted",
    padding: "lg",
    radius: "lg",
    children: "Inverted surface suited for featured content.",
  },
};

export const Interactive: Story = {
  args: {
    variant: "raised",
    padding: "lg",
    radius: "lg",
    interactive: true,
    children: "Hover me for interaction effect.",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <Surface variant="flat" padding="lg" radius="lg">
        Flat variant - subtle shadow
      </Surface>
      <Surface variant="raised" padding="lg" radius="lg">
        Raised variant - pronounced shadow
      </Surface>
      <Surface variant="inverted" padding="lg" radius="lg">
        Inverted variant - dark background
      </Surface>
    </div>
  ),
};

export const PaddingScale: Story = {
  render: () => (
    <div className="space-y-4">
      <Surface padding="none">Padding: none</Surface>
      <Surface padding="xs">Padding: xs</Surface>
      <Surface padding="sm">Padding: sm</Surface>
      <Surface padding="md">Padding: md</Surface>
      <Surface padding="lg">Padding: lg</Surface>
    </div>
  ),
};
