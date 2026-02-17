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

    // Check for common navigation links (they appear in both desktop and mobile menus)
    const browseLinks = screen.getAllByText(/browse/i);
    expect(browseLinks.length).toBeGreaterThan(0);

    const aboutLinks = screen.getAllByText(/about/i);
    expect(aboutLinks.length).toBeGreaterThan(0);
  });

  it('renders list pet button', () => {
    render(
      <RouterWrapper>
        <Navbar />
      </RouterWrapper>
    );

    // List Pet button appears in both desktop and mobile menus
    const listPetButtons = screen.getAllByText(/list.*pet/i);
    expect(listPetButtons.length).toBeGreaterThan(0);
  });
});
