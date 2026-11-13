import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import Modal from '@/components/Modal'
import Text from '@/components/Text'
import { AnimationProvider } from '@/lib/motion'
import frame from './LibraryStory.module.css'

const meta = {
  title: 'Library/Feedback/Modal', component: Modal, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Focused interruption surface with scroll lock, keyboard loop, Escape handling and focus return.' } } },
  decorators: [(Story) => <AnimationProvider><Story /></AnimationProvider>],
  args: { isOpen: false, onClose: () => undefined, closeable: true },
} satisfies Meta<typeof Modal>
export default meta
type Story = StoryObj<typeof meta>

const DialogDemo = ({ closeable = true, long = false }: { closeable?: boolean; long?: boolean }) => {
  const [open, setOpen] = useState(false)
  return <div className={frame.paperStage}><button className={`${frame.systemButton} ${frame.systemButtonPrimary}`} type="button" onClick={() => setOpen(true)}>Open dialog</button><Modal isOpen={open} onClose={() => setOpen(false)} closeable={closeable} labelledById="demo-dialog-title" describedById="demo-dialog-description"><div className={frame.dialogContent}><h2 id="demo-dialog-title" className={frame.dialogTitle}>Confirm source change</h2><Text id="demo-dialog-description" className={frame.measure}>{long ? 'Changing the source replaces the currently loaded provider frame. Playback state is owned by the provider and may need to be resumed after the new source is ready. This long copy verifies responsive wrapping and scrolling.' : 'The current provider frame will be replaced.'}</Text><div className={frame.dialogActions}>{!closeable && <button className={frame.systemButton} type="button" onClick={() => setOpen(false)}>Cancel</button>}<button className={`${frame.systemButton} ${frame.systemButtonPrimary}`} type="button" onClick={() => setOpen(false)}>Continue</button></div></div></Modal></div>
}
export const Default: Story = { render: () => <DialogDemo /> }
export const RequiredDecision: Story = { render: () => <DialogDemo closeable={false} /> }
export const LongContent: Story = { render: () => <DialogDemo long /> }
