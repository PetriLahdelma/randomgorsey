import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";

import { Field, formFieldStyles } from "./Field";

const meta = {
  title: "Components/Forms/Field",
  component: Field,
  parameters: {
    docs: {
      description: {
        component: "Shared field composition for labels, optional/required markers, help text, errors, and a correctly associated form control.",
      },
    },
  },
  args: {
    id: "field-project-reference",
    label: "Project reference",
    helpText: "Use the reference included in the brief.",
    error: "",
    optional: false,
    required: false,
    presentation: "system",
    children: null,
  },
  argTypes: {
    label: { control: "text", description: "Visible label associated with the child control." },
    helpText: { control: "text", description: "Supporting copy announced through aria-describedby." },
    error: { control: "text", description: "Validation copy; takes precedence over help text." },
    optional: { control: "boolean" },
    required: { control: "boolean" },
    presentation: { control: "inline-radio", options: ["system", "contact"], description: "System is the library treatment; contact preserves the production page treatment." },
    id: { control: false, table: { disable: true } },
    children: { control: false, table: { disable: true } },
    className: { control: false, table: { disable: true } },
  },
  render: function Render(args) {
    const [value, setValue] = useState("");
    const describedBy = args.error ? `${args.id}-error` : args.helpText ? `${args.id}-help` : undefined;

    return (
      <div style={{ width: "min(100%, var(--ds-size-content-dialog))", padding: "var(--ds-space-6)", background: args.presentation === "contact" ? "var(--studio-paper)" : "var(--component-surface-panel)" }}>
        <Field {...args}>
          <input
            id={args.id}
            className={args.presentation === "contact" ? formFieldStyles.contactControl : formFieldStyles.control}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="RG-2026-11"
            required={args.required}
            aria-invalid={Boolean(args.error)}
            aria-describedby={describedBy}
          />
        </Field>
      </div>
    );
  },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};
export const Optional: Story = { args: { optional: true, helpText: "Add this only when a project reference already exists." } };
export const Required: Story = { args: { required: true } };
export const Invalid: Story = { args: { error: "Enter the complete project reference." } };
