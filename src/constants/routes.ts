/**
 * Application route constants
 * Centralized route definitions to avoid magic strings
 */

export const ROUTES = {
  HOME: '/',
  BROWSE: '/browse',
  PET_DETAILS: '/pet/:id',
  SUCCESS_STORIES: '/success-stories',
  SPONSORS: '/sponsors',
  ABOUT: '/about',
  TERMS: '/terms',
  PRIVACY_POLICY: '/privacy-policy',
  LIST_PET: '/list-pet',
} as const;

/**
 * Helper function to generate pet details route
 */
export const getPetDetailsRoute = (petId: string): string => {
  return `/pet/${petId}`;
};
