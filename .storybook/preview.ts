import type { Preview } from '@storybook/react-webpack5';
import '../src/index.module.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    viewport: {
      defaultViewport: 'responsive',
    },
  },
};

export default preview;