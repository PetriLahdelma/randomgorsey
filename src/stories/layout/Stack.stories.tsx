import type { Meta, StoryObj } from '@storybook/react'
import { Stack } from '@/components/layout'
import frame from '../LibraryStory.module.css'

const meta = { title: 'Library/Layout/Stack', component: Stack, tags: ['autodocs'], parameters: { layout: 'fullscreen', controls: { include: ['gap', 'align'] }, docs: { description: { component: 'Vertical flow primitive with a fixed spacing scale and polymorphic semantic output.' } } }, decorators: [(Story) => <div className={frame.layoutStage}><Story /></div>], args: { gap: 'md', align: 'stretch' }, argTypes: { gap: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'section'] }, align: { control: 'select', options: ['start', 'center', 'end', 'stretch'] }, as: { control: false }, children: { control: false }, className: { control: false } } } satisfies Meta<typeof Stack>
export default meta
type Story = StoryObj<typeof meta>

const Item = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => <div className={`${frame.layoutItem} ${className}`}>{children}</div>
export const Default: Story = { name: 'Playground', render: (args) => <Stack {...args}><Item>01 / Input</Item><Item>02 / Process</Item><Item>03 / Output</Item></Stack> }
export const GapScale: Story = { parameters: { controls: { disable: true } }, render: () => <Stack gap="lg">{(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'section'] as const).map((gap) => <Stack key={gap} gap={gap}><div className={frame.label}>gap={gap}</div><Item>A</Item><Item>B</Item></Stack>)}</Stack> }
export const Alignment: Story = { parameters: { controls: { disable: true } }, render: () => <Stack gap="lg">{(['start', 'center', 'end', 'stretch'] as const).map((align) => <Stack key={align} align={align} gap="xs"><div className={frame.label}>align={align}</div><Item>Short</Item><Item>Extended item width</Item></Stack>)}</Stack> }
export const SemanticSection: Story = { parameters: { controls: { disable: true } }, render: () => <Stack as="section" gap="lg"><header><div className={frame.label}>System section</div><h2>Collected entries</h2></header><Item className={frame.layoutItemDark}>A semantic section assembled without decorative cards.</Item><footer><div className={frame.label}>3 records</div></footer></Stack> }
