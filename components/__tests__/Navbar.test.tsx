import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    profile: null,
    isAdmin: false,
    isAuthenticated: false,
    signOut: vi.fn(),
  }),
}));

import Navbar from '../Navbar';

describe('Navbar', () => {
  it('renders the logo/brand name', () => {
    render(<Navbar />);

    const brandElements = screen.getAllByText(/adopt/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });

  it('renders navigation links', () => {
    render(<Navbar />);

    const browseLinks = screen.getAllByText(/browse/i);
    expect(browseLinks.length).toBeGreaterThan(0);

    const aboutLinks = screen.getAllByText(/about/i);
    expect(aboutLinks.length).toBeGreaterThan(0);
  });

  it('renders list pet button', () => {
    render(<Navbar />);

    const listPetButtons = screen.getAllByText(/list.*pet/i);
    expect(listPetButtons.length).toBeGreaterThan(0);
  });
});
