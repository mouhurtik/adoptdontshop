import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useFilters } from '../useFilters';
import type { Pet } from '@/types';

// Mock pets data
const mockPets: Pet[] = [
    {
        id: '1',
        pet_name: 'Buddy',
        animal_type: 'Dog',
        breed: 'Golden Retriever',
        age: '2 years',
        location: 'New York',
        description: 'Friendly dog',
        medical_info: 'Vaccinated',
        image_url: 'https://example.com/buddy.jpg',
        status: 'available',
        caregiver_name: 'John',
        mobile: '1234567890',
        created_at: '2024-01-15T10:00:00Z',
    },
    {
        id: '2',
        pet_name: 'Whiskers',
        animal_type: 'Cat',
        breed: 'Persian',
        age: '3 months',
        location: 'Los Angeles',
        description: 'Cute kitten',
        medical_info: 'Healthy',
        image_url: 'https://example.com/whiskers.jpg',
        status: 'urgent',
        caregiver_name: 'Jane',
        mobile: '0987654321',
        created_at: '2024-02-20T14:30:00Z',
    },
    {
        id: '3',
        pet_name: 'Tweety',
        animal_type: 'Bird',
        breed: 'Canary',
        age: '1 year',
        location: 'New York',
        description: 'Beautiful singer',
        medical_info: 'None',
        image_url: 'https://example.com/tweety.jpg',
        status: 'available',
        caregiver_name: 'Bob',
        mobile: '5555555555',
        created_at: '2024-01-01T08:00:00Z',
    },
];

describe('useFilters', () => {
    it('initializes with default filter values', () => {
        const { result } = renderHook(() => useFilters());

        expect(result.current.filters).toEqual({
            searchTerm: '',
            selectedType: 'all',
            selectedAge: 'all',
            showUrgentOnly: false,
            sortBy: 'newest',
        });
    });

    it('accepts initial search and type parameters', () => {
        const { result } = renderHook(() => useFilters('Buddy', 'Dog'));

        expect(result.current.filters.searchTerm).toBe('Buddy');
        expect(result.current.filters.selectedType).toBe('Dog');
    });

    it('updates filter values correctly', () => {
        const { result } = renderHook(() => useFilters());

        act(() => {
            result.current.updateFilter('searchTerm', 'test');
        });

        expect(result.current.filters.searchTerm).toBe('test');
    });

    it('resets filters to defaults', () => {
        const { result } = renderHook(() => useFilters('search', 'Cat'));

        act(() => {
            result.current.updateFilter('showUrgentOnly', true);
            result.current.resetFilters();
        });

        expect(result.current.filters).toEqual({
            searchTerm: '',
            selectedType: 'all',
            selectedAge: 'all',
            showUrgentOnly: false,
            sortBy: 'newest',
        });
    });

    it('toggles filter visibility', () => {
        const { result } = renderHook(() => useFilters());

        expect(result.current.showFilters).toBe(false);

        act(() => {
            result.current.toggleFilters();
        });

        expect(result.current.showFilters).toBe(true);
    });

    it('filters pets by search term', () => {
        const { result } = renderHook(() => useFilters());

        act(() => {
            result.current.updateFilter('searchTerm', 'Buddy');
        });

        const filtered = result.current.getFilteredAndSortedPets(mockPets);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].pet_name).toBe('Buddy');
    });

    it('filters pets by location', () => {
        const { result } = renderHook(() => useFilters());

        act(() => {
            result.current.updateFilter('searchTerm', 'New York');
        });

        const filtered = result.current.getFilteredAndSortedPets(mockPets);
        expect(filtered).toHaveLength(2);
    });

    it('filters pets by type', () => {
        const { result } = renderHook(() => useFilters());

        act(() => {
            result.current.updateFilter('selectedType', 'Cat');
        });

        const filtered = result.current.getFilteredAndSortedPets(mockPets);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].animal_type).toBe('Cat');
    });

    it('filters urgent pets only', () => {
        const { result } = renderHook(() => useFilters());

        act(() => {
            result.current.updateFilter('showUrgentOnly', true);
        });

        const filtered = result.current.getFilteredAndSortedPets(mockPets);
        expect(filtered).toHaveLength(1);
        expect(filtered[0].status).toBe('urgent');
    });

    it('sorts pets by newest first', () => {
        const { result } = renderHook(() => useFilters());

        const sorted = result.current.getFilteredAndSortedPets(mockPets);
        // Newest should be first (2024-02-20)
        expect(sorted[0].pet_name).toBe('Whiskers');
    });

    it('sorts pets by oldest first', () => {
        const { result } = renderHook(() => useFilters());

        act(() => {
            result.current.updateFilter('sortBy', 'oldest');
        });

        const sorted = result.current.getFilteredAndSortedPets(mockPets);
        // Oldest should be first (2024-01-01)
        expect(sorted[0].pet_name).toBe('Tweety');
    });

    it('sorts pets by name ascending', () => {
        const { result } = renderHook(() => useFilters());

        act(() => {
            result.current.updateFilter('sortBy', 'nameAsc');
        });

        const sorted = result.current.getFilteredAndSortedPets(mockPets);
        expect(sorted[0].pet_name).toBe('Buddy');
    });

    it('sorts pets by name descending', () => {
        const { result } = renderHook(() => useFilters());

        act(() => {
            result.current.updateFilter('sortBy', 'nameDesc');
        });

        const sorted = result.current.getFilteredAndSortedPets(mockPets);
        expect(sorted[0].pet_name).toBe('Whiskers');
    });
});
