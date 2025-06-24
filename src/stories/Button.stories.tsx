import React from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';
import Button from '../components/Button';
import { ArrowLeftCircleIcon } from '@heroicons/react/24/outline';

export default {
  title: 'Components/Button',
  component: Button,
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['primary', 'secondary', 'danger', 'tertiary', 'success', 'icon'],
      },
    },
    onClick: { action: 'clicked' },
  },
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  children: 'Primary Button',
};

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  children: 'Secondary Button',
};

export const Tertiary = Template.bind({});
Tertiary.args = {
  variant: 'tertiary',
  children: 'Tertiary Button',
};

export const Danger = Template.bind({});
Danger.args = {
  variant: 'danger',
  children: 'Danger Button',
};

export const Success = Template.bind({});
Success.args = {
  variant: 'success',
  children: 'Success Button',
};

export const Icon = Template.bind({});
Icon.args = {
  variant: 'primary',
  icon: ArrowLeftCircleIcon,
  iconStyle: { height: '24px', width: '24px' }
};

export const TextWithIcon = Template.bind({});
TextWithIcon.args = {
  variant: 'primary',
  children: 'Back',
  icon: ArrowLeftCircleIcon,
  iconStyle: { height: '24px', width: '24px' }
};
