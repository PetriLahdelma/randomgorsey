import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";

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
  parameters: { docs: { description: { component: "Native select with grouped and disabled options, help/error association, multiple selection, and deterministic density." } } },
  args: {
    options,
    value: "",
    onChange: () => undefined,
    label: "Inquiry type",
    placeholder: "Select a route",
    size: "medium",
    required: false,
    disabled: false,
    loading: false,
    multiple: false,
    autoFocus: false,
    helpText: "The selected route determines which details are requested.",
    error: "",
    name: "inquiryType",
  },
  argTypes: {
    options: { control: "object", description: "Options may be grouped or disabled." },
    value: { control: "object", description: "Controlled value. Use a string normally or a string array when multiple is enabled." },
    label: { control: "text" },
    placeholder: { control: "text" },
    size: { control: "inline-radio", options: ["small", "medium", "large"] },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
    multiple: { control: "boolean" },
    autoFocus: { control: "boolean" },
    helpText: { control: "text" },
    error: { control: "text" },
    name: { control: "text" },
    onChange: { control: false, table: { disable: true } },
    onBlur: { control: false, table: { disable: true } },
    onFocus: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
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
    const controlledValue = args.multiple
      ? Array.isArray(args.value) ? args.value : args.value ? [String(args.value)] : []
      : Array.isArray(args.value) ? args.value[0] ?? "" : String(args.value ?? "");
    return <div style={{ width: "min(100%, 34rem)", padding: "var(--ds-space-6)", background: "var(--component-surface-panel)" }}><Select {...args} value={controlledValue} onChange={(event) => { updateArgs({ value: args.multiple ? Array.from(event.target.selectedOptions, (option) => option.value) : event.target.value }); args.onChange(event); }} /></div>;
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
