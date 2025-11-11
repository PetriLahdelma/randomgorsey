import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Badge from '../components/Badge';

export default {
  title: 'Components/Badge',
  component: Badge,
  argTypes: {
    text: { control: 'text' },
    variant: {
      control: { type: 'select', options: ['default', 'primary', 'secondary', 'tertiary', 'success', 'danger'] },
    },
  },
} as Meta<typeof Badge>;

const Template: StoryFn<typeof Badge> = (args) => <Badge {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: 'Default',
  variant: 'default',
};

export const Primary = Template.bind({});
Primary.args = {
  text: 'Primary',
  variant: 'primary',
};

export const Secondary = Template.bind({});
Secondary.args = {
  text: 'Secondary',
  variant: 'secondary',
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  text: 'Tertiary',
  variant: 'tertiary',
};

export const Success = Template.bind({});
Success.args = {
  text: 'Success',
  variant: 'success',
};

export const Danger = Template.bind({});
Danger.args = {
  text: 'Danger',
  variant: 'danger',
};

export const Disabled = Template.bind({});
Disabled.args = {
  text: 'Disabled',
  variant: 'default',
  disabled: true,
};
