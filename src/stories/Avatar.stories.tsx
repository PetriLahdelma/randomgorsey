import type { Meta, StoryObj } from '@storybook/react'
import Avatar from '@/components/Avatar'
import PeteImg from '../../public/images/pete.jpg'
import frame from './LibraryStory.module.css'

const meta = {
  title: 'Library/Display/Avatar', component: Avatar, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Square identity image with deterministic initials fallback and explicit alternative text.' } } },
  decorators: [(Story) => <div className={frame.paperStage}><Story /></div>],
  args: { avatarColor: '#101210', initials: 'RG', alt: 'Random Gorsey' },
} satisfies Meta<typeof Avatar>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const WithImage: Story = { args: { avatarImage: PeteImg, alt: 'Portrait of Random Gorsey' } }
export const SizeMatrix: Story = { render: () => <div className={frame.row}>{(['XS', 'S', 'M', 'L', 'XL'] as const).map((size) => <Avatar key={size} size={size} initials="RG" alt={`${size} avatar`} />)}</div> }
export const BrokenImageFallback: Story = { args: { avatarImage: '/missing-avatar.jpg', initials: 'RG', alt: 'Random Gorsey fallback' } }
