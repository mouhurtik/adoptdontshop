/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  NAME: 'Adopt Don\'t Shop',
  DESCRIPTION: 'Find your perfect pet companion',
  CONTACT: {
    PHONE: '(555) 123-4567',
    EMAIL: 'adopt@adoptdontshop.com',
    ADDRESS: '123 Puppy Lane, Pet City, PC 12345',
  },
  HOURS: {
    WEEKDAY: 'Mon-Sat: 9am - 6pm',
    WEEKEND: 'Sun: 10am - 4pm',
  },
  SOCIAL: {
    FACEBOOK: 'https://facebook.com/adoptdontshop',
    TWITTER: 'https://twitter.com/adoptdontshop',
    INSTAGRAM: 'https://instagram.com/adoptdontshop',
  },
} as const;

export const QUERY_CONFIG = {
  STALE_TIME: 1000 * 60 * 5, // 5 minutes
  RETRY: 1,
  REFETCH_ON_WINDOW_FOCUS: false,
} as const;

export const ANIMAL_TYPES = ['Dog', 'Cat', 'Bird', 'Small Pet', 'Other'] as const;

export const PET_STATUS = {
  AVAILABLE: 'available',
  PENDING: 'pending',
  ADOPTED: 'adopted',
} as const;
