import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Checkbox from "../components/Checkbox";

const meta = {
  title: "Components/Forms/Checkbox",
  component: Checkbox,
  args: { checked: false, onChange: () => undefined, label: "Retain a local copy of this selection" },
  render: function Render(args) {
    const [checked, setChecked] = useState(args.checked);
    return <div style={{ width: "min(100%, 34rem)", padding: "var(--ds-space-6)", background: "var(--component-surface-panel)" }}><Checkbox {...args} checked={checked} onChange={(event) => setChecked(event.target.checked)} /></div>;
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const Checked: Story = { args: { checked: true } };
export const WithHelp: Story = { args: { helpText: "This setting stays in the current browser." } };
export const Invalid: Story = { args: { required: true, error: "Confirm this choice before continuing." } };
export const Disabled: Story = { args: { disabled: true, checked: true } };
export const LongContent: Story = { args: { label: "Allow this deliberately long localized choice to wrap without moving the native checkbox away from the first line" } };
