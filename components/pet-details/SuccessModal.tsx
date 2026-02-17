
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface SuccessModalProps {
  onClose: () => void;
}

const SuccessModal = ({ onClose }: SuccessModalProps) => {
  const modalVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2 } },
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      transition: { 
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 25
      } 
    },
    exit: { 
      opacity: 0, 
      y: 20, 
      scale: 0.9, 
      transition: { duration: 0.2 } 
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      variants={modalVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      onClick={onClose}
    >
      <motion.div 
        className="bg-white rounded-xl max-w-md w-full"
        variants={contentVariants}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 sm:p-8 text-center">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-adoptGreen" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for your interest in adoption. We'll review your application and get back to you soon.
          </p>
          <button 
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-adoptGreen hover:bg-adoptGreen-dark text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default SuccessModal;



