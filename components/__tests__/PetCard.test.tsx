import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Mock Supabase client (initializes at module load, needs env vars)
vi.mock('@/lib/supabase/client', () => ({
  supabase: {
    auth: { getSession: vi.fn(), onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })) },
    from: vi.fn(() => ({ select: vi.fn(() => ({ data: [], error: null })) })),
  },
  createClient: vi.fn(),
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

// Mock useFavorites
vi.mock('@/hooks/useFavorites', () => ({
  useFavorites: () => ({
    favorites: [],
    toggleFavorite: vi.fn(),
  }),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: Record<string, unknown>) => <div {...props}>{children as React.ReactNode}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

import PetCard from '../PetCard';

describe('PetCard', () => {
  const mockPet = {
    id: '123',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: '2 years',
    location: 'New York, NY',
    image: 'https://example.com/buddy.jpg',
    type: 'Dog',
  };

  it('renders pet information correctly', () => {
    render(<PetCard {...mockPet} />);

    expect(screen.getByText('Buddy')).toBeInTheDocument();
    expect(screen.getByText(/2 years/i)).toBeInTheDocument();
    expect(screen.getByText(/New York, NY/i)).toBeInTheDocument();
  });

  it('renders pet image with correct alt text', () => {
    render(<PetCard {...mockPet} />);

    const image = screen.getByAltText('Buddy');
    expect(image).toBeInTheDocument();
  });

  it('displays breed information', () => {
    render(<PetCard {...mockPet} />);

    expect(screen.getByText(/Golden Retriever/i)).toBeInTheDocument();
  });

  it('renders with different pet names', () => {
    const catPet = { ...mockPet, name: 'Whiskers', breed: 'Persian', type: 'Cat' };

    render(<PetCard {...catPet} />);

    expect(screen.getByText('Whiskers')).toBeInTheDocument();
    expect(screen.getByText(/Persian/i)).toBeInTheDocument();
  });
});
