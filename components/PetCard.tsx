'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, MapPin } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Link from 'next/link';
import { generatePetSlug } from '@/utils/slugUtils';

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
  return (
    <motion.div
      whileHover={{ y: -10 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 border-2 border-transparent hover:border-playful-teal/20"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:bg-playful-coral hover:text-white transition-colors duration-300 group/heart">
            <Heart className="w-5 h-5 text-playful-coral group-hover/heart:fill-current group-hover/heart:text-white" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent">
          <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-playful-text shadow-sm">
            {type === 'dog' ? '🐶' : type === 'cat' ? '🐱' : '🐾'} {breed}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-heading font-bold text-playful-text group-hover:text-playful-teal transition-colors">
            {name}
          </h3>
          <span className="text-sm font-bold bg-playful-lavender text-playful-text px-2 py-1 rounded-lg">
            {typeof age === 'string' ? age : `${age} yr${age === 1 ? '' : 's'}`}
          </span>
        </div>

        <div className="flex items-center text-gray-500 mb-6">
          <MapPin className="w-4 h-4 mr-1 text-playful-coral" />
          <span className="text-sm font-medium">{location}</span>
        </div>

        <Link href={`/pet/${generatePetSlug(name, id)}`} className="block">
          <PrimaryButton
            variant="secondary"
            className="w-full group-hover:bg-playful-teal group-hover:text-white"
          >
            Meet {name}
          </PrimaryButton>
        </Link>
      </div>
    </motion.div>
  );
};

export default PetCard;
