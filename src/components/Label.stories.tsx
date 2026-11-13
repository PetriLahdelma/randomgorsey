import type { Meta, StoryObj } from "@storybook/react";

import Label from "./Label";
import styles from "./forms/FormField.module.css";

const meta = {
  title: "Components/Forms/Label",
  component: Label,
  args: { children: "Project reference", htmlFor: "label-example" },
  render: (args) => (
    <div style={{ width: "min(100%, 34rem)", padding: "var(--ds-space-6)", background: "var(--component-surface-panel)" }}>
      <Label {...args} />
      <input id="label-example" className={styles.control} />
    </div>
  ),
} satisfies Meta<typeof Label>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Required: Story = { args: { required: true } };
export const LongContent: Story = { args: { children: "Localized production reference with a deliberately long descriptive label" } };
