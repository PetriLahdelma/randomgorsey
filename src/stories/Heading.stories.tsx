import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Heading from '../components/design-system/Heading';

const meta: Meta<typeof Heading> = {
  title: 'Design System/Heading',
  component: Heading,
  argTypes: {
    level: {
      control: 'number',
      min: 1,
      max: 6,
    },
    tone: {
      control: 'select',
      options: ['light', 'dark', 'accent'],
    },
    align: {
      control: 'select',
      options: ['left', 'center', 'right'],
    },
    weight: {
      control: 'select',
      options: ['regular', 'medium', 'bold'],
    },
    uppercase: {
      control: 'boolean',
    },
  },
};

export default meta;

const Template: StoryFn<typeof Heading> = (args) => (
  <div style={{ background: args.tone === 'light' ? '#000' : '#fff', padding: '2rem' }}>
    <Heading {...args} />
  </div>
);

export const Hero = Template.bind({});
Hero.args = {
  level: 1,
  tone: 'dark',
  children: 'Random Gorsey Hero Heading',
};

export const Accent = Template.bind({});
Accent.args = {
  level: 2,
  tone: 'accent',
  children: 'Accent Heading',
};

export const LightOnDark = Template.bind({});
LightOnDark.args = {
  level: 3,
  tone: 'light',
  children: 'Light Heading',
};
