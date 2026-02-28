
import Image from 'next/image';
import { Pet } from '@/types/pet.types';

interface PetGalleryProps {
  pet: Pet;
}

const PetGallery = ({ pet }: PetGalleryProps) => {
  const petName = pet.name || pet.pet_name;
  const petImage = pet.image || pet.image_url || '';

  // Check if we have additional images (for now we don't, so we'll handle a single image case)
  const hasMultipleImages = false; // This would be true if we had multiple images

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-soft mb-8">
      <div className="h-80 sm:h-96 bg-gray-100">
        <Image
          src={petImage || '/placeholder.svg'}
          alt={petName}
          width={800}
          height={384}
          className="w-full h-full object-cover"
          unoptimized
          priority
        />
      </div>

      {hasMultipleImages ? (
        // If we have multiple images, show the thumbnail grid
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2">
          {/* We would map through additional images here */}
          <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden">
            <Image
              src={petImage || '/placeholder.svg'}
              alt={`${petName} thumbnail 1`}
              width={200}
              height={200}
              unoptimized
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : (
        // If we only have a single image, show a simple info bar instead
        <div className="p-3 text-sm text-gray-500 italic text-center bg-gray-50">
          This pet has a single profile image
        </div>
      )}
    </div>
  );
};

export default PetGallery;



