import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';
import Checkbox from '../components/Checkbox';

export default {
  title: 'Components/Checkbox',
  component: Checkbox,
  argTypes: {
    checked: { control: 'boolean' },
    label: { control: 'text' },
    onChange: { action: 'change' },
  },
} as Meta<typeof Checkbox>;

const Template: StoryFn<typeof Checkbox> = (args) => {
  const [checked, setChecked] = useState(args.checked);
  return (
    <Checkbox
      {...args}
      checked={checked}
      onChange={(e) => {
        setChecked(e.target.checked);
        args.onChange && args.onChange(e);
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  checked: false,
  label: 'Accept Terms',
};

export const Checked = Template.bind({});
Checked.args = {
  checked: true,
  label: 'Checked by Default',
};

export const Disabled = Template.bind({});
Disabled.args = {
  checked: false,
  disabled: true,
  label: "Disabled Checkbox",
};
