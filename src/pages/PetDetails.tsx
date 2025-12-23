import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Pet } from '@/hooks/usePets';

// Import Playful components
import PetDetailsHeader from '@/components/pet-details/PetDetailsHeader';
import PetInfoSection from '@/components/pet-details/PetInfoSection';
import AdoptionModal from '@/components/pet-details/AdoptionModal';
import ContactInfoCard from '@/components/pet-details/ContactInfoCard';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ScrollReveal from '@/components/ui/ScrollReveal';

const PetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [pet, setPet] = useState<Pet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdoptModalOpen, setIsAdoptModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (id) {
      fetchPetFromSupabase(id);
    }
  }, [id]);

  const fetchPetFromSupabase = async (petId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('pet_listings')
        .select('*')
        .eq('id', petId)
        .single();

      if (error) {
        console.error('Error fetching pet from Supabase:', error);
        navigate('/browse');
        toast.error('Pet not found');
        return;
      }

      if (data) {
        // Transform the Supabase data to match the expected format
        const transformedPet: Pet = {
          ...data,
          name: data.pet_name,
          type: data.animal_type,
          age: data.age || 'Unknown',
          urgent: data.status === 'urgent',
          image: data.image_url,
        };

        setPet(transformedPet);
      }
    } catch (error) {
      console.error('Error fetching pet:', error);
      toast.error('Failed to load pet details.');
      navigate('/browse');
    } finally {
      setIsLoading(false);
    }
  };

  const openAdoptModal = () => {
    setIsAdoptModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeAdoptModal = () => {
    setIsAdoptModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  if (isLoading) {
    return (
      <div className="pt-32 min-h-screen flex items-center justify-center bg-playful-cream">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-playful-coral border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium">Loading pet details...</p>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="pt-32 pb-16 container mx-auto px-4 min-h-screen bg-playful-cream">
        <div className="text-center py-16 bg-white rounded-[2rem] shadow-soft max-w-2xl mx-auto">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pet Not Found</h1>
          <p className="text-gray-600 mb-8">Sorry, we couldn't find the pet you're looking for.</p>
          <Link to="/browse">
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
    <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
      <div className="container mx-auto px-4">
        <Link
          to="/browse"
          className="inline-flex items-center text-gray-600 hover:text-playful-coral font-bold mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Browse
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column with pet info */}
          <div className="flex-grow">
            <ScrollReveal mode="fade-up" width="100%">
              <PetDetailsHeader pet={pet} openAdoptModal={openAdoptModal} />
            </ScrollReveal>
            <ScrollReveal mode="fade-up" delay={0.2} width="100%">
              <PetInfoSection pet={pet} />
            </ScrollReveal>
          </div>

          {/* Right column with contact info */}
          <ScrollReveal
            mode="slide-left"
            delay={0.4}
            className="w-full lg:w-auto"
          >
            <ContactInfoCard petName={pet.name} petId={id} petLocation={pet.location} />
          </ScrollReveal>
        </div>
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

      {/* Success Modal - Reusing existing one or creating a simple alert */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full text-center shadow-2xl">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-heading font-bold text-playful-text mb-2">
              Application Sent!
            </h2>
            <p className="text-gray-600 mb-6">
              Thank you for your interest in adopting {pet.name}. We'll be in touch soon!
            </p>
            <PrimaryButton
              onClick={() => {
                setShowSuccess(false);
                closeAdoptModal();
              }}
              className="w-full justify-center"
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
