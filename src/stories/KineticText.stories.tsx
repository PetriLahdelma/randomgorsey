import type { Meta, StoryObj } from '@storybook/react';
import { KineticText } from '@/components/KineticText';

const meta: Meta<typeof KineticText> = {
  title: 'Components/KineticText',
  component: KineticText,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
Kinetic typography component that splits text into characters, words, or lines
and animates them with staggered timing.

## Features
- Uses SplitType for text splitting
- Supports chars, words, or lines split modes
- Configurable stagger delay
- Triggers on scroll into view (optional)
- Respects prefers-reduced-motion
- Accessible: uses aria-label for screen readers

## Usage
\`\`\`tsx
import { KineticText } from '@/components/KineticText';

<KineticText as="h1" splitBy="chars" staggerDelay={0.02}>
  Hello World
</KineticText>
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description: 'Text content to animate',
    },
    as: {
      control: 'select',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span'],
      description: 'HTML element to render',
    },
    splitBy: {
      control: 'select',
      options: ['chars', 'words', 'lines'],
      description: 'How to split the text',
    },
    staggerDelay: {
      control: { type: 'range', min: 0.01, max: 0.2, step: 0.01 },
      description: 'Delay between each animated element (seconds)',
    },
    variant: {
      control: 'select',
      options: ['default', 'dramatic'],
      description: 'Animation style',
    },
    triggerOnView: {
      control: 'boolean',
      description: 'Whether to trigger animation on scroll into view',
    },
    viewportAmount: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Viewport amount required to trigger (0-1)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof KineticText>;

export const Characters: Story = {
  args: {
    children: 'Random Gorsey',
    as: 'h1',
    splitBy: 'chars',
    staggerDelay: 0.03,
    variant: 'default',
    triggerOnView: false,
    className: 'text-6xl font-bold text-white',
  },
  decorators: [
    (Story) => (
      <div className="p-12 bg-neutral-900 min-w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export const Words: Story = {
  args: {
    children: 'Explore The Music Collection',
    as: 'h2',
    splitBy: 'words',
    staggerDelay: 0.08,
    variant: 'default',
    triggerOnView: false,
    className: 'text-4xl font-semibold text-white',
  },
  decorators: [
    (Story) => (
      <div className="p-12 bg-neutral-900 min-w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export const DramaticVariant: Story = {
  name: 'Dramatic Animation',
  args: {
    children: 'Welcome',
    as: 'h1',
    splitBy: 'chars',
    staggerDelay: 0.05,
    variant: 'dramatic',
    triggerOnView: false,
    className: 'text-8xl font-bold text-yellow-400',
  },
  decorators: [
    (Story) => (
      <div className="p-12 bg-neutral-900 min-w-[600px] perspective-[1000px]">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story: 'Dramatic variant adds rotation for a more impactful reveal effect.',
      },
    },
  },
};

export const ScrollTriggered: Story = {
  name: 'Scroll Triggered',
  args: {
    children: 'Scroll down to see this animate',
    as: 'h2',
    splitBy: 'words',
    staggerDelay: 0.1,
    variant: 'default',
    triggerOnView: true,
    viewportAmount: 0.5,
    className: 'text-4xl font-bold text-white',
  },
  decorators: [
    (Story) => (
      <div className="bg-neutral-900">
        <div className="h-[80vh] flex items-center justify-center">
          <p className="text-white text-xl">Scroll down</p>
        </div>
        <div className="h-screen flex items-center justify-center">
          <Story />
        </div>
        <div className="h-[50vh]" />
      </div>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: 'Animation triggers when the element scrolls into view.',
      },
    },
  },
};

export const Comparison: Story = {
  name: 'Split Mode Comparison',
  render: () => (
    <div className="p-8 bg-neutral-900 space-y-12 min-w-[600px]">
      <div>
        <p className="text-neutral-500 text-sm mb-2">splitBy="chars"</p>
        <KineticText
          as="h2"
          splitBy="chars"
          staggerDelay={0.02}
          triggerOnView={false}
          className="text-3xl font-bold text-white"
        >
          Character Split
        </KineticText>
      </div>
      <div>
        <p className="text-neutral-500 text-sm mb-2">splitBy="words"</p>
        <KineticText
          as="h2"
          splitBy="words"
          staggerDelay={0.1}
          triggerOnView={false}
          className="text-3xl font-bold text-white"
        >
          Word by Word Split
        </KineticText>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Comparison of different split modes.',
      },
    },
  },
};
