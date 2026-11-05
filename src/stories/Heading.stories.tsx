import type { Meta, StoryObj } from "@storybook/react";
import Heading from "../components/Heading";

const meta = {
  title: "Components/Heading",
  component: Heading,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 760, padding: "1.5rem", background: "var(--studio-stage)" }}>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "Heading is used by journal PostCard titles. Page-level LisaTerminal titles use studioTitle instead.",
      },
    },
  },
} satisfies Meta<typeof Heading>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Light Returning", level: 3, tone: "light", uppercase: false },
};
export const Hero: Story = {
  args: { children: "Four Tracks", level: 2, tone: "light", uppercase: false },
  parameters: { docs: { description: { story: "Expanded journal-entry hierarchy." } } },
};
export const Accent: Story = {
  args: { children: "SCENE", level: 4, tone: "accent", uppercase: true },
  parameters: { docs: { description: { story: "Library tone; live category labels use the smaller mono role." } } },
};
export const LightOnDark: Story = {
  args: { children: "Theo Parrish on RA Exchange", level: 3, tone: "light", uppercase: false },
};
export const AllLevels: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16 }}>
      <Heading level={2} tone="light" uppercase={false}>Light Returning</Heading>
      <Heading level={3} tone="light" uppercase={false}>Four Tracks</Heading>
      <Heading level={4} tone="light" uppercase={false}>Field Notes: Frozen City</Heading>
    </div>
  ),
};
export const AllTones: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 18 }}>
      <Heading level={3} tone="light" uppercase={false}>Journal title on graphite</Heading>
      <div style={{ padding: 16, background: "var(--studio-paper)" }}>
        <Heading level={3} tone="dark" uppercase={false}>Catalog title on paper</Heading>
      </div>
      <Heading level={4} tone="accent" uppercase>Archive signal</Heading>
    </div>
  ),
};
