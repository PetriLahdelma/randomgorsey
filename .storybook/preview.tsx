import type { Preview } from '@storybook/react-webpack5';
import '../src/index.module.css';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';

const preview: Preview = {
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
