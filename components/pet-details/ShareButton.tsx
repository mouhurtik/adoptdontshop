import { useState } from 'react';
import { Facebook, Twitter, Download, Copy, X, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import type { Pet } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import html2canvas from 'html2canvas';
import ShareablePetCard from './ShareablePetCard';
import PrimaryButton from '../ui/PrimaryButton';

interface ShareButtonProps {
  pet: Pet;
}

const ShareButton = ({ pet }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const isMobile = useIsMobile();

  // Handle both pet types
  const petName = pet.name || pet.pet_name;
  const petBreed = pet.breed;
  const petType = pet.type || pet.animal_type;

  // Unique ID for the card element
  const cardId = `pet-card-${pet.id}`;
  const currentUrl = window.location.href;
  const shareText = `Meet ${petName}, a wonderful ${petBreed} ${petType?.toLowerCase()} looking for a loving home! Check out their profile:`;

  const handleOpen = async () => {
    setIsOpen(true);
    if (!generatedImage) {
      generateCard();
    }
  };

  const generateCard = async () => {
    setIsGenerating(true);
    try {
      // Find the element
      const element = document.getElementById(cardId);
      if (element) {
        // Short delay to ensure rendering (especially images)
        await new Promise(resolve => setTimeout(resolve, 500));

        const canvas = await html2canvas(element, {
          useCORS: true,
          scale: 2, // Reting quality
          backgroundColor: null,
        });
        const dataUrl = canvas.toDataURL('image/png');
        setGeneratedImage(dataUrl);
      }
    } catch (error) {
      console.error("Failed to generate card", error);
      toast.error("Failed to generate share card");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `Meet-${petName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Image downloaded!');
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${shareText} ${currentUrl}`)
      .then(() => toast.success('Link copied!'))
      .catch(() => toast.error('Failed to copy'));
  };

  const handleShare = (platform: string) => {
    let shareUrl = '';
    const text = encodeURIComponent(shareText);
    const url = encodeURIComponent(currentUrl);

    switch (platform) {
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${text}`; break;
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
      case 'reddit': shareUrl = `https://www.reddit.com/submit?url=${url}&title=${text}`; break;
      case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`; break;
    }

    if (shareUrl) window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <>
      <ShareablePetCard pet={pet} elementId={cardId} />

      <button
        onClick={handleOpen}
        className="p-3 bg-playful-cream rounded-full hover:bg-blue-50 text-gray-400 hover:text-blue-500 transition-colors group"
        aria-label="Share"
      >
        <Share2 className="w-6 h-6 group-hover:scale-110 transition-transform" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[85vh]"
            >
              {/* Header with Close Button - Fixed at top */}
              <div className="p-6 pb-2 flex justify-between items-center border-b border-gray-100 flex-shrink-0 bg-white z-20 rounded-t-3xl">
                <h3 className="text-2xl font-heading font-bold text-gray-800">Share {petName}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-8 pt-6 overflow-y-auto custom-scrollbar">

                {/* Image Preview Area */}
                <div className="bg-playful-cream/50 rounded-2xl p-4 mb-6 min-h-[300px] flex items-center justify-center relative">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-3 text-playful-teal">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="font-medium animate-pulse">Creating magic card...</span>
                    </div>
                  ) : generatedImage ? (
                    <div className="relative group w-full">
                      <img src={generatedImage} alt="Share Card" className="w-full rounded-xl shadow-md" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <PrimaryButton onClick={handleDownload} size="sm" className="shadow-xl">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </PrimaryButton>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400">Failed to generate preview</div>
                  )}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <button
                    onClick={handleDownload}
                    disabled={!generatedImage}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-playful-teal/10 text-playful-teal font-bold hover:bg-playful-teal hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-5 h-5" />
                    Save Image
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-all"
                  >
                    <Copy className="w-5 h-5" />
                    Copy Link
                  </button>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-4 border-t border-gray-100 pt-6">
                  <button onClick={() => handleShare('facebook')} className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
                    <Facebook className="w-6 h-6" />
                  </button>
                  <button onClick={() => handleShare('twitter')} className="p-3 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-100 transition-colors">
                    <Twitter className="w-6 h-6" />
                  </button>
                  {isMobile && (
                    <button onClick={() => handleShare('whatsapp')} className="p-3 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors">
                      <Share2 className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareButton;
