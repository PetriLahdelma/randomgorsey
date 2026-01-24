import type { Meta, StoryObj } from '@storybook/react';
import { CursorProvider, useCursor } from '@/lib/cursor';

// Demo component to show cursor variants
function CursorDemo() {
  const { setCursorVariant, cursorVariant } = useCursor();

  return (
    <div className="min-h-[400px] p-8 bg-neutral-900 text-white">
      <h2 className="text-2xl mb-8">Current variant: {cursorVariant}</h2>

      <div className="space-y-4">
        <div
          className="p-4 bg-neutral-800 rounded cursor-pointer"
          onMouseEnter={() => setCursorVariant('default')}
        >
          <p>Default cursor area</p>
        </div>

        <button
          className="px-6 py-3 bg-yellow-500 text-black rounded font-semibold"
          onMouseEnter={() => setCursorVariant('hover')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          Hover me (hover variant)
        </button>

        <div
          className="p-8 bg-neutral-800 rounded"
          onMouseEnter={() => setCursorVariant('text')}
          onMouseLeave={() => setCursorVariant('default')}
        >
          <h1 className="text-4xl font-bold">
            Large text area (text variant)
          </h1>
          <p className="mt-2 text-neutral-400">
            Hover over this area to see the text cursor
          </p>
        </div>
      </div>

      <p className="mt-8 text-neutral-500 text-sm">
        Note: Custom cursor only appears on desktop with fine pointer.
        Touch devices use native cursor.
      </p>
    </div>
  );
}

const meta: Meta = {
  title: 'Effects/CustomCursor',
  component: CursorDemo,
  decorators: [
    (Story) => (
      <CursorProvider>
        <Story />
      </CursorProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
Custom cursor that follows mouse position with adaptive smoothing.

## Features
- Desktop-only (uses \`(hover: hover) and (pointer: fine)\` detection)
- Three variants: default, hover, text
- Respects prefers-reduced-motion
- Uses mix-blend-mode for visibility on any background

## Usage
\`\`\`tsx
import { useCursor } from '@/lib/cursor';

function MyComponent() {
  const { setCursorVariant } = useCursor();

  return (
    <button
      onMouseEnter={() => setCursorVariant('hover')}
      onMouseLeave={() => setCursorVariant('default')}
    >
      Hover me
    </button>
  );
}
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Interactive: Story = {
  name: 'Interactive Demo',
};

export const VariantShowcase: Story = {
  name: 'Variant Showcase',
  render: () => {
    const VariantDemo = () => {
      const { setCursorVariant } = useCursor();

      return (
        <div className="grid grid-cols-3 gap-4 min-h-[300px] p-4 bg-neutral-900">
          <div
            className="flex items-center justify-center bg-neutral-800 rounded p-8"
            onMouseEnter={() => setCursorVariant('default')}
          >
            <span className="text-white">Default</span>
          </div>
          <div
            className="flex items-center justify-center bg-neutral-800 rounded p-8"
            onMouseEnter={() => setCursorVariant('hover')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <span className="text-white">Hover</span>
          </div>
          <div
            className="flex items-center justify-center bg-neutral-800 rounded p-8"
            onMouseEnter={() => setCursorVariant('text')}
            onMouseLeave={() => setCursorVariant('default')}
          >
            <span className="text-white">Text</span>
          </div>
        </div>
      );
    };

    return (
      <CursorProvider>
        <VariantDemo />
      </CursorProvider>
    );
  },
};
