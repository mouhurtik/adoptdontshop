'use client';

import { useState } from 'react';
import { X, Copy, Check, Heart, Sparkles, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { useAddSupporter, Fundraiser } from '@/hooks/useFundraisers';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentDetailsModalProps {
    fundraiser: Fundraiser;
    isOpen: boolean;
    onClose: () => void;
}

export default function PaymentDetailsModal({
    fundraiser,
    isOpen,
    onClose,
}: PaymentDetailsModalProps) {
    const { profile } = useAuth();
    const addSupporterMutation = useAddSupporter();

    const [copied, setCopied] = useState(false);
    const [donorName, setDonorName] = useState(profile?.display_name || '');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [hasLoggedDonation, setHasLoggedDonation] = useState(false);

    if (!isOpen) return null;

    const upiId = fundraiser.payment_upi || '';
    const upiDeepLink = upiId ? `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(fundraiser.title.substring(0, 25))}&cu=INR` : '';

    const handleCopyUPI = () => {
        if (!upiId) return;
        navigator.clipboard.writeText(upiId);
        setCopied(true);
        toast.success('UPI ID copied to clipboard!');
        setTimeout(() => setCopied(false), 2500);
    };

    const handleLogDonation = async (e: React.FormEvent) => {
        e.preventDefault();
        const donationAmount = parseFloat(amount);
        if (isNaN(donationAmount) || donationAmount <= 0) {
            toast.error('Please enter a valid amount');
            return;
        }

        try {
            await addSupporterMutation.mutateAsync({
                fundraiserId: fundraiser.id,
                donorName: isAnonymous ? 'Kind Supporter' : (donorName.trim() || 'Anonymous'),
                amount: donationAmount,
                message: message.trim() || undefined,
                isAnonymous,
            });
            setHasLoggedDonation(true);
            toast.success('Thank you so much! Your contribution was recorded (+15 PawCoins)!');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Could not record donation';
            toast.error(message);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div
                className="bg-white rounded-[2rem] max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 p-6 md:p-8 relative animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 mb-3 shadow-xs">
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <h3 className="text-xl md:text-2xl font-heading font-black text-playful-text">
                        Support This Cause
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 mt-1 font-medium">
                        {fundraiser.title}
                    </p>
                </div>

                {/* Direct UPI Transfer Info */}
                <div className="bg-playful-cream/50 rounded-2xl p-5 border border-playful-coral/20 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                            Direct 0% Platform Fee Payment
                        </span>
                    </div>

                    {upiId ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-gray-200">
                                <div>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold block">UPI ID</span>
                                    <span className="text-sm md:text-base font-bold text-playful-text select-all">
                                        {upiId}
                                    </span>
                                </div>
                                <button
                                    onClick={handleCopyUPI}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-playful-coral text-white text-xs font-bold hover:bg-playful-coral/90 transition-colors shadow-xs"
                                >
                                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>

                            {/* Mobile UPI App Trigger */}
                            <a
                                href={upiDeepLink}
                                className="block text-center w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors"
                            >
                                Pay via UPI App (GPay, PhonePe, Paytm)
                            </a>
                        </div>
                    ) : (
                        <p className="text-xs text-gray-500 italic">
                            No UPI ID provided. Please contact the creator directly.
                        </p>
                    )}

                    {fundraiser.payment_qr_url && (
                        <div className="mt-4 text-center">
                            <span className="text-[11px] text-gray-400 font-semibold mb-2 block">
                                Or scan QR code to pay
                            </span>
                            <div className="inline-block p-2 bg-white rounded-xl shadow-xs border border-gray-100">
                                <img
                                    src={fundraiser.payment_qr_url}
                                    alt="Payment QR code"
                                    className="w-40 h-40 object-contain mx-auto rounded-lg"
                                />
                            </div>
                        </div>
                    )}

                    {fundraiser.payment_details && (
                        <div className="mt-3 p-3 bg-white/80 rounded-xl text-xs text-gray-600 whitespace-pre-line border border-gray-100">
                            <span className="font-bold block text-gray-700 mb-1">Additional details:</span>
                            {fundraiser.payment_details}
                        </div>
                    )}
                </div>

                {/* Confirm / Record Contribution */}
                {!hasLoggedDonation ? (
                    <form onSubmit={handleLogDonation} className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-playful-yellow" />
                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Already transferred? Record your support
                            </h4>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">
                                Amount Donated (₹) *
                            </label>
                            <input
                                type="number"
                                min="10"
                                required
                                value={amount}
                                onChange={e => setAmount(e.target.value)}
                                placeholder="e.g. 500"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/40"
                            />
                        </div>

                        {!isAnonymous && (
                            <div>
                                <label className="block text-xs font-bold text-gray-600 mb-1">
                                    Your Name
                                </label>
                                <input
                                    type="text"
                                    value={donorName}
                                    onChange={e => setDonorName(e.target.value)}
                                    placeholder="Your full name"
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/40"
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">
                                Encouraging Message (Optional)
                            </label>
                            <input
                                type="text"
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Wishing the fur babies speedy recovery! ❤️"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/40"
                            />
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer pt-1">
                            <input
                                type="checkbox"
                                checked={isAnonymous}
                                onChange={e => setIsAnonymous(e.target.checked)}
                                className="rounded text-playful-coral focus:ring-playful-coral"
                            />
                            <span className="text-xs text-gray-600 font-medium">
                                Keep my donation anonymous to the public
                            </span>
                        </label>

                        <button
                            type="submit"
                            disabled={addSupporterMutation.isPending}
                            className="w-full py-3 mt-2 bg-playful-coral hover:bg-playful-coral/90 text-white font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
                        >
                            {addSupporterMutation.isPending ? 'Recording...' : 'Record My Contribution (+15 PawCoins)'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center py-4 bg-emerald-50 rounded-2xl border border-emerald-100 p-4">
                        <Check className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                        <h4 className="text-base font-bold text-emerald-900">Contribution Recorded!</h4>
                        <p className="text-xs text-emerald-700 mt-1">
                            Thank you for being a hero for animals. Your support appears in the public supporters list.
                        </p>
                        <button
                            onClick={onClose}
                            className="mt-3 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-colors"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
