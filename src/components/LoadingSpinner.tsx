
import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-80 z-50">
      <motion.div 
        className="flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="relative w-20 h-20">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.05, 1, 1.05, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut" 
            }}
          >
            <PawPrint className="w-16 h-16 text-adoptGreen" />
          </motion.div>
        </div>
        <motion.p 
          className="mt-4 text-lg font-medium text-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner;



