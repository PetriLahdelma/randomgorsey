import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Header from '../patterns/Header';
import { version } from '../../package.json';

export default {
  title: 'Patterns/Header',
  component: Header,
} as Meta<typeof Header>;

const Template: StoryFn<typeof Header> = (args) => <Header {...args} />;

export const Desktop = Template.bind({});
Desktop.args = { version };

export const Mobile = Template.bind({});
Mobile.args = { version };
Mobile.parameters = {
  viewport: {
    defaultViewport: 'largeMobile',
  },
};
