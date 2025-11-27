import { useEffect } from 'react';
import { Mail, PawPrint, Eye, Users, Award, Building, UserCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const Patrons = () => {
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-playful-teal/20 rounded-full blur-3xl -z-10"></div>
          <h1 className="text-4xl md:text-7xl font-heading font-black text-playful-text mb-6 leading-tight">
            Our
            <span className="relative inline-block ml-4 transform rotate-2">
              <span className="absolute inset-0 bg-playful-yellow rounded-2xl transform -rotate-2"></span>
              <span className="relative text-white px-6 py-2">Patrons</span>
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 font-bold max-w-4xl mx-auto mt-8 font-heading">
            Supporting our mission to connect pets with loving homes 🤝
          </p>
        </motion.div>

        {/* Organizations & Doctors Section */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-24"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Organizations */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border-2 border-playful-mint/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-playful-mint/20 p-3 rounded-full text-green-600">
                  <Building className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-playful-text">Organizations</h2>
              </div>
              <div className="bg-playful-cream rounded-2xl p-8 text-center border border-playful-mint/20">
                <div className="bg-playful-yellow p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-white shadow-md">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-playful-text mb-3">Coming Soon!</h3>
                <p className="text-gray-600 font-medium">
                  We're currently developing partnerships with organizations that share our mission.
                </p>
              </div>
            </div>

            {/* Doctors */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border-2 border-playful-teal/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-playful-teal/20 p-3 rounded-full text-playful-teal">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-playful-text">Doctors</h2>
              </div>
              <div className="bg-playful-cream rounded-2xl p-8 text-center border border-playful-teal/20">
                <div className="bg-playful-coral p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-white shadow-md">
                  <Star className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-heading font-bold text-playful-text mb-3">Coming Soon!</h3>
                <p className="text-gray-600 font-medium">
                  We're working to partner with veterinarians and animal healthcare professionals.
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Become a Patron Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-24"
        >
          <div className="bg-white rounded-[3rem] p-6 md:p-12 shadow-xl text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-40 bg-playful-coral/20 rounded-full -ml-10 -mt-10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-40 h-40 bg-playful-yellow/20 rounded-full -mr-10 -mb-10 blur-3xl"></div>

            <div className="flex items-center justify-center gap-4 mb-8 relative z-10">
              <div className="bg-playful-coral p-4 rounded-full text-white shadow-lg transform rotate-3">
                <Award className="h-8 w-8" />
              </div>
              <h2 className="text-4xl font-heading font-black text-playful-text">Become a Patron</h2>
            </div>

            <div className="text-xl text-gray-600 font-medium leading-relaxed mb-8 space-y-4 relative z-10">
              <p>
                We're currently developing our patronage program to help more pets find their forever homes.
              </p>
              <p>
                By becoming a patron, you or your organization can make a meaningful impact on the lives of animals in need.
              </p>
            </div>

            <div className="mb-8 relative z-10">
              <a
                href="mailto:sponsor@adoptdontshop.me"
                className="inline-flex items-center bg-playful-teal text-white px-8 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-teal-600 hover:scale-105 transition-all duration-200"
              >
                <Mail className="h-6 w-6 mr-3" />
                sponsor@adoptdontshop.me
              </a>
            </div>

            <p className="text-lg text-gray-500 font-bold relative z-10">
              Contact us for early details on how you can support our mission.
            </p>
          </div>
        </motion.div>

        {/* Why Become a Patron Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
            <div className="bg-playful-yellow p-4 rounded-full text-white shadow-md">
              <PawPrint className="h-8 w-8" />
            </div>
            <h2 className="text-4xl font-heading font-black text-playful-text">Why Become a Patron?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SponsorBenefit
              icon={<PawPrint className="h-8 w-8" />}
              title="Make an Impact"
              description="Help us save more animals and connect them with loving homes."
              bgColor="bg-playful-mint/20"
              iconColor="text-green-600"
              index={0}
            />
            <SponsorBenefit
              icon={<Eye className="h-8 w-8" />}
              title="Brand Visibility"
              description="Reach our community of pet lovers and showcase your commitment to animal welfare."
              bgColor="bg-playful-teal/20"
              iconColor="text-playful-teal"
              index={1}
            />
            <SponsorBenefit
              icon={<Users className="h-8 w-8" />}
              title="Community Engagement"
              description="Participate in events and initiatives that bring together animal lovers."
              bgColor="bg-playful-coral/20"
              iconColor="text-playful-coral"
              index={2}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface SponsorBenefitProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  index: number;
}

const SponsorBenefit = ({ title, description, icon, bgColor, iconColor, index }: SponsorBenefitProps) => (
  <motion.div
    className={`bg-white rounded-[2rem] p-8 shadow-soft border-2 border-transparent hover:border-gray-100`}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, delay: 1.0 + (index * 0.1) }}
    whileHover={{ y: -8, scale: 1.02 }}
  >
    <div className={`${bgColor} p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full ${iconColor}`}>
      {icon}
    </div>
    <h3 className="text-2xl font-heading font-bold text-playful-text mb-4">{title}</h3>
    <p className="text-gray-600 font-medium leading-relaxed">{description}</p>
  </motion.div>
);

export default Patrons;



