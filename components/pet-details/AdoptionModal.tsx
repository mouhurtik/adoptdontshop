'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Heart } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { supabase } from '@/lib/supabase/client';
import type { Pet } from '@/types';

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
  const [formData, setFormData] = useState({
    full_name: '',
    mobile_number: '',
    gender: '',
    age: '',
    occupation: '',
    financial_status: '',
    pet_experience: '',
    family_approval: '',
    adoption_reason: '',
    agreed_responsibility: false,
    agreed_terms: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.agreed_responsibility || !formData.agreed_terms) {
      setError('Please agree to both the responsibility and terms checkboxes.');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: insertError } = await (supabase
        .from('adoption_applications') as ReturnType<typeof supabase.from>)
        .insert({
          id: crypto.randomUUID(),
          pet_listing_id: pet.id,
          full_name: formData.full_name,
          mobile_number: formData.mobile_number,
          gender: formData.gender || null,
          age: formData.age || null,
          occupation: formData.occupation || null,
          financial_status: formData.financial_status || null,
          pet_experience: formData.pet_experience || null,
          family_approval: formData.family_approval || null,
          adoption_reason: formData.adoption_reason,
          agreed_responsibility: formData.agreed_responsibility,
          agreed_terms: formData.agreed_terms,
          status: 'pending',
        });

      if (insertError) throw insertError;

      setIsSubmitting(false);
      setShowSuccess(true);
    } catch (err) {
      console.error('Failed to submit adoption application:', err);
      setError('Failed to submit application. Please try again.');
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-transparent focus:bg-white focus:border-playful-teal focus:outline-none transition-all text-sm";
  const labelClass = "block text-sm font-bold text-gray-700 mb-1 ml-1";

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
        className="bg-white rounded-[2rem] p-6 lg:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-playful-coral/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-playful-teal/10 rounded-full -ml-10 -mb-10 blur-2xl"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <X className="w-6 h-6 text-gray-500" />
        </button>

        <div className="text-center mb-6 relative z-10">
          <div className="inline-block p-3 bg-playful-coral/10 rounded-full mb-3">
            <Heart className="w-8 h-8 text-playful-coral fill-current" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-playful-text mb-1">
            Adopt {pet.name || pet.pet_name}
          </h2>
          <p className="text-gray-500 text-sm">Fill out the form to start your adoption journey!</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input type="text" name="full_name" required value={formData.full_name} onChange={handleChange} className={inputClass} placeholder="Your full name" />
            </div>
            <div>
              <label className={labelClass}>Mobile Number</label>
              <input type="tel" name="mobile_number" value={formData.mobile_number} onChange={handleChange} className={inputClass} placeholder="+91 99999 99999" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className={labelClass}>Gender</label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputClass}>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Age</label>
              <input type="text" name="age" value={formData.age} onChange={handleChange} className={inputClass} placeholder="25" />
            </div>
            <div>
              <label className={labelClass}>Occupation</label>
              <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className={inputClass} placeholder="Student" />
            </div>
          </div>

          <div>
            <label className={labelClass}>Financial Status</label>
            <select name="financial_status" value={formData.financial_status} onChange={handleChange} className={inputClass}>
              <option value="">Select</option>
              <option value="student">Student</option>
              <option value="employed">Employed</option>
              <option value="self-employed">Self-Employed</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Pet Experience</label>
            <select name="pet_experience" value={formData.pet_experience} onChange={handleChange} className={inputClass}>
              <option value="">Select</option>
              <option value="none">No prior experience</option>
              <option value="some">Some experience</option>
              <option value="experienced">Experienced pet owner</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Family Approval</label>
            <select name="family_approval" value={formData.family_approval} onChange={handleChange} className={inputClass}>
              <option value="">Select</option>
              <option value="yes">Yes, everyone is on board</option>
              <option value="partial">Most family members agree</option>
              <option value="no">Not yet discussed</option>
              <option value="solo">I live alone</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>Why do you want to adopt? *</label>
            <textarea
              name="adoption_reason"
              required
              rows={3}
              value={formData.adoption_reason}
              onChange={handleChange}
              className={`${inputClass} resize-none`}
              placeholder="Tell us about yourself and why you want to adopt..."
            />
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" name="agreed_responsibility" checked={formData.agreed_responsibility} onChange={handleChange} className="mt-1 w-4 h-4 rounded border-gray-300 text-playful-coral focus:ring-playful-coral" />
              <span className="text-xs text-gray-600 group-hover:text-gray-800">
                I understand the responsibility of caring for a pet and commit to providing a loving home. *
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" name="agreed_terms" checked={formData.agreed_terms} onChange={handleChange} className="mt-1 w-4 h-4 rounded border-gray-300 text-playful-coral focus:ring-playful-coral" />
              <span className="text-xs text-gray-600 group-hover:text-gray-800">
                I agree to the adoption terms and conditions of AdoptDontShop. *
              </span>
            </label>
          </div>

          <div className="pt-3">
            <PrimaryButton
              type="submit"
              className="w-full justify-center text-base py-3.5"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
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
