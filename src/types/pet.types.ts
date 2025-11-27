/**
 * Pet-related type definitions
 */

export type AnimalType = 'Dog' | 'Cat' | 'Bird' | 'Small Pet' | 'Other';

export type PetStatus = 'available' | 'pending' | 'adopted';

export interface Pet {
  id: string;
  pet_name: string;
  animal_type: AnimalType;
  breed: string;
  age: string;
  location: string;
  description: string;
  medical_info: string;
  image_url: string | null;
  status: PetStatus;
  caregiver_name: string;
  mobile: string;
  created_at?: string;
  updated_at?: string;
}

export interface PetFilters {
  animalType: string;
  location: string;
  searchQuery: string;
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
