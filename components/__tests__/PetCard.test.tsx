import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import PetCard from '../PetCard';

// Wrapper component for router context
const RouterWrapper = ({ children }: { children: React.ReactNode }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe('PetCard', () => {
  const mockPet = {
    id: '123',
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: '2 years',
    location: 'New York, NY',
    imageUrl: 'https://example.com/buddy.jpg',
    animalType: 'Dog' as const,
  };

  it('renders pet information correctly', () => {
    render(
      <RouterWrapper>
        <PetCard {...mockPet} />
      </RouterWrapper>
    );

    expect(screen.getByText('Buddy')).toBeInTheDocument();
    expect(screen.getByText(/2 years/i)).toBeInTheDocument();
    expect(screen.getByText(/New York, NY/i)).toBeInTheDocument();
  });

  it('renders pet image with correct alt text', () => {
    render(
      <RouterWrapper>
        <PetCard {...mockPet} />
      </RouterWrapper>
    );

    const image = screen.getByAltText('Buddy');
    expect(image).toBeInTheDocument();
  });

  it('displays breed information', () => {
    render(
      <RouterWrapper>
        <PetCard {...mockPet} />
      </RouterWrapper>
    );

    // The breed is displayed in the component
    expect(screen.getByText(/Golden Retriever/i)).toBeInTheDocument();
  });

  it('renders with different pet names', () => {
    const catPet = { ...mockPet, name: 'Whiskers', breed: 'Persian', animalType: 'Cat' as const };
    
    render(
      <RouterWrapper>
        <PetCard {...catPet} />
      </RouterWrapper>
    );

    expect(screen.getByText('Whiskers')).toBeInTheDocument();
    expect(screen.getByText(/Persian/i)).toBeInTheDocument();
  });
});
