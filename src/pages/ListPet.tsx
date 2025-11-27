import { useState } from "react";
import { motion } from "framer-motion";
import { PawPrint, Upload, FileText, Shield } from "lucide-react";
import PetListingForm from "@/components/pet-listing/PetListingForm";

const ListPet = () => {
  const [formOpen, setFormOpen] = useState(true);

  return (
    <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16 relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-playful-yellow/20 rounded-full blur-3xl -z-10"></div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-playful-yellow p-4 rounded-full text-white shadow-lg transform -rotate-6">
                <PawPrint className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-black text-playful-text">List a Pet for Adoption</h1>
            </div>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">
              Help a pet find their forever home by listing them on our platform 🏡
            </p>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="bg-white rounded-[2rem] p-6 shadow-soft border-2 border-playful-yellow/30 text-center">
              <div className="bg-playful-yellow/20 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-yellow-600">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-playful-text mb-2">Upload Photos</h3>
              <p className="text-gray-600 font-medium text-sm">
                Share clear, high-quality photos of your pet to help them stand out
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-soft border-2 border-playful-coral/30 text-center">
              <div className="bg-playful-coral/20 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-playful-coral">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-playful-text mb-2">Detailed Info</h3>
              <p className="text-gray-600 font-medium text-sm">
                Provide complete information about your pet's personality and needs
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-soft border-2 border-playful-teal/30 text-center">
              <div className="bg-playful-teal/20 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-playful-teal">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-playful-text mb-2">Safe Process</h3>
              <p className="text-gray-600 font-medium text-sm">
                We verify all listings to ensure the safety of both pets and adopters
              </p>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-xl border-2 border-gray-100"
          >
            <PetListingForm isPage={true} />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ListPet;



