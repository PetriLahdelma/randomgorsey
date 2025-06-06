import React from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';
import Alert from '../components/Alert';

export default {
  title: 'Components/Alert',
  component: Alert,
  argTypes: {
    variant: {
      control: { type: 'select', options: ['info', 'success', 'warning', 'error'] },
    },
    children: { control: 'text' },
  },
} as Meta<typeof Alert>;

const Template: StoryFn<typeof Alert> = (args) => <Alert {...args} />;

export const Info = Template.bind({});
Info.args = {
  variant: 'info',
  children: 'Informational message',
};

export const Success = Template.bind({});
Success.args = {
  variant: 'success',
  children: 'Success message',
};

export const Warning = Template.bind({});
Warning.args = {
  variant: 'warning',
  children: 'Warning message',
};

export const Error = Template.bind({});
Error.args = {
  variant: 'error',
  children: 'Error message',
};
