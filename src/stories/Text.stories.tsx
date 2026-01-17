import type { Meta, StoryObj } from "@storybook/react";
import Text from "../components/Text";

const meta: Meta<typeof Text> = {
  title: "Components/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["body", "bodySmall", "caption", "eyebrow"],
    },
    tone: {
      control: { type: "select" },
      options: ["default", "muted", "contrast", "accent"],
    },
    align: {
      control: { type: "select" },
      options: ["left", "center", "right"],
    },
    weight: {
      control: { type: "select" },
      options: ["regular", "medium", "bold"],
    },
    uppercase: {
      control: { type: "boolean" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "body",
    tone: "default",
    children: "Body copy that mirrors the typography used across the site.",
  },
};

export const Body: Story = {
  args: {
    variant: "body",
    tone: "default",
    children: "Body copy that mirrors the typography used across the site.",
  },
};

export const BodySmall: Story = {
  args: {
    variant: "bodySmall",
    tone: "default",
    children: "Smaller body text for secondary content.",
  },
};

export const Caption: Story = {
  args: {
    variant: "caption",
    tone: "muted",
    children: "Muted caption text",
  },
};

export const Eyebrow: Story = {
  args: {
    variant: "eyebrow",
    tone: "accent",
    children: "Eyebrow label",
  },
};

export const ContrastOnDark: Story = {
  args: {
    variant: "body",
    tone: "contrast",
    children: "White text for dark backgrounds",
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-6">
        <Story />
      </div>
    ),
  ],
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <Text variant="body">Body variant - standard paragraph text</Text>
      <Text variant="bodySmall">Body small variant - secondary text</Text>
      <Text variant="caption">Caption variant - fine print</Text>
      <Text variant="eyebrow">Eyebrow variant</Text>
    </div>
  ),
};

export const AllTones: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="bg-white p-4">
        <Text tone="default">Default tone - black text</Text>
      </div>
      <div className="bg-white p-4">
        <Text tone="muted">Muted tone - gray text</Text>
      </div>
      <div className="bg-black p-4">
        <Text tone="contrast">Contrast tone - white text</Text>
      </div>
      <div className="bg-white p-4">
        <Text tone="accent">Accent tone - highlighted text</Text>
      </div>
    </div>
  ),
};

export const WeightVariations: Story = {
  render: () => (
    <div className="space-y-2">
      <Text weight="regular">Regular weight (400)</Text>
      <Text weight="medium">Medium weight (500)</Text>
      <Text weight="bold">Bold weight (700)</Text>
    </div>
  ),
};
