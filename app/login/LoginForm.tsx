'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PawPrint, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import PrimaryButton from '@/components/ui/PrimaryButton';

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push(redirect);
            router.refresh();
        }
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
                        Welcome Back 🐾
                    </h1>
                    <p className="mt-2 text-gray-600 font-medium">
                        Sign in to your account
                    </p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-[2rem] p-8 shadow-soft border-2 border-gray-100">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-playful-text mb-2">
                                Email
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

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-playful-text mb-2">
                                Password
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

                        <PrimaryButton type="submit" disabled={loading} className="w-full justify-center">
                            {loading ? 'Signing in...' : 'Sign In'}
                        </PrimaryButton>

                        <p className="text-center text-sm text-gray-600 font-medium">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-playful-coral hover:underline font-bold">
                                Sign up
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}
