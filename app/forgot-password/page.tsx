'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { PawPrint, Mail, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Turnstile from '@/components/ui/Turnstile';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [captchaToken, setCaptchaToken] = useState<string | undefined>();
    const handleCaptcha = useCallback((token: string) => setCaptchaToken(token), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
            captchaToken,
        });

        if (error) {
            setError(error.message);
        } else {
            setSent(true);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-playful-cream">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="bg-playful-coral text-white p-3 rounded-2xl rotate-3 shadow-md">
                            <PawPrint className="h-8 w-8 fill-current" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-heading font-black text-playful-text">
                        Forgot Password? 🐶
                    </h1>
                    <p className="mt-2 text-gray-600 font-medium">
                        No worries! We&apos;ll send you a reset link.
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-soft border-2 border-gray-100">
                    {sent ? (
                        <div className="text-center py-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-heading font-bold text-playful-text mb-2">
                                Check your email! 📬
                            </h2>
                            <p className="text-gray-500 font-medium text-sm mb-6">
                                We&apos;ve sent a password reset link to <strong>{email}</strong>.
                                It might take a minute to arrive — check your spam folder too.
                            </p>
                            <Link href="/login">
                                <PrimaryButton variant="outline" className="w-full justify-center">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back to Sign In
                                </PrimaryButton>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-playful-text mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm focus:border-playful-coral focus:ring-playful-coral focus:bg-white transition-colors"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <Turnstile onVerify={handleCaptcha} className="flex justify-center" />

                            <PrimaryButton type="submit" disabled={loading} className="w-full justify-center">
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </PrimaryButton>

                            <p className="text-center text-sm text-gray-600 font-medium">
                                Remember your password?{' '}
                                <Link href="/login" className="text-playful-coral hover:underline font-bold">
                                    Sign in
                                </Link>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
