import React from 'react';
import { render } from '@testing-library/react';
import Spinner from '../Spinner';

describe('Spinner Component', () => {
  it('renders the spinner element', () => {
    const { container } = render(<Spinner />);
    expect(container.firstChild).toHaveClass('spinner');
  });
});
