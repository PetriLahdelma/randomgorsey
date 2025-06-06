import React, { useState } from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';
import Select from '../components/Select';

export default {
  title: 'Components/Select',
  component: Select,
  argTypes: {
    value: { control: 'text' },
    placeholder: { control: 'text' },
    onChange: { action: 'change' },
  },
} as Meta<typeof Select>;

const options = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
];

const Template: StoryFn<typeof Select> = (args) => {
  const [val, setVal] = useState(args.value);
  return (
    <Select
      {...args}
      value={val}
      onChange={(e) => {
        setVal(e.target.value);
        args.onChange && args.onChange(e);
      }}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  value: '',
  placeholder: 'Choose option',
  options,
};
