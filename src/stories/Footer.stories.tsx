import React from 'react';
import { StoryFn, Meta } from '@storybook/react';
import Footer from '../patterns/Footer';

export default {
  title: 'Patterns/Footer',
  component: Footer,
} as Meta<typeof Footer>;

const Template: StoryFn<typeof Footer> = (args) => <Footer {...args} />;

export const Default = Template.bind({});
Default.args = {};
