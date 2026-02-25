import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const renderWithClient = (ui: React.ReactElement) => {
  return render(
    <QueryClientProvider client={queryClient}>
      {ui}
    </QueryClientProvider>
  );
};

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Supabase client
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })) },
    from: vi.fn(() => ({ select: vi.fn(() => ({ data: [], error: null })) })),
  },
  createClient: vi.fn(),
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
    renderWithClient(<Navbar />);

    const brandElements = screen.getAllByText(/adopt/i);
    expect(brandElements.length).toBeGreaterThan(0);
  });

  it('renders navigation links', () => {
    renderWithClient(<Navbar />);

    const browseLinks = screen.getAllByText(/browse/i);
    expect(browseLinks.length).toBeGreaterThan(0);

    const aboutLinks = screen.getAllByText(/about/i);
    expect(aboutLinks.length).toBeGreaterThan(0);
  });

  it('renders list pet button', () => {
    renderWithClient(<Navbar />);

    const listPetButtons = screen.getAllByText(/list.*pet/i);
    expect(listPetButtons.length).toBeGreaterThan(0);
  });
});
