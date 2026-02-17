/**
 * User and caregiver-related type definitions
 */

export interface CaregiverInfo {
  caregiver_name: string;
  mobile: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  hours: string;
  location: string;
}

export interface AdoptionFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  experience: string;
  reason: string;
  agreeToTerms: boolean;
}
