import type { Meta, StoryObj } from '@storybook/react'
import Caption from '@/components/Caption'
import frame from './LibraryStory.module.css'

const meta = {
  title: 'Library/Typography/Caption',
  component: Caption,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', controls: { include: ['as', 'children'] } },
  decorators: [(Story) => <div className={frame.paperStage}><Story /></div>],
  args: { as: 'figcaption', children: 'UNTITLED_09.JPG · 2048×2048' },
  argTypes: {
    as: { control: 'inline-radio', options: ['figcaption', 'span', 'p'], description: 'Rendered semantic element.' },
    children: { control: 'text', description: 'Supporting metadata or image caption.' },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
} satisfies Meta<typeof Caption>
export default meta
type Story = StoryObj<typeof meta>
export const Playground: Story = {}
export const Default: Story = {}
export const AsParagraph: Story = { args: { as: 'p', children: 'Rendered as supporting paragraph metadata.' } }
