import React from 'react';
import { motion } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Pet } from '@/hooks/usePets';

interface AdoptionModalProps {
  pet: Pet;
  onClose: () => void;
  isSubmitting: boolean;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setShowSuccess: (showSuccess: boolean) => void;
}

const AdoptionModal = ({
  pet,
  onClose,
  isSubmitting,
  setIsSubmitting,
  setShowSuccess,
}: AdoptionModalProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[2rem] p-8 max-w-lg w-full shadow-2xl relative overflow-hidden"
      >
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-playful-coral/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-playful-teal/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <div className="text-center mb-8 relative z-10">
          <div className="inline-block p-3 bg-playful-coral/10 rounded-full mb-4">
            <Heart className="w-8 h-8 text-playful-coral fill-current" />
          </div>
          <h2 className="text-3xl font-heading font-bold text-playful-text mb-2">
            Adopt {pet.name || pet.pet_name}
          </h2>
          <p className="text-gray-600">Fill out the form below to start your adoption journey!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-playful-teal focus:outline-none transition-all"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Email Address</label>
            <input
              type="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-playful-teal focus:outline-none transition-all"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">Phone Number</label>
            <input
              type="tel"
              required
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-playful-teal focus:outline-none transition-all"
              placeholder="(555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1 ml-1">
              Why do you want to adopt?
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-playful-teal focus:outline-none transition-all resize-none"
              placeholder="Tell us a bit about yourself..."
            />
          </div>

          <div className="pt-4">
            <PrimaryButton
              type="submit"
              className="w-full justify-center text-lg py-4"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Application 🚀'
              )}
            </PrimaryButton>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdoptionModal;
