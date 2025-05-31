import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from '../Input';

describe('Input Component', () => {
  it('renders the input with placeholder', () => {
    render(<Input type="text" value="" onChange={() => {}} placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders the label when provided', () => {
    render(<Input type="text" value="" onChange={() => {}} label="Name" />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('handles the onChange event', () => {
    const handleChange = jest.fn();
    render(<Input type="text" value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
