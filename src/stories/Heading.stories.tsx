import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "storybook/test";
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
          "Standalone library heading variants are shown here. Production journal titles use this component inside the journal context, which applies Lisa Terminal Paper; see Production / Surfaces for the live result. Page titles use StudioPageHeader.",
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

export const SemanticLevels: Story = {
  render: () => (
    <div style={{ display: "grid", gap: "var(--ds-space-4)" }}>
      <Heading level={1} tone="light" uppercase={false}>Journal index</Heading>
      <Heading level={2} tone="light" uppercase={false}>Collected entries</Heading>
      <Heading level={3} tone="light" uppercase={false}>Light Returning</Heading>
      <Heading level={4} tone="light" uppercase={false}>Field note</Heading>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("heading", { level: 1, name: "Journal index" })).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 2, name: "Collected entries" })).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 3, name: "Light Returning" })).toBeVisible();
    await expect(canvas.getByRole("heading", { level: 4, name: "Field note" })).toBeVisible();
  },
};

export const LongJournalTitle: Story = {
  args: {
    children: "Notes from a room where the machines kept running after everyone left",
    level: 3,
    tone: "light",
    uppercase: false,
  },
  parameters: { viewport: { defaultViewport: "narrow" } },
};

export const PolymorphicLabel: Story = {
  args: {
    as: "p",
    children: "Archive signal",
    level: 5,
    tone: "accent",
    uppercase: true,
  },
  parameters: {
    docs: {
      description: {
        story: "Visual heading treatment on a non-heading element. Use only when the document outline already supplies the semantic heading.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Archive signal").tagName).toBe("P");
    await expect(canvas.queryByRole("heading", { name: "Archive signal" })).not.toBeInTheDocument();
  },
};
