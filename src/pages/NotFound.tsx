import { Link } from "react-router-dom";
import { useEffect } from "react";
import { PawPrint, ArrowLeft, Home } from "lucide-react";
import { motion } from "framer-motion";
import PrimaryButton from "@/components/ui/PrimaryButton";

const NotFound = () => {
  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-playful-cream relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-playful-coral/20 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-playful-teal/20 rounded-full blur-2xl"></div>

      <div className="text-center p-6 relative z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
            duration: 0.8
          }}
          className="mb-8 inline-block"
        >
          <div className="w-40 h-40 bg-white rounded-full flex items-center justify-center mx-auto shadow-xl border-4 border-playful-yellow relative">
            <PawPrint className="h-20 w-20 text-playful-yellow" />
            <div className="absolute -top-2 -right-2 text-6xl">❓</div>
          </div>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-heading font-black text-playful-text mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          404
        </motion.h1>

        <motion.h2
          className="text-3xl font-heading font-bold text-gray-700 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Uh oh! You seem lost...
        </motion.h2>

        <motion.p
          className="text-xl text-gray-600 mb-10 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          We couldn't find the page you're looking for. Maybe it went for a walk? 🐕
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link to="/">
            <PrimaryButton size="lg" className="w-full sm:w-auto">
              <Home className="mr-2 h-5 w-5" />
              Go Home
            </PrimaryButton>
          </Link>

          <Link to="/browse">
            <PrimaryButton variant="secondary" size="lg" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Browse Pets
            </PrimaryButton>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;



