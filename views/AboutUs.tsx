'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    Mail, Linkedin, Twitter, PawPrint, Users, Target, Award,
    Building, UserCheck, Star, Eye, ShoppingBag, Heart, Facebook, Youtube
} from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import ScrollReveal from '@/components/ui/ScrollReveal';
import ProductsSection from './essentials/ProductsSection';
import InsuranceSection from './essentials/InsuranceSection';
import { PRODUCTS } from './essentials/productsData';

type TabKey = 'story' | 'patrons' | 'store';

const AboutUsInner = () => {
    const searchParams = useSearchParams();
    const initialTab = (searchParams.get('tab') as TabKey) || 'story';
    const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
    const [activeProductTab, setActiveProductTab] = useState('dog');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Sync tab from URL
    useEffect(() => {
        const tab = searchParams.get('tab') as TabKey;
        if (tab === 'story' || tab === 'patrons' || tab === 'store') {
            setActiveTab(tab);
        }
    }, [searchParams]);

    const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
        { key: 'story', label: 'Our Story', icon: <Heart className="w-4 h-4" /> },
        { key: 'patrons', label: 'Patrons', icon: <Users className="w-4 h-4" /> },
        { key: 'store', label: 'Store', icon: <ShoppingBag className="w-4 h-4" /> },
    ];

    return (
        <div className={`lg:pt-4 lg:pt-8 pb-16 bg-playful-cream min-h-screen ${activeTab === 'store' ? 'pt-2' : 'pt-6'}`}>
            <div className="max-w-7xl mx-auto px-4 lg:px-6">
                {/* Hero */}
                <ScrollReveal mode="fade-up" width="100%" className={`text-center mb-8 lg:mb-12 relative ${activeTab === 'store' ? 'hidden lg:block' : ''}`}>
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-playful-coral/20 rounded-full blur-3xl -z-10" />
                    <h1 className="text-4xl md:text-7xl font-heading font-black text-playful-text mb-4 lg:mb-6 leading-tight">
                        About
                        <span className="relative inline-block ml-3 lg:ml-4 transform -rotate-2">
                            <span className="absolute inset-0 bg-playful-teal rounded-xl lg:rounded-2xl transform rotate-2" />
                            <span className="relative text-white px-4 lg:px-6 py-1 lg:py-2">Us</span>
                        </span>
                    </h1>
                    <p className="text-lg md:text-3xl text-gray-600 font-bold max-w-4xl mx-auto mt-4 lg:mt-8 font-heading">
                        Connecting loving homes with pets in need 🐾
                    </p>
                </ScrollReveal>

                {/* Tab Switcher */}
                <ScrollReveal mode="fade-up" delay={0.05} width="100%" className={`flex justify-center mb-12 ${activeTab === 'store' ? 'hidden lg:flex' : ''}`}>
                    <div className="inline-flex bg-white rounded-full p-1.5 shadow-soft border border-gray-100">
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${
                                    activeTab === tab.key
                                        ? 'bg-playful-teal text-white shadow-md'
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
                <div className="max-w-6xl mx-auto">
                    {activeTab === 'story' && <OurStoryTab />}
                    {activeTab === 'patrons' && <PatronsTab />}
                    {activeTab === 'store' && (
                        <StoreTab
                            activeProductTab={activeProductTab}
                            onProductTabChange={setActiveProductTab}
                        />
                    )}
                </div>

                {/* CTA */}
                <ScrollReveal className="mt-16 text-center" mode="fade-up" delay={0.1} width="100%">
                    <Link href="/browse">
                        <PrimaryButton size="lg" className="text-xl px-10 py-4">
                            <PawPrint className="mr-3 h-6 w-6" />
                            Browse Available Pets
                        </PrimaryButton>
                    </Link>
                </ScrollReveal>
            </div>
        </div>
    );
};

