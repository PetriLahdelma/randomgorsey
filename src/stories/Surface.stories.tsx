import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Surface from '../components/design-system/Surface';

const meta: Meta<typeof Surface> = {
  title: 'Design System/Surface',
  component: Surface,
  argTypes: {
    variant: {
      control: 'select',
      options: ['flat', 'raised', 'inverted'],
    },
    padding: {
      control: 'select',
      options: ['none', 'xs', 'sm', 'md', 'lg'],
    },
    radius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg'],
    },
    interactive: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
};

export default meta;

const Template: StoryFn<typeof Surface> = (args) => (
  <div style={{ maxWidth: '640px', margin: '0 auto' }}>
    <Surface {...args}>
      {args.children ?? 'Surface content aligned with Random Gorsey styling.'}
    </Surface>
  </div>
);

export const Flat = Template.bind({});
Flat.args = {
  variant: 'flat',
  padding: 'lg',
  radius: 'lg',
  children: 'Flat surface with subtle depth.',
};

export const Raised = Template.bind({});
Raised.args = {
  variant: 'raised',
  padding: 'lg',
  radius: 'lg',
  children: 'Raised surface for emphasis.',
};

export const Inverted = Template.bind({});
Inverted.args = {
  variant: 'inverted',
  padding: 'lg',
  radius: 'lg',
  children: 'Inverted surface suited for featured content.',
};
