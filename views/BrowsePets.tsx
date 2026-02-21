'use client';

import React, { useEffect, useState } from 'react';
import { usePets } from '@/hooks/usePets';
import { useFilters } from '@/hooks/useFilters';
import PetFilters from '@/components/browse/PetFilters';
import PetGrid from '@/components/browse/PetGrid';
import { Search, Filter } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ScrollReveal from '@/components/ui/ScrollReveal';

const BrowsePets = () => {
  // Get URL parameters
  const getUrlParams = () => {
    if (typeof window === 'undefined') return { search: '', type: 'all' };

    const urlSearchParams = new URLSearchParams(window.location.search);
    return {
      search: urlSearchParams.get('search') || '',
      type: urlSearchParams.get('type') || 'all'
    };
  };

  const { search: initialSearch, type: initialType } = getUrlParams();

  // Custom hooks for data management
  const { pets, isLoading, error } = usePets();
  const {
    filters,
    showFilters,
    updateFilter,
    resetFilters,
    toggleFilters,
    getFilteredAndSortedPets
  } = useFilters(initialSearch, initialType);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const petsPerPage = 8;

  // Handle side effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
  }, []);

  // Get filtered and sorted pets
  const filteredAndSortedPets = getFilteredAndSortedPets(pets);

  // Pagination logic
  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredAndSortedPets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(filteredAndSortedPets.length / petsPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle search change
  const handleSearchChange = (value: string) => {
    updateFilter('searchTerm', value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    updateFilter('sortBy', value as 'newest' | 'oldest' | 'nameAsc' | 'nameDesc');
  };

  // Handle error state
  if (error) {
    return (
      <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
        <div className="container mx-auto px-6 text-center">
          <ScrollReveal
            mode="fade-up"
            width="100%"
            className="bg-white rounded-3xl p-12 shadow-soft border-2 border-red-100 max-w-2xl mx-auto"
          >
            <div className="text-6xl mb-6">😕</div>
            <p className="text-2xl mb-6 font-heading font-bold text-gray-800">{error}</p>
            <PrimaryButton
              onClick={() => window.location.reload()}
              variant="primary"
              size="lg"
            >
              Try Again
            </PrimaryButton>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-playful-cream pb-20">
      {/* Hero Header */}
      <div className="pt-6 md:pt-28 pb-4 md:pb-12 relative overflow-hidden mb-2 md:mb-8">
        <div className="container mx-auto px-6 text-center relative z-10">
          <ScrollReveal
            mode="fade-up"
            width="100%"
          >
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-black text-playful-text mb-2 md:mb-6 leading-tight flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
              <span>Find Your</span> <span className="inline-block px-3 py-1.5 lg:px-6 md:py-0 bg-playful-yellow text-playful-text rounded-2xl md:rounded-3xl shadow-sm">Perfect Match</span>
            </h1>
            <p className="hidden md:block text-base lg:text-lg text-gray-600 font-medium max-w-2xl mx-auto mb-6 lg:mb-8">
              Browse through our list of adorable pets waiting for a loving home.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="container mx-auto px-0 md:px-6 md:-mt-16 relative z-20">
        {/* Search Bar */}
        <div className="relative lg:sticky lg:top-[6.5rem] z-40 px-4 md:px-0 pt-2 md:pt-4 pb-2 bg-playful-cream/90 backdrop-blur-md">
          <ScrollReveal
            mode="fade-up"
            delay={0.2}
            width="100%"
            className="bg-white rounded-[2rem] md:rounded-[2.5rem] p-1.5 md:p-3 shadow-md md:shadow-xl max-w-4xl mx-auto flex flex-row gap-2 md:gap-3 items-center border border-gray-100"
          >
            <div className="flex-grow relative w-full">
              <div className="absolute left-4 md:left-6 top-1/2 transform -translate-y-1/2 text-playful-coral">
                <Search className="h-5 w-5 md:h-6 md:w-6" />
              </div>
              <input
                type="text"
                placeholder="Search pets..."
                className="w-full pl-11 md:pl-14 pr-4 py-3 md:py-4 bg-gray-50/50 border-2 border-transparent focus:bg-white focus:border-playful-coral rounded-[1.5rem] md:rounded-[2rem] font-bold text-gray-700 placeholder-gray-400 focus:outline-none transition-all duration-200 text-sm md:text-base"
                value={filters.searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <PrimaryButton
              onClick={toggleFilters}
              variant={showFilters ? "primary" : "outline"}
              className="flex-shrink-0 flex items-center justify-center rounded-[1.5rem] md:rounded-[2rem] h-[46px] w-[46px] md:h-auto md:w-auto md:px-6 md:py-4 active-scale p-0"
              title="Toggle Filters"
            >
              <Filter className="h-5 w-5" />
              <span className="hidden md:inline ml-2">Filters {showFilters ? 'On' : 'Off'}</span>
            </PrimaryButton>
          </ScrollReveal>
        </div>

        {/* Filters */}
        <PetFilters
          filters={filters}
          onFilterChange={updateFilter}
          onResetFilters={resetFilters}
          showFilters={showFilters}
          onClose={toggleFilters}
        />

        {/* Pets Grid */}
        <PetGrid
          pets={currentPets}
          isLoading={isLoading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
          sortBy={filters.sortBy}
          onSortChange={handleSortChange}
        />
      </div>
    </div>
  );
};

export default BrowsePets;