// ─── Our Story Tab ────────────────────────────────────────
function OurStoryTab() {
    return (
        <div className="space-y-16">
            {/* Mission */}
            <ScrollReveal mode="fade-up" width="100%">
                <div className="bg-white rounded-[2.5rem] p-6 md:p-12 shadow-soft border-2 border-playful-mint/30">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="bg-playful-mint/20 p-4 rounded-full text-green-600">
                            <Target className="h-8 w-8" />
                        </div>
                        <h2 className="text-4xl font-heading font-black text-playful-text">Our Mission</h2>
                    </div>
                    <div className="text-xl text-gray-600 font-medium leading-relaxed space-y-4">
                        <p>
                            At Adopt Don&apos;t Shop, we believe every pet deserves a loving home. Our mission is
                            to connect abandoned, surrendered, and rescued animals with compassionate
                            individuals and families who will provide them with the care and love they
                            deserve.
                        </p>
                        <p>
                            We strive to reduce the number of animals in shelters by promoting adoption over
                            purchasing from breeders or pet stores. By choosing to adopt, you&apos;re not only
                            saving a life but also making room for another animal in need at a shelter or
                            rescue organization.
                        </p>
                    </div>
                </div>
            </ScrollReveal>

            {/* Founder */}
            <ScrollReveal mode="fade-up" delay={0.1} width="100%"
                className="bg-white rounded-[3rem] p-6 md:p-12 shadow-xl border-2 border-playful-yellow/30"
            >
                <div className="flex items-center gap-4 mb-8">
                    <div className="bg-playful-yellow/20 p-4 rounded-full text-yellow-600">
                        <Award className="h-8 w-8" />
                    </div>
                    <h2 className="text-4xl font-heading font-black text-playful-text">Our Founder</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-1">
                        <div className="bg-playful-yellow/10 rounded-[2rem] p-4 shadow-inner">
                            <div className="aspect-[3/4] bg-white rounded-[1.5rem] overflow-hidden shadow-md">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/pet-images/founder/mouhurtik-ray.webp`}
                                    alt="Mouhurtik Ray"
                                    className="w-full h-full object-cover object-top"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                        <h3 className="text-3xl font-heading font-black text-playful-text mb-2">Mouhurtik Ray</h3>
                        <p className="text-xl text-playful-teal font-bold mb-6 bg-playful-teal/10 px-4 py-2 rounded-full inline-block">
                            Founder &amp; CEO
                        </p>
                        <div className="text-xl text-gray-600 font-medium leading-relaxed space-y-4">
                            <p>
                                &quot;I, Mouhurtik Ray, founded Adopt Don&apos;t Shop in 2025 with a simple yet powerful
                                vision: to help stray animals find loving homes. As someone who regularly feeds
                                and cares for local stray animals—and having personally adopted a rescue
                                kitten—I witnessed firsthand the challenges these animals face in finding the
                                care they deserve.
                            </p>
                            <p>
                                Driven by my experiences, I created Adopt Don&apos;t Shop to be a platform where
                                every stray and rescue animal can connect with caring individuals looking to
                                give them a second chance. This website is more than just a listing service;
                                it&apos;s a community built on the belief that every animal deserves love, care, and
                                a forever home.
                            </p>
                            <p>Join me in making a difference, one adoption at a time.&quot;</p>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            {/* Contact */}
            <ScrollReveal mode="fade-up" delay={0.1} width="100%">
                <div className="flex items-center gap-4 mb-8 justify-center md:justify-start">
                    <div className="bg-playful-coral/20 p-4 rounded-full text-playful-coral">
                        <Users className="h-8 w-8" />
                    </div>
                    <h2 className="text-4xl font-heading font-black text-playful-text">Contact Us</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mt-8">
                    {/* Email Card */}
                    <a href="mailto:mouhurtikr@gmail.com" 
                       className="relative overflow-hidden group bg-gradient-to-br from-green-50 to-emerald-100/50 rounded-3xl p-6 shadow-sm border border-emerald-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                            <Mail className="w-24 h-24 text-emerald-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="bg-white/80 backdrop-blur-sm w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm text-emerald-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-bold text-emerald-800/60 uppercase tracking-wider mb-1">Email</p>
                            <p className="font-bold text-gray-800 truncate">mouhurtikr@gmail.com</p>
                        </div>
                    </a>
                    
                    {/* LinkedIn Card */}
                    <a href="https://www.linkedin.com/in/mouhurtik/" target="_blank" rel="noopener noreferrer"
                       className="relative overflow-hidden group bg-gradient-to-br from-blue-50 to-sky-100/50 rounded-3xl p-6 shadow-sm border border-sky-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                            <Linkedin className="w-24 h-24 text-sky-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="bg-white/80 backdrop-blur-sm w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm text-sky-600">
                                <Linkedin className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-bold text-sky-800/60 uppercase tracking-wider mb-1">LinkedIn</p>
                            <p className="font-bold text-gray-800 truncate">mouhurtik</p>
                        </div>
                    </a>

                    {/* X (Twitter) Card */}
                    <a href="https://x.com/mouhurtik" target="_blank" rel="noopener noreferrer"
                       className="relative overflow-hidden group bg-gradient-to-br from-gray-50 to-gray-200/50 rounded-3xl p-6 shadow-sm border border-gray-300/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                            <Twitter className="w-24 h-24 text-gray-800" />
                        </div>
                        <div className="relative z-10">
                            <div className="bg-white/80 backdrop-blur-sm w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm text-gray-800">
                                <Twitter className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-bold text-gray-600 uppercase tracking-wider mb-1">X</p>
                            <p className="font-bold text-gray-800 truncate">@mouhurtik</p>
                        </div>
                    </a>

                    {/* Facebook Card */}
                    <a href="https://www.facebook.com/profile.php?id=61583730512051" target="_blank" rel="noopener noreferrer"
                       className="relative overflow-hidden group bg-gradient-to-br from-indigo-50 to-blue-200/40 rounded-3xl p-6 shadow-sm border border-blue-300/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                            <Facebook className="w-24 h-24 text-blue-700" />
                        </div>
                        <div className="relative z-10">
                            <div className="bg-white/80 backdrop-blur-sm w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm text-blue-700">
                                <Facebook className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-bold text-blue-800/60 uppercase tracking-wider mb-1">Facebook</p>
                            <p className="font-bold text-gray-800 truncate">AdoptDontShop</p>
                        </div>
                    </a>

                    {/* YouTube Card */}
                    <a href="https://www.youtube.com/@mouhurtik" target="_blank" rel="noopener noreferrer"
                       className="relative overflow-hidden group bg-gradient-to-br from-red-50 to-rose-100/50 rounded-3xl p-6 shadow-sm border border-rose-200/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-150 transition-transform duration-500">
                            <Youtube className="w-24 h-24 text-rose-600" />
                        </div>
                        <div className="relative z-10">
                            <div className="bg-white/80 backdrop-blur-sm w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm text-rose-600">
                                <Youtube className="w-6 h-6" />
                            </div>
                            <p className="text-sm font-bold text-rose-800/60 uppercase tracking-wider mb-1">YouTube</p>
                            <p className="font-bold text-gray-800 truncate">@mouhurtik</p>
                        </div>
                    </a>
                </div>
            </ScrollReveal>
        </div>
    );
}

// ─── Patrons Tab ──────────────────────────────────────────
function PatronsTab() {
    return (
        <div className="space-y-16">
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
                            <h3 className="font-heading font-bold text-xl text-playful-text mb-2">Coming Soon</h3>
                            <p className="text-gray-500 text-sm">Partner organizations will be featured here</p>
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
                            <h3 className="font-heading font-bold text-xl text-playful-text mb-2">Coming Soon</h3>
                            <p className="text-gray-500 text-sm">Verified veterinarians will be listed here</p>
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
                        <h2 className="text-3xl md:text-4xl font-heading font-black mb-4">Become a Patron</h2>
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
                        <a href="mailto:mouhurtikr@gmail.com"
                            className="inline-flex items-center gap-2 bg-white text-playful-coral px-8 py-4 rounded-full font-bold text-lg hover:bg-white/90 transition-all shadow-lg hover:shadow-xl">
                            <Mail className="h-5 w-5" />
                            Get in Touch
                        </a>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    );
}

// ─── Store Tab ────────────────────────────────────────────
function StoreTab({
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

const AboutUs = () => (
    <Suspense fallback={<div className="min-h-screen pt-4 lg:pt-8 pb-16 bg-playful-cream" />}>
        <AboutUsInner />
    </Suspense>
);

export default AboutUs;
