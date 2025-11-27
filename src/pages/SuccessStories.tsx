import { useEffect } from 'react';
import { Mail, ArrowRight, PawPrint, Star, Users, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PrimaryButton from '@/components/ui/PrimaryButton';

const SuccessStories = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
      <div className="container mx-auto px-6">
        {/* Playful Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-24 relative"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-playful-yellow/20 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-4xl md:text-7xl font-heading font-black text-playful-text mb-6 leading-tight">
            Success
            <span className="relative inline-block ml-4 transform -rotate-3">
              <span className="absolute inset-0 bg-playful-coral rounded-2xl transform rotate-3"></span>
              <span className="relative text-white px-6 py-2">Stories</span>
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 font-bold max-w-4xl mx-auto mt-8 font-heading">
            Heartwarming stories of rescued pets finding their forever homes 🏡
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-24"
        >
          <motion.div
            className="bg-white rounded-[2.5rem] p-8 shadow-soft text-center border-2 border-playful-mint/30"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="bg-playful-mint/20 p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full text-green-600">
              <PawPrint className="h-10 w-10" />
            </div>
            <h3 className="font-heading font-black text-5xl text-playful-text mb-2">25+</h3>
            <p className="text-gray-500 text-lg font-bold">Successful Adoptions</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-[2.5rem] p-8 shadow-soft text-center border-2 border-playful-coral/30"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="bg-playful-coral/20 p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full text-playful-coral">
              <Users className="h-10 w-10" />
            </div>
            <h3 className="font-heading font-black text-5xl text-playful-text mb-2">50+</h3>
            <p className="text-gray-500 text-lg font-bold">Happy Families</p>
          </motion.div>

          <motion.div
            className="bg-white rounded-[2.5rem] p-8 shadow-soft text-center border-2 border-playful-yellow/30"
            whileHover={{ y: -8, scale: 1.02 }}
          >
            <div className="bg-playful-yellow/20 p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center rounded-full text-yellow-600">
              <Star className="h-10 w-10" />
            </div>
            <h3 className="font-heading font-black text-5xl text-playful-text mb-2">100%</h3>
            <p className="text-gray-500 text-lg font-bold">Satisfaction Rate</p>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-playful-lavender/30 rounded-full -mr-10 -mt-10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-playful-mint/30 rounded-full -ml-10 -mb-10 blur-3xl"></div>

            <div className="mb-8 relative z-10">
              <div className="bg-playful-yellow p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center rounded-full shadow-lg text-white transform -rotate-6">
                <Mail className="h-12 w-12" />
              </div>
            </div>

            <h2 className="text-4xl font-heading font-black text-playful-text mb-6 relative z-10">
              Have you adopted a pet and want to share your story?
            </h2>

            <div className="text-xl text-gray-600 font-medium leading-relaxed mb-8 space-y-4 relative z-10">
              <p>
                We love hearing about how our adopted pets are doing in their new homes! ❤️
              </p>
              <p>
                Send us your story and photos, and we may feature it when our success stories section launches.
              </p>
            </div>

            <div className="mb-12 relative z-10">
              <a
                href="mailto:stories@adoptdontshop.me"
                className="inline-flex items-center bg-playful-teal text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-teal-600 hover:scale-105 transition-all duration-200"
              >
                <Mail className="h-6 w-6 mr-3" />
                stories@adoptdontshop.me
              </a>
            </div>

            <div className="relative z-10">
              <Link to="/browse">
                <PrimaryButton size="lg" className="text-xl px-12 py-6">
                  Browse Available Pets
                  <ArrowRight className="ml-3 h-6 w-6" />
                </PrimaryButton>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Coming Soon Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="bg-playful-text text-white rounded-[2rem] p-6 md:p-12 shadow-xl max-w-3xl mx-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-white/5 pattern-dots"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-4 mb-6">
                <div className="bg-playful-yellow p-4 rounded-full text-playful-text">
                  <Award className="h-8 w-8" />
                </div>
                <h3 className="text-3xl font-heading font-bold">Coming Soon</h3>
              </div>
              <p className="text-xl font-medium text-gray-300">
                Our success stories section will be launching soon with real stories from adopted pets!
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SuccessStories;



