import type { Meta, StoryObj } from "@storybook/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
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
          padding: "1rem",
          color: "var(--studio-ink)",
          background: "var(--studio-gray)",
          border: "2px solid",
          borderColor: "#fff #6f706b #6f706b #fff",
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
