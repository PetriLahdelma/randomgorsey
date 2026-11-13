import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";

import Input from "../components/Input";

const shell = { width: "min(100%, 34rem)", padding: "var(--ds-space-6)", background: "var(--component-surface-panel)", color: "var(--component-text-primary)" };

const meta = {
  title: "Components/Forms/Input",
  component: Input,
  parameters: { docs: { description: { component: "Productive text input with native semantics, explicit help/error association, deterministic density, and reduced-motion support." } } },
  args: {
    type: "text",
    value: "",
    onChange: () => undefined,
    label: "Project reference",
    placeholder: "RG-2026-11",
    size: "medium",
    required: false,
    disabled: false,
    loading: false,
    autoFocus: false,
    helpText: "Use the reference included in the brief.",
    error: "",
    rows: 4,
    minLength: 0,
    maxLength: 80,
    autoComplete: "off",
    pattern: "",
    step: 1,
    min: 0,
    max: 100,
  },
  argTypes: {
    type: { control: "select", options: ["text", "email", "password", "number", "tel", "url", "search", "date", "datetime-local", "time", "color", "textarea"], description: "Native control type. Use textarea to render the multiline variant." },
    value: { control: "text", description: "Controlled field value. Typing in the preview updates this arg." },
    label: { control: "text", description: "Visible label associated with the control." },
    placeholder: { control: "text" },
    size: { control: "inline-radio", options: ["small", "medium", "large"], description: "Density preset." },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean", description: "Locks the control and shows the loading indicator." },
    autoFocus: { control: "boolean" },
    helpText: { control: "text", description: "Supporting copy announced through aria-describedby." },
    error: { control: "text", description: "Validation message; also marks the control invalid." },
    rows: { control: { type: "number", min: 2, max: 12, step: 1 }, if: { arg: "type", eq: "textarea" } },
    minLength: { control: { type: "number", min: 0, step: 1 } },
    maxLength: { control: { type: "number", min: 1, step: 1 } },
    autoComplete: { control: "text" },
    pattern: { control: "text", if: { arg: "type", eq: "text" } },
    step: { control: "number", if: { arg: "type", eq: "number" } },
    min: { control: "number", if: { arg: "type", eq: "number" } },
    max: { control: "number", if: { arg: "type", eq: "number" } },
    onChange: { control: false, table: { disable: true } },
    onBlur: { control: false, table: { disable: true } },
    onFocus: { control: false, table: { disable: true } },
    validation: { control: false, table: { disable: true } },
    icon: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
    style: { control: false, table: { disable: true } },
    id: { control: false, table: { disable: true } },
    testId: { control: false, table: { disable: true } },
    "aria-label": { control: false, table: { disable: true } },
    "aria-labelledby": { control: false, table: { disable: true } },
    "aria-describedby": { control: false, table: { disable: true } },
    role: { control: false, table: { disable: true } },
    tabIndex: { control: false, table: { disable: true } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return <div style={shell}><Input {...args} value={String(args.value ?? "")} onChange={(event) => { updateArgs({ value: event.target.value }); args.onChange(event); }} /></div>;
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
  parameters: { controls: { disable: true } },
  render: () => <div style={{ ...shell, display: "grid", gap: "var(--ds-space-4)" }}>
    <Input type="text" label="Default" value="" onChange={() => undefined} placeholder="Enter reference" />
    <Input type="text" label="With help" value="RG-2026" onChange={() => undefined} helpText="Local archive identifier" />
    <Input type="text" label="Invalid" value="RG" onChange={() => undefined} error="Reference is incomplete." />
    <Input type="text" label="Loading" value="Retrieving record" onChange={() => undefined} loading />
    <Input type="text" label="Disabled" value="Archived" onChange={() => undefined} disabled />
  </div>,
};
