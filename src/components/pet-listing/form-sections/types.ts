/** Shared types for PetListingForm sections */

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

export interface FormSectionProps {
    formData: PetListingFormData;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onCheckboxChange: (name: string, checked: boolean) => void;
}

export const INITIAL_FORM_DATA: PetListingFormData = {
    caregiverName: "",
    mobile: "",
    petName: "",
    location: "",
    animalType: "",
    breed: "",
    medicalInfo: "",
    description: "",
    age: "",
    agreeToTerms: false,
    agreeToPrivacyPolicy: false,
};
