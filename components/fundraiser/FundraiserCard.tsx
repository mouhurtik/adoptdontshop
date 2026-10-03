'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Heart, Users, AlertTriangle, MapPin } from 'lucide-react';
import ProgressBar from '@/components/fundraiser/ProgressBar';
import PaymentDetailsModal from '@/components/fundraiser/PaymentDetailsModal';
import type { Fundraiser } from '@/hooks/useFundraisers';

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
    sterilization: { label: 'Sterilization', color: 'bg-teal-100 text-teal-800' },
    treatment: { label: 'Medical Treatment', color: 'bg-rose-100 text-rose-800' },
    shelter: { label: 'Shelter & Care', color: 'bg-amber-100 text-amber-800' },
    food_drive: { label: 'Food Drive', color: 'bg-emerald-100 text-emerald-800' },
    rescue: { label: 'Emergency Rescue', color: 'bg-purple-100 text-purple-800' },
    other: { label: 'Animal Cause', color: 'bg-gray-100 text-gray-800' },
};

interface FundraiserCardProps {
    fundraiser: Fundraiser;
    priority?: boolean;
}

export default function FundraiserCard({ fundraiser, priority = false }: FundraiserCardProps) {
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const cat = CATEGORY_LABELS[fundraiser.category] || CATEGORY_LABELS.other;

    const raised = Number(fundraiser.raised_amount || 0);
    const target = Number(fundraiser.target_amount || 1);

    return (
        <>
            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-soft hover:shadow-md transition-all duration-300 flex flex-col overflow-hidden group">
                {/* Image & Badges */}
                <Link href={`/fundraisers/${fundraiser.slug}`} className="relative h-48 sm:h-52 w-full bg-playful-cream/60 overflow-hidden block">
                    {fundraiser.image_url ? (
                        <img
                            src={fundraiser.image_url}
                            alt={fundraiser.title}
                            loading={priority ? 'eager' : 'lazy'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-teal-50 text-gray-300">
                            <Heart className="w-12 h-12 stroke-[1.5] text-rose-300" />
                            <span className="text-xs font-bold text-gray-400 mt-2">AdoptDontShop Cause</span>
                        </div>
                    )}

                    {/* Urgent badge */}
                    {fundraiser.is_urgent && (
                        <div className="absolute top-3 left-3 flex items-center gap-1 px-3 py-1 rounded-full bg-red-500/90 text-white text-xs font-extrabold shadow-sm animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Urgent</span>
                        </div>
                    )}

                    {/* Category badge */}
                    <div className="absolute top-3 right-3">
                        <span className={`text-[11px] font-bold px-3 py-1 rounded-full shadow-xs backdrop-blur-xs ${cat.color}`}>
                            {cat.label}
                        </span>
                    </div>

                    {fundraiser.city && (
                        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 text-white text-[11px] font-medium backdrop-blur-xs">
                            <MapPin className="w-3 h-3 text-playful-coral" />
                            <span>{fundraiser.city}</span>
                        </div>
                    )}
                </Link>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                        <Link href={`/fundraisers/${fundraiser.slug}`}>
                            <h3 className="font-heading font-black text-lg text-playful-text hover:text-playful-coral transition-colors line-clamp-2 leading-snug mb-2">
                                {fundraiser.title}
                            </h3>
                        </Link>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                            {fundraiser.description_text || fundraiser.description?.replace(/<[^>]*>/g, '') || 'Join us in supporting this animal care initiative.'}
                        </p>
                    </div>

                    {/* Progress */}
                    <div className="space-y-4 pt-2 border-t border-gray-50">
                        <ProgressBar raised={raised} target={target} />

                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                <Users className="w-3.5 h-3.5 text-gray-400" />
                                <span>{fundraiser.supporter_count || 0} supporters</span>
                            </div>

                            <button
                                onClick={() => setIsPaymentOpen(true)}
                                className="px-4 py-2 rounded-xl bg-playful-coral hover:bg-playful-coral/90 text-white text-xs font-bold transition-colors shadow-xs"
                            >
                                Support
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentDetailsModal
                fundraiser={fundraiser}
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
            />
        </>
    );
}
