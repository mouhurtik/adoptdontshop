import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-playful-teal p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full text-white shadow-lg transform rotate-3">
            <ShieldCheck className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-playful-text mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            We care about your privacy as much as we care about pets 🔒
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-[2.5rem] shadow-soft p-8 md:p-12 border-2 border-playful-teal/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-6 text-lg">At Adopt Don't Shop, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.</p>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-teal/20 text-playful-teal w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Information We Collect
            </h2>
            <p className="mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-none space-y-2 pl-4 mb-6">
              {['Personal information (name, contact details)', 'Pet information (images, descriptions, medical history)', 'Adoption application details', 'Messages and communications between users', 'Feedback and survey responses'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-playful-teal mt-1">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-teal/20 text-playful-teal w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              How We Use Your Information
            </h2>
            <p className="mb-4">We use the information we collect to:</p>
            <ul className="list-none space-y-2 pl-4 mb-6">
              {['Facilitate pet adoptions and caregiver-adopter connections', 'Improve our platform and services', 'Communicate with you about your account or the platform', 'Ensure compliance with our terms and policies', 'Respond to your inquiries and provide support'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-playful-teal mt-1">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-teal/20 text-playful-teal w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Sharing Your Information
            </h2>
            <p className="mb-4">We may share your information with:</p>
            <ul className="list-none space-y-2 pl-4 mb-6">
              {['Other users as necessary for the adoption process', 'Service providers who help us operate our platform', 'Legal authorities when required by law'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-playful-teal mt-1">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mb-6 font-medium">We do not sell your personal information to third parties.</p>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-teal/20 text-playful-teal w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              Data Security
            </h2>
            <p className="mb-6">We implement reasonable security measures to protect your information, but no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security of your personal information.</p>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-teal/20 text-playful-teal w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
              Your Privacy Rights
            </h2>
            <p className="mb-4">Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className="list-none space-y-2 pl-4 mb-6">
              {['Access to your personal information', 'Correction of inaccurate information', 'Deletion of your information', 'Restriction of processing of your information', 'Data portability'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-playful-teal mt-1">●</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mb-6">To exercise these rights, please contact us using the information provided below.</p>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-teal/20 text-playful-teal w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
              Children's Privacy
            </h2>
            <p className="mb-6">Our platform is not intended for children under 13 years of age, and we do not knowingly collect personal information from children under 13.</p>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-teal/20 text-playful-teal w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
              Changes to This Privacy Policy
            </h2>
            <p className="mb-6">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.</p>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-teal/20 text-playful-teal w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
              Contact Information
            </h2>
            <p className="mb-6">If you have any questions about this Privacy Policy, please contact us at <a href="mailto:mouhurtikr@gmail.com" className="text-playful-teal font-bold hover:underline">mouhurtikr@gmail.com</a>.</p>

            <p className="text-gray-500 font-medium text-sm mt-8 border-t pt-4">
              Last Updated: May 28, 2023
            </p>
          </div>

          <div className="flex justify-center mt-12">
            <Link to="/">
              <PrimaryButton size="lg">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return to Home
              </PrimaryButton>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;



