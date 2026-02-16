import { Heart, ShieldCheck } from "lucide-react";
import type { FormSectionProps } from "./types";

type TermsSectionProps = Pick<FormSectionProps, "formData" | "onCheckboxChange">;

const TermsSection = ({ formData, onCheckboxChange }: TermsSectionProps) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b-2 border-playful-teal/30 pb-2">
                <div className="bg-playful-teal/20 p-2 rounded-full text-playful-teal">
                    <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-heading font-bold text-playful-text">Terms & Privacy</h3>
            </div>

            <div className="space-y-4 bg-gray-50 p-6 rounded-2xl border-2 border-gray-100">
                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.agreeToTerms}
                            onChange={(e) => onCheckboxChange('agreeToTerms', e.target.checked)}
                            className="peer h-6 w-6 appearance-none border-2 border-gray-300 rounded-lg checked:bg-playful-teal checked:border-playful-teal transition-all"
                        />
                        <Heart className="absolute left-1 top-1 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                    <span className="text-gray-600 pt-0.5 group-hover:text-gray-900 transition-colors">
                        I agree to the <span className="text-playful-teal font-bold hover:underline">Terms and Conditions</span>
                    </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                        <input
                            type="checkbox"
                            checked={formData.agreeToPrivacyPolicy}
                            onChange={(e) => onCheckboxChange('agreeToPrivacyPolicy', e.target.checked)}
                            className="peer h-6 w-6 appearance-none border-2 border-gray-300 rounded-lg checked:bg-playful-teal checked:border-playful-teal transition-all"
                        />
                        <Heart className="absolute left-1 top-1 h-4 w-4 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                    </div>
                    <span className="text-gray-600 pt-0.5 group-hover:text-gray-900 transition-colors">
                        I agree to the <span className="text-playful-teal font-bold hover:underline">Privacy Policy</span>
                    </span>
                </label>
            </div>
        </div>
    );
};

export default TermsSection;
