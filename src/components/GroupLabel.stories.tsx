import type { Meta, StoryObj } from "@storybook/react";

import Checkbox from "./Checkbox";
import GroupLabel from "./GroupLabel";

const meta = {
  title: "Components/Forms/GroupLabel",
  component: GroupLabel,
  parameters: { docs: { description: { component: "Group heading for related controls. Use legend inside a fieldset and div for a generic grouped region." } } },
  args: { children: "Delivery preferences", description: "Choose every route that can receive updates.", required: false, as: "legend" },
  argTypes: {
    children: { control: "text" },
    description: { control: "text" },
    required: { control: "boolean" },
    as: { control: "inline-radio", options: ["legend", "div"], description: "Semantic element used for the group heading." },
    className: { control: false, table: { disable: true } },
    style: { control: false, table: { disable: true } },
    id: { control: false, table: { disable: true } },
    descriptionId: { control: false, table: { disable: true } },
  },
  render: (args) => args.as === "legend" ? (
    <fieldset aria-describedby="delivery-description" style={{ width: "min(100%, 34rem)", padding: "var(--ds-space-6)", background: "var(--component-surface-panel)", border: "var(--ds-border-width-hairline) solid var(--component-control-border)" }}>
      <GroupLabel {...args} descriptionId="delivery-description" />
      <Checkbox checked={false} onChange={() => undefined} label="Email" />
    </fieldset>
  ) : (
    <div role="group" aria-describedby="delivery-description" style={{ width: "min(100%, 34rem)", padding: "var(--ds-space-6)", background: "var(--component-surface-panel)", border: "var(--ds-border-width-hairline) solid var(--component-control-border)" }}>
      <GroupLabel {...args} descriptionId="delivery-description" />
      <Checkbox checked={false} onChange={() => undefined} label="Email" />
    </div>
  ),
} satisfies Meta<typeof GroupLabel>;
export default meta;
type Story = StoryObj<typeof meta>;
export const FieldsetLegend: Story = {};
export const Required: Story = { args: { required: true } };
