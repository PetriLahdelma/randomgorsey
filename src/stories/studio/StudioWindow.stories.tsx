import type { Meta, StoryObj } from "@storybook/react";
import { StudioWindow } from "@/components/studio/StudioWindow";

const meta = {
  title: "Studio/Window",
  component: StudioWindow,
  tags: ["autodocs"],
  args: {
    title: "Random Gorsey · Catalog",
    children: "Window content",
    tone: "paper",
    inert: false,
  },
  argTypes: {
    title: { control: "text", description: "Text shown in the window title bar." },
    tone: { control: "select", options: ["paper", "dark", "blue"] },
    inert: { control: "boolean", description: "Removes the window subtree from interaction and accessibility navigation." },
    children: { control: "text", description: "Simple content for the interactive playground." },
    actions: { control: false },
    className: { control: false },
  },
  parameters: {
    layout: "centered",
    controls: { include: ["title", "tone", "inert", "children"] },
  },
  decorators: [
    (Story) => (
      <div style={{ width: "min(760px, calc(100vw - 3rem))" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StudioWindow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Paper: Story = {
  args: {
    tone: "paper",
    children: (
      <div>
        <p className="studioMeta">FIRGO2100004 · 2021</p>
        <h2 style={{ margin: "12px 0", textTransform: "none" }}>
          So Long Spectrum
        </h2>
        <p style={{ maxWidth: "52ch", lineHeight: 1.65 }}>
          A factual catalog surface with readable text and deliberate system
          chrome.
        </p>
      </div>
    ),
  },
  parameters: { controls: { disable: true } },
};

export const Dark: Story = {
  args: {
    tone: "dark",
    title: "Listen · External players",
    actions: <span>Idle</span>,
    children: (
      <div>
        <p className="studioMeta">No player loaded</p>
        <p style={{ maxWidth: "52ch", lineHeight: 1.65 }}>
          Third-party media starts only after a clear listener action.
        </p>
        <button className="studioButton" type="button">
          Load player
        </button>
      </div>
    ),
  },
  parameters: { controls: { disable: true } },
};

export const ElectricBlue: Story = {
  args: {
    tone: "blue",
    title: "Active window",
    actions: <span>Playing</span>,
    children: (
      <p style={{ margin: 0, maxWidth: "46ch", lineHeight: 1.65 }}>
        The blue tone is reserved for an active or selected surface, not used
        as decoration on every window.
      </p>
    ),
  },
  parameters: { controls: { disable: true } },
};

export const LongTitleAndActions: Story = {
  args: {
    title:
      "The Customer is Always Right EP · A deliberately long title bar proof",
    tone: "paper",
    actions: (
      <button className="studioButton" type="button">
        Open
      </button>
    ),
    children: (
      <p style={{ margin: 0, lineHeight: 1.65 }}>
        The title wraps without clipping its accessible name or obscuring the
        action.
      </p>
    ),
  },
  parameters: {
    viewport: { defaultViewport: "mobile" },
    controls: { disable: true },
  },
};
