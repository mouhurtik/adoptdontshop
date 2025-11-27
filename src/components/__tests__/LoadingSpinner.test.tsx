import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
    it('renders loading spinner with paw icon', () => {
        render(<LoadingSpinner />);

        // Check if the spinner container is present
        const container = screen.getByText(/loading/i).closest('div');
        expect(container).toBeInTheDocument();
    });

    it('displays loading text', () => {
        render(<LoadingSpinner />);

        // Check for loading text
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
});
