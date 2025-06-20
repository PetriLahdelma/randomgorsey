import React from 'react';
import { render, screen } from '@testing-library/react';
import { HelmetProvider } from 'react-helmet-async';
import PostCard, { Post } from '../PostCard';

const post: Post = {
  id: 1,
  title: 'Test Post',
  timestamp: '2024-01-01',
  contentType: 'image',
  body: 'Some body text',
  media: '/images/test.jpg',
  author: 'RG'
};

describe('PostCard', () => {
  it('renders post title and image', () => {
    render(
      <HelmetProvider>
        <PostCard post={post} />
      </HelmetProvider>
    );
    expect(screen.getByRole('heading', { name: 'Test Post' })).toBeInTheDocument();
    const img = screen.getByAltText('Test Post');
    expect(img).toHaveAttribute('title', 'Test Post');
  });
});
