import type { Meta, StoryObj } from '@storybook/react'
import Badge from '@/components/Badge'
import frame from './LibraryStory.module.css'

const meta = {
  title: 'Library/Display/Badge', component: Badge, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', controls: { include: ['text', 'variant', 'disabled'] }, docs: { description: { component: 'Compact machine-readable status label. Badges describe state; they are not interactive controls.' } } },
  decorators: [(Story) => <div className={frame.paperStage}><Story /></div>],
  args: { text: 'Indexed', variant: 'default', disabled: false },
  argTypes: {
    text: { control: 'text', description: 'Short status label.' },
    variant: { control: 'select', options: ['default', 'primary', 'secondary', 'tertiary', 'success', 'danger'] },
    disabled: { control: 'boolean', description: 'Marks the displayed state as unavailable.' },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
  },
} satisfies Meta<typeof Badge>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Default: Story = {}
export const Disabled: Story = { args: { text: 'Unavailable', disabled: true } }
export const StateMatrix: Story = { render: () => <div className={frame.row}><Badge text="Default" /><Badge text="Active" variant="primary" /><Badge text="Reference" variant="secondary" /><Badge text="Archived" variant="tertiary" /><Badge text="Ready" variant="success" /><Badge text="Error" variant="danger" /><Badge text="Disabled" disabled /></div>, parameters: { controls: { disable: true } } }
