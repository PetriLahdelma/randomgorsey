import type { Meta, StoryObj } from '@storybook/react'
import Text from '@/components/Text'
import Surface from '@/components/Surface'
import frame from './LibraryStory.module.css'

const meta = {
  title: 'Library/Typography/Text', component: Text, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', controls: { include: ['as', 'children', 'variant', 'tone', 'align', 'weight', 'uppercase', 'dateTime'] }, docs: { description: { component: 'Productive body, support and data-label typography. Lisa Terminal remains reserved for artist and window titles.' } } },
  decorators: [(Story) => <div className={frame.paperStage}><Story /></div>],
  args: {
    as: 'p',
    variant: 'body',
    tone: 'default',
    align: 'left',
    weight: 'regular',
    uppercase: false,
    children: 'Body copy with a controlled reading measure.',
  },
  argTypes: {
    as: { control: 'select', options: ['p', 'span', 'div', 'time'], description: 'Rendered semantic element.' },
    variant: { control: 'inline-radio', options: ['body', 'bodySmall', 'caption', 'eyebrow'] },
    tone: { control: 'inline-radio', options: ['default', 'muted', 'contrast', 'accent'] },
    align: { control: 'inline-radio', options: ['left', 'center', 'right'] },
    weight: { control: 'inline-radio', options: ['regular', 'medium', 'bold'] },
    children: { control: 'text', description: 'Rendered copy.' },
    dateTime: { control: 'text', if: { arg: 'as', eq: 'time' } },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    testId: { table: { disable: true } },
    role: { table: { disable: true } },
    tabIndex: { table: { disable: true } },
  },
} satisfies Meta<typeof Text>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Default: Story = {}
export const TypeScale: Story = { render: () => <div className={frame.matrix}><Text>Body / 17px</Text><Text variant="bodySmall">Body small / 15px</Text><Text variant="caption">Caption / 12px</Text><Text variant="eyebrow">System label / 12px</Text></div>, parameters: { controls: { disable: true } } }
export const ToneMatrix: Story = { render: () => <div className={frame.matrix}><Text>Primary text</Text><Text tone="muted">Secondary text</Text><Text tone="accent">Operational accent</Text><Surface variant="inverted"><Text tone="contrast">Text on dark layer</Text></Surface></div>, parameters: { controls: { disable: true } } }
export const LongContent: Story = { args: { children: 'Long-form copy remains readable and wraps at whole-word boundaries even when the content includes detailed technical descriptions, identifiers and changing viewport widths.' } }
