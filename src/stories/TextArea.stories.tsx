import type { Meta, StoryObj } from "@storybook/react";
import { useArgs } from "storybook/preview-api";

import TextArea from "../components/TextArea";

const meta = {
  title: "Components/Forms/TextArea",
  component: TextArea,
  parameters: { docs: { description: { component: "Controlled multiline field with explicit help, error, disabled, required, and delivery states." } } },
  args: {
    value: "",
    onChange: () => undefined,
    label: "Message",
    placeholder: "Add the relevant details",
    rows: 6,
    cols: 40,
    required: false,
    disabled: false,
    loading: false,
    helpText: "Maximum 5,000 characters.",
    error: "",
    autoComplete: "off",
    maxLength: 5000,
  },
  argTypes: {
    value: { control: "text", description: "Controlled textarea value. Typing in the preview updates this arg." },
    label: { control: "text" },
    placeholder: { control: "text" },
    rows: { control: { type: "number", min: 2, max: 20, step: 1 } },
    cols: { control: { type: "number", min: 10, max: 100, step: 1 } },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean", description: "Locks the field while retaining its contents." },
    helpText: { control: "text" },
    error: { control: "text", description: "Validation message; also marks the textarea invalid." },
    autoComplete: { control: "text" },
    maxLength: { control: { type: "number", min: 1, step: 1 } },
    onChange: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
    id: { control: false, table: { disable: true } },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();
    return <div style={{ width: "min(100%, 40rem)", padding: "var(--ds-space-6)", background: "var(--component-surface-panel)" }}><TextArea {...args} value={String(args.value ?? "")} onChange={(event) => { updateArgs({ value: event.target.value }); args.onChange(event); }} /></div>;
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const WithHelp: Story = { args: { helpText: "Maximum 5,000 characters.", maxLength: 5000 } };
export const Invalid: Story = { args: { value: "Short", error: "Add enough detail to route this message." } };
export const Loading: Story = { args: { value: "Message locked during delivery", loading: true } };
export const LongContent: Story = { args: { value: "A long-form note that verifies wrapping, resizing, and stable vertical rhythm across narrow and wide viewports. ".repeat(8) } };
