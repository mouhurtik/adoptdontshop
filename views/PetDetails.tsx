'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { parseSlugId } from '@/utils/slugUtils';
import { usePetBySlug } from '@/hooks/usePets';

// Import Playful components
import PetDetailsHeader from '@/components/pet-details/PetDetailsHeader';
import PetInfoSection from '@/components/pet-details/PetInfoSection';
import AdoptionModal from '@/components/pet-details/AdoptionModal';
import ContactInfoCard from '@/components/pet-details/ContactInfoCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import PawprintLoader from '@/components/ui/PawprintLoader';

const PetDetails = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  // Extract the short ID from the slug for database lookup
  const petIdPrefix = slug ? parseSlugId(slug) : '';

  const { data: pet, isLoading, error } = usePetBySlug(petIdPrefix || undefined);

  useEffect(() => {
    if (error) {
      router.push('/browse');
    }
  }, [error, router]);

  const openAdoptModal = () => {
    setIsAdoptModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAdoptModal = () => {
    setIsAdoptModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  if (isLoading) {
    return <PawprintLoader fullScreen size="lg" message="Loading pet details..." />;
  }

  if (!pet) {
    return (
      <div className="pt-32 pb-16 container mx-auto px-4 min-h-screen bg-playful-cream">
        <div className="text-center py-16 bg-white rounded-[2rem] shadow-soft max-w-2xl mx-auto">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pet Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, we couldn&apos;t find the pet you&apos;re looking for.</p>
          <Link href="/browse">
            <PrimaryButton>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </PrimaryButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-0 lg:pt-32 pb-32 lg:pb-16 bg-white lg:bg-playful-cream min-h-screen relative">
      {/* Absolute Back Button for Mobile (Floating over image) / Standard for Desktop */}
      <div className="absolute lg:relative top-safe lg:top-0 left-4 lg:left-0 z-50 lg:container lg:mx-auto lg:px-4 mt-4 lg:mt-0 lg:mb-6">
        <Link
          href="/browse"
          className="inline-flex items-center justify-center lg:justify-start w-10 h-10 lg:w-auto lg:h-auto bg-black/30 lg:bg-transparent backdrop-blur-md lg:backdrop-blur-none rounded-full lg:rounded-none text-white lg:text-gray-600 hover:text-white lg:hover:text-playful-coral font-bold transition-colors shadow-sm lg:shadow-none active-scale lg:active:scale-100"
        >
          <ArrowLeft className="h-6 w-6 lg:mr-2 lg:h-5 lg:w-5" />
          <span className="hidden lg:inline">Back to Browse</span>
        </Link>
      </div>

      <div className="container mx-auto px-0 lg:px-4">
        <div className="flex flex-col lg:flex-row gap-0 lg:gap-8">
          {/* Left column with pet info */}
          <div className="flex-grow">
            <ScrollReveal mode="fade-up" width="100%">
              <PetDetailsHeader pet={pet} openAdoptModal={openAdoptModal} />
            </ScrollReveal>
            <div className="px-6 lg:px-0">
              <ScrollReveal mode="fade-up" delay={0.2} width="100%">
                <PetInfoSection pet={pet} />
              </ScrollReveal>
            </div>
          </div>

          {/* Right column with contact info */}
          <div className="px-6 lg:px-0 mt-8 lg:mt-0">
            <ScrollReveal
              mode="slide-left"
              delay={0.4}
              width="100%"
              className="w-full lg:w-auto"
            >
              <ContactInfoCard petId={pet.id} petLocation={pet.location} />
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Floating Action Bar */}
      <div className="lg:hidden fixed bottom-6 left-4 right-4 p-4 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] z-40 rounded-[2rem]">
        <PrimaryButton
          onClick={openAdoptModal}
          size="lg"
          className="w-full text-[17px] justify-center active-scale shadow-lg rounded-2xl py-3"
        >
          Adopt {pet.name || pet.pet_name} 🐾
        </PrimaryButton>
      </div>

      {/* Adoption Modal */}
      <AnimatePresence>
        {isAdoptModalOpen && (
          <AdoptionModal
            pet={pet}
            onClose={closeAdoptModal}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            setShowSuccess={setShowSuccess}
          />
        )}
      </AnimatePresence>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-heading font-bold text-playful-text mb-2">
              Application Sent!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in adopting {pet.name}. We&apos;ll be in touch soon!
            </p>
            <PrimaryButton
              onClick={() => {
                setShowSuccess(false);
                closeAdoptModal();
              }}
              className="w-full justify-center active-scale py-3.5 rounded-xl"
            >
              Yay!
            </PrimaryButton>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetDetails;
