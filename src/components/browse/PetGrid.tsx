import React from 'react';
import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import PetCard from '@/components/PetCard';
import { Pet } from '@/hooks/usePets';
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
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <p className="text-xl font-heading font-bold text-playful-text">
          Found <span className="text-playful-coral">{pets.length}</span> friends
        </p>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-500 hidden md:inline">Sort by:</span>
          <select
            className="bg-white border-2 border-gray-200 rounded-full px-4 py-2 font-medium text-gray-700 focus:outline-none focus:border-playful-teal focus:ring-2 focus:ring-playful-teal/20 transition-all duration-200 cursor-pointer"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="nameAsc">Name (A-Z)</option>
            <option value="nameDesc">Name (Z-A)</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
              age={pet.age || '0 years'}
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
