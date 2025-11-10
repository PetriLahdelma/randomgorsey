import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { HelmetProvider } from 'react-helmet-async';
import PostCard, { Post, PostContentType } from '../components/PostCard';

const basePost: Post = {
  id: 99,
  title: 'New Single Release',
  timestamp: '2025-01-15',
  contentType: PostContentType.IMAGE,
  body: '<p>Fresh cuts from the Random Gorsey studio. Dive into the textures, movements, and inspirations behind the new tracks.</p>',
  media: '/images/solongspectrum.jpg',
  author: 'Random Gorsey',
  excerpt: 'Fresh cuts from the Random Gorsey studio.',
  tags: ['release', 'studio'],
  featured: false,
  views: 1240,
  likes: 320,
  avatarColor: '#fefefe',
};

const meta: Meta<typeof PostCard> = {
  title: 'Components/PostCard',
  component: PostCard,
  argTypes: {
    showFullContent: { control: 'boolean' },
    showSocialShare: { control: 'boolean' },
    showMetadata: { control: 'boolean' },
    onClick: { action: 'card-clicked' },
  },
};

export default meta;

const Template: StoryFn<typeof PostCard> = (args) => (
  <HelmetProvider>
    <div style={{ maxWidth: '720px', margin: '0 auto' }}>
      <PostCard {...args} />
    </div>
  </HelmetProvider>
);

export const Default = Template.bind({});
Default.args = {
  post: basePost,
  showFullContent: false,
  showSocialShare: true,
  showMetadata: true,
};

export const Featured = Template.bind({});
Featured.args = {
  post: {
    ...basePost,
    id: 100,
    featured: true,
    avatarColor: '#000',
    title: 'Gallery Immersion',
    body: '<p>Experience the audiovisual gallery tour with motion overlays powered by Framer Motion.</p>',
  },
  showFullContent: true,
  showSocialShare: true,
  showMetadata: true,
};
