import { Shield, Check } from "lucide-react";
import PrimaryButton from "@/components/ui/PrimaryButton";
import { Card } from "@/components/ui/card";
import ScrollReveal from "@/components/ui/ScrollReveal";

const BENEFITS = [
    "Up to 90% reimbursement on vet bills",
    "Coverage for accidents & illnesses",
    "24/7 Vet helpline included",
    "Fast claim processing"
];

const InsuranceSection = () => {
    return (
        <section className="py-20 bg-gray-50 text-playful-text relative overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-playful-coral/5 blur-3xl rounded-full translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-playful-yellow/10 blur-3xl rounded-full -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <ScrollReveal mode="slide-right">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-playful-coral font-bold text-sm mb-6 border border-playful-coral/20 shadow-sm">
                                <Shield className="w-4 h-4" />
                                Peace of Mind Protected
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight text-playful-text">
                                Protect Your Pet With <span className="text-playful-coral">Top-Rated</span> Insurance
                            </h2>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                Unexpected vet bills shouldn't happen. Secure your pet's health with comprehensive coverage for accidents, illnesses, and routine care.
                            </p>

                            <ul className="space-y-4 mb-8">
                                {BENEFITS.map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-playful-coral/10 flex items-center justify-center shrink-0">
                                            <Check className="w-3 h-3 text-playful-coral" />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <PrimaryButton variant="secondary" size="lg" className="bg-playful-text text-white hover:bg-playful-text/90 shadow-xl">
                                Get a Free Quote
                            </PrimaryButton>
                        </ScrollReveal>
                    </div>

                    <div className="relative">
                        <ScrollReveal
                            mode="pop"
                            duration={0.5}
                            className="relative z-10"
                        >
                            <Card className="bg-white border-gray-100 shadow-2xl p-2 overflow-hidden rotate-2 hover:rotate-0 transition-all duration-500">
                                <img
                                    src="https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=75&w=800&auto=format&fit=crop"
                                    alt="Happy Dog"
                                    className="rounded-xl w-full h-auto object-cover"
                                />
                                <div className="p-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <h3 className="text-xl font-bold text-playful-text">Standard Plan</h3>
                                        <span className="text-2xl font-black text-playful-teal">$25<span className="text-sm text-gray-400 font-normal">/mo</span></span>
                                    </div>
                                    <p className="text-gray-500 text-sm">Great for puppies and young pets.</p>
                                </div>
                            </Card>
                        </ScrollReveal>

                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-playful-coral/20 rounded-full opacity-50 blur-xl" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-playful-yellow/30 rounded-full opacity-50 blur-xl" />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default InsuranceSection;
