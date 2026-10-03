'use client';

import { useState } from 'react';
import { Search, ShoppingBag, Heart, ShieldCheck, Sparkles, Store } from 'lucide-react';
import { useStoreProducts, AFFILIATE_PLATFORMS } from '@/hooks/useShop';
import ShopProductCard from '@/components/shop/ShopProductCard';
import PlatformCard from '@/components/shop/PlatformCard';
import PawCoinsBanner from '@/components/shop/PawCoinsBanner';

const CATEGORIES = [
    { value: 'all', label: 'All Bestsellers' },
    { value: 'food', label: '🍲 Food & Nutrition' },
    { value: 'toys', label: '🎾 Toys & Fun' },
    { value: 'accessories', label: '🦮 Collars & Leashes' },
    { value: 'health', label: '💊 Health & Supplements' },
    { value: 'grooming', label: '🧼 Grooming & Hygiene' },
];

export default function ShopPage() {
    const [petType, setPetType] = useState<'all' | 'dog' | 'cat'>('all');
    const [category, setCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const { data: products = [], isLoading, error } = useStoreProducts({
        category,
        petType,
        search: searchQuery,
    });

    return (
        <div className="pt-4 lg:pt-6 pb-20 bg-playful-cream min-h-screen">
            <div className="max-w-[1400px] mx-auto px-4 lg:px-8">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-playful-coral text-white rounded-xl">
                            <Store className="w-5 h-5" />
                        </div>
                        <h1 className="text-2xl md:text-4xl font-heading font-black text-playful-text">
                            Pet Partner Stores & Bestsellers
                        </h1>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500 max-w-2xl leading-relaxed">
                        We don&apos;t sell products directly — just like CashKaro, we partner with India&apos;s leading pet platforms. Shop through our verified links to earn PawCoins, unlock partner discounts, and fund food &amp; medical care for rescue animals at zero extra cost.
                    </p>
                </div>

                {/* PawCoins Balance Banner */}
                <PawCoinsBanner />

                {/* CashKaro-Style 3-Step Flow */}
                <div className="bg-white rounded-[2rem] p-5 md:p-6 border border-gray-100 shadow-soft mb-10">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-4 h-4 text-playful-coral" />
                        <h2 className="text-sm font-heading font-black text-playful-text uppercase tracking-wider">
                            How Partner Shopping Works
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-playful-cream/60 border border-gray-100">
                            <div className="w-8 h-8 rounded-xl bg-playful-coral text-white flex items-center justify-center text-xs font-black shrink-0">
                                1
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-900">Choose a Platform</h3>
                                <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                                    Pick Supertails, Amazon Pets, HUFT, Zigly, or Drools below.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-playful-cream/60 border border-gray-100">
                            <div className="w-8 h-8 rounded-xl bg-playful-teal text-white flex items-center justify-center text-xs font-black shrink-0">
                                2
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-900">Shop Normal Deals</h3>
                                <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                                    Order on their official site or app. Use coupons and pay standard merchant prices.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-playful-cream/60 border border-gray-100">
                            <div className="w-8 h-8 rounded-xl bg-playful-yellow text-playful-text flex items-center justify-center text-xs font-black shrink-0">
                                3
                            </div>
                            <div>
                                <h3 className="text-xs font-bold text-gray-900">Earn Coins &amp; Feed Strays</h3>
                                <p className="text-[11px] text-gray-500 mt-0.5 leading-normal">
                                    We earn an affiliate commission and reinvest 100% into street animal welfare.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Primary Section: Top Partner Platforms */}
                <div className="mb-14">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-playful-coral text-white tracking-wider">
                                    Affiliate Partners
                                </span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-heading font-black text-playful-text mt-1.5">
                                Top Pet Stores &amp; Platforms
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Tap any store to activate your PawCoins tracking session and shop directly.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {AFFILIATE_PLATFORMS.map(platform => (
                            <PlatformCard key={platform.id} platform={platform} />
                        ))}
                    </div>
                </div>

                {/* Secondary Section: Bestselling Products & Direct Deals */}
                <div className="mb-12">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500 text-white tracking-wider">
                                    Curated Deals
                                </span>
                            </div>
                            <h2 className="text-xl md:text-2xl font-heading font-black text-playful-text mt-1.5">
                                Bestselling Pet Products
                            </h2>
                            <p className="text-xs text-gray-500 mt-0.5">
                                Handpicked recommendations with direct affiliate links across our partner platforms.
                            </p>
                        </div>

                        {/* Search Input */}
                        <div className="relative max-w-xs w-full">
                            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                placeholder="Search products..."
                                className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-playful-coral/40 shadow-xs"
                            />
                        </div>
                    </div>

                    {/* Filter Controls: Pet Type Tabs + Category Pills */}
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-gray-200/80 shadow-xs w-fit">
                            {[
                                { key: 'all' as const, label: 'All Pets 🐾' },
                                { key: 'dog' as const, label: 'Dogs 🐕' },
                                { key: 'cat' as const, label: 'Cats 🐱' },
                            ].map(tab => (
                                <button
                                    key={tab.key}
                                    onClick={() => setPetType(tab.key)}
                                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                        petType === tab.key
                                            ? 'bg-playful-coral text-white shadow-xs'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Category Scrollable Filter */}
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat.value}
                                    onClick={() => setCategory(cat.value)}
                                    className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                                        category === cat.value
                                            ? 'bg-playful-text text-white shadow-xs'
                                            : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200/80'
                                    }`}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white rounded-[2rem] h-80 animate-pulse border border-gray-100" />
                            ))}
                        </div>
                    ) : error ? (
                        <div className="text-center py-16 bg-white rounded-[2rem] p-8 border border-gray-100">
                            <p className="text-lg font-bold text-red-500 mb-2">Could not load products</p>
                            <p className="text-xs text-gray-400">Please try refreshing.</p>
                        </div>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {products.map(product => (
                                <ShopProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-white rounded-[2rem] p-8 border border-gray-100">
                            <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-base font-bold text-gray-700">No products found</h3>
                            <p className="text-xs text-gray-400 mt-1">Try selecting another category or clearing your search.</p>
                        </div>
                    )}
                </div>

                {/* Affiliate Transparency Disclosure */}
                <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div className="text-xs text-gray-600 leading-relaxed">
                            <strong className="text-gray-900 block font-heading font-black text-sm">
                                100% Non-Profit Reinvestment Policy
                            </strong>
                            AdoptDontShop operates on a transparent affiliate model. When you buy via Supertails, Amazon, or HUFT, the partner pays us a marketing referral commission at zero extra cost to you. 100% of these earnings fund street animal feeding drives, emergency veterinary medical treatments, and shelter adoptions across India.
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-playful-coral shrink-0">
                        <Heart className="w-4 h-4 fill-current" />
                        <span>Every Purchase Helps an Animal</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
