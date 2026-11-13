import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import TextArea from "../components/TextArea";

const meta = {
  title: "Components/Forms/TextArea",
  component: TextArea,
  args: { value: "", onChange: () => undefined, label: "Message", placeholder: "Add the relevant details" },
  render: function Render(args) {
    const [value, setValue] = useState(args.value);
    return <div style={{ width: "min(100%, 40rem)", padding: "var(--ds-space-6)", background: "var(--component-surface-panel)" }}><TextArea {...args} value={value} onChange={(event) => setValue(event.target.value)} /></div>;
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Playground: Story = {};
export const WithHelp: Story = { args: { helpText: "Maximum 5,000 characters.", maxLength: 5000 } };
export const Invalid: Story = { args: { value: "Short", error: "Add enough detail to route this message." } };
export const Loading: Story = { args: { value: "Message locked during delivery", loading: true } };
export const LongContent: Story = { args: { value: "A long-form note that verifies wrapping, resizing, and stable vertical rhythm across narrow and wide viewports. ".repeat(8) } };
