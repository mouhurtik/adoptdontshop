'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShoppingBag, Heart, Package, Shield, Mail, PawPrint, Building, UserCheck, Star, Eye, Users, Award } from 'lucide-react';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProductsSection from './essentials/ProductsSection';
import InsuranceSection from './essentials/InsuranceSection';
import { PRODUCTS } from './essentials/productsData';

type TabKey = 'essentials' | 'patrons';

const Resources = () => {
    const searchParams = useSearchParams();
    const initialTab = (searchParams.get('tab') as TabKey) || 'essentials';
    const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
    const [activeProductTab, setActiveProductTab] = useState('dog');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Sync tab from URL
    useEffect(() => {
        const tab = searchParams.get('tab') as TabKey;
        if (tab === 'essentials' || tab === 'patrons') {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
        { key: 'essentials', label: 'Pet Essentials', icon: <Package className="w-5 h-5" /> },
        { key: 'patrons', label: 'Our Patrons', icon: <Heart className="w-5 h-5" /> },
    ];

    return (
        <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
            <div className="container mx-auto px-6">
                {/* Header */}
                <ScrollReveal mode="fade-up" width="100%" className="text-center mb-12 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-playful-teal/20 rounded-full blur-3xl -z-10" />
                    <h1 className="text-4xl md:text-7xl font-heading font-black text-playful-text mb-6 leading-tight">
                        Pet
                        <span className="relative inline-block ml-4 transform rotate-2">
                            <span className="absolute inset-0 bg-playful-coral rounded-2xl transform -rotate-2" />
                            <span className="relative text-white px-6 py-2">Resources</span>
                        </span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mt-4">
                        Everything you need for your furry friend — from essentials to community support 🐾
                    </p>
                </ScrollReveal>

                {/* Tab Switcher */}
                <ScrollReveal mode="fade-up" delay={0.1} width="100%" className="flex justify-center mb-12">
                    <div className="inline-flex bg-white rounded-full p-1.5 shadow-soft border border-gray-100">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all duration-300 ${
                                    activeTab === tab.key
                                        ? 'bg-playful-coral text-white shadow-md'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </ScrollReveal>

                {/* Tab Content */}
                {activeTab === 'essentials' ? (
                    <EssentialsContent
                        activeProductTab={activeProductTab}
                        onProductTabChange={setActiveProductTab}
                    />
                ) : (
                    <PatronsContent />
                )}
            </div>
        </div>
    );
};

// ─── Essentials Tab ────────────────────────────────────────
function EssentialsContent({
    activeProductTab,
    onProductTabChange,
}: {
    activeProductTab: string;
    onProductTabChange: (tab: string) => void;
}) {
    return (
        <div className="space-y-16">
            <ScrollReveal mode="fade-up" width="100%">
                <ProductsSection
                    products={PRODUCTS}
                    activeTab={activeProductTab}
                    onTabChange={onProductTabChange}
                />
            </ScrollReveal>
            <ScrollReveal mode="fade-up" delay={0.1} width="100%">
                <InsuranceSection />
            </ScrollReveal>
        </div>
    );
}

// ─── Patrons Tab ───────────────────────────────────────────
function PatronsContent() {
    return (
        <div className="space-y-16">
            {/* Organizations & Doctors */}
            <ScrollReveal mode="fade-up" width="100%">
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
                            <h3 className="font-heading font-bold text-xl text-playful-text mb-2">
                                Coming Soon
                            </h3>
                            <p className="text-gray-500 text-sm">
                                Partner organizations will be featured here
                            </p>
                        </div>
                    </div>

                    {/* Doctors */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-soft border-2 border-playful-lavender/30">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-playful-lavender/20 p-3 rounded-full text-purple-600">
                                <UserCheck className="h-6 w-6" />
                            </div>
                            <h2 className="text-2xl font-heading font-bold text-playful-text">Doctors</h2>
                        </div>
                        <div className="bg-playful-cream rounded-2xl p-8 text-center border border-playful-lavender/20">
                            <div className="bg-playful-teal p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full text-white shadow-md">
                                <Award className="h-8 w-8" />
                            </div>
                            <h3 className="font-heading font-bold text-xl text-playful-text mb-2">
                                Coming Soon
                            </h3>
                            <p className="text-gray-500 text-sm">
                                Verified veterinarians will be listed here
                            </p>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Become a Patron CTA */}
            <ScrollReveal mode="fade-up" delay={0.1} width="100%">
                <div className="bg-gradient-to-r from-playful-coral to-playful-teal rounded-[2.5rem] p-12 text-center text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                    <div className="relative z-10">
                        <div className="bg-white/20 p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center rounded-full">
                            <PawPrint className="h-8 w-8 fill-current" />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-heading font-black mb-4">
                            Become a Patron
                        </h2>
                        <p className="text-white/80 text-lg max-w-xl mx-auto mb-8">
                            Support our mission to connect pets with loving homes. Your patronage helps
                            keep our platform free and accessible to all.
                        </p>
                        <div className="flex flex-wrap justify-center gap-8 mb-8">
                            <div className="flex items-center gap-3">
                                <Eye className="h-5 w-5" />
                                <span className="font-bold">Brand Visibility</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Users className="h-5 w-5" />
                                <span className="font-bold">Community Impact</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Award className="h-5 w-5" />
                                <span className="font-bold">Recognition</span>
                            </div>
                        </div>
                        <a
                            href="mailto:adoptdontshop@example.com"
                            className="inline-flex items-center gap-2 bg-white text-playful-coral px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl"
                        >
                            <Mail className="h-5 w-5" />
                            Get in Touch
                        </a>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}

export default Resources;
