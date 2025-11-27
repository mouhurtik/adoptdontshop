import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../Navbar';

const RouterWrapper = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('Navbar', () => {
  it('renders the logo/brand name', () => {
    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    // Check for brand/logo text
    const brandElements = screen.getAllByText(/adopt/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });

  it('renders navigation links', () => {
    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    // Check for common navigation links
    expect(screen.getByText(/browse/i)).toBeInTheDocument();
    expect(screen.getByText(/about/i)).toBeInTheDocument();
  });

  it('renders list pet button', () => {
    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    const listPetButton = screen.getByText(/list.*pet/i);
    expect(listPetButton).toBeInTheDocument();
  });
});
