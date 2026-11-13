import type { Meta, StoryObj } from '@storybook/react'
import Text from '@/components/Text'
import Surface from '@/components/Surface'
import frame from './LibraryStory.module.css'

const meta = {
  title: 'Library/Typography/Text', component: Text, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Productive body, support and data-label typography. Lisa Terminal remains reserved for artist and window titles.' } } },
  decorators: [(Story) => <div className={frame.paperStage}><Story /></div>],
  args: { variant: 'body', tone: 'default', weight: 'regular', children: 'Body copy with a controlled reading measure.' },
} satisfies Meta<typeof Text>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const TypeScale: Story = { render: () => <div className={frame.matrix}><Text>Body / 17px</Text><Text variant="bodySmall">Body small / 15px</Text><Text variant="caption">Caption / 12px</Text><Text variant="eyebrow">System label / 12px</Text></div> }
export const ToneMatrix: Story = { render: () => <div className={frame.matrix}><Text>Primary text</Text><Text tone="muted">Secondary text</Text><Text tone="accent">Operational accent</Text><Surface variant="inverted"><Text tone="contrast">Text on dark layer</Text></Surface></div> }
export const LongContent: Story = { args: { children: 'Long-form copy remains readable and wraps at whole-word boundaries even when the content includes detailed technical descriptions, identifiers and changing viewport widths.' } }
