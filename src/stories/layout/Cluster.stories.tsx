import type { Meta, StoryObj } from '@storybook/react'
import { Cluster } from '@/components/layout'
import Badge from '@/components/Badge'
import frame from '../LibraryStory.module.css'

const meta = { title: 'Library/Layout/Cluster', component: Cluster, tags: ['autodocs'], parameters: { layout: 'fullscreen', docs: { description: { component: 'Wrapping inline layout for related controls, labels and metadata.' } } }, decorators: [(Story) => <div className={frame.layoutStage}><Story /></div>], args: { gap: 'md', justify: 'start', align: 'center' } } satisfies Meta<typeof Cluster>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { render: (args) => <Cluster {...args}><Badge text="Audio" /><Badge text="Journal" /><Badge text="Image" /><Badge text="External" variant="secondary" /></Cluster> }
export const GapScale: Story = { render: () => <div className={frame.matrix}>{(['none', 'xs', 'sm', 'md', 'lg'] as const).map((gap) => <div key={gap}><div className={frame.label}>gap={gap}</div><Cluster gap={gap}><Badge text="A" /><Badge text="B" /><Badge text="C" /></Cluster></div>)}</div> }
export const Distribution: Story = { render: () => <div className={frame.matrix}>{(['start', 'center', 'end', 'between'] as const).map((justify) => <div key={justify}><div className={frame.label}>justify={justify}</div><Cluster justify={justify} className={frame.layoutItem}><Badge text="01" /><Badge text="02" /><Badge text="03" /></Cluster></div>)}</div> }
export const Alignment: Story = { render: () => <div className={frame.matrix}>{(['start', 'center', 'end', 'baseline', 'stretch'] as const).map((align) => <div key={align}><div className={frame.label}>align={align}</div><Cluster align={align} gap="sm" className={frame.layoutItem}><Badge text="Short" /><span className={frame.layoutItemDark}>Two-line<br />reference</span><Badge text="Data" variant="secondary" /></Cluster></div>)}</div> }
export const SemanticNavigation: Story = { render: () => <Cluster as="nav" aria-label="Example section navigation" justify="between" gap="lg"><strong>RG / INDEX</strong><Cluster gap="md"><a href="#audio">Audio</a><a href="#images">Images</a><a href="#notes">Notes</a></Cluster></Cluster> }
