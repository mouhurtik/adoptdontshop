'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PawPrint, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Supabase handles the token exchange from the URL hash automatically
    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'PASSWORD_RECOVERY') {
                // User is in password recovery mode — show the form
            }
        });
        return () => subscription.unsubscribe();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message);
        } else {
            setSuccess(true);
            setTimeout(() => router.push('/'), 3000);
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
                        New Password 🔒
                    </h1>
                    <p className="mt-2 text-gray-600 font-medium">
                        Choose a strong password for your account.
                    </p>
                </div>

                <div className="bg-white rounded-[2rem] p-8 shadow-soft border-2 border-gray-100">
                    {success ? (
                        <div className="text-center py-6">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h2 className="text-xl font-heading font-bold text-playful-text mb-2">
                                Password Updated! 🎉
                            </h2>
                            <p className="text-gray-500 font-medium text-sm">
                                Redirecting you to the app...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium text-sm">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-playful-text mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-10 pr-12 py-3 text-sm focus:border-playful-coral focus:ring-playful-coral focus:bg-white transition-colors"
                                        placeholder="••••••••"
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="confirm-password" className="block text-sm font-bold text-playful-text mb-2">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <input
                                        id="confirm-password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm focus:border-playful-coral focus:ring-playful-coral focus:bg-white transition-colors"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <PrimaryButton type="submit" disabled={loading} className="w-full justify-center">
                                {loading ? 'Updating...' : 'Update Password'}
                            </PrimaryButton>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
