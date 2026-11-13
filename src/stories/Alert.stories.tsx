import type { Meta, StoryObj } from '@storybook/react'
import Alert from '@/components/Alert'
import frame from './LibraryStory.module.css'

const meta = {
  title: 'Library/Feedback/Alert', component: Alert, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Inline status messaging with semantic alert behavior, direct color language and an optional dismiss control.' } } },
  decorators: [(Story) => <div className={frame.paperStage}><Story /></div>],
  args: { children: 'Playback source connected.', hasIcon: true },
  argTypes: { variant: { control: 'select', options: ['info', 'success', 'warning', 'error'] } },
} satisfies Meta<typeof Alert>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const StateMatrix: Story = { render: () => <div className={frame.matrix}><Alert variant="info" hasIcon>System information is available.</Alert><Alert variant="success" hasIcon>Message queued successfully.</Alert><Alert variant="warning" hasIcon>The external player is taking longer than expected.</Alert><Alert variant="error" hasIcon isCloseable>Connection failed. Use a direct platform link and try again.</Alert></div> }
export const LongContent: Story = { args: { variant: 'warning', isCloseable: true, children: 'This is a deliberately long status message used to verify that the content wraps cleanly, the dismiss control remains reachable and no text is clipped on a narrow screen.' } }
