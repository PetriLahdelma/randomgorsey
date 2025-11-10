import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Text from '../components/design-system/Text';

const meta: Meta<typeof Text> = {
  title: 'Design System/Text',
  component: Text,
  argTypes: {
    variant: {
      control: 'select',
      options: ['body', 'bodySmall', 'caption', 'eyebrow'],
    },
    tone: {
      control: 'select',
      options: ['default', 'muted', 'contrast', 'accent'],
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

type StoryArgs = {
  variant?: 'body' | 'bodySmall' | 'caption' | 'eyebrow';
  tone?: 'default' | 'muted' | 'contrast' | 'accent';
  align?: 'left' | 'center' | 'right';
  weight?: 'regular' | 'medium' | 'bold';
  uppercase?: boolean;
  children?: React.ReactNode;
};

const Template: StoryFn<StoryArgs> = (args) => {
  const backgroundColor = args.tone === 'contrast' ? '#000' : '#fff';
  return (
    <div style={{ background: backgroundColor, padding: '1.5rem' }}>
      <Text {...args} />
    </div>
  );
};

export const Body = Template.bind({});
Body.args = {
  variant: 'body',
  tone: 'default',
  children: 'Body copy that mirrors the typography used across the site.',
};

export const Caption = Template.bind({});
Caption.args = {
  variant: 'caption',
  tone: 'muted',
  children: 'Muted caption text',
};

export const Eyebrow = Template.bind({});
Eyebrow.args = {
  variant: 'eyebrow',
  tone: 'accent',
  uppercase: true,
  children: 'Eyebrow label',
};
