import type { Meta, StoryObj } from '@storybook/react'
import Surface from '@/components/Surface'
import Text from '@/components/Text'
import frame from './LibraryStory.module.css'

const meta = {
  title: 'Library/Surfaces/Surface', component: Surface, tags: ['autodocs'],
  parameters: { layout: 'fullscreen', controls: { include: ['as', 'variant', 'padding', 'radius', 'interactive', 'fullWidth', 'children'] }, docs: { description: { component: 'Polymorphic structural surface for field, panel and dark-layer contexts. Geometry stays deliberately sharp.' } } },
  decorators: [(Story) => <div className={frame.stage}><Story /></div>],
  args: {
    as: 'div',
    variant: 'flat',
    padding: 'md',
    radius: 'none',
    interactive: false,
    fullWidth: true,
    children: 'Stable field surface.',
  },
  argTypes: {
    as: { control: 'select', options: ['div', 'section', 'article', 'button'], description: 'Rendered semantic element.' },
    variant: { control: 'inline-radio', options: ['flat', 'raised', 'inverted'] },
    padding: { control: 'select', options: ['none', 'xs', 'sm', 'md', 'lg'] },
    radius: { control: 'inline-radio', options: ['none', 'sm', 'md', 'lg'] },
    interactive: { control: 'boolean', description: 'Adds hover and press affordances; pair with an interactive element.' },
    fullWidth: { control: 'boolean' },
    children: { control: 'text', description: 'Surface content.' },
    className: { table: { disable: true } },
    style: { table: { disable: true } },
    id: { table: { disable: true } },
    testId: { table: { disable: true } },
    role: { table: { disable: true } },
    tabIndex: { table: { disable: true } },
  },
} satisfies Meta<typeof Surface>
export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}
export const Default: Story = {}
export const StateMatrix: Story = { render: () => <div className={frame.matrix}><Surface variant="flat"><Text>Flat / field</Text></Surface><Surface variant="raised"><Text>Raised / panel</Text></Surface><Surface variant="inverted"><Text tone="contrast">Inverted / dark layer</Text></Surface><Surface as="button" type="button" interactive padding="md"><Text>Interactive semantic button surface</Text></Surface></div>, parameters: { controls: { disable: true } } }
export const PaddingScale: Story = { render: () => <div className={frame.matrix}>{(['none', 'xs', 'sm', 'md', 'lg'] as const).map((padding) => <Surface key={padding} padding={padding}><Text variant="caption">padding={padding}</Text></Surface>)}</div>, parameters: { controls: { disable: true } } }
