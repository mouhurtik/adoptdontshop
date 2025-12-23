import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase, generateUUID } from "@/integrations/supabase/client";
import { Upload, X, PawPrint, User, Phone, MapPin, Heart, ShieldCheck } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import SuccessDialog from "./form-sections/SuccessDialog";

interface PetListingFormProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    isPage?: boolean;
}

const PetListingForm = ({ open = true, onOpenChange = () => { }, isPage = false }: PetListingFormProps) => {
    const [formData, setFormData] = useState({
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
        agreeToPrivacyPolicy: false
    });

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
            const petId = generateUUID();

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
                status: 'pending'
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
        setFormData({
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
            agreeToPrivacyPolicy: false
        });
        setImage(null);
        setPreviewUrl(null);
    };

    const formContent = (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Caregiver Info */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b-2 border-playful-yellow/30 pb-2">
                    <div className="bg-playful-yellow/20 p-2 rounded-full text-yellow-600">
                        <User className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-playful-text">Caregiver Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="caregiverName" className="text-sm font-bold text-gray-700 ml-1">
                            Your Name *
                        </label>
                        <input
                            id="caregiverName"
                            name="caregiverName"
                            value={formData.caregiverName}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-800 focus:outline-none focus:border-playful-yellow focus:ring-4 focus:ring-playful-yellow/10 transition-all duration-200"
                            placeholder="Enter your name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="mobile" className="text-sm font-bold text-gray-700 ml-1">
                            Mobile Number *
                        </label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                id="mobile"
                                name="mobile"
                                type="tel"
                                value={formData.mobile}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 pl-12 font-medium text-gray-800 focus:outline-none focus:border-playful-yellow focus:ring-4 focus:ring-playful-yellow/10 transition-all duration-200"
                                placeholder="Enter mobile number"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Pet Info */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b-2 border-playful-mint/30 pb-2">
                    <div className="bg-playful-mint/20 p-2 rounded-full text-green-600">
                        <PawPrint className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-playful-text">Pet Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label htmlFor="petName" className="text-sm font-bold text-gray-700 ml-1">
                            Pet Name *
                        </label>
                        <input
                            id="petName"
                            name="petName"
                            value={formData.petName}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-800 focus:outline-none focus:border-playful-mint focus:ring-4 focus:ring-playful-mint/10 transition-all duration-200"
                            placeholder="Enter pet name"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="age" className="text-sm font-bold text-gray-700 ml-1">
                            Pet Age *
                        </label>
                        <input
                            id="age"
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-800 focus:outline-none focus:border-playful-mint focus:ring-4 focus:ring-playful-mint/10 transition-all duration-200"
                            placeholder="e.g., 2 years, 6 months"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="location" className="text-sm font-bold text-gray-700 ml-1">
                            Location *
                        </label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                id="location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                required
                                className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 pl-12 font-medium text-gray-800 focus:outline-none focus:border-playful-mint focus:ring-4 focus:ring-playful-mint/10 transition-all duration-200"
                                placeholder="City, State"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="animalType" className="text-sm font-bold text-gray-700 ml-1">
                            Animal Type *
                        </label>
                        <select
                            id="animalType"
                            value={formData.animalType}
                            onChange={handleSelectChange}
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-800 focus:outline-none focus:border-playful-mint focus:ring-4 focus:ring-playful-mint/10 transition-all duration-200 appearance-none"
                        >
                            <option value="">Select Animal Type</option>
                            <option value="Dog">Dog</option>
                            <option value="Cat">Cat</option>
                            <option value="Bird">Bird</option>
                            <option value="Small Pet">Small Pet</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="breed" className="text-sm font-bold text-gray-700 ml-1">
                            Breed / Species *
                        </label>
                        <input
                            id="breed"
                            name="breed"
                            value={formData.breed}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-800 focus:outline-none focus:border-playful-mint focus:ring-4 focus:ring-playful-mint/10 transition-all duration-200"
                            placeholder="Enter breed or species"
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="medicalInfo" className="text-sm font-bold text-gray-700 ml-1">
                            Medical History *
                        </label>
                        <input
                            id="medicalInfo"
                            name="medicalInfo"
                            value={formData.medicalInfo}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-800 focus:outline-none focus:border-playful-mint focus:ring-4 focus:ring-playful-mint/10 transition-all duration-200"
                            placeholder="Vaccinations, spayed/neutered, etc."
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-bold text-gray-700 ml-1">
                        Description *
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Tell us about the pet's personality, habits, and needs..."
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-800 focus:outline-none focus:border-playful-mint focus:ring-4 focus:ring-playful-mint/10 transition-all duration-200 min-h-32 resize-none"
                        required
                    />
                </div>
            </div>

            {/* Photo Upload */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b-2 border-playful-coral/30 pb-2">
                    <div className="bg-playful-coral/20 p-2 rounded-full text-playful-coral">
                        <Upload className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-playful-text">Pet Photo</h3>
                </div>

                {!previewUrl ? (
                    <div className="border-4 border-dashed border-gray-200 rounded-[2rem] p-8 text-center hover:border-playful-coral/50 transition-colors bg-gray-50">
                        <div className="bg-white p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full shadow-soft text-playful-coral">
                            <Upload className="h-10 w-10" />
                        </div>
                        <p className="text-lg font-bold text-gray-700 mb-2">
                            Upload a clear photo
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            High-quality photos help pets get adopted faster!
                        </p>
                        <label className="inline-block cursor-pointer">
                            <span className="bg-playful-coral hover:bg-playful-coral/90 text-white px-6 py-3 rounded-full font-bold shadow-lg shadow-playful-coral/20 transition-all hover:-translate-y-1 inline-flex items-center gap-2">
                                <Upload className="h-5 w-5" />
                                Choose Photo
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                required
                            />
                        </label>
                    </div>
                ) : (
                    <div className="relative rounded-[2rem] overflow-hidden shadow-lg border-4 border-white">
                        <img
                            src={previewUrl}
                            alt="Pet preview"
                            className="w-full h-64 object-cover"
                        />
                        <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-4 right-4 bg-white/90 text-red-500 p-2 rounded-full shadow-md hover:bg-red-50 transition-colors"
                        >
                            <X className="h-6 w-6" />
                        </button>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-4 text-white text-center font-bold">
                            Looking good! 📸
                        </div>
                    </div>
                )}
            </div>

            {/* Terms & Privacy */}
            <div className="space-y-6">
                <div className="flex items-center gap-3 border-b-2 border-playful-teal/30 pb-2">
                    <div className="bg-playful-teal/20 p-2 rounded-full text-playful-teal">
                        <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h3 className="text-xl font-heading font-bold text-playful-text">Terms & Privacy</h3>
                </div>

                <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.agreeToTerms}
                                onChange={(e) => handleCheckboxChange('agreeToTerms', e.target.checked)}
                                className="peer h-6 w-6 appearance-none border-2 border-gray-300 rounded-lg checked:bg-playful-teal checked:border-playful-teal transition-all"
                            />
                            <Heart className="absolute left-1 top-1 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                        </div>
                        <span className="text-gray-600 pt-0.5 group-hover:text-gray-900 transition-colors">
                            I agree to the <span className="text-playful-teal font-bold hover:underline">Terms and Conditions</span>
                        </span>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center">
                            <input
                                type="checkbox"
                                checked={formData.agreeToPrivacyPolicy}
                                onChange={(e) => handleCheckboxChange('agreeToPrivacyPolicy', e.target.checked)}
                                className="peer h-6 w-6 appearance-none border-2 border-gray-300 rounded-lg checked:bg-playful-teal checked:border-playful-teal transition-all"
                            />
                            <Heart className="absolute left-1 top-1 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                        </div>
                        <span className="text-gray-600 pt-0.5 group-hover:text-gray-900 transition-colors">
                            I agree to the <span className="text-playful-teal font-bold hover:underline">Privacy Policy</span>
                        </span>
                    </label>
                </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {!isPage && (
                    <PrimaryButton
                        type="button"
                        variant="secondary"
                        onClick={() => onOpenChange(false)}
                        className="flex-1"
                    >
                        Cancel
                    </PrimaryButton>
                )}
                <PrimaryButton
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 ${isPage ? 'w-full' : ''}`}
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                            Submitting...
                        </span>
                    ) : (
                        <>
                            <PawPrint className="mr-2 h-5 w-5" />
                            List Pet for Adoption
                        </>
                    )}
                </PrimaryButton>
            </div>
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



