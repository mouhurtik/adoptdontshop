import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import type { Pet } from '@/types';
import ShareButton from './ShareButton';

interface PetDetailsHeaderProps {
  pet: Pet;
  openAdoptModal: () => void;
}

const PetDetailsHeader = ({ pet, openAdoptModal }: PetDetailsHeaderProps) => {
  return (
    <div className="relative mb-6 lg:mb-12">
      {/* Mobile Hero Image (hidden on desktop) */}
      <div className="lg:hidden absolute top-0 left-0 w-full h-[60vh] z-0">
        <img
          src={pet.image || pet.image_url || '/placeholder.svg'}
          alt={pet.name || pet.pet_name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
        {pet.urgent && (
          <div className="absolute top-20 right-4 bg-red-500 text-white px-4 py-1.5 rounded-full font-bold shadow-lg animate-pulse text-sm">
            Urgent ❤️
          </div>
        )}
      </div>

      {/* Content Spacer for Native Scrolling over Absolute Image */}
      <div className="lg:hidden w-full h-[55vh]"></div>

      {/* Content Sheet */}
      <div className="bg-white rounded-t-[2rem] lg:rounded-[3rem] px-6 py-8 lg:p-8 shadow-[0_-8px_30px_rgba(0,0,0,0.12)] lg:shadow-xl border-t lg:border-2 border-gray-100 lg:border-playful-cream relative z-10 lg:mt-0 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Desktop Image Section (hidden on mobile) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block relative group"
          >
            <div className="absolute inset-0 bg-playful-yellow rounded-[2.5rem] rotate-3 group-hover:rotate-6 transition-transform duration-300 opacity-20"></div>
            <img
              src={pet.image || pet.image_url || '/placeholder.svg'}
              alt={pet.name || pet.pet_name}
              className="relative w-full h-[400px] object-cover rounded-[2.5rem] shadow-lg transform transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {pet.urgent && (
              <div className="absolute top-6 left-6 bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg animate-pulse">
                Urgent Need ❤️
              </div>
            )}
          </motion.div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-5 lg:space-y-6"
          >
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl lg:text-5xl font-heading font-black text-playful-text mb-1 lg:mb-2">
                  {pet.name || pet.pet_name}
                </h1>
                <div className="flex items-center text-gray-500 font-medium text-base lg:text-lg">
                  <MapPin className="w-4 h-4 lg:w-5 lg:h-5 mr-1.5 text-playful-teal" />
                  {pet.location}
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2.5 lg:p-3 bg-gray-50 lg:bg-playful-cream rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors active-scale">
                  <Heart className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
                <ShareButton pet={pet} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 lg:gap-3">
              <span className="px-3.5 py-1.5 lg:px-4 lg:py-2 bg-playful-teal/10 text-playful-teal rounded-lg lg:rounded-xl font-bold text-sm lg:text-base">
                {pet.type || pet.animal_type}
              </span>
              <span className="px-3.5 py-1.5 lg:px-4 lg:py-2 bg-playful-coral/10 text-playful-coral rounded-lg lg:rounded-xl font-bold text-sm lg:text-base">
                {pet.breed}
              </span>
              <span className="px-3.5 py-1.5 lg:px-4 lg:py-2 bg-playful-yellow/20 text-yellow-700 rounded-lg lg:rounded-xl font-bold text-sm lg:text-base">
                {pet.age}
              </span>
            </div>

            <p className="text-gray-600 text-base lg:text-lg leading-relaxed">{pet.description}</p>

            {/* Desktop Adopt Button (hidden on mobile, replaced by FAB) */}
            <div className="pt-4 lg:pt-6 hidden lg:block">
              <PrimaryButton
                onClick={openAdoptModal}
                size="lg"
                className="w-full text-lg justify-center active-scale"
              >
                Adopt {pet.name || pet.pet_name} 🐾
              </PrimaryButton>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PetDetailsHeader;
