import { motion } from 'framer-motion';
import type { PetFilters as PetFiltersType } from '@/types';
import { Filter, RotateCcw } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';

interface PetFiltersProps {
  filters: PetFiltersType;
  onFilterChange: <K extends keyof PetFiltersType>(key: K, value: PetFiltersType[K]) => void;
  onResetFilters: () => void;
  showFilters: boolean;
}

const PetFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
  showFilters
}: PetFiltersProps) => {
  if (!showFilters) return null;

  return (
    <motion.div
      className="bg-white rounded-[2rem] p-8 shadow-soft mb-8 border-2 border-playful-cream"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2 mb-6 text-playful-teal">
        <Filter className="w-5 h-5" />
        <h3 className="font-heading font-bold text-lg">Filter Friends</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-2 ml-2">Type</label>
          <div className="relative">
            <select
              className="w-full bg-playful-cream border-2 border-transparent hover:border-playful-teal/30 rounded-xl p-3 text-gray-700 font-medium focus:outline-none focus:border-playful-teal focus:ring-4 focus:ring-playful-teal/10 transition-all cursor-pointer appearance-none"
              value={filters.selectedType}
              onChange={(e) => onFilterChange('selectedType', e.target.value as PetFiltersType['selectedType'])}
            >
              <option value="all">All Types 🐾</option>
              <option value="Dog">Dogs 🐶</option>
              <option value="Cat">Cats 🐱</option>
              <option value="Bird">Birds 🐦</option>
              <option value="Small Pet">Small Pets 🐰</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-2 ml-2">Age</label>
          <div className="relative">
            <select
              className="w-full bg-playful-cream border-2 border-transparent hover:border-playful-coral/30 rounded-xl p-3 text-gray-700 font-medium focus:outline-none focus:border-playful-coral focus:ring-4 focus:ring-playful-coral/10 transition-all cursor-pointer appearance-none"
              value={filters.selectedAge}
              onChange={(e) => onFilterChange('selectedAge', e.target.value as PetFiltersType['selectedAge'])}
            >
              <option value="all">All Ages 🎂</option>
              <option value="baby">Baby (0-1 yr)</option>
              <option value="young">Young (1-3 yrs)</option>
              <option value="adult">Adult (3-8 yrs)</option>
              <option value="senior">Senior (8+ yrs)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <label className="inline-flex items-center cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={filters.showUrgentOnly}
              onChange={(e) => onFilterChange('showUrgentOnly', e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-playful-coral/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-playful-coral"></div>
          </div>
          <span className="ml-3 text-gray-600 font-medium group-hover:text-playful-coral transition-colors">Show Urgent Needs Only ❤️</span>
        </label>

        <PrimaryButton
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          className="text-gray-400 hover:text-gray-600"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset Filters
        </PrimaryButton>
      </div>
    </motion.div>
  );
};

export default PetFilters;



