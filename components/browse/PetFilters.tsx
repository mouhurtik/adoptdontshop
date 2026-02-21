import { motion, AnimatePresence } from 'framer-motion';
import type { PetFilters as PetFiltersType } from '@/types';
import { Filter, RotateCcw, X, ChevronDown } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useState } from 'react';

interface PetFiltersProps {
  filters: PetFiltersType;
  onFilterChange: <K extends keyof PetFiltersType>(key: K, value: PetFiltersType[K]) => void;
  onResetFilters: () => void;
  showFilters: boolean;
  onClose: () => void;
}

const TYPE_OPTIONS = [
  { value: 'all', label: 'All Types 🐾' },
  { value: 'Dog', label: 'Dogs 🐶' },
  { value: 'Cat', label: 'Cats 🐱' },
  { value: 'Bird', label: 'Birds 🐦' },
  { value: 'Small Pet', label: 'Small Pets 🐰' },
];

const AGE_OPTIONS = [
  { value: 'all', label: 'All Ages 🎂' },
  { value: 'baby', label: 'Baby (0-1 yr)' },
  { value: 'young', label: 'Young (1-3 yrs)' },
  { value: 'adult', label: 'Adult (3-8 yrs)' },
  { value: 'senior', label: 'Senior (8+ yrs)' },
];

const PetFilters = ({
  filters,
  onFilterChange,
  onResetFilters,
  showFilters,
  onClose
}: PetFiltersProps) => {
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const [isAgeOpen, setIsAgeOpen] = useState(false);

  // Helper to get labels
  const typeLabel = TYPE_OPTIONS.find(opt => opt.value === filters.selectedType)?.label || 'All Types 🐾';
  const ageLabel = AGE_OPTIONS.find(opt => opt.value === filters.selectedAge)?.label || 'All Ages 🎂';
  return (
    <AnimatePresence>
      {showFilters && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={onClose}>
            <motion.div
              className="bg-white rounded-[2rem] p-4 shadow-xl w-full max-w-2xl border-2 border-playful-cream relative"
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing the modal
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2 text-playful-teal">
                <Filter className="w-5 h-5" />
                <h3 className="font-heading font-bold text-xl">Filter Friends</h3>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors active-scale"
                aria-label="Close filters"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-2 ml-2">Type</label>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setIsTypeOpen(!isTypeOpen); setIsAgeOpen(false); }}
              className="w-full flex justify-between items-center bg-playful-cream border-2 border-transparent hover:border-playful-teal/30 rounded-xl p-3 text-gray-700 font-medium transition-all cursor-pointer"
            >
              <span>{typeLabel}</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isTypeOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isTypeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 left-0 right-0 z-50 bg-white border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] rounded-[1.5rem] p-2 max-h-[40vh] overflow-y-auto hide-scrollbar"
                >
                  {TYPE_OPTIONS.map(opt => {
                    const isActive = filters.selectedType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          onFilterChange('selectedType', opt.value as PetFiltersType['selectedType']);
                          setIsTypeOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors flex justify-between items-center ${isActive ? 'bg-playful-cream text-playful-teal' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {opt.label}
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-playful-teal"></div>}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-2 ml-2">Age</label>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setIsAgeOpen(!isAgeOpen); setIsTypeOpen(false); }}
              className="w-full flex justify-between items-center bg-playful-cream border-2 border-transparent hover:border-playful-coral/30 rounded-xl p-3 text-gray-700 font-medium transition-all cursor-pointer"
            >
              <span>{ageLabel}</span>
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isAgeOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isAgeOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 left-0 right-0 z-50 bg-white border border-gray-100 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] rounded-[1.5rem] p-2 max-h-[40vh] overflow-y-auto hide-scrollbar"
                >
                  {AGE_OPTIONS.map(opt => {
                    const isActive = filters.selectedAge === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={(e) => {
                          e.stopPropagation();
                          onFilterChange('selectedAge', opt.value as PetFiltersType['selectedAge']);
                          setIsAgeOpen(false);
                        }}
                        className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors flex justify-between items-center ${isActive ? 'bg-playful-coral/10 text-playful-coral' : 'text-gray-600 hover:bg-gray-50'}`}
                      >
                        {opt.label}
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-playful-coral"></div>}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
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
        </div>
      )}
    </AnimatePresence>
  );
};

export default PetFilters;



