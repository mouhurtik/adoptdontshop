/**
 * Application configuration constants
 */

export const APP_CONFIG = {
  NAME: 'Adopt Don\'t Shop',
  DESCRIPTION: 'Adopt rescue dogs & cats near you',
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
    FACEBOOK: 'https://www.facebook.com/profile.php?id=61583730512051',
    TWITTER: 'https://x.com/mouhurtik',
    INSTAGRAM: 'https://instagram.com/adoptdontshop.xyz',
    LINKEDIN: 'https://www.linkedin.com/company/adoptdontshop-xyz/',
    YOUTUBE: 'https://www.youtube.com/@mouhurtik',
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
