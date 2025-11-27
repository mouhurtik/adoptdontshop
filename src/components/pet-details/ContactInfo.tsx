
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';

interface ContactInfoProps {
  petName: string;
  petId?: string;
}

type CaregiverInfo = {
  caregiver_name: string;
  mobile: string;
}

const ContactInfo = ({ petName, petId }: ContactInfoProps) => {
  const [caregiverInfo, setCaregiverInfo] = useState<CaregiverInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCaregiverInfo = async () => {
      if (!petId) return;
      
      try {
        const { data, error } = await supabase
          .from('pet_listings')
          .select('caregiver_name, mobile')
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
    <div className="lg:w-1/3 xl:w-1/4">
      <div className="bg-white rounded-lg border border-gray-100 p-6 shadow-soft sticky top-24">
        <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm text-gray-500 mb-1">Name</label>
            {isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <p className="font-medium">{caregiverInfo?.caregiver_name || 'Not available'}</p>
            )}
          </div>
          <div>
            <label className="block text-sm text-gray-500 mb-1">Contact</label>
            {isLoading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <p className="font-medium">{caregiverInfo?.mobile || 'Not available'}</p>
            )}
          </div>
        </div>
        
        <button className="w-full button-primary">
          Contact About {petName}
        </button>
      </div>
    </div>
  );
};

export default ContactInfo;



