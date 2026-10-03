'use client';

import { Sparkles, Tag, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import type { AffiliatePlatform } from '@/hooks/useShop';
import { useTrackPlatformClick } from '@/hooks/useShop';

interface PlatformCardProps {
    platform: AffiliatePlatform;
}

export default function PlatformCard({ platform }: PlatformCardProps) {
    const { isAuthenticated } = useAuth();
    const trackClick = useTrackPlatformClick();

    const handleVisit = () => {
        if (isAuthenticated) {
            trackClick.mutate(platform);
            toast.success(`Activated ${platform.name}! +${platform.reward_pawcoins} PawCoins earned.`);
        }
        window.open(platform.affiliate_url, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-soft hover:shadow-hover transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
            <div>
                {/* Header: Platform Logo Icon + Highlight Badge */}
                <div className="flex items-start justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${platform.bg_gradient} text-white flex items-center justify-center font-heading font-black text-sm shadow-sm flex-shrink-0`}>
                            {platform.logo_initial}
                        </div>
                        <div>
                            <h3 className="text-base font-heading font-black text-playful-text group-hover:text-playful-coral transition-colors flex items-center gap-1">
                                {platform.name}
                            </h3>
                            <p className="text-[11px] font-semibold text-gray-400 line-clamp-1">
                                {platform.tagline}
                            </p>
                        </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60 shrink-0">
                        {platform.badge}
                    </span>
                </div>

                {/* Cashback / PawCoins Rate Banner (CashKaro Style) */}
                <div className="bg-playful-coral/10 border border-playful-coral/20 rounded-xl p-2.5 mb-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-playful-coral shrink-0" />
                        <span className="text-xs font-heading font-black text-playful-coral">
                            {platform.reward_text}
                        </span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-500 bg-white/80 px-2 py-0.5 rounded-md">
                        +{platform.reward_pawcoins} Coins on Visit
                    </span>
                </div>

                {/* Popular Categories */}
                <div className="flex flex-wrap gap-1.5 mb-3.5">
                    {platform.popular_categories.map((cat, idx) => (
                        <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-gray-50 text-gray-600 text-[10px] font-semibold border border-gray-100"
                        >
                            {cat}
                        </span>
                    ))}
                </div>

                {/* Extra Partner Perk */}
                {platform.perk && (
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50/70 px-2.5 py-1.5 rounded-lg mb-4">
                        <Tag className="w-3 h-3 shrink-0 text-emerald-600" />
                        <span className="line-clamp-1">{platform.perk}</span>
                    </div>
                )}
            </div>

            {/* Visit Platform CTA */}
            <button
                onClick={handleVisit}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-playful-text hover:bg-playful-coral text-white text-xs font-bold transition-all duration-200 shadow-xs group/btn"
            >
                <span>Shop on {platform.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
        </div>
    );
}
