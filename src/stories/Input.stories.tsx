import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Input from '../components/Input';

export default {
  title: 'Components/Input',
  component: Input,
  parameters: {
    docs: {
      description: {
        component:
          'Input now generates and uses unique id/htmlFor for accessibility. You can provide an explicit id, or it will be derived from the label.',
      },
    },
  },
  argTypes: {
    type: {
      control: {
        type: 'select',
        options: ['text', 'email', 'password', 'textarea'],
      },
    },
    onChange: { action: 'changed' },
    id: { control: 'text' },
    label: { control: 'text' },
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

export const WithCustomId = Template.bind({});
WithCustomId.args = {
  type: 'text',
  value: '',
  placeholder: 'Custom id',
  label: 'Custom ID',
  id: 'custom-input-id',
};

export const MultipleInputsSameLabel = () => (
  <div style={{ maxWidth: '400px' }}>
    <Input type="text" value="" onChange={() => {}} label="Name" id="name-1" placeholder="First input" />
    <div style={{ marginTop: 16 }}>
      <Input type="text" value="" onChange={() => {}} label="Name" id="name-2" placeholder="Second input" />
    </div>
  </div>
);

export const NoLabelOrId = Template.bind({});
NoLabelOrId.args = {
  type: 'text',
  value: '',
  placeholder: 'No label or id',
};
