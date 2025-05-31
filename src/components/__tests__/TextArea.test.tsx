import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextArea from '../TextArea';

describe('TextArea Component', () => {
  it('renders the textarea with placeholder', () => {
    render(<TextArea value="" onChange={() => {}} placeholder="Enter text" />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('renders the label when provided', () => {
    render(<TextArea value="" onChange={() => {}} label="Message" />);
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('handles the onChange event', () => {
    const handleChange = jest.fn();
    render(<TextArea value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
