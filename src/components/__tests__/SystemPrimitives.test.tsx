import { render, screen } from '@testing-library/react'
import Caption from '../Caption'
import Surface from '../Surface'
import Text from '../Text'

describe('productive system primitives', () => {
  it('preserves polymorphic Surface semantics', () => {
    render(<Surface as="section" aria-label="Release data">Content</Surface>)
    expect(screen.getByRole('region', { name: 'Release data' })).toBeInTheDocument()
  })

  it('preserves polymorphic Text semantics and time metadata', () => {
    render(<Text as="time" dateTime="2026-11-13T14:21:00+02:00">Timestamp</Text>)
    expect(screen.getByText('Timestamp').tagName).toBe('TIME')
    expect(screen.getByText('Timestamp')).toHaveAttribute('datetime', '2026-11-13T14:21:00+02:00')
  })

  it('renders Caption with the requested semantic element', () => {
    render(<Caption as="p">Attachment metadata</Caption>)
    expect(screen.getByText('Attachment metadata').tagName).toBe('P')
  })
})
