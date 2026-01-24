import React from 'react';
import GroupLabel from './GroupLabel';
import type { StoryFn } from '@storybook/react';

const Story = {
  title: 'Components/GroupLabel',
  component: GroupLabel,
  argTypes: {
    children: { control: 'text', defaultValue: 'Group Label Example' },
    required: { control: 'boolean', defaultValue: false },
    className: { control: 'text' },
    style: { control: 'object' },
  },
};
export default Story;

const Template: StoryFn<typeof GroupLabel> = (args) => <GroupLabel {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Group Label Example',
  required: false,
};
