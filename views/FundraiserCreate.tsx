'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, CheckCircle2, HeartHandshake, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateFundraiser } from '@/hooks/useFundraisers';
import { supabase } from '@/lib/supabase/client';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function FundraiserCreate() {
    const { isAuthenticated } = useAuth();
    const createFundraiser = useCreateFundraiser();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('treatment');
    const [targetAmount, setTargetAmount] = useState('');
    const [city, setCity] = useState('');
    const [upiId, setUpiId] = useState('');
    const [paymentDetails, setPaymentDetails] = useState('');
    const [description, setDescription] = useState('');
    const [isUrgent, setIsUrgent] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [qrFile, setQrFile] = useState<File | null>(null);
    const [qrPreview, setQrPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isAuthenticated) {
        return (
            <div className="pt-12 pb-24 px-4 bg-playful-cream min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-soft text-center">
                    <div className="w-16 h-16 rounded-3xl bg-rose-50 text-playful-coral flex items-center justify-center mx-auto mb-4">
                        <HeartHandshake className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-heading font-black text-playful-text mb-2">
                        Sign In Required
                    </h2>
                    <p className="text-xs text-gray-500 mb-6">
                        To maintain trust and safety in our community, you need an account to create fundraisers.
                    </p>
                    <Link href="/login?redirect=/fundraisers/create">
                        <PrimaryButton size="lg" className="w-full">
                            Sign In to Continue
                        </PrimaryButton>
                    </Link>
                </div>
            </div>
        );
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setQrFile(file);
            setQrPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const target = parseFloat(targetAmount);

        if (!title.trim()) return toast.error('Please provide a title');
        if (isNaN(target) || target <= 0) return toast.error('Please provide a valid target amount');
        if (!upiId.trim()) return toast.error('Please provide a UPI ID for receiving direct donations');
        if (!description.trim()) return toast.error('Please share the story/description for this cause');

        setIsSubmitting(true);
        try {
            let uploadedImageUrl: string | undefined = undefined;
            let uploadedQrUrl: string | undefined = undefined;

            // Upload cover photo if provided
            if (imageFile) {
                const ext = imageFile.name.split('.').pop();
                const fileName = `fundraiser-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
                const { error: uploadError } = await supabase.storage
                    .from('community-images')
                    .upload(fileName, imageFile, { contentType: imageFile.type });

                if (!uploadError) {
                    const { data: urlData } = supabase.storage.from('community-images').getPublicUrl(fileName);
                    uploadedImageUrl = urlData.publicUrl;
                }
            }

            // Upload QR if provided
            if (qrFile) {
                const ext = qrFile.name.split('.').pop();
                const fileName = `qr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
                const { error: uploadError } = await supabase.storage
                    .from('community-images')
                    .upload(fileName, qrFile, { contentType: qrFile.type });

                if (!uploadError) {
                    const { data: urlData } = supabase.storage.from('community-images').getPublicUrl(fileName);
                    uploadedQrUrl = urlData.publicUrl;
                }
            }

            await createFundraiser.mutateAsync({
                title: title.trim(),
                category,
                target_amount: target,
                city: city.trim() || undefined,
                payment_upi: upiId.trim(),
                payment_details: paymentDetails.trim() || undefined,
                description: `<p>${description.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`,
                description_text: description.trim(),
                image_url: uploadedImageUrl,
                payment_qr_url: uploadedQrUrl,
                is_urgent: isUrgent,
            });

            setIsSuccess(true);
            toast.success('Fundraiser submitted for review!');
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to submit fundraiser';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="pt-12 pb-24 px-4 bg-playful-cream min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-soft text-center">
                    <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-heading font-black text-playful-text mb-2">
                        Submitted for Approval!
                    </h2>
                    <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                        To protect donors and animals from fraud, our moderators review every fundraiser within 2–4 hours. You can see it live as soon as it is approved.
                    </p>
                    <div className="flex flex-col gap-2">
                        <Link href="/fundraisers">
                            <PrimaryButton size="md" className="w-full">
                                Browse All Fundraisers
                            </PrimaryButton>
                        </Link>
                        <Link href="/" className="text-xs text-gray-500 font-bold py-2 hover:text-playful-coral">
                            Go to Homepage
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-4 lg:pt-6 pb-24 bg-playful-cream min-h-screen">
            <div className="max-w-2xl mx-auto px-4 lg:px-6">
                <div className="mb-6">
                    <Link
                        href="/fundraisers"
                        className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-playful-coral transition-colors mb-3"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Fundraisers
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-heading font-black text-playful-text">
                        Start an Animal Fundraiser
                    </h1>
                    <p className="text-xs text-gray-500 mt-1">
                        Raise funds directly to your UPI ID for treatment, sterilizations, and stray animal welfare.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-[2rem] p-6 md:p-8 shadow-soft border border-gray-100 space-y-6">
                    {/* Urgency Alert Card */}
                    <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/60 flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div className="text-xs text-amber-900 leading-relaxed">
                            <span className="font-bold block">100% Direct to Caregivers:</span>
                            We take 0% platform fee. All donations go directly from supporters to your UPI ID. You will be asked to update the raised amount periodically.
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Fundraiser Title *
                        </label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g. Urgent Leg Surgery for Stray Puppy 'Tommy'"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-playful-coral/40"
                        />
                    </div>

                    {/* Category & Target Amount */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Category *
                            </label>
                            <select
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-playful-coral/40"
                            >
                                <option value="treatment">Medical Treatment</option>
                                <option value="sterilization">Sterilization / ABC</option>
                                <option value="shelter">Shelter & Boarding</option>
                                <option value="food_drive">Food Drive</option>
                                <option value="rescue">Emergency Rescue</option>
                                <option value="other">Other Welfare</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                                Target Amount (₹) *
                            </label>
                            <input
                                type="number"
                                required
                                min="100"
                                value={targetAmount}
                                onChange={e => setTargetAmount(e.target.value)}
                                placeholder="e.g. 15000"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-playful-coral/40"
                            />
                        </div>
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            City / Location
                        </label>
                        <input
                            type="text"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            placeholder="e.g. Mumbai, Bandra West"
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-playful-coral/40"
                        />
                    </div>

                    {/* Cover Photo */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            Cover Photo / Vet Bill
                        </label>
                        <div className="flex items-center gap-4">
                            <label className="flex-1 border-2 border-dashed border-gray-200 hover:border-playful-coral rounded-2xl p-4 text-center cursor-pointer transition-colors">
                                <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                                <span className="text-xs font-bold text-playful-coral">Upload Photo</span>
                                <span className="text-[10px] text-gray-400 block mt-0.5">JPG, PNG, WebP up to 5MB</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            {imagePreview && (
                                <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-200 shrink-0">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment Info: UPI ID & QR */}
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                        <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                            Payment Details (For Direct Donor Transfers)
                        </h4>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Your UPI ID *
                            </label>
                            <input
                                type="text"
                                required
                                value={upiId}
                                onChange={e => setUpiId(e.target.value)}
                                placeholder="caregiver@okhdfcbank"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/40 bg-white"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                UPI QR Code (Optional screenshot)
                            </label>
                            <div className="flex items-center gap-4">
                                <label className="border border-gray-300 bg-white hover:bg-gray-50 rounded-xl px-4 py-2 cursor-pointer text-xs font-bold text-gray-700 inline-flex items-center gap-2">
                                    <Upload className="w-4 h-4 text-gray-400" />
                                    Choose QR Image
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleQrChange}
                                        className="hidden"
                                    />
                                </label>
                                {qrPreview && (
                                    <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 shrink-0">
                                        <img src={qrPreview} alt="QR" className="w-full h-full object-contain" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">
                                Bank or Hospital Details (Optional)
                            </label>
                            <textarea
                                rows={2}
                                value={paymentDetails}
                                onChange={e => setPaymentDetails(e.target.value)}
                                placeholder="e.g. Can also pay directly at Crown Vet Clinic under Case #481"
                                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:ring-2 focus:ring-playful-coral/40 bg-white"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
                            The Full Story & Medical Need *
                        </label>
                        <textarea
                            rows={6}
                            required
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            placeholder="Explain what happened to the animal, the diagnosis by the vet, treatment plan, and how the funds will be utilized..."
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/40"
                        />
                    </div>

                    {/* Urgent Checkbox */}
                    <div className="flex items-start gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100">
                        <input
                            type="checkbox"
                            id="urgent"
                            checked={isUrgent}
                            onChange={e => setIsUrgent(e.target.checked)}
                            className="mt-1 rounded text-red-500 focus:ring-red-400"
                        />
                        <label htmlFor="urgent" className="text-xs text-red-900 cursor-pointer">
                            <span className="font-bold block">Mark as Emergency / Critical Need</span>
                            Check this only if the animal requires immediate life-saving surgery or ICU care within 24–48 hours.
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 bg-playful-coral hover:bg-playful-coral/90 text-white font-bold text-sm md:text-base rounded-2xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting Fundraiser...' : 'Submit Fundraiser for Approval'}
                    </button>
                </form>
            </div>
        </div>
    );
}
