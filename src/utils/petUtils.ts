import { Pet } from '@/hooks/usePets';

/**
 * Transform raw Supabase pet data to consistent format
 */
export const transformPetData = (rawPet: any): Pet => {
  return {
    ...rawPet,
    name: rawPet.pet_name,
    type: rawPet.animal_type,
    age: rawPet.age || 'Unknown',
    urgent: rawPet.status === 'urgent',
    image: rawPet.image_url
  };
};

/**
 * Get pet display name (handles both name and pet_name fields)
 */
export const getPetDisplayName = (pet: Pet): string => {
  return pet.name || pet.pet_name || 'Unknown Pet';
};

/**
 * Get pet display image (handles both image and image_url fields)
 */
export const getPetDisplayImage = (pet: Pet): string => {
  return pet.image || pet.image_url || '/placeholder.svg';
};

/**
 * Get pet display type (handles both type and animal_type fields)
 */
export const getPetDisplayType = (pet: Pet): string => {
  return pet.type || pet.animal_type || 'Unknown';
};

/**
 * Check if pet is urgent
 */
export const isPetUrgent = (pet: Pet): boolean => {
  return pet.urgent || pet.status === 'urgent';
};

/**
 * Format pet age for display
 */
export const formatPetAge = (age: string): string => {
  if (!age || age === 'Unknown') return 'Unknown';
  
  const ageLower = age.toLowerCase();
  
  if (ageLower.includes('week')) {
    return age;
  }
  
  if (ageLower.includes('month')) {
    return age;
  }
  
  if (ageLower.includes('year')) {
    return age;
  }
  
  // If it's just a number, assume it's years
  const years = parseInt(age);
  if (!isNaN(years)) {
    return `${years} year${years === 1 ? '' : 's'} old`;
  }
  
  return age;
};

/**
 * Get pet type icon name for Lucide React
 */
export const getPetTypeIcon = (type: string): string => {
  const typeLower = type.toLowerCase();
  
  switch (typeLower) {
    case 'dog':
      return 'Dog';
    case 'cat':
      return 'Cat';
    case 'bird':
      return 'Bird';
    case 'small pet':
    case 'hamster':
    case 'rabbit':
    case 'guinea pig':
      return 'Mouse';
    default:
      return 'PawPrint';
  }
};

/**
 * Get urgency badge color
 */
export const getUrgencyColor = (isUrgent: boolean): string => {
  return isUrgent ? 'red' : 'green';
};

/**
 * Validate pet data
 */
export const validatePetData = (pet: Pet): boolean => {
  return !!(
    pet.id &&
    (pet.name || pet.pet_name) &&
    (pet.type || pet.animal_type) &&
    pet.breed &&
    pet.location &&
    (pet.image || pet.image_url)
  );
};
