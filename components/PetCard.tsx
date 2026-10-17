'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Heart, MapPin } from 'lucide-react';
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
  compact?: boolean;
  priority?: boolean;
}

const PetCard = ({ id, name, breed, age, location, image, type, compact = false, priority = false }: PetProps) => {
  const { isAuthenticated } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [imgError, setImgError] = useState(false);

  const isFavorited = favorites.includes(id);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      setShowAuthModal(true);
    } else {
      toggleFavorite(id);
    }
  };

  const imgSrc = imgError ? '/placeholder.svg' : (image || '/placeholder.svg');
  const petSlug = generatePetSlug(name, id);

  return (
    <>
      <article
        className={`group/pet relative h-full border border-playful-text/10 bg-white p-2 shadow-soft transition-[border-color,box-shadow,transform] duration-200 ease-out hover:border-playful-teal/30 hover:shadow-md motion-safe:hover:-translate-y-0.5 motion-reduce:transition-none ${compact ? 'rounded-[1.5rem]' : 'rounded-[1.75rem]'}`}
      >
        <Link
          href={`/pet/${petSlug}`}
          aria-label={`Meet ${name}`}
          className={`flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-playful-teal-text ${compact ? 'rounded-[1rem]' : 'rounded-[1.25rem]'}`}
        >
          <div className={`relative aspect-[4/3] overflow-hidden bg-playful-cream outline outline-1 -outline-offset-1 outline-black/10 ${compact ? 'rounded-[1rem]' : 'rounded-[1.25rem]'}`}>
            <Image
              src={imgSrc}
              alt={name}
              width={compact ? 300 : 400}
              height={compact ? 300 : 400}
              sizes={compact ? '(max-width: 640px) 50vw, 25vw' : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw'}
              unoptimized
              priority={priority}
              loading={priority ? 'eager' : 'lazy'}
              className="h-full w-full object-cover motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-out motion-safe:group-hover/pet:scale-[1.02]"
              onError={() => setImgError(true)}
            />
            <span className={`absolute inline-block truncate rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-playful-text shadow-sm ${compact ? 'left-2 top-2 max-w-[calc(100%-4rem)]' : 'bottom-3 left-3 max-w-[calc(100%-1.5rem)]'}`}>
              <span aria-hidden="true">{type === 'dog' ? '🐶' : type === 'cat' ? '🐱' : '🐾'}</span>{' '}
              {compact ? (typeof age === 'string' ? age : `${age}yr`) : breed}
            </span>
          </div>

          <div className={`flex flex-1 flex-col ${compact ? 'px-1.5 pb-2 pt-3 sm:px-2' : 'px-3 pb-3 pt-4 sm:px-4 sm:pb-4'}`}>
            <div className="flex items-start justify-between gap-2">
              <h3 className={`min-w-0 flex-1 font-heading font-extrabold leading-tight text-playful-text transition-colors duration-150 group-hover/pet:text-playful-teal-text motion-reduce:transition-none ${compact ? 'line-clamp-1 text-base sm:text-lg' : 'line-clamp-2 text-2xl'}`}>
                {name}
              </h3>
              {!compact && (
                <span className="max-w-[45%] rounded-full bg-playful-cream px-2.5 py-1 text-xs font-semibold text-playful-teal-text">
                  {typeof age === 'string' ? age : `${age} yr${age === 1 ? '' : 's'}`}
                </span>
              )}
            </div>

            <div className="mt-2 flex items-center gap-1.5 text-gray-600">
              <MapPin aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-playful-coral-text" />
              <span className={`truncate font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{location}</span>
            </div>

            {!compact && (
              <div className="mt-auto pt-5">
                <span className="flex min-h-11 items-center justify-center rounded-full bg-playful-teal/10 px-4 py-2.5 text-center font-heading text-sm font-bold text-playful-teal-text transition-colors duration-150 group-hover/pet:bg-playful-teal-text group-hover/pet:text-white motion-reduce:transition-none">
                  Meet {name}
                </span>
              </div>
            )}
          </div>
        </Link>

        <button
          type="button"
          onClick={handleFavorite}
          aria-label={isFavorited ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
          aria-pressed={isFavorited}
          className={`absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full text-playful-coral-text shadow-sm transition-colors duration-150 hover:bg-playful-coral-text hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-playful-teal-text motion-reduce:transition-none ${isFavorited ? 'bg-playful-cream' : 'bg-white'}`}
        >
          <Heart aria-hidden="true" className={`h-5 w-5 ${isFavorited ? 'fill-current' : ''}`} />
        </button>
      </article>

      <AuthPromptModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        message="Sign in to save your favorite pets and never lose track of them! ❤️"
      />
    </>
  );
};

export default PetCard;

