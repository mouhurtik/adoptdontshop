import { User, Phone } from "lucide-react";
import type { FormSectionProps } from "./types";

type CaregiverInfoSectionProps = Pick<FormSectionProps, "formData" | "onInputChange">;

const CaregiverInfoSection = ({ formData, onInputChange }: CaregiverInfoSectionProps) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 border-b-2 border-playful-yellow/30 pb-2">
                <div className="bg-playful-yellow/20 p-2 rounded-full text-yellow-600">
                    <User className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-heading font-bold text-playful-text">Caregiver Information</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label htmlFor="caregiverName" className="text-sm font-bold text-gray-700 ml-1">
                        Your Name *
                    </label>
                    <input
                        id="caregiverName"
                        name="caregiverName"
                        value={formData.caregiverName}
                        onChange={onInputChange}
                        required
                        className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 font-medium text-gray-800 focus:outline-none focus:border-playful-yellow focus:ring-4 focus:ring-playful-yellow/10 transition-all duration-200"
                        placeholder="Enter your name"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="mobile" className="text-sm font-bold text-gray-700 ml-1">
                        Mobile Number *
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            id="mobile"
                            name="mobile"
                            type="tel"
                            value={formData.mobile}
                            onChange={onInputChange}
                            required
                            className="w-full bg-gray-50 border-2 border-gray-200 rounded-2xl p-4 pl-12 font-medium text-gray-800 focus:outline-none focus:border-playful-yellow focus:ring-4 focus:ring-playful-yellow/10 transition-all duration-200"
                            placeholder="Enter mobile number"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CaregiverInfoSection;
