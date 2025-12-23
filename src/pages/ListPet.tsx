import { PawPrint, Upload, FileText, Shield } from "lucide-react";
import PetListingForm from "@/components/pet-listing/PetListingForm";
import ScrollReveal from "@/components/ui/ScrollReveal";

const ListPet = () => {

  return (
    <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <ScrollReveal
            mode="fade-up"
            duration={0.5}
            width="100%"
            className="text-center mb-16 relative"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-playful-yellow/20 rounded-full blur-3xl -z-10"></div>
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="bg-playful-yellow p-4 rounded-full text-white shadow-lg transform -rotate-6">
                <PawPrint className="h-8 w-8" />
              </div>
              <h1 className="text-3xl md:text-6xl font-heading font-black text-playful-text leading-tight">
                List a Pet for
                <span className="relative inline-block ml-3 transform -rotate-2">
                  <span className="absolute inset-0 bg-playful-coral rounded-2xl transform rotate-2"></span>
                  <span className="relative text-white px-4 py-1">Adoption</span>
                </span>
              </h1>
            </div>
            <p className="text-2xl md:text-3xl text-gray-600 font-bold max-w-2xl mx-auto font-heading">
              Help a pet find their forever home by listing them on our platform 🏡
            </p>
          </ScrollReveal>

          {/* Info Cards */}
          <ScrollReveal
            mode="fade-up"
            delay={0.2}
            width="100%"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <div className="bg-white rounded-[2rem] p-6 shadow-soft border-2 border-playful-yellow/30 text-center hover:scale-105 transition-transform duration-300">
              <div className="bg-playful-yellow/20 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-yellow-600">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-playful-text mb-2">Upload Photos</h3>
              <p className="text-gray-600 font-medium text-sm">
                Share clear, high-quality photos of your pet to help them stand out
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-soft border-2 border-playful-coral/30 text-center hover:scale-105 transition-transform duration-300">
              <div className="bg-playful-coral/20 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-playful-coral">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-playful-text mb-2">Detailed Info</h3>
              <p className="text-gray-600 font-medium text-sm">
                Provide complete information about your pet's personality and needs
              </p>
            </div>

            <div className="bg-white rounded-[2rem] p-6 shadow-soft border-2 border-playful-teal/30 text-center hover:scale-105 transition-transform duration-300">
              <div className="bg-playful-teal/20 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-playful-teal">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-heading font-bold text-playful-text mb-2">Safe Process</h3>
              <p className="text-gray-600 font-medium text-sm">
                We verify all listings to ensure the safety of both pets and adopters
              </p>
            </div>
          </ScrollReveal>

          {/* Form Section */}
          <ScrollReveal
            mode="fade-up"
            delay={0.4}
            width="100%"
            className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-xl border-2 border-gray-100"
          >
            <PetListingForm isPage={true} />
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
};

export default ListPet;



