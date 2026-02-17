import { motion } from 'framer-motion';
import { FileText, Shield, Users } from 'lucide-react';
import type { Pet } from '@/types';

interface PetInfoSectionProps {
    pet: Pet;
}

const PetInfoSection = ({ pet }: PetInfoSectionProps) => {
    const petName = pet.name || pet.pet_name;
    const petType = pet.type || pet.animal_type;
    const petDescription = pet.description || `${petName} is looking for a loving home. This ${petType?.toLowerCase()} would make a wonderful companion.`;
    const medicalInfo = pet.medical_info || 'No medical information available';

    const steps = [
        "Fill out an adoption application 📝",
        "Meet with the pet (in-person or virtually) 🤝",
        "Home check (if applicable) 🏠",
        "Adoption fee payment 💳"
    ];

    return (
        <div className="space-y-8">
            {/* About Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white rounded-[2rem] p-8 shadow-soft border border-gray-100"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-playful-yellow/20 p-3 rounded-full text-yellow-600">
                        <FileText className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-playful-text">About {petName}</h2>
                </div>
                <p className="text-gray-600 leading-relaxed text-lg">
                    {petDescription}
                </p>
            </motion.section>

            {/* Medical Info Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white rounded-[2rem] p-8 shadow-soft border border-gray-100"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-playful-mint/30 p-3 rounded-full text-green-600">
                        <Shield className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-playful-text">Medical Information</h2>
                </div>
                <div className="bg-playful-cream rounded-xl p-6 border border-playful-mint/20">
                    <p className="text-gray-700 font-medium text-lg">{medicalInfo}</p>
                </div>
            </motion.section>

            {/* Adoption Process Section */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-white rounded-[2rem] p-8 shadow-soft border border-gray-100"
            >
                <div className="flex items-center gap-4 mb-6">
                    <div className="bg-playful-lavender/30 p-3 rounded-full text-purple-600">
                        <Users className="h-6 w-6" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-playful-text">Adoption Process</h2>
                </div>
                <div className="space-y-4">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 rounded-xl hover:bg-playful-cream transition-colors duration-300">
                            <div className="flex-shrink-0 w-8 h-8 bg-playful-coral text-white rounded-full flex items-center justify-center font-bold text-sm">
                                {index + 1}
                            </div>
                            <p className="text-gray-700 font-medium text-lg">{step}</p>
                        </div>
                    ))}
                </div>
            </motion.section>
        </div>
    );
};

export default PetInfoSection;



