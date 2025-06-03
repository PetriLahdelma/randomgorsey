import React from 'react';
import { StoryFn, Meta } from '@storybook/react-webpack5';
import Input from '../components/Input';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['text', 'email', 'password', 'textarea'],
      },
    },
    onChange: { action: 'changed' },
  },
} as Meta<typeof Input>;

const Template: StoryFn<typeof Input> = (args) => (
  <div style={{ maxWidth: '400px' }}>
    <Input {...args} />
  </div>
);

export const Text = Template.bind({});
Text.args = {
  type: 'text',
  value: '',
  placeholder: 'Enter text',
  label: 'Text Input',
};

export const Email = Template.bind({});
Email.args = {
  type: 'email',
  value: '',
  placeholder: 'Enter email',
  label: 'Email Input',
};

export const Password = Template.bind({});
Password.args = {
  type: 'password',
  value: '',
  placeholder: 'Enter password',
  label: 'Password Input',
};

export const TextArea = Template.bind({});
TextArea.args = {
  type: 'textarea',
  value: '',
  placeholder: 'Enter message',
  label: 'Text Area',
};
