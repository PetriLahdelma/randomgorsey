import type { Meta, StoryObj } from '@storybook/react'
import { Bleed, Container } from '@/components/layout'
import frame from '../LibraryStory.module.css'

const meta = { title: 'Library/Layout/Bleed', component: Bleed, tags: ['autodocs'], parameters: { layout: 'fullscreen', docs: { description: { component: 'Viewport-width breakout primitive for content placed inside a constrained container.' } } }, decorators: [(Story) => <div className={frame.layoutStage}><Container size="md"><div className={frame.layoutItem}>Contained before</div><Story /><div className={frame.layoutItem}>Contained after</div></Container></div>] } satisfies Meta<typeof Bleed>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { render: () => <Bleed><div className={frame.fullBleed}><Container size="md"><div className={frame.label}>Full viewport width</div><strong>Inner content remains aligned to the reading grid.</strong></Container></div></Bleed> }
export const AsFigure: Story = { render: () => <Bleed as="figure"><div className={`${frame.fullBleed} ${frame.layoutItemAcid}`}><Container size="md"><div className={frame.label}>Stable azimuth</div><div className={frame.layoutLine} /></Container></div><figcaption className={frame.layoutItem}>Semantic figure with a full-width artwork field.</figcaption></Bleed> }
export const LayerSequence: Story = { render: () => <Bleed><div className={frame.layoutItemDark}><Container size="md">Dark layer</Container></div><div className={frame.fullBleed}><Container size="md">Signal layer</Container></div><div className={frame.layoutItemAcid}><Container size="md">Acid layer</Container></div></Bleed> }
