'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MapPin, Clock, User, MessageCircle, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useStartConversation } from '@/hooks/useMessages';

interface ContactInfoCardProps {
  petId?: string;
  petLocation?: string;
}

type CaregiverInfo = {
  caregiver_name: string;
  mobile: string;
  location: string;
  user_id: string | null;
};

const ContactInfoCard = ({ petId, petLocation }: ContactInfoCardProps) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const startConversation = useStartConversation();

  const [caregiverInfo, setCaregiverInfo] = useState<CaregiverInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const fetchCaregiverInfo = async () => {
      if (!petId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('pet_listings')
          .select('caregiver_name, mobile, location, user_id')
          .eq('id', petId)
          .single();

        if (error) {
          console.error('Error fetching caregiver info:', error);
          return;
        }

        setCaregiverInfo(data);
      } catch (error) {
        console.error('Failed to fetch caregiver info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCaregiverInfo();
  }, [petId]);

  const handleMessageClick = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!caregiverInfo?.user_id || !petId) return;

    setIsNavigating(true);
    try {
      const conversationId = await startConversation.mutateAsync({
        recipientId: caregiverInfo.user_id,
        petListingId: petId,
        initialMessage: `Hi! I'm interested in adopting this pet.`,
      });
      router.push(`/messages?conv=${conversationId}`);
    } catch (error) {
      console.error('Failed to start conversation:', error);
      setIsNavigating(false);
    }
  };

  const isOwnPet = user?.id === caregiverInfo?.user_id;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-soft border border-gray-100 w-full lg:w-96 flex-shrink-0 h-fit sticky top-24"
    >
      <h3 className="text-xl lg:text-2xl font-heading font-bold text-playful-text mb-4 lg:mb-6">
        Contact Information
      </h3>

      <div className="space-y-4 lg:space-y-6">
        <div className="flex items-start gap-4">
          <div className="bg-playful-coral/10 p-3 rounded-full text-playful-coral">
            <User className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-gray-800">Caregiver</p>
            {isLoading ? (
              <Skeleton className="h-5 w-32 mt-1" />
            ) : (
              <p className="text-gray-600">{caregiverInfo?.caregiver_name || 'Not available'}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-playful-teal/10 p-3 rounded-full text-playful-teal">
            <Phone className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-gray-800">Phone</p>
            {isLoading ? (
              <Skeleton className="h-5 w-32 mt-1" />
            ) : (
              <p className="text-gray-600">{caregiverInfo?.mobile || 'Not available'}</p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-playful-lavender/30 p-3 rounded-full text-purple-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-gray-800">Location</p>
            {isLoading ? (
              <Skeleton className="h-5 w-32 mt-1" />
            ) : (
              <p className="text-gray-600">
                {caregiverInfo?.location || petLocation || 'Not available'}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-playful-yellow/20 p-3 rounded-full text-yellow-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="font-bold text-gray-800">Availability</p>
            <p className="text-gray-600">Contact for details</p>
          </div>
        </div>
      </div>

      {/* Message Caregiver Button — navigates directly to messages */}
      {!isOwnPet && caregiverInfo?.user_id && (
        <button
          onClick={handleMessageClick}
          disabled={isNavigating || startConversation.isPending}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-playful-teal text-white py-3 px-6 rounded-full font-bold hover:bg-playful-teal/90 transition-all shadow-md hover:shadow-lg disabled:opacity-60"
        >
          {isNavigating || startConversation.isPending ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Opening Messages...
            </>
          ) : (
            <>
              <MessageCircle className="w-5 h-5" />
              Message Caregiver
            </>
          )}
        </button>
      )}

      {/* Map Placeholder */}
      <div className="mt-6 rounded-2xl overflow-hidden h-48 bg-gray-100 relative group">
        <img
          src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600"
          alt="Map location"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors">
          <div className="bg-white p-2 rounded-full shadow-lg">
            <MapPin className="w-6 h-6 text-playful-coral" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ContactInfoCard;
