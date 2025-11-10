import type { Preview } from '@storybook/react';
import '../src/index.module.css';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import Badge from '../src/components/Badge';

/**
 * WIP (Work In Progress) Decorator
 * 
 * This decorator adds a red "WIP" badge to the bottom-right corner of all Storybook stories.
 * 
 * To remove the WIP badge:
 * 1. Remove the WIPDecorator from the decorators array below
 * 2. Remove the import for Badge component if no longer needed
 * 
 * The badge appears on ALL stories until manually removed.
 */
const WIPDecorator = (Story: any) => (
  <div style={{ position: 'relative', minHeight: '100vh', padding: '1rem' }}>
    <Story />
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <Badge text="WIP" variant="danger" />
    </div>
  </div>
);

const preview: Preview = {
  decorators: [
    WIPDecorator,
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
