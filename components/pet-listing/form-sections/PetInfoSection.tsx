import { PawPrint, MapPin } from "lucide-react";
import type { FormSectionProps } from "./types";

type PetInfoSectionProps = Pick<FormSectionProps, "formData" | "onInputChange" | "onSelectChange">;

const PetInfoSection = ({ formData, onInputChange, onSelectChange }: PetInfoSectionProps) => {
    return (
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
                        onChange={onInputChange}
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
                        onChange={onInputChange}
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
                            onChange={onInputChange}
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
                        onChange={onSelectChange}
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
                        onChange={onInputChange}
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
                        onChange={onInputChange}
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
                    onChange={onInputChange}
                    placeholder="Tell us about the pet's personality, habits, and needs..."
                    className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-800 focus:outline-none focus:border-playful-mint focus:ring-4 focus:ring-playful-mint/10 transition-all duration-200 min-h-32 resize-none"
                    required
                />
            </div>
        </div>
    );
};

export default PetInfoSection;
