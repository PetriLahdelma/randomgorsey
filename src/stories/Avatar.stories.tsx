import React from 'react';
import { Meta, StoryFn } from '@storybook/react-webpack5';
import Avatar, { AvatarProps } from '../components/Avatar';
import PeteImg from '../../public/images/pete.jpg';

export default {
  title: 'Components/Avatar',
  component: Avatar,
} as Meta;

const Template: StoryFn<AvatarProps> = (args: AvatarProps) => <Avatar {...args} />;

export const Default = Template.bind({});
Default.args = {
  avatarColor: '#000',
  initials: 'RG',
};

export const WithImage = Template.bind({});
WithImage.args = {
    avatarImage: PeteImg,
};
