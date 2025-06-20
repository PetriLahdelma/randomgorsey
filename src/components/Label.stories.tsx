import React from 'react';
import Label from './Label';
import { ComponentProps } from 'react';
import type { StoryFn } from '@storybook/react-webpack5';

const Story = {
  title: 'Components/Label',
  component: Label,
  argTypes: {
    children: { control: 'text', defaultValue: 'Label Text' },
    htmlFor: { control: 'text' },
    required: { control: 'boolean', defaultValue: false },
    className: { control: 'text' },
    style: { control: 'object' },
  },
};
export default Story;

export interface LabelProps extends ComponentProps<typeof Label> {}


const Template: StoryFn<typeof Label> = (args) => <Label {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Label Text',
  required: false,
};
