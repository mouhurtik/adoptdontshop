
import { useState } from 'react';
import { Share, Facebook, Twitter } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Pet } from '@/data/mockData';
import { SupabasePet } from '@/pages/BrowsePets';
import { useIsMobile } from '@/hooks/use-mobile';

interface ShareButtonProps {
  pet: Pet | SupabasePet;
}

const ShareButton = ({ pet }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Handle both pet types (from mock data or Supabase)
  const petName = 'name' in pet ? pet.name : pet.pet_name;
  const petType = 'type' in pet ? pet.type : pet.animal_type;
  const petBreed = pet.breed;
  
  // Get the current URL
  const currentUrl = window.location.href;
  
  // Generate share text
  const shareText = `Meet ${petName}, a wonderful ${petBreed} ${petType?.toLowerCase()} looking for a loving home! Check out their profile:`;
  
  const toggleShareMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${currentUrl}`)
      .then(() => {
        toast.success('Link copied to clipboard!');
        setIsOpen(false);
      })
      .catch(() => {
        toast.error('Failed to copy link');
      });
  };
  
  const handleShare = (platform: string) => {
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
        break;
      case 'reddit':
        shareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(currentUrl)}&title=${encodeURIComponent(shareText)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`;
        break;
      default:
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
      setIsOpen(false);
    }
  };
  
  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="button-secondary flex items-center"
        onClick={toggleShareMenu}
        aria-label="Share"
      >
        <Share className="mr-2 h-5 w-5" />
        Share
      </motion.button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={`absolute ${isMobile ? 'left-0' : 'right-0'} mt-2 w-48 bg-white rounded-md shadow-lg z-10`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <ul className="py-1">
              <li>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={handleCopyLink}
                >
                  <span className="mr-2">📋</span>
                  Copy link
                </button>
              </li>
              <li>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => handleShare('facebook')}
                >
                  <Facebook className="mr-2 h-4 w-4 text-blue-600" />
                  Facebook
                </button>
              </li>
              <li>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => handleShare('twitter')}
                >
                  <Twitter className="mr-2 h-4 w-4 text-blue-400" />
                  Twitter
                </button>
              </li>
              <li>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                  onClick={() => handleShare('reddit')}
                >
                  <span className="mr-2 text-orange-600 font-bold">r/</span>
                  Reddit
                </button>
              </li>
              {isMobile && (
                <li>
                  <button 
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                    onClick={() => handleShare('whatsapp')}
                  >
                    <span className="mr-2 text-green-500 font-semibold flex items-center justify-center">
                      {/* WhatsApp SVG icon */}
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="h-4 w-4"
                      >
                        <path d="M17.6 6.8A7.8 7.8 0 0 0 12 4c-4.4 0-8 3.6-8 8 0 1.4.4 2.8 1 4l-1 4 4-1c1.2.6 2.6 1 4 1 4.4 0 8-3.6 8-8 0-2.1-.8-4.1-2.4-5.7z" />
                        <path d="M15 12c0 .5-.2 1-.5 1.5l-2 2c-1 .5-2.5.8-4-.5-2-1.5-2-2.5-2-3.5 0-.5.2-1 .5-1.5M13.2 9.8a1.3 1.3 0 0 1 1.8 1.8" />
                      </svg>
                    </span>
                    WhatsApp
                  </button>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;



