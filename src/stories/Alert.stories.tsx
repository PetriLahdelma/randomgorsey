import type { Meta, StoryObj } from '@storybook/react'
import Alert from '@/components/Alert'
import frame from './LibraryStory.module.css'

const meta = {
  title: 'Library/Feedback/Alert', component: Alert, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', controls: { include: ['variant', 'children', 'hasIcon', 'isCloseable'] }, docs: { description: { component: 'Inline status messaging with semantic alert behavior, direct color language and an optional dismiss control.' } } },
  decorators: [(Story) => <div className={frame.paperStage}><Story /></div>],
  args: {
    variant: 'info',
    children: 'Playback source connected.',
    hasIcon: true,
    isCloseable: false,
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'], description: 'Status severity and color treatment.' },
    children: { control: 'text', description: 'Status message announced by the alert region.' },
    hasIcon: { control: 'boolean', description: 'Adds a severity icon without duplicating the message.' },
    isCloseable: { control: 'boolean', description: 'Shows a keyboard-accessible dismiss control.' },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    role: { table: { disable: true } },
  },
} satisfies Meta<typeof Alert>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Default: Story = {}
export const StateMatrix: Story = { render: () => <div className={frame.matrix}><Alert variant="info" hasIcon>System information is available.</Alert><Alert variant="success" hasIcon>Message queued successfully.</Alert><Alert variant="warning" hasIcon>The external player is taking longer than expected.</Alert><Alert variant="error" hasIcon isCloseable>Connection failed. Use a direct platform link and try again.</Alert></div>, parameters: { controls: { disable: true } } }
export const LongContent: Story = { args: { variant: 'warning', isCloseable: true, children: 'This is a deliberately long status message used to verify that the content wraps cleanly, the dismiss control remains reachable and no text is clipped on a narrow screen.' } }
