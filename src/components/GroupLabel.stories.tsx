import type { Meta, StoryObj } from "@storybook/react";

import Checkbox from "./Checkbox";
import GroupLabel from "./GroupLabel";

const meta = {
  title: "Components/Forms/GroupLabel",
  component: GroupLabel,
  args: { children: "Delivery preferences", description: "Choose every route that can receive updates." },
  render: (args) => (
    <fieldset aria-describedby="delivery-description" style={{ width: "min(100%, 34rem)", padding: "var(--ds-space-6)", background: "var(--component-surface-panel)", border: "var(--ds-border-width-hairline) solid var(--component-control-border)" }}>
      <GroupLabel {...args} as="legend" descriptionId="delivery-description" />
      <Checkbox checked={false} onChange={() => undefined} label="Email" />
    </fieldset>
  ),
} satisfies Meta<typeof GroupLabel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const FieldsetLegend: Story = {};
export const Required: Story = { args: { required: true } };
