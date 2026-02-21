'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PawPrint, ChevronDown } from 'lucide-react';
import PetCard from '@/components/PetCard';
import type { Pet } from '@/types';
import Pagination from './Pagination';

interface PetGridProps {
  pets: Pet[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const PetGrid = ({
  pets,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
  sortBy,
  onSortChange,
}: PetGridProps) => {
  const fadeInStagger = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.5 },
    }),
  };

  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setIsSortOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'nameAsc', label: 'Name (A-Z)' },
    { value: 'nameDesc', label: 'Name (Z-A)' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <PawPrint className="w-16 h-16 text-playful-coral" />
        </motion.div>
      </div>
    );
  }

  if (pets.length === 0) {
    return (
      <div className="text-center py-16">
        <motion.p
          className="text-xl text-gray-600 mb-4 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          No pets found matching your criteria 🐾
        </motion.p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-4 px-4 sm:px-0">
        <p className="text-xl font-heading font-bold text-playful-text">
          Found <span className="text-playful-coral">{pets.length}</span> friends
        </p>
        <div className="hidden md:flex items-center gap-3 w-full sm:w-auto relative" ref={sortRef}>
           <span className="text-sm font-bold text-gray-500 hidden md:inline">Sort by:</span>
           <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex items-center justify-between sm:justify-center gap-2 w-full sm:w-auto bg-white border border-gray-100 sm:border-2 sm:border-gray-200 rounded-xl sm:rounded-full px-4 py-3 sm:py-2 font-medium text-gray-700 focus:outline-none focus:border-playful-teal focus:ring-2 focus:ring-playful-teal/20 transition-all duration-200 shadow-sm sm:shadow-none bg-playful-yellow/10 sm:bg-white"
           >
              {sortOptions.find((o) => o.value === sortBy)?.label || 'Sort By'}
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
           </button>

           <AnimatePresence>
              {isSortOpen && (
                  <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full mt-2 sm:right-0 z-50 w-full sm:w-[160px] bg-white border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] rounded-[1.25rem] p-1.5 focus:outline-none sm:origin-top-right mx-auto max-w-[200px]"
                  >
                      {sortOptions.map((option) => (
                           <button
                               key={option.value}
                               onClick={() => { onSortChange(option.value); setIsSortOpen(false); }}
                               className="w-full text-left px-3 py-2.5 rounded-xl transition-colors duration-150 flex items-center justify-between group hover:bg-playful-cream/50"
                           >
                              <span className={`text-sm font-bold ${sortBy === option.value ? 'text-playful-coral' : 'text-gray-600 group-hover:text-playful-text'}`}>
                                  {option.label}
                              </span>
                              {sortBy === option.value && <div className="w-1.5 h-1.5 rounded-full bg-playful-coral" />}
                           </button>
                      ))}
                  </motion.div>
              )}
           </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
        {pets.map((pet, index) => (
          <motion.div
            key={pet.id}
            initial="hidden"
            animate="visible"
            variants={fadeInStagger}
            custom={index}
          >
            <PetCard
              id={pet.id}
              name={pet.pet_name}
              breed={pet.breed}
              age={String(pet.age || '0 years')}
              location={pet.location}
              image={pet.image_url || '/placeholder.svg'}
              type={pet.animal_type || 'dog'}
            />
          </motion.div>
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </div>
  );
};

export default PetGrid;
