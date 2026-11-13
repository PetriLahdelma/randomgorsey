import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import Input from "../components/Input";

const shell = { width: "min(100%, 34rem)", padding: "var(--ds-space-6)", background: "var(--component-surface-panel)", color: "var(--component-text-primary)" };

const meta = {
  title: "Components/Forms/Input",
  component: Input,
  parameters: { docs: { description: { component: "Productive text input with native semantics, explicit help/error association, deterministic density, and reduced-motion support." } } },
  args: { type: "text", value: "", onChange: () => undefined, label: "Project reference", placeholder: "RG-2026-11" },
  render: function Render(args) {
    const [value, setValue] = useState(String(args.value));
    return <div style={shell}><Input {...args} value={value} onChange={(event) => setValue(event.target.value)} /></div>;
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Required: Story = { args: { required: true, helpText: "Use the reference included in the brief." } };
export const Invalid: Story = { args: { value: "RG", error: "Enter the complete project reference." } };
export const Loading: Story = { args: { value: "Retrieving record", loading: true } };
export const Disabled: Story = { args: { value: "Archived record", disabled: true } };
export const LongContent: Story = { args: { label: "Localized production reference with a deliberately long field label", value: "RG-2026-11-HELSINKI-AFTER-HOURS-MASTER-ARCHIVE" } };

export const StateMatrix: Story = {
  render: () => <div style={{ ...shell, display: "grid", gap: "var(--ds-space-4)" }}>
    <Input type="text" label="Default" value="" onChange={() => undefined} placeholder="Enter reference" />
    <Input type="text" label="With help" value="RG-2026" onChange={() => undefined} helpText="Local archive identifier" />
    <Input type="text" label="Invalid" value="RG" onChange={() => undefined} error="Reference is incomplete." />
    <Input type="text" label="Loading" value="Retrieving record" onChange={() => undefined} loading />
    <Input type="text" label="Disabled" value="Archived" onChange={() => undefined} disabled />
  </div>,
};
