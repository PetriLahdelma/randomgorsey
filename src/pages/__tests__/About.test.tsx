import React from 'react';
import { render, screen } from '@testing-library/react';
import About from '../About';

describe('About Page', () => {
  test('renders about page content', () => {
    render(<About />);

    const aboutTitle = screen.getByText('About Us');
    expect(aboutTitle).toBeInTheDocument();

    const aboutDescription = screen.getByText('Learn more about Random Gorsey and our mission.');
    expect(aboutDescription).toBeInTheDocument();
  });
});
