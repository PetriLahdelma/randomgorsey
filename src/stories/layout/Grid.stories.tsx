import type { Meta, StoryObj } from '@storybook/react'
import { Grid } from '@/components/layout'
import frame from '../LibraryStory.module.css'

const meta = { title: 'Library/Layout/Grid', component: Grid, tags: ['autodocs'], parameters: { layout: 'fullscreen', controls: { include: ['gap', 'columns', 'minItemWidth'] }, docs: { description: { component: 'Container-responsive grid with fixed-column and minimum-item-width modes.' } } }, decorators: [(Story) => <div className={frame.layoutStage}><Story /></div>], args: { gap: 'md', columns: 'auto', minItemWidth: '' }, argTypes: { gap: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] }, columns: { control: 'select', options: ['auto', '1', '2', '3', '4'] }, minItemWidth: { control: 'text', description: 'Optional CSS width used by auto-fit, for example 180px.' }, children: { control: false }, className: { control: false }, containerClassName: { control: false } } } satisfies Meta<typeof Grid>
export default meta
type Story = StoryObj<typeof meta>

const items = Array.from({ length: 8 }, (_, index) => index + 1)
const Tile = ({ value }: { value: number }) => <div className={`${frame.layoutItem} ${value % 3 === 0 ? frame.layoutItemBlue : value % 2 === 0 ? frame.layoutItemDark : ''}`}>{String(value).padStart(2, '0')}</div>
export const Default: Story = { name: 'Playground', render: (args) => <Grid {...args}>{items.map((value) => <Tile key={value} value={value} />)}</Grid> }
export const FixedColumns: Story = { parameters: { controls: { disable: true } }, render: () => <div className={frame.matrix}>{(['1', '2', '3', '4'] as const).map((columns) => <div key={columns}><div className={frame.label}>columns={columns}</div><Grid columns={columns} gap="sm">{items.slice(0, 4).map((value) => <Tile key={value} value={value} />)}</Grid></div>)}</div> }
export const GapScale: Story = { parameters: { controls: { disable: true } }, render: () => <div className={frame.matrix}>{(['sm', 'md', 'lg', 'xl'] as const).map((gap) => <div key={gap}><div className={frame.label}>gap={gap}</div><Grid columns="4" gap={gap}>{items.slice(0, 4).map((value) => <Tile key={value} value={value} />)}</Grid></div>)}</div> }
export const MinimumWidth: Story = { args: { minItemWidth: '180px', gap: 'md' }, render: (args) => <Grid {...args}>{items.map((value) => <Tile key={value} value={value} />)}</Grid> }
export const ResizableContainer: Story = { parameters: { controls: { disable: true } }, render: () => <div className={frame.resizable}><div className={frame.label}>Drag the right edge</div><Grid columns="auto" gap="sm">{items.slice(0, 6).map((value) => <Tile key={value} value={value} />)}</Grid></div> }
