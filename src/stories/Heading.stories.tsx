import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../components/Heading";

const meta: Meta<typeof Heading> = {
  title: "Components/Heading",
  component: Heading,
  tags: ["autodocs"],
  argTypes: {
    level: {
      control: { type: "select" },
      options: [1, 2, 3, 4, 5, 6],
    },
    tone: {
      control: { type: "select" },
      options: ["light", "dark", "accent"],
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
    children: "Heading Text",
    level: 2,
    tone: "dark",
  },
};

export const Hero: Story = {
  args: {
    level: 1,
    tone: "dark",
    children: "Random Gorsey Hero Heading",
  },
};

export const Accent: Story = {
  args: {
    level: 2,
    tone: "accent",
    children: "Accent Heading",
  },
};

export const LightOnDark: Story = {
  args: {
    level: 3,
    tone: "light",
    children: "Light Heading",
  },
  decorators: [
    (Story) => (
      <div className="bg-black p-8">
        <Story />
      </div>
    ),
  ],
};

export const AllLevels: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading level={1}>Heading 1</Heading>
      <Heading level={2}>Heading 2</Heading>
      <Heading level={3}>Heading 3</Heading>
      <Heading level={4}>Heading 4</Heading>
      <Heading level={5}>Heading 5</Heading>
      <Heading level={6}>Heading 6</Heading>
    </div>
  ),
};

export const AllTones: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="bg-white p-4">
        <Heading level={3} tone="dark">
          Dark Tone
        </Heading>
      </div>
      <div className="bg-black p-4">
        <Heading level={3} tone="light">
          Light Tone
        </Heading>
      </div>
      <div className="bg-white p-4">
        <Heading level={3} tone="accent">
          Accent Tone
        </Heading>
      </div>
    </div>
  ),
};
