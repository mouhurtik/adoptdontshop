import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface ContactInfoCardProps {
  petId?: string;
  petLocation?: string;
}

type CaregiverInfo = {
  caregiver_name: string;
  mobile: string;
  location: string;
};

const ContactInfoCard = ({ petId, petLocation }: ContactInfoCardProps) => {
  const [caregiverInfo, setCaregiverInfo] = useState<CaregiverInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCaregiverInfo = async () => {
      if (!petId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('pet_listings')
          .select('caregiver_name, mobile, location')
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

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-[2rem] p-8 shadow-soft border border-gray-100 lg:w-96 flex-shrink-0 h-fit sticky top-24"
    >
      <h3 className="text-2xl font-heading font-bold text-playful-text mb-6">
        Contact Information
      </h3>

      <div className="space-y-6">
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

      {/* Map Placeholder */}
      <div className="mt-8 rounded-2xl overflow-hidden h-48 bg-gray-100 relative group">
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
