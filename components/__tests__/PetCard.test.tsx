import type { ComponentProps } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  auth: vi.fn(),
  favorites: vi.fn(),
  toggleFavorite: vi.fn(),
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: mocks.auth,
}));

vi.mock('@/hooks/useFavorites', () => ({
  useFavorites: mocks.favorites,
}));

vi.mock('@/components/ui/AuthPromptModal', () => ({
  default: ({ isOpen, message, onClose }: { isOpen: boolean; message: string; onClose: () => void }) => (
    isOpen ? (
      <div role="dialog" aria-label="Sign in to save favorites">
        <p>{message}</p>
        <button type="button" onClick={onClose}>Close</button>
      </div>
    ) : null
  ),
}));

// Mock next/image — strip non-DOM props
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { unoptimized: _, fill: _f, priority: _p, ...rest } = props;
    return <img {...rest} />;
  },
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: (props: ComponentProps<'a'>) => <a {...props} />,
}));

import PetCard from '../PetCard';

beforeEach(() => {
  vi.clearAllMocks();
  mocks.auth.mockReturnValue({ isAuthenticated: false });
  mocks.favorites.mockReturnValue({ favorites: [], toggleFavorite: mocks.toggleFavorite });
});

afterEach(cleanup);

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

  it.each([false, true])('uses the canonical pet slug without nested controls (compact=%s)', (compact) => {
    render(<PetCard {...mockPet} id="2c57d18e-ef39-4c68-9f18-d442bc857a11" name="Fluffy's Paw" compact={compact} />);

    const link = screen.getByRole('link', { name: "Meet Fluffy's Paw" });
    expect(link).toHaveAttribute('href', '/pet/fluffys-paw-2c57d18e');
    expect(link).toContainElement(screen.getByRole('img', { name: "Fluffy's Paw" }));
    expect(link.querySelector('button, a')).toBeNull();
    expect(screen.getByRole('button', { name: "Add Fluffy's Paw to favorites" }).closest('a')).toBeNull();
  });

  it.each([false, true])('keeps saving independent of the pet link for keyboard users (compact=%s)', async (compact) => {
    const user = userEvent.setup();
    mocks.auth.mockReturnValue({ isAuthenticated: true });
    render(<PetCard {...mockPet} compact={compact} />);

    const link = screen.getByRole('link', { name: 'Meet Buddy' });
    const linkClick = vi.fn();
    link.addEventListener('click', linkClick);
    await user.tab();
    expect(link).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Add Buddy to favorites' })).toHaveFocus();
    await user.keyboard('{Enter}');

    expect(mocks.toggleFavorite).toHaveBeenCalledExactlyOnceWith(mockPet.id);
    expect(linkClick).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it.each([false, true])('opens the auth prompt instead of navigating when saving signed out (compact=%s)', async (compact) => {
    const user = userEvent.setup();
    render(<PetCard {...mockPet} compact={compact} />);

    const linkClick = vi.fn();
    screen.getByRole('link', { name: 'Meet Buddy' }).addEventListener('click', linkClick);
    await user.click(screen.getByRole('button', { name: 'Add Buddy to favorites' }));

    expect(screen.getByRole('dialog', { name: 'Sign in to save favorites' })).toHaveTextContent('Sign in to save your favorite pets');
    expect(mocks.toggleFavorite).not.toHaveBeenCalled();
    expect(linkClick).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('exposes the saved state and keeps the remove action', async () => {
    const user = userEvent.setup();
    mocks.auth.mockReturnValue({ isAuthenticated: true });
    mocks.favorites.mockReturnValue({ favorites: [mockPet.id], toggleFavorite: mocks.toggleFavorite });
    render(<PetCard {...mockPet} compact />);

    const remove = screen.getByRole('button', { name: 'Remove Buddy from favorites', pressed: true });
    await user.click(remove);
    expect(mocks.toggleFavorite).toHaveBeenCalledExactlyOnceWith(mockPet.id);
  });

  it.each([false, true])('falls back after an image error without changing the pet link (compact=%s)', (compact) => {
    render(<PetCard {...mockPet} compact={compact} />);
    const image = screen.getByRole('img', { name: 'Buddy' });
    expect(image).toHaveAttribute('src', mockPet.image);
    expect(image).toHaveAttribute('loading', 'lazy');

    fireEvent.error(image);

    expect(image).toHaveAttribute('src', '/placeholder.svg');
    expect(screen.getByRole('link', { name: 'Meet Buddy' })).toHaveAttribute('href', '/pet/buddy-123');
  });

  it('keeps priority images eager and handles a missing image', () => {
    render(<PetCard {...mockPet} image="" priority />);
    expect(screen.getByRole('img', { name: 'Buddy' })).toHaveAttribute('loading', 'eager');
    expect(screen.getByRole('img', { name: 'Buddy' })).toHaveAttribute('src', '/placeholder.svg');
  });
});
