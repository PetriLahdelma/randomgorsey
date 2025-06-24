import React from 'react';
import Header from '../patterns/Header';
import { MemoryRouter } from 'react-router-dom';

export default {
  title: 'Patterns/Header',
  component: Header,
  decorators: [
    (StoryFn: React.FC) => (
      <MemoryRouter>
        <StoryFn />
      </MemoryRouter>
    ),
  ],
};

export const Desktop = () => <Header />;

export const Mobile = () => <Header />;
Mobile.parameters = { viewport: { defaultViewport: 'iphone12', } }; // Storybook's built-in mobile viewport (375px)
