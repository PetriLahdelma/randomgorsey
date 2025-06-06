import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from '../Checkbox';

describe('Checkbox Component', () => {
  it('renders label', () => {
    render(<Checkbox checked={false} onChange={() => {}} label="Accept" />);
    expect(screen.getByText('Accept')).toBeInTheDocument();
  });

  it('calls onChange when clicked', () => {
    const handleChange = jest.fn();
    render(<Checkbox checked={false} onChange={handleChange} label="Accept" />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
