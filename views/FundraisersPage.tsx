'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HeartHandshake, Plus, Sparkles, Filter, Heart } from 'lucide-react';
import FundraiserCard from '@/components/fundraiser/FundraiserCard';
import { useFundraisers, FundraiserCategory, FundraiserSort } from '@/hooks/useFundraisers';
import PrimaryButton from '@/components/ui/PrimaryButton';

const CATEGORIES: { value: FundraiserCategory; label: string }[] = [
    { value: 'all', label: 'All Causes' },
    { value: 'treatment', label: '🩹 Medical Treatment' },
    { value: 'sterilization', label: '🩺 Sterilization' },
    { value: 'shelter', label: '🏠 Shelter & Care' },
    { value: 'food_drive', label: '🥣 Food Drive' },
    { value: 'rescue', label: '🚨 Emergency Rescue' },
];

const SORTS: { value: FundraiserSort; label: string }[] = [
    { value: 'urgent', label: 'Most Urgent' },
    { value: 'new', label: 'Newest' },
    { value: 'popular', label: 'Most Supported' },
    { value: 'close_to_goal', label: 'Almost There' },
];

export default function FundraisersPage() {
    const [selectedCategory, setSelectedCategory] = useState<FundraiserCategory>('all');
    const [selectedSort, setSelectedSort] = useState<FundraiserSort>('urgent');

    const { data: fundraisers = [], isLoading, error } = useFundraisers({
        category: selectedCategory,
        sort: selectedSort,
        status: 'active',
    });

    return (
        <div className="pt-4 lg:pt-6 pb-20 bg-playful-cream min-h-screen">
            <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                {/* Hero / Header */}
                <div className="bg-gradient-to-r from-rose-500 via-playful-coral to-amber-500 rounded-[2.5rem] p-6 md:p-12 text-white shadow-xl mb-8 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles className="w-3.5 h-3.5" />
                            Community Animal Fundraisers
                        </div>
                        <h1 className="text-3xl md:text-5xl font-heading font-black leading-tight mb-3">
                            Direct Support for Stray & Injured Animals
                        </h1>
                        <p className="text-sm md:text-base text-white/90 font-medium mb-6 leading-relaxed">
                            Every rupee goes directly to verified caregivers and rescues via UPI. 0% platform fee, 100% transparent.
                        </p>
                        <Link href="/fundraisers/create">
                            <PrimaryButton size="lg" className="bg-white text-playful-coral hover:bg-white/90 shadow-lg text-sm md:text-base">
                                <Plus className="w-5 h-5 mr-1" />
                                Start a Fundraiser
                            </PrimaryButton>
                        </Link>
                    </div>

                    <div className="absolute right-[-40px] bottom-[-40px] opacity-15 pointer-events-none">
                        <HeartHandshake className="w-80 h-80" />
                    </div>
                </div>

                {/* Filters and Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    {/* Category Scrollable Tabs */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat.value}
                                onClick={() => setSelectedCategory(cat.value)}
                                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                                    selectedCategory === cat.value
                                        ? 'bg-playful-coral text-white shadow-sm'
                                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                                }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>

                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <select
                            value={selectedSort}
                            onChange={e => setSelectedSort(e.target.value as FundraiserSort)}
                            className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-playful-coral/40"
                        >
                            {SORTS.map(s => (
                                <option key={s.value} value={s.value}>
                                    {s.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Fundraisers Grid */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-white rounded-[2rem] h-96 animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-16 bg-white rounded-[2rem] p-8 border border-gray-100">
                        <p className="text-lg font-bold text-red-500 mb-2">Could not load fundraisers</p>
                        <p className="text-xs text-gray-400">Please try refreshing the page.</p>
                    </div>
                ) : fundraisers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {fundraisers.map((f, idx) => (
                            <FundraiserCard key={f.id} fundraiser={f} priority={idx === 0} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-soft">
                        <div className="w-20 h-20 mx-auto rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4">
                            <Heart className="w-10 h-10" />
                        </div>
                        <h2 className="text-2xl font-heading font-black text-playful-text mb-2">
                            No active fundraisers in this category
                        </h2>
                        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
                            Know an animal needing urgent medical care or food? Start a verified fundraiser today!
                        </p>
                        <Link href="/fundraisers/create">
                            <PrimaryButton size="md">
                                <Plus className="w-4 h-4 mr-1" />
                                Start a Fundraiser
                            </PrimaryButton>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
