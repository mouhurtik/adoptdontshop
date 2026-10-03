'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Share2, Heart, ShieldCheck, Users, AlertTriangle, MapPin, Check } from 'lucide-react';
import { toast } from 'sonner';
import ProgressBar from '@/components/fundraiser/ProgressBar';
import PaymentDetailsModal from '@/components/fundraiser/PaymentDetailsModal';
import { useFundraiserBySlug } from '@/hooks/useFundraisers';
import { formatTimeAgo } from '@/lib/formatTimeAgo';

interface FundraiserDetailProps {
    slug: string;
}

export default function FundraiserDetail({ slug }: FundraiserDetailProps) {
    const { data, isLoading, error } = useFundraiserBySlug(slug);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [copiedLink, setCopiedLink] = useState(false);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-playful-cream pt-6 pb-20 flex justify-center items-center">
                <div className="w-12 h-12 rounded-full border-4 border-playful-coral border-t-transparent animate-spin" />
            </div>
        );
    }

    if (error || !data?.fundraiser) {
        return (
            <div className="min-h-screen bg-playful-cream pt-12 pb-20 px-4 text-center">
                <div className="max-w-md mx-auto bg-white rounded-[2rem] p-8 border border-gray-100 shadow-soft">
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Fundraiser Not Found</h2>
                    <p className="text-xs text-gray-500 mb-6">This fundraiser may have ended or been removed.</p>
                    <Link
                        href="/fundraisers"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-playful-coral text-white font-bold text-xs"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Fundraisers
                    </Link>
                </div>
            </div>
        );
    }

    const { fundraiser, supporters } = data;
    const raised = Number(fundraiser.raised_amount || 0);
    const target = Number(fundraiser.target_amount || 1);

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            if (navigator.share) {
                navigator.share({
                    title: fundraiser.title,
                    text: `Help support "${fundraiser.title}" on AdoptDontShop!`,
                    url: window.location.href,
                }).catch(() => {});
            } else {
                navigator.clipboard.writeText(window.location.href);
                setCopiedLink(true);
                toast.success('Fundraiser link copied to clipboard!');
                setTimeout(() => setCopiedLink(false), 2500);
            }
        }
    };

    return (
        <div className="pt-4 lg:pt-6 pb-24 bg-playful-cream min-h-screen">
            <div className="max-w-[1100px] mx-auto px-4 lg:px-8">
                {/* Back navigation */}
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href="/fundraisers"
                        className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-playful-coral transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        All Fundraisers
                    </Link>

                    <button
                        onClick={handleShare}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs transition-colors"
                    >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-gray-500" />}
                        <span>{copiedLink ? 'Copied' : 'Share Cause'}</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Media & Story */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Hero Image */}
                        <div className="relative h-64 sm:h-96 w-full rounded-[2.5rem] bg-gray-100 overflow-hidden shadow-soft border border-gray-100">
                            {fundraiser.image_url ? (
                                <img
                                    src={fundraiser.image_url}
                                    alt={fundraiser.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 to-teal-50 text-gray-300">
                                    <Heart className="w-16 h-16 stroke-[1.5] text-rose-300" />
                                </div>
                            )}

                            {fundraiser.is_urgent && (
                                <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-red-500 text-white text-xs font-black shadow-md animate-pulse">
                                    <AlertTriangle className="w-4 h-4" />
                                    <span>Urgent Medical Need</span>
                                </div>
                            )}
                        </div>

                        {/* Title & Creator */}
                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-soft border border-gray-100">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="text-xs font-bold px-3 py-1 rounded-full bg-playful-coral/10 text-playful-coral uppercase tracking-wider">
                                    {fundraiser.category}
                                </span>
                                {fundraiser.city && (
                                    <span className="flex items-center gap-1 text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                        <MapPin className="w-3.5 h-3.5 text-playful-coral" />
                                        {fundraiser.city}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-2xl md:text-4xl font-heading font-black text-playful-text leading-tight mb-4">
                                {fundraiser.title}
                            </h1>

                            {/* Creator metadata */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <div className="w-10 h-10 rounded-full bg-playful-coral/10 text-playful-coral font-bold flex items-center justify-center text-sm">
                                    {fundraiser.creator_profile?.avatar_url ? (
                                        <img
                                            src={fundraiser.creator_profile.avatar_url}
                                            alt="Creator"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        (fundraiser.creator_profile?.display_name || 'C').charAt(0).toUpperCase()
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-xs font-bold text-playful-text">
                                            {fundraiser.creator_profile?.display_name || 'Animal Guardian'}
                                        </span>
                                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    </div>
                                    <span className="text-[11px] text-gray-400">
                                        Organized this fundraiser · {fundraiser.created_at ? formatTimeAgo(fundraiser.created_at) : 'recently'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Story Content */}
                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-soft border border-gray-100">
                            <h2 className="text-lg font-heading font-black text-playful-text mb-4">
                                About This Fundraiser
                            </h2>
                            <div
                                className="prose max-w-none text-sm md:text-base text-gray-700 leading-relaxed font-sans"
                                dangerouslySetInnerHTML={{
                                    __html: fundraiser.description || `<p>${fundraiser.description_text || ''}</p>`,
                                }}
                            />
                        </div>

                        {/* Supporters Community List */}
                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-soft border border-gray-100">
                            <div className="flex items-center justify-between mb-5">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-playful-coral" />
                                    <h3 className="text-lg font-heading font-black text-playful-text">
                                        Supporters ({supporters.length})
                                    </h3>
                                </div>
                            </div>

                            {supporters.length > 0 ? (
                                <div className="divide-y divide-gray-100">
                                    {supporters.map(s => (
                                        <div key={s.id} className="py-3.5 flex items-start justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-playful-text">
                                                        {s.is_anonymous ? 'Kind Supporter' : s.donor_name || 'Anonymous'}
                                                    </span>
                                                    <span className="text-[11px] text-gray-400">
                                                        {s.created_at ? formatTimeAgo(s.created_at) : ''}
                                                    </span>
                                                </div>
                                                {s.message && (
                                                    <p className="text-xs text-gray-600 mt-1 italic">
                                                        &ldquo;{s.message}&rdquo;
                                                    </p>
                                                )}
                                            </div>
                                            {s.amount && (
                                                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg shrink-0">
                                                    ₹{Number(s.amount).toLocaleString('en-IN')}
                                                </span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-gray-400 text-center py-6">
                                    Be the very first hero to support this cause!
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column: Donation Card (Sticky on desktop) */}
                    <div className="lg:col-span-4">
                        <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-soft border border-gray-100 sticky top-8 space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Funds Raised
                                </h3>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-heading font-black text-playful-coral">
                                        ₹{raised.toLocaleString('en-IN')}
                                    </span>
                                    <span className="text-xs text-gray-400 font-semibold">
                                        raised of ₹{target.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>

                            <ProgressBar raised={raised} target={target} showLabel={false} />

                            <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100 text-center">
                                <div>
                                    <span className="text-lg font-heading font-black text-playful-text block">
                                        {fundraiser.supporter_count || supporters.length}
                                    </span>
                                    <span className="text-[11px] text-gray-400 font-medium">Kind Supporters</span>
                                </div>
                                <div>
                                    <span className="text-lg font-heading font-black text-playful-text block">
                                        {Math.round((raised / target) * 100)}%
                                    </span>
                                    <span className="text-[11px] text-gray-400 font-medium">Goal Achieved</span>
                                </div>
                            </div>

                            {/* Main CTA */}
                            <button
                                onClick={() => setIsPaymentOpen(true)}
                                className="w-full py-3.5 bg-playful-coral hover:bg-playful-coral/90 text-white font-bold text-sm md:text-base rounded-2xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                            >
                                Support This Cause
                            </button>

                            <button
                                onClick={handleShare}
                                className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-gray-200"
                            >
                                <Share2 className="w-4 h-4 text-gray-500" />
                                Share with Friends
                            </button>

                            <div className="bg-playful-cream/60 rounded-xl p-3 border border-playful-coral/15 text-[11px] text-gray-500 flex items-start gap-2">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>
                                    Direct transfers go 100% to the verified animal caregiver without intermediaries or cuts.
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentDetailsModal
                fundraiser={fundraiser}
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
            />
        </div>
    );
}
