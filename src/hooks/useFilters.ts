import { useState, useEffect } from 'react';
import type { Pet, PetFilters } from '@/types';

export type AgeOption = PetFilters['selectedAge'];
export type TypeOption = PetFilters['selectedType'];
export type SortOption = PetFilters['sortBy'];

export const useFilters = (initialSearch?: string, initialType?: string) => {
  const [filters, setFilters] = useState<PetFilters>({
    searchTerm: initialSearch || '',
    selectedType: (initialType as TypeOption) || 'all',
    selectedAge: 'all',
    showUrgentOnly: false,
    sortBy: 'newest'
  });

  const [showFilters, setShowFilters] = useState(false);

  // Update filters when URL params change
  useEffect(() => {
    if (initialSearch) {
      setFilters(prev => ({ ...prev, searchTerm: initialSearch }));
    }

    if (initialType && initialType !== 'all') {
      setFilters(prev => ({ ...prev, selectedType: initialType as TypeOption }));
    }
  }, [initialSearch, initialType]);

  const updateFilter = <K extends keyof PetFilters>(
    key: K,
    value: PetFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      selectedType: 'all',
      selectedAge: 'all',
      showUrgentOnly: false,
      sortBy: 'newest'
    });
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const applyFilters = (pets: Pet[]): Pet[] => {
    let filtered = [...pets];

    // Search filter
    if (filters.searchTerm) {
      const lowercaseQuery = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(pet =>
        (pet.name?.toLowerCase() || pet.pet_name.toLowerCase()).includes(lowercaseQuery) ||
        pet.breed.toLowerCase().includes(lowercaseQuery) ||
        pet.location.toLowerCase().includes(lowercaseQuery)
      );
    }

    // Type filter
    if (filters.selectedType !== 'all') {
      filtered = filtered.filter(pet => pet.animal_type === filters.selectedType);
    }

    // Urgent filter
    if (filters.showUrgentOnly) {
      filtered = filtered.filter(pet => pet.status === 'urgent');
    }

    // Age filter
    if (filters.selectedAge !== 'all') {
      filtered = filtered.filter(pet => {
        const age = String(pet.age ?? '').toLowerCase();

        switch (filters.selectedAge) {
          case 'baby':
            return age.includes('week') ||
              age.includes('month') ||
              (age.match(/\d+/) && parseInt(age.match(/\d+/)?.[0] || '0') < 1);
          case 'young':
            return age.match(/\d+/) &&
              parseInt(age.match(/\d+/)?.[0] || '0') >= 1 &&
              parseInt(age.match(/\d+/)?.[0] || '0') <= 2;
          case 'adult':
            return age.match(/\d+/) &&
              parseInt(age.match(/\d+/)?.[0] || '0') > 2 &&
              parseInt(age.match(/\d+/)?.[0] || '0') <= 8;
          case 'senior':
            return age.match(/\d+/) && parseInt(age.match(/\d+/)?.[0] || '0') > 8;
          default:
            return true;
        }
      });
    }

    return filtered;
  };

  const sortPets = (pets: Pet[]): Pet[] => {
    switch (filters.sortBy) {
      case 'newest':
        return [...pets].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      case 'oldest':
        return [...pets].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case 'nameAsc':
        return [...pets].sort((a, b) => (a.pet_name || '').localeCompare(b.pet_name || ''));
      case 'nameDesc':
        return [...pets].sort((a, b) => (b.pet_name || '').localeCompare(a.pet_name || ''));
      default:
        return pets;
    }
  };

  const getFilteredAndSortedPets = (pets: Pet[]): Pet[] => {
    const filtered = applyFilters(pets);
    return sortPets(filtered);
  };

  return {
    filters,
    showFilters,
    updateFilter,
    resetFilters,
    toggleFilters,
    applyFilters,
    sortPets,
    getFilteredAndSortedPets
  };
};
