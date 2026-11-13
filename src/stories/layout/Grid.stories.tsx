import type { Meta, StoryObj } from '@storybook/react'
import { Grid } from '@/components/layout'
import frame from '../LibraryStory.module.css'

const meta = { title: 'Library/Layout/Grid', component: Grid, tags: ['autodocs'], parameters: { layout: 'fullscreen', docs: { description: { component: 'Container-responsive grid with fixed-column and minimum-item-width modes.' } } }, decorators: [(Story) => <div className={frame.layoutStage}><Story /></div>], args: { gap: 'md', columns: 'auto' } } satisfies Meta<typeof Grid>
export default meta
type Story = StoryObj<typeof meta>

const items = Array.from({ length: 8 }, (_, index) => index + 1)
const Tile = ({ value }: { value: number }) => <div className={`${frame.layoutItem} ${value % 3 === 0 ? frame.layoutItemBlue : value % 2 === 0 ? frame.layoutItemDark : ''}`}>{String(value).padStart(2, '0')}</div>
export const Default: Story = { render: (args) => <Grid {...args}>{items.map((value) => <Tile key={value} value={value} />)}</Grid> }
export const FixedColumns: Story = { render: () => <div className={frame.matrix}>{(['1', '2', '3', '4'] as const).map((columns) => <div key={columns}><div className={frame.label}>columns={columns}</div><Grid columns={columns} gap="sm">{items.slice(0, 4).map((value) => <Tile key={value} value={value} />)}</Grid></div>)}</div> }
export const GapScale: Story = { render: () => <div className={frame.matrix}>{(['sm', 'md', 'lg', 'xl'] as const).map((gap) => <div key={gap}><div className={frame.label}>gap={gap}</div><Grid columns="4" gap={gap}>{items.slice(0, 4).map((value) => <Tile key={value} value={value} />)}</Grid></div>)}</div> }
export const MinimumWidth: Story = { render: () => <Grid minItemWidth="180px" gap="md">{items.map((value) => <Tile key={value} value={value} />)}</Grid> }
export const ResizableContainer: Story = { render: () => <div className={frame.resizable}><div className={frame.label}>Drag the right edge</div><Grid columns="auto" gap="sm">{items.slice(0, 6).map((value) => <Tile key={value} value={value} />)}</Grid></div> }
