import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from '../Select';

describe('Select Component', () => {
  const options = [
    { label: 'One', value: '1' },
    { label: 'Two', value: '2' },
  ];

  it('renders all options', () => {
    render(
      <Select options={options} value="" onChange={() => {}} placeholder="choose" />
    );
    expect(screen.getByText('One')).toBeInTheDocument();
    expect(screen.getByText('Two')).toBeInTheDocument();
  });

  it('calls onChange when new value selected', () => {
    const handleChange = jest.fn();
    render(<Select options={options} value="1" onChange={handleChange} />);
    fireEvent.change(screen.getByLabelText('select'), { target: { value: '2' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
