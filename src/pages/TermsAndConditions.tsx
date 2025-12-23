import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, FileText } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ScrollReveal from '@/components/ui/ScrollReveal';

const TermsAndConditions = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <ScrollReveal
          mode="fade-up"
          duration={0.5}
          width="100%"
          className="text-center mb-12"
        >
          <div className="bg-playful-yellow p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center rounded-full text-white shadow-lg transform -rotate-3">
            <FileText className="h-10 w-10" />
          </div>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-playful-text mb-4">
            Terms and Conditions
          </h1>
          <p className="text-xl text-gray-600 font-medium">
            Please read these terms carefully before using our platform 📜
          </p>
        </ScrollReveal>

        <ScrollReveal
          mode="fade-up"
          delay={0.1}
          duration={0.5}
          width="100%"
          className="bg-white rounded-[2.5rem] shadow-soft p-8 md:p-12 border-2 border-playful-mint/30"
        >
          <div className="prose prose-lg max-w-none text-gray-600">
            <p className="mb-6 text-lg">Welcome to Adopt Don't Shop. By using our platform, you agree to comply with and be bound by the following terms and conditions. Please review them carefully.</p>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-mint/20 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
              Acceptance of Terms
            </h2>
            <p className="mb-6">By accessing or using the Adopt Don't Shop platform, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-mint/20 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
              Pet Adoption Process
            </h2>
            <p className="mb-4">
              Adopt Don't Shop serves as a platform connecting pet caregivers with potential adopters. We do not own any pets listed on the platform and are not responsible for the accuracy of the information provided by caregivers.
            </p>
            <p className="mb-4">By submitting an adoption application, you agree to:</p>
            <ul className="list-none space-y-2 pl-4 mb-6">
              {['Provide accurate and truthful information', 'Participate in any screening processes required by the pet caregiver', 'Accept that submission of an application does not guarantee approval for adoption', 'Take full responsibility for the pet if your application is approved'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-playful-mint mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-mint/20 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">3</span>
              Pet Listing Guidelines
            </h2>
            <p className="mb-4">When listing a pet for adoption, you agree to:</p>
            <ul className="list-none space-y-2 pl-4 mb-6">
              {['Provide accurate information about the pet\'s health, behavior, and history', 'Upload clear and recent photos of the pet', 'Respond to inquiries from potential adopters in a timely manner', 'Conduct appropriate screening of potential adopters', 'Update the listing if the pet is no longer available for adoption'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-playful-mint mt-1">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-mint/20 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">4</span>
              User Conduct
            </h2>
            <p className="mb-4">Users of Adopt Don't Shop agree not to:</p>
            <ul className="list-none space-y-2 pl-4 mb-6">
              {['Use the platform for commercial breeding or selling of pets', 'Post false, misleading, or fraudulent information', 'Harass, abuse, or harm other users or pets', 'Use the platform for any illegal activities', 'Attempt to circumvent any fees or policies of the platform'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-playful-coral mt-1">✕</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-mint/20 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">5</span>
              Privacy Policy
            </h2>
            <p className="mb-6">Your use of Adopt Don't Shop is also governed by our Privacy Policy, which outlines how we collect, use, and protect your personal information.</p>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-mint/20 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">6</span>
              Limitation of Liability
            </h2>
            <p className="mb-4">Adopt Don't Shop is not responsible for:</p>
            <ul className="list-none space-y-2 pl-4 mb-6">
              {['The accuracy of information provided by users', 'The behavior or health of pets listed on the platform', 'Disputes between caregivers and adopters', 'Any damages or injuries resulting from the adoption process'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-playful-coral mt-1">!</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-mint/20 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">7</span>
              Modifications to Terms
            </h2>
            <p className="mb-6">Adopt Don't Shop reserves the right to modify these terms at any time. We will notify users of any significant changes. Continued use of the platform after changes constitutes acceptance of the modified terms.</p>

            <h2 className="text-2xl font-heading font-bold text-playful-text mt-8 mb-4 flex items-center gap-3">
              <span className="bg-playful-mint/20 text-green-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">8</span>
              Contact Information
            </h2>
            <p className="mb-6">If you have any questions about these Terms and Conditions, please contact us at <a href="mailto:mouhurtikr@gmail.com" className="text-playful-teal font-bold hover:underline">mouhurtikr@gmail.com</a>.</p>
          </div>

          <div className="flex justify-center mt-12">
            <Link to="/">
              <PrimaryButton size="lg">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Return to Home
              </PrimaryButton>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};

export default TermsAndConditions;



