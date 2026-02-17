/**
 * Pet-related type definitions
 * Single source of truth for all pet types across the application
 */

export type AnimalType = 'Dog' | 'Cat' | 'Bird' | 'Small Pet' | 'Other';

export type PetStatus = 'available' | 'pending' | 'adopted' | 'urgent';

/**
 * Core Pet interface - represents a pet from the database
 * Includes optional transformed fields for UI convenience
 */
export interface Pet {
  id: string;
  pet_name: string;
  animal_type: AnimalType | string | null;
  breed: string;
  age: string | number | null;
  location: string;
  description: string | null;
  medical_info: string | null;
  image_url: string | null;
  status: PetStatus | string;
  caregiver_name: string;
  mobile: string;
  created_at: string;
  updated_at?: string;

  // Optional transformed fields for UI convenience
  name?: string;        // Alias for pet_name
  type?: string;        // Alias for animal_type
  image?: string;       // Alias for image_url
  urgent?: boolean;     // Derived from status === 'urgent'
}

/**
 * Filters used in the browse/search functionality
 */
export interface PetFilters {
  searchTerm: string;
  selectedType: 'all' | 'Dog' | 'Cat' | 'Bird' | 'Small Pet';
  selectedAge: 'all' | 'baby' | 'young' | 'adult' | 'senior';
  showUrgentOnly: boolean;
  sortBy: 'newest' | 'oldest' | 'nameAsc' | 'nameDesc';
}

export interface PetCardProps {
  id: string;
  name: string;
  breed: string;
  age: string;
  location: string;
  imageUrl: string;
  animalType: AnimalType;
}

export interface PetListingFormData {
  caregiverName: string;
  mobile: string;
  petName: string;
  location: string;
  animalType: string;
  breed: string;
  medicalInfo: string;
  description: string;
  age: string;
  agreeToTerms: boolean;
  agreeToPrivacyPolicy: boolean;
}
