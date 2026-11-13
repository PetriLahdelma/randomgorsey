import type { Meta, StoryObj } from "@storybook/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { expect, fn, userEvent, within } from "storybook/test";
import Button from "../components/Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div
        style={{
          width: "min(32rem, 100%)",
          padding: "var(--ds-space-4)",
          color: "var(--component-text-primary)",
          background: "var(--component-surface-panel)",
          border: "var(--ds-border-width-hairline) solid var(--component-control-border)",
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          "The live site uses primary and secondary-dark in Cookie preferences. Remaining variants are retained as library API coverage.",
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary", children: "Accept all" } };
export const SecondaryDark: Story = { args: { variant: "secondary-dark", children: "Necessary" } };
export const Secondary: Story = {
  args: { variant: "secondary", children: "Open directly" },
  parameters: { docs: { description: { story: "Library variant; not currently used by a production route." } } },
};
export const Tertiary: Story = {
  args: { variant: "tertiary", children: "Load more" },
  parameters: { docs: { description: { story: "Library variant; the live archive uses studioButton." } } },
};
export const Danger: Story = {
  args: { variant: "danger", children: "Remove" },
  parameters: { docs: { description: { story: "Library-only destructive variant." } } },
};
export const Success: Story = {
  args: { variant: "success", children: "Confirmed" },
  parameters: { docs: { description: { story: "Library-only confirmation variant." } } },
};
export const Disabled: Story = { args: { variant: "primary", children: "Accept all", disabled: true } };
export const Loading: Story = { args: { variant: "primary", children: "Saving choice…", loading: true } };
export const KeyboardFocus: Story = { args: { variant: "primary", children: "Accept all", autoFocus: true } };
export const Icon: Story = {
  args: {
    variant: "secondary-dark",
    icon: <ArrowLeftIcon style={{ width: 20, height: 20 }} aria-hidden="true" />,
    iconOnly: true,
    "aria-label": "Back",
    children: "Back",
  },
};
export const TextWithIcon: Story = {
  args: {
    variant: "secondary-dark",
    children: "Back",
    icon: <ArrowLeftIcon style={{ width: 20, height: 20 }} aria-hidden="true" />,
  },
};

export const ProductionVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--ds-space-3)" }}>
      <Button variant="primary">Accept all</Button>
      <Button variant="secondary-dark">Necessary only</Button>
      <Button variant="primary" disabled>Unavailable</Button>
      <Button variant="primary" loading>Saving choice…</Button>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "The variants and states currently exercised by the production cookie-preferences flow.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("button", { name: "Accept all" })).toBeEnabled();
    await expect(canvas.getByRole("button", { name: "Necessary only" })).toBeEnabled();
    await expect(canvas.getByRole("button", { name: "Unavailable" })).toBeDisabled();
    await expect(canvas.getByRole("button", { name: "Saving choice…" })).toBeDisabled();
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--ds-space-3)" }}>
      <Button size="small">Small</Button>
      <Button size="medium">Medium</Button>
      <Button size="large">Large</Button>
    </div>
  ),
};

export const FullWidthAndLongLabel: Story = {
  args: {
    variant: "secondary-dark",
    fullWidth: true,
    children: "Keep necessary cookies and close preferences",
  },
  parameters: { viewport: { defaultViewport: "mobile" } },
};

export const KeyboardActivation: Story = {
  args: { variant: "primary", children: "Confirm selection", onClick: fn() },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Confirm selection" });
    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.keyboard("{Enter}");
    await expect(args.onClick).toHaveBeenCalledOnce();
  },
};
