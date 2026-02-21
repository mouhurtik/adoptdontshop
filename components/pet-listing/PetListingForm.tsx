'use client';

import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { generatePetSlug } from "@/utils/slugUtils";
import SuccessDialog from "./form-sections/SuccessDialog";
import CaregiverInfoSection from "./form-sections/CaregiverInfoSection";
import PetInfoSection from "./form-sections/PetInfoSection";
import PhotoUploadSection from "./form-sections/PhotoUploadSection";
import TermsSection from "./form-sections/TermsSection";
import FormActions from "./form-sections/FormSubmitButtons";
import { INITIAL_FORM_DATA } from "./form-sections/types";

interface PetListingFormProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    isPage?: boolean;
}

const PetListingForm = ({ open = true, onOpenChange = () => { }, isPage = false }: PetListingFormProps) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ ...INITIAL_FORM_DATA });
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, animalType: e.target.value }));
    };

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData(prev => ({ ...prev, [name]: checked }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            toast.error("Please sign in to submit a listing");
            return;
        }

        if (!formData.agreeToTerms) {
            toast.error("Please agree to the Terms and Conditions");
            return;
        }

        if (!formData.agreeToPrivacyPolicy) {
            toast.error("Please agree to the Privacy Policy");
            return;
        }

        if (!image) {
            toast.error("Please upload a pet image");
            return;
        }

        if (!formData.location) {
            toast.error("Please enter a location");
            return;
        }

        if (!formData.age) {
            toast.error("Please enter the pet's age");
            return;
        }

        setIsSubmitting(true);

        try {
            const petId = crypto.randomUUID();

            let imageUrl = null;
            if (image) {
                const fileExt = image.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;

                const { error: uploadError, data } = await supabase.storage
                    .from('pet-images')
                    .upload(fileName, image);

                if (uploadError) {
                    throw uploadError;
                }

                if (data) {
                    const { data: urlData } = supabase.storage.from('pet-images').getPublicUrl(fileName);
                    imageUrl = urlData.publicUrl;
                }
            }

            const { error } = await supabase.from('pet_listings').insert({
                id: petId,
                caregiver_name: formData.caregiverName,
                mobile: formData.mobile,
                pet_name: formData.petName,
                location: formData.location,
                animal_type: formData.animalType,
                breed: formData.breed,
                medical_info: formData.medicalInfo,
                description: formData.description,
                age: formData.age,
                image_url: imageUrl,
                status: 'pending',
                user_id: user?.id || null,
                slug: generatePetSlug(formData.petName, petId),
            });

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            setShowSuccessDialog(true);
            resetForm();

        } catch (error) {
            console.error('Error submitting pet listing:', error);
            toast.error("Failed to submit listing. Please try again.");
        } finally {
            setIsSubmitting(false);
            if (!isPage) {
                onOpenChange(false);
            }
        }
    };

    const resetForm = () => {
        setFormData({ ...INITIAL_FORM_DATA });
        setImage(null);
        setPreviewUrl(null);
    };

    const formContent = (
        <form onSubmit={handleSubmit} className="space-y-8">
            <CaregiverInfoSection
                formData={formData}
                onInputChange={handleInputChange}
            />

            <PetInfoSection
                formData={formData}
                onInputChange={handleInputChange}
                onSelectChange={handleSelectChange}
            />

            <PhotoUploadSection
                previewUrl={previewUrl}
                onFileChange={handleFileChange}
                onRemoveImage={handleRemoveImage}
            />

            <TermsSection
                formData={formData}
                onCheckboxChange={handleCheckboxChange}
            />

            <FormActions
                isSubmitting={isSubmitting}
                isPage={isPage}
                isAuthenticated={!!user}
                onCancel={!isPage ? () => onOpenChange(false) : undefined}
            />
        </form>
    );

    return (
        <>
            {isPage ? (
                formContent
            ) : (
                <Dialog open={open} onOpenChange={onOpenChange}>
                    <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-[2rem] border-4 border-playful-yellow/20">
                        <DialogHeader>
                            <DialogTitle className="text-3xl font-heading font-black text-center text-playful-text">List a Pet</DialogTitle>
                            <p className="text-center text-gray-600 font-medium">
                                Help a pet find their forever home 🏡
                            </p>
                        </DialogHeader>
                        {formContent}
                    </DialogContent>
                </Dialog>
            )}

            <SuccessDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog} />
        </>
    );
};

export default PetListingForm;
