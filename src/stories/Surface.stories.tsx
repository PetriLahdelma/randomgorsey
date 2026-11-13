import type { Meta, StoryObj } from '@storybook/react'
import Surface from '@/components/Surface'
import Text from '@/components/Text'
import frame from './LibraryStory.module.css'

const meta = {
  title: 'Library/Surfaces/Surface', component: Surface, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', docs: { description: { component: 'Polymorphic structural surface for field, panel and dark-layer contexts. Geometry stays deliberately sharp.' } } },
  decorators: [(Story) => <div className={frame.stage}><Story /></div>],
  args: { variant: 'flat', padding: 'md', radius: 'none', fullWidth: true },
} satisfies Meta<typeof Surface>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = { render: (args) => <Surface {...args}><Text>Stable field surface.</Text></Surface> }
export const StateMatrix: Story = { render: () => <div className={frame.matrix}><Surface variant="flat"><Text>Flat / field</Text></Surface><Surface variant="raised"><Text>Raised / panel</Text></Surface><Surface variant="inverted"><Text tone="contrast">Inverted / dark layer</Text></Surface><Surface as="button" type="button" interactive padding="md"><Text>Interactive semantic button surface</Text></Surface></div> }
export const PaddingScale: Story = { render: () => <div className={frame.matrix}>{(['none', 'xs', 'sm', 'md', 'lg'] as const).map((padding) => <Surface key={padding} padding={padding}><Text variant="caption">padding={padding}</Text></Surface>)}</div> }
