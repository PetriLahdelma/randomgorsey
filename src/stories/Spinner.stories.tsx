import type { Meta, StoryObj } from '@storybook/react'
import Spinner from '@/components/Spinner'
import frame from './LibraryStory.module.css'

const meta = { title: 'Library/Feedback/Spinner', component: Spinner, tags: ['autodocs'], parameters: { layout: 'fullscreen' }, decorators: [(Story) => <div className={frame.paperStage}><Story /></div>], args: { size: 'md', ariaLabel: 'Loading playback source' } } satisfies Meta<typeof Spinner>
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {}
export const SizeMatrix: Story = { render: () => <div className={frame.row}><Spinner size="sm" ariaLabel="Loading small" /><Spinner size="md" ariaLabel="Loading medium" /><Spinner size="lg" ariaLabel="Loading large" /><Spinner size={36} ariaLabel="Loading custom size" /></div> }
