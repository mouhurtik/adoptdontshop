import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Heart, Share2 } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { Pet } from '@/hooks/usePets';

interface PetDetailsHeaderProps {
    pet: Pet;
    openAdoptModal: () => void;
}

const PetDetailsHeader = ({ pet, openAdoptModal }: PetDetailsHeaderProps) => {
    return (
        <div className="relative mb-12">
            <div className="bg-white rounded-[3rem] p-8 shadow-xl border-2 border-playful-cream relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative group"
                    >
                        <div className="absolute inset-0 bg-playful-yellow rounded-[2.5rem] rotate-3 group-hover:rotate-6 transition-transform duration-300 opacity-20"></div>
                        <img
                            src={pet.image || pet.image_url || "/placeholder.svg"}
                            alt={pet.name || pet.pet_name}
                            className="relative w-full h-[300px] md:h-[400px] object-cover rounded-[2.5rem] shadow-lg transform transition-transform duration-500 group-hover:scale-[1.02]"
                        />
                        {pet.urgent && (
                            <div className="absolute top-6 left-6 bg-red-500 text-white px-6 py-2 rounded-full font-bold shadow-lg animate-pulse">
                                Urgent Need ❤️
                            </div>
                        )}
                    </motion.div>

                    {/* Info Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-3xl md:text-5xl font-heading font-black text-playful-text mb-2">
                                    {pet.name || pet.pet_name}
                                </h1>
                                <div className="flex items-center text-gray-500 font-medium text-lg">
                                    <MapPin className="w-5 h-5 mr-2 text-playful-teal" />
                                    {pet.location}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-3 bg-playful-cream rounded-full hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors">
                                    <Heart className="w-6 h-6" />
                                </button>
                                <button className="p-3 bg-playful-cream rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors">
                                    <Share2 className="w-6 h-6" />
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-2 bg-playful-teal/10 text-playful-teal rounded-xl font-bold">
                                {pet.type || pet.animal_type}
                            </span>
                            <span className="px-4 py-2 bg-playful-coral/10 text-playful-coral rounded-xl font-bold">
                                {pet.breed}
                            </span>
                            <span className="px-4 py-2 bg-playful-yellow/20 text-yellow-700 rounded-xl font-bold">
                                {pet.age}
                            </span>
                        </div>

                        <p className="text-gray-600 text-lg leading-relaxed">
                            {pet.description}
                        </p>

                        <div className="pt-6 flex flex-col sm:flex-row gap-4">
                            <PrimaryButton
                                onClick={openAdoptModal}
                                size="lg"
                                className="flex-1 text-lg justify-center"
                            >
                                Adopt {pet.name || pet.pet_name} 🐾
                            </PrimaryButton>
                            <PrimaryButton
                                variant="outline"
                                size="lg"
                                className="flex-1 text-lg justify-center"
                            >
                                Sponsor Me
                            </PrimaryButton>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default PetDetailsHeader;



