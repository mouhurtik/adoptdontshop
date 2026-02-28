'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Heart, MapPin } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import AuthPromptModal from '@/components/ui/AuthPromptModal';
import Link from 'next/link';
import { generatePetSlug } from '@/utils/slugUtils';
import { useAuth } from '@/contexts/AuthContext';
import { useFavorites } from '@/hooks/useFavorites';

interface PetProps {
  id: string;
  name: string;
  breed: string;
  age: number | string;
  location: string;
  image: string;
  type: string;
}

const PetCard = ({ id, name, breed, age, location, image, type }: PetProps) => {
  const { isAuthenticated } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isFavorited = favorites.includes(id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      toggleFavorite(id);
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -10 }}
        className="group relative bg-white rounded-[1.5rem] sm:rounded-3xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-playful-teal/20 active-scale"
      >
        {/* Image Container */}
        <div className="relative h-[360px] sm:h-64 overflow-hidden bg-gray-100">
          <Image
            src={image || '/placeholder.svg'}
            alt={name}
            width={400}
            height={400}
            unoptimized
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute top-4 right-4 z-10">
            <button onClick={handleFavorite} className={`p-3 sm:p-2 backdrop-blur-sm rounded-full shadow-sm hover:bg-playful-coral hover:text-white transition-colors duration-300 group/heart active-scale ${isFavorited ? 'bg-playful-cream border border-playful-coral/20' : 'bg-white/80'}`}>
              <Heart className={`w-6 h-6 sm:w-5 sm:h-5 transition-colors ${isFavorited ? 'fill-playful-coral text-playful-coral hover:text-white hover:fill-current' : 'text-playful-coral group-hover/heart:fill-current group-hover/heart:text-white'}`} />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 w-full p-4 md:p-4 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
            <span className="inline-block px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-playful-text shadow-sm">
              {type === 'dog' ? '🐶' : type === 'cat' ? '🐱' : '🐾'} {breed}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-2xl sm:text-2xl font-heading font-bold text-playful-text group-hover:text-playful-teal transition-colors flex-1 pr-2 line-clamp-1">
              {name}
            </h3>
            <span className="text-xs sm:text-sm font-bold bg-playful-lavender text-playful-text px-2 py-1.5 rounded-lg whitespace-nowrap">
              {typeof age === 'string' ? age : `${age} yr${age === 1 ? '' : 's'}`}
            </span>
          </div>

          <div className="flex items-center text-gray-500 mb-5 sm:mb-6">
            <MapPin className="w-4 h-4 mr-1.5 text-playful-coral flex-shrink-0" />
            <span className="text-sm font-medium truncate">{location}</span>
          </div>

          <Link href={`/pet/${generatePetSlug(name, id)}`} className="block">
            <PrimaryButton
              variant="secondary"
              className="w-full group-hover:bg-playful-teal group-hover:text-white py-3 sm:py-2.5 text-[15px] sm:text-base font-bold rounded-xl sm:rounded-full"
            >
              Meet {name}
            </PrimaryButton>
          </Link>
        </div>
      </motion.div>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="Sign in to save your favorite pets and never lose track of them! ❤️"
      />
    </>
  );
};

export default PetCard;

