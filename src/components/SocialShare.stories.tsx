import React from 'react';
import SocialShare from './SocialShare';

export default {
  title: 'Components/SocialShare',
  component: SocialShare,
};

export const Default = () => (
  <SocialShare
    url={typeof window !== 'undefined' ? window.location.href : 'https://randomgorsey.com/'}
    title="First Post"
    text="Welcome to the brand new Random Gorsey blog! This space will be filled with updates about music, art and more."
  />
);
