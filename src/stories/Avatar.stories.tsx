import type { Meta, StoryObj } from '@storybook/react'
import Avatar from '@/components/Avatar'
import PeteImg from '../../public/images/pete.jpg'
import frame from './LibraryStory.module.css'

const meta = {
  title: 'Library/Display/Avatar', component: Avatar, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', controls: { include: ['avatarColor', 'initials', 'size', 'alt'] }, docs: { description: { component: 'Square identity image with deterministic initials fallback and explicit alternative text.' } } },
  decorators: [(Story) => <div className={frame.paperStage}><Story /></div>],
  args: { avatarColor: '#101210', initials: 'RG', size: 'M', alt: 'Random Gorsey' },
  argTypes: {
    avatarColor: { control: 'color', description: 'Fallback background color.' },
    initials: { control: 'text', description: 'Fallback text when no image is available.' },
    size: { control: 'inline-radio', options: ['XS', 'S', 'M', 'L', 'XL'] },
    alt: { control: 'text', description: 'Accessible name for both image and fallback.' },
    avatarImage: {
      control: false,
      description: 'Next.js image source. Use the dedicated image stories for configured examples.',
    },
    className: { table: { disable: true } },
  },
} satisfies Meta<typeof Avatar>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Default: Story = {}
export const WithImage: Story = { args: { avatarImage: PeteImg, alt: 'Portrait of Random Gorsey' }, parameters: { controls: { disable: true } } }
export const SizeMatrix: Story = { render: () => <div className={frame.row}>{(['XS', 'S', 'M', 'L', 'XL'] as const).map((size) => <Avatar key={size} size={size} initials="RG" alt={`${size} avatar`} />)}</div>, parameters: { controls: { disable: true } } }
export const BrokenImageFallback: Story = { args: { avatarImage: '/missing-avatar.jpg', initials: 'RG', alt: 'Random Gorsey fallback' } }
