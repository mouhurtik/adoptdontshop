import { useState, useEffect } from 'react';
import { Facebook, Twitter, Download, Copy, X, Share2, Loader2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import type { Pet } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
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
    document.body.style.overflow = 'hidden';
    if (!generatedImage) {
      generateCard();
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const generateCard = async () => {
    setIsGenerating(true);
    try {
      // Find the element
      const element = document.getElementById(cardId);
      if (element) {
        // Short delay to ensure rendering (especially images)
        await new Promise(resolve => setTimeout(resolve, 500));

        const { default: html2canvas } = await import('html2canvas');
        const canvas = await html2canvas(element, {
          useCORS: true,
          scale: 2, // Retina quality
          backgroundColor: null,
          logging: false,
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
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[85vh] lg:max-h-[80vh]"
            >
              {/* Header with Close Button - Fixed at top */}
              <div className="p-6 pb-2 flex justify-between items-center border-b border-gray-100 flex-shrink-0 bg-white z-20 rounded-t-3xl">
                <h3 className="text-2xl font-heading font-bold text-gray-800">Share {petName}</h3>
                <button
                  onClick={handleClose}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 lg:p-8 pt-0 lg:pt-6 overflow-y-auto custom-scrollbar flex flex-col lg:flex-row gap-6 lg:gap-8">

                {/* Left Col: Image Preview Area */}
                <div className="lg:w-[55%] flex flex-col shrink-0">
                  <div className="bg-playful-cream/50 rounded-2xl p-4 lg:p-6 lg:mb-0 min-h-[250px] lg:min-h-[400px] flex items-center justify-center relative shadow-inner">
                    {isGenerating ? (
                      <div className="flex flex-col items-center gap-3 text-playful-teal">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        <span className="font-medium animate-pulse">Creating magic card...</span>
                      </div>
                    ) : generatedImage ? (
                      <div className="relative group w-full h-full flex flex-col justify-center">
                        <img src={generatedImage} alt="Share Card" className="w-full h-auto max-h-full object-contain rounded-xl shadow-md lg:rounded-2xl lg:shadow-xl" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl lg:rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <PrimaryButton onClick={handleDownload} size="sm" className="shadow-xl">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </PrimaryButton>
                        </div>
                      </div>
                    ) : (
                      <div className="text-gray-400 font-medium">Failed to generate preview</div>
                    )}
                  </div>
                </div>

                {/* Right Col: Actions & Social */}
                <div className="lg:w-[45%] flex flex-col justify-center py-2 lg:py-6">

                  <div className="mb-6 lg:mb-8 text-center lg:text-left">
                    <h4 className="text-xl font-heading font-black text-playful-text mb-2">Help {petName} find a home!</h4>
                    <p className="text-gray-500 font-medium">Sharing increases adoption chances by 3x.</p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mb-8">
                    <button
                      onClick={handleDownload}
                      disabled={!generatedImage}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-playful-teal/10 text-playful-teal font-bold hover:bg-playful-teal hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm active:scale-95"
                    >
                      <Download className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      Save Image
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-playful-coral/10 text-playful-coral font-bold hover:bg-playful-coral hover:text-white transition-all group shadow-sm active:scale-95"
                    >
                      <Copy className="w-6 h-6 group-hover:scale-110 transition-transform" />
                      Copy Link
                    </button>
                  </div>

                  {/* Social Icons */}
                  <div className="flex justify-center lg:justify-start gap-3 lg:gap-4 border-t lg:border-t-0 border-gray-100 pt-6 lg:pt-0 pb-2">
                    <button onClick={() => handleShare('facebook')} className="p-3.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 hover:scale-110 transition-all shadow-sm">
                      <Facebook className="w-6 h-6" />
                    </button>
                    <button onClick={() => handleShare('twitter')} className="p-3.5 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-100 hover:scale-110 transition-all shadow-sm">
                      <Twitter className="w-6 h-6 fill-current" />
                    </button>
                    <button onClick={() => handleShare('reddit')} className="p-3.5 bg-orange-50 text-orange-500 rounded-full hover:bg-orange-100 hover:scale-110 transition-all shadow-sm">
                      <MessageSquare className="w-6 h-6" />
                    </button>
                    {isMobile && (
                      <button onClick={() => handleShare('whatsapp')} className="p-3.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 hover:scale-110 transition-all shadow-sm">
                        <Share2 className="w-6 h-6" />
                      </button>
                    )}
                  </div>
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
