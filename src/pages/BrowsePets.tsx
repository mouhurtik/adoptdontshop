import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { usePets } from '@/hooks/usePets';
import { useFilters } from '@/hooks/useFilters';
import PetFilters from '@/components/browse/PetFilters';
import PetGrid from '@/components/browse/PetGrid';
import { Search, Filter } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';

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
    updateFilter('sortBy', value as any);
  };

  // Handle error state
  if (error) {
    return (
      <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-playful-cream pb-20">
      {/* Hero Header */}
      <div className="bg-playful-teal pt-32 pb-24 rounded-b-[3rem] relative overflow-hidden mb-12">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 text-9xl">🐾</div>
          <div className="absolute bottom-10 right-10 text-9xl">🦴</div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 bg-white/20 text-white rounded-full font-bold text-sm tracking-wide mb-4 backdrop-blur-sm">
              Adopt, Don't Shop
            </span>
            <h1 className="text-5xl md:text-7xl font-heading font-black text-white mb-6 leading-tight">
              Find Your <br />
              <span className="text-playful-yellow relative inline-block">
                Perfect Match
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-white opacity-40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
              </span>
            </h1>
            <p className="text-xl text-white/90 font-medium max-w-2xl mx-auto">
              Browse through our list of adorable pets waiting for a loving home like yours.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-20 relative z-20">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-[2rem] p-4 shadow-xl mb-12 max-w-4xl mx-auto flex flex-col md:flex-row gap-4 items-center"
        >
          <div className="flex-grow relative w-full">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="h-6 w-6" />
            </div>
            <input
              type="text"
              placeholder="Search by name, breed, or location..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-playful-coral rounded-xl font-medium text-gray-700 placeholder-gray-400 focus:outline-none transition-all duration-200"
              value={filters.searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          <PrimaryButton
            onClick={toggleFilters}
            variant={showFilters ? "primary" : "outline"}
            className="w-full md:w-auto flex items-center justify-center gap-2"
          >
            <Filter className="h-5 w-5" />
            Filters {showFilters ? 'On' : 'Off'}
          </PrimaryButton>
        </motion.div>

        {/* Filters */}
        <PetFilters
          filters={filters}
          onFilterChange={updateFilter}
          onResetFilters={resetFilters}
          showFilters={showFilters}
        />

        {/* Pets Grid */}
        <PetGrid
          pets={currentPets}
          isLoading={isLoading}
          currentPage={currentPage}
          petsPerPage={petsPerPage}
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



