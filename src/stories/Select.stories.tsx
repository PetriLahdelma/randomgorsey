import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Select, { type SelectOption } from "../components/Select";

const options: SelectOption[] = [
  { label: "Booking", value: "booking", group: "INQUIRY" },
  { label: "Collaboration", value: "collaboration", group: "INQUIRY" },
  { label: "Just saying hello", value: "hello", group: "INQUIRY" },
  { label: "Unavailable route", value: "closed", disabled: true, group: "ARCHIVE" },
];

const meta = {
  title: "Components/Forms/Select",
  component: Select,
  args: { options, value: "", onChange: () => undefined, label: "Inquiry type", placeholder: "Select a route" },
  render: function Render(args) {
    const [value, setValue] = useState<string | string[]>(args.value);
    return <div style={{ width: "min(100%, 34rem)", padding: "var(--ds-space-6)", background: "var(--component-surface-panel)" }}><Select {...args} value={value} onChange={(event) => setValue(args.multiple ? Array.from(event.target.selectedOptions, (option) => option.value) : event.target.value)} /></div>;
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const WithHelp: Story = { args: { value: "booking", helpText: "The selected route determines which details are requested." } };
export const Invalid: Story = { args: { error: "Choose an inquiry type." } };
export const Loading: Story = { args: { loading: true, placeholder: "Loading routes" } };
export const Disabled: Story = { args: { disabled: true, value: "collaboration" } };
export const Multiple: Story = { args: { multiple: true, value: ["booking", "collaboration"], helpText: "Native multiple selection is preserved." } };
