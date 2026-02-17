/**
 * Application route constants
 * Centralized route definitions to avoid magic strings
 */

import { generatePetSlug } from '@/utils/slugUtils';

export const ROUTES = {
  HOME: '/',
  BROWSE: '/browse',
  PET_DETAILS: '/pet/:slug',
  SUCCESS_STORIES: '/success-stories',
  SPONSORS: '/sponsors',
  ABOUT: '/about',
  TERMS: '/terms',
  PRIVACY_POLICY: '/privacy-policy',
  LIST_PET: '/list-pet',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  MY_LISTINGS: '/profile/my-listings',
  ADMIN: '/admin',
} as const;

/**
 * Helper function to generate pet details route with clean slug URL
 */
export const getPetDetailsRoute = (petName: string, petId: string): string => {
  return `/pet/${generatePetSlug(petName, petId)}`;
};
