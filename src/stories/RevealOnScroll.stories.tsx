import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import RevealOnScroll from '../components/RevealOnScroll';

const meta: Meta<typeof RevealOnScroll> = {
  title: 'Components/RevealOnScroll',
  component: RevealOnScroll,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Wrapper component for scroll-triggered reveal animations. Respects reduced-motion preferences.',
      },
    },
  },
  argTypes: {
    as: {
      control: 'select',
      options: ['div', 'section', 'article', 'aside'],
      description: 'HTML element to render',
    },
    once: {
      control: 'boolean',
      description: 'Trigger animation only once',
    },
    amount: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Visibility threshold (0-1)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RevealOnScroll>;

// Helper to create scrollable container
const ScrollContainer = ({ children }: { children: React.ReactNode }) => (
  <div style={{ height: '150vh', paddingTop: '100vh' }}>
    <p style={{ position: 'fixed', top: 20, left: 20, color: '#666' }}>
      Scroll down to see the reveal animation
    </p>
    {children}
  </div>
);

export const Default: Story = {
  render: (args) => (
    <ScrollContainer>
      <RevealOnScroll {...args}>
        <div style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '8px',
          color: 'white',
        }}>
          <h2>Revealed Content</h2>
          <p>This content animates into view when you scroll down.</p>
        </div>
      </RevealOnScroll>
    </ScrollContainer>
  ),
  args: {
    once: true,
    amount: 0.3,
  },
};

export const MultipleItems: Story = {
  render: () => (
    <ScrollContainer>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <RevealOnScroll key={i}>
            <div style={{
              padding: '2rem',
              background: `hsl(${i * 40}, 70%, 60%)`,
              borderRadius: '8px',
              color: 'white',
            }}>
              <h3>Item {i}</h3>
              <p>Each item reveals independently as it enters the viewport.</p>
            </div>
          </RevealOnScroll>
        ))}
      </div>
    </ScrollContainer>
  ),
};

export const AsSection: Story = {
  render: (args) => (
    <ScrollContainer>
      <RevealOnScroll as="section" {...args}>
        <div style={{
          padding: '3rem',
          background: '#1a1a2e',
          borderRadius: '12px',
          color: 'white',
        }}>
          <h2>Section Element</h2>
          <p>This renders as a semantic section element.</p>
        </div>
      </RevealOnScroll>
    </ScrollContainer>
  ),
  args: {
    as: 'section',
    amount: 0.5,
  },
};

export const HighThreshold: Story = {
  render: (args) => (
    <ScrollContainer>
      <RevealOnScroll {...args}>
        <div style={{
          padding: '2rem',
          background: '#2d3436',
          borderRadius: '8px',
          color: 'white',
        }}>
          <h2>High Visibility Threshold</h2>
          <p>This content requires 80% visibility before revealing.</p>
        </div>
      </RevealOnScroll>
    </ScrollContainer>
  ),
  args: {
    amount: 0.8,
    once: true,
  },
};

export const RepeatAnimation: Story = {
  render: (args) => (
    <ScrollContainer>
      <RevealOnScroll {...args}>
        <div style={{
          padding: '2rem',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          borderRadius: '8px',
          color: 'white',
        }}>
          <h2>Repeating Animation</h2>
          <p>Scroll up and down - animation repeats each time.</p>
        </div>
      </RevealOnScroll>
    </ScrollContainer>
  ),
  args: {
    once: false,
    amount: 0.3,
  },
};
