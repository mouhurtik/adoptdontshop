import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Facebook, Twitter, Download, Copy, X, Share2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import type { Pet } from '@/types';
import ShareablePetCard from './ShareablePetCard';
import PrimaryButton from '../ui/PrimaryButton';

interface ShareButtonProps {
  pet: Pet;
}

const ShareButton = ({ pet }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Handle both pet types
  const petName = pet.name || pet.pet_name;
  const petBreed = pet.breed;
  const petType = pet.type || pet.animal_type;

  // Unique ID for the card element
  const cardId = `pet-card-${pet.id}`;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = `Meet ${petName}, a wonderful ${petBreed} ${petType?.toLowerCase()} looking for a loving home! Check out their profile:`;

  // Hydration state
  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && 'share' in navigator && generatedImage) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        const file = new File([blob], `share-${petName.replace(/\s+/g, '-')}.png`, { type: 'image/png' });

        if ('canShare' in navigator && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: `Meet ${petName}!`,
            text: shareText,
            url: currentUrl,
            files: [file]
          });
          toast.success('Shared successfully!');
          return;
        } else {
          // Fallback if browser doesn't permit files but does have navigator.share
          await navigator.share({
            title: `Meet ${petName}!`,
            text: shareText,
            url: currentUrl,
          });
          toast.success('Shared link successfully!');
        }
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          console.error("Error sharing:", err);
        }
      }
    }
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

      {mounted && typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isOpen && (
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 sm:p-6 lg:p-8">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
              />

              {/* Modal Card */}
              <motion.div
                initial={{ opacity: 0, y: 100, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 100, scale: 0.95 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white w-full max-w-5xl shadow-2xl relative flex flex-col lg:flex-row rounded-[2rem] overflow-hidden lg:max-h-[85vh] max-h-[90vh] z-10"
              >
                {/* Close Button - Absolute */}
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 z-20 p-2.5 bg-white/80 backdrop-blur-md rounded-full shadow-sm hover:bg-gray-100 transition-colors text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Left Col: Image Preview Area */}
                <div className="w-full lg:w-[40%] bg-gray-50 p-4 lg:p-8 relative min-h-[40vh] max-h-[55vh] h-[55vh] lg:h-auto lg:min-h-[400px] lg:max-h-none border-b lg:border-b-0 lg:border-r border-gray-100 flex-shrink-0 flex items-center justify-center overflow-hidden min-h-0">
                  {isGenerating ? (
                    <div className="flex flex-col items-center gap-4 text-playful-teal">
                      <div className="relative">
                        <div className="absolute inset-0 bg-playful-teal/20 blur-xl rounded-full animate-pulse"></div>
                        <Loader2 className="w-10 h-10 animate-spin relative z-10 drop-shadow-sm" />
                      </div>
                      <span className="font-semibold text-lg animate-pulse tracking-wide">Creating magic card...</span>
                    </div>
                  ) : generatedImage ? (
                    <div className="relative group w-full h-full">
                      <img src={generatedImage} alt="Share Card" className="absolute inset-0 w-full h-full object-contain rounded-xl shadow-lg ring-1 ring-black/5" />
                      <div className="absolute inset-0 bg-black/0 lg:group-hover:bg-black/20 transition-all duration-300 rounded-xl flex items-center justify-center opacity-0 lg:group-hover:opacity-100 backdrop-blur-[2px] pointer-events-none lg:pointer-events-auto">
                        <PrimaryButton onClick={handleDownload} size="sm" className="shadow-2xl scale-95 group-hover:scale-100 transition-transform hidden lg:flex">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </PrimaryButton>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-400 font-medium bg-gray-100 px-4 py-2 rounded-lg">Failed to generate preview</div>
                  )}
                </div>

                {/* Right Col: Actions & Social */}
                <div className="w-full lg:w-[60%] p-5 sm:p-6 lg:p-10 flex flex-col justify-center overflow-y-auto custom-scrollbar bg-white">
                  <div className="mb-4 sm:mb-8">
                    <h3 className="text-xl sm:text-3xl font-heading font-black text-gray-900 mb-1 sm:mb-3 tracking-tight">Share {petName}</h3>
                    <p className="text-xs sm:text-base text-gray-500 font-medium leading-snug sm:leading-relaxed">Sharing increases adoption chances by 3x. Help find a forever home!</p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-8">
                    <button
                      onClick={handleDownload}
                      disabled={!generatedImage}
                      className="flex flex-col items-center justify-center gap-1.5 sm:gap-3 p-2 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-playful-teal/10 text-playful-teal-text font-bold hover:bg-playful-teal hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed group shadow-sm active:scale-95 border border-transparent hover:border-playful-teal/20"
                    >
                      <Download className="w-4 h-4 sm:w-7 sm:h-7 lg:group-hover:scale-110 lg:group-hover:-translate-y-1 transition-transform" />
                      <span className="text-[11px] sm:text-sm border-b-2 border-transparent">Save Image</span>
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="flex flex-col items-center justify-center gap-1.5 sm:gap-3 p-2 sm:p-4 lg:p-5 rounded-xl sm:rounded-2xl bg-playful-coral/10 text-playful-coral-text font-bold hover:bg-playful-coral hover:text-white transition-all group shadow-sm active:scale-95 border border-transparent hover:border-playful-coral/20"
                    >
                      <Copy className="w-4 h-4 sm:w-7 sm:h-7 lg:group-hover:scale-110 lg:group-hover:-translate-y-1 transition-transform" />
                      <span className="text-[11px] sm:text-sm border-b-2 border-transparent">Copy Link</span>
                    </button>
                  </div>

                  {/* Social Icons */}
                  <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-6 mt-auto lg:mt-0 border-t border-gray-100/80">
                    {mounted && typeof navigator !== 'undefined' && 'share' in navigator && (
                      <button onClick={handleNativeShare} title="Share via..." className="p-3.5 bg-purple-50 text-purple-600 rounded-full hover:bg-purple-600 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-purple-500/30 transition-all group shrink-0">
                        <Share2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </button>
                    )}
                    <button onClick={() => handleShare('whatsapp')} title="WhatsApp" className="p-3.5 bg-[#E8F8EE] text-[#25D366] rounded-full hover:bg-[#25D366] hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-green-500/30 transition-all group shrink-0">
                      <svg className="w-5 h-5 group-hover:fill-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                    </button>
                    <button onClick={() => handleShare('facebook')} title="Facebook" className="p-3.5 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-blue-500/30 transition-all group shrink-0">
                      <Facebook className="w-5 h-5 group-hover:fill-current" />
                    </button>
                    <button onClick={() => handleShare('twitter')} title="Twitter" className="p-3.5 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-500 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-sky-500/30 transition-all group shrink-0">
                      <Twitter className="w-5 h-5 fill-current" />
                    </button>
                    <button onClick={() => handleShare('reddit')} title="Reddit" className="hidden sm:block p-3.5 bg-orange-50 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white hover:scale-110 hover:shadow-lg hover:shadow-orange-500/30 transition-all group shrink-0">
                      <svg className="w-5 h-5 group-hover:fill-white" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.505 1.12-.82 2.673-1.373 4.38-1.455l.892-4.168a.387.387 0 0 1 .454-.298l3.18.632c.224-.44.675-.758 1.115-.758zM8.336 12.75a1.272 1.272 0 1 0 0 2.544 1.272 1.272 0 0 0 0-2.544zm7.328 0a1.272 1.272 0 1 0 0 2.544 1.272 1.272 0 0 0 0-2.544zm-3.664 3.993c-1.378 0-2.502-.823-2.55-1.85-.006-.115.084-.213.2-.213.106 0 .194.08.203.185.034.408.835 1.416 2.147 1.416 1.312 0 2.113-1.008 2.147-1.416.01-.105.097-.185.203-.185.116 0 .206.098.2.213-.048 1.027-1.172 1.85-2.55 1.85z"/></svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
};

export default ShareButton;
