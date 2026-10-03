'use client';

import { useState } from 'react';
import { X, Check, MapPin, Syringe, Scissors, ThumbsUp, Share2, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { StreetAnimalSighting, useConfirmSighting } from '@/hooks/useMapSightings';
import { formatTimeAgo } from '@/lib/formatTimeAgo';
import { useAuth } from '@/contexts/AuthContext';

interface SightingCardProps {
    sighting: StreetAnimalSighting;
    onClose: () => void;
}

export default function SightingCard({ sighting, onClose }: SightingCardProps) {
    const { isAuthenticated } = useAuth();
    const confirmMutation = useConfirmSighting();
    const [confirmedLocally, setConfirmedLocally] = useState(sighting.user_confirmed || false);
    const [confirmCount, setConfirmCount] = useState(sighting.confirmation_count || 0);

    const handleConfirm = async () => {
        if (!isAuthenticated) {
            toast.error('Please sign in to confirm this animal sighting');
            return;
        }

        if (confirmedLocally) {
            toast.info("You've already confirmed this spot!");
            return;
        }

        try {
            await confirmMutation.mutateAsync(sighting.id);
            setConfirmedLocally(true);
            setConfirmCount(prev => prev + 1);
            toast.success('Confirmed! Thanks for keeping community data fresh (+2 PawCoins)!');
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Could not confirm sighting';
            toast.error(msg);
        }
    };

    const handleShare = () => {
        if (typeof window !== 'undefined') {
            const shareUrl = `${window.location.origin}/map?spot=${sighting.id}`;
            navigator.clipboard.writeText(shareUrl);
            toast.success('Spot link copied to clipboard!');
        }
    };

    return (
        <div className="bg-white rounded-[2rem] p-5 md:p-6 shadow-2xl border border-gray-100 max-w-md w-full relative animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors z-10"
                aria-label="Close details"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Photo & Header */}
            <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-playful-cream/60 shrink-0 border border-gray-100">
                    {sighting.image_url ? (
                        <img
                            src={sighting.image_url}
                            alt={sighting.name || 'Street animal'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl">
                            {sighting.animal_type === 'cat' ? '🐱' : sighting.animal_type === 'dog' ? '🐕' : '🐾'}
                        </div>
                    )}
                </div>

                <div className="min-w-0 flex-1 pr-6">
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className={`text-[10px] uppercase font-black px-2.5 py-0.5 rounded-full ${
                            sighting.animal_type === 'cat' ? 'bg-playful-coral/15 text-playful-coral' :
                            sighting.animal_type === 'dog' ? 'bg-playful-teal/15 text-playful-teal' : 'bg-amber-100 text-amber-800'
                        }`}>
                            {sighting.animal_type}
                        </span>
                        {sighting.city && (
                            <span className="text-[11px] text-gray-400 flex items-center gap-0.5 truncate">
                                <MapPin className="w-3 h-3 text-playful-coral shrink-0" />
                                {sighting.city}
                            </span>
                        )}
                    </div>

                    <h3 className="text-lg md:text-xl font-heading font-black text-playful-text truncate">
                        {sighting.name || `Community ${sighting.animal_type}`}
                    </h3>

                    {sighting.location_name && (
                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 font-medium">
                            {sighting.location_name}
                        </p>
                    )}
                </div>
            </div>

            {/* Health & Care Badges */}
            <div className="flex flex-wrap gap-2 mb-4">
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                    sighting.is_vaccinated ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' : 'bg-gray-50 text-gray-400 border border-gray-200/40'
                }`}>
                    <Syringe className="w-3.5 h-3.5" />
                    <span>{sighting.is_vaccinated ? 'Vaccinated' : 'Unvaccinated'}</span>
                </div>

                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                    sighting.is_sterilized ? 'bg-teal-50 text-teal-700 border border-teal-200/60' : 'bg-gray-50 text-gray-400 border border-gray-200/40'
                }`}>
                    <Scissors className="w-3.5 h-3.5" />
                    <span>{sighting.is_sterilized ? 'Sterilized (ABC)' : 'Unsterilized'}</span>
                </div>
            </div>

            {/* Description / Notes */}
            {sighting.description && (
                <div className="bg-playful-cream/40 rounded-xl p-3 text-xs text-gray-700 mb-4 border border-playful-coral/10 leading-relaxed">
                    {sighting.description}
                </div>
            )}

            {/* Sighting Status & Verification Activity */}
            <div className="flex items-center justify-between text-xs text-gray-400 mb-4 px-1">
                <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-playful-coral" />
                    <strong className="text-gray-700">{confirmCount}</strong> confirmations
                </span>
                <span>
                    Last seen: {sighting.last_confirmed_at ? formatTimeAgo(sighting.last_confirmed_at) : 'recently'}
                </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={handleConfirm}
                    disabled={confirmedLocally || confirmMutation.isPending}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${
                        confirmedLocally
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-playful-coral hover:bg-playful-coral/90 text-white'
                    }`}
                >
                    {confirmedLocally ? (
                        <>
                            <Check className="w-4 h-4" />
                            <span>Confirmed Sighting!</span>
                        </>
                    ) : (
                        <>
                            <ThumbsUp className="w-4 h-4" />
                            <span>Still Here! (+2 PawCoins)</span>
                        </>
                    )}
                </button>

                <button
                    onClick={handleShare}
                    className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors"
                    title="Share spot link"
                >
                    <Share2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
