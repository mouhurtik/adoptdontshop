'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PawPrint, Mail, Lock, Eye, EyeOff, Phone, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Turnstile from '@/components/ui/Turnstile';

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [authMode, _setAuthMode] = useState<'email' | 'phone'>('email');
    const [captchaToken, setCaptchaToken] = useState<string | undefined>();
    const handleCaptcha = useCallback((token: string) => setCaptchaToken(token), []);

    const handleOAuth = async (provider: 'google' | 'facebook') => {
        setLoading(true);
        setError(null);
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            }
        });
        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    const handlePhoneLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!otpSent) {
            // Send OTP
            const { error } = await supabase.auth.signInWithOtp({ phone, options: { captchaToken } });
            if (error) {
                setError(error.message);
            } else {
                setOtpSent(true);
            }
            setLoading(false);
        } else {
            // Verify OTP
            const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
            if (error) {
                setError(error.message);
                setLoading(false);
            } else {
                router.push(redirect);
                router.refresh();
            }
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (authMode === 'phone') {
            return handlePhoneLogin(e);
        }
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken } });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push(redirect);
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-24 pb-12 bg-playful-cream">
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

                <div className="bg-white rounded-[2rem] p-8 shadow-soft border-2 border-gray-100">

                    <div className="flex flex-col gap-3 mb-6">
                        <button
                            type="button"
                            onClick={() => handleOAuth('google')}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                            Continue with Google
                        </button>
                        {/* Facebook OAuth hidden - requires App Review
                        <button
                            type="button"
                            onClick={() => handleOAuth('facebook')}
                            disabled={loading}
                            className="flex items-center justify-center gap-3 w-full bg-[#1877F2] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#1865F2] transition-colors"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg" alt="Facebook" className="w-5 h-5" />
                            Continue with Facebook
                        </button>
                        */}
                    </div>

                    <div className="relative flex items-center gap-4 py-2 mb-6">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-gray-400 text-sm font-bold">OR</span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>
                    {/* Phone auth hidden for now 
                    <div className="flex justify-center p-1 bg-gray-100 rounded-xl mb-6">
                        <button
                            onClick={() => { setAuthMode('email'); setError(null); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'email' ? 'bg-white shadow-sm text-playful-text' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Email
                        </button>
                        <button
                            onClick={() => { setAuthMode('phone'); setError(null); }}
                            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'phone' ? 'bg-white shadow-sm text-playful-text' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Phone
                        </button>
                    </div>
                    */}

                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium text-sm">
                                {error}
                            </div>
                        )}

                        {authMode === 'email' ? (
                            <>
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
                                            autoComplete="email"
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
                                            autoComplete="current-password"
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
                                    <div className="flex justify-end mt-1.5">
                                        <Link href="/forgot-password" className="text-xs font-bold text-playful-coral hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-bold text-playful-text mb-2">
                                        Phone Number
                                    </label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                        <input
                                            id="phone"
                                            type="tel"
                                            required
                                            disabled={otpSent}
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm focus:border-playful-coral focus:ring-playful-coral focus:bg-white transition-colors disabled:opacity-50"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                </div>

                                {otpSent && (
                                    <div>
                                        <label htmlFor="otp" className="block text-sm font-bold text-playful-text mb-2">
                                            Verification Code
                                        </label>
                                        <div className="relative">
                                            <Check className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                            <input
                                                id="otp"
                                                type="text"
                                                required
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm focus:border-playful-coral focus:ring-playful-coral focus:bg-white transition-colors tracking-widest font-mono text-lg"
                                                placeholder="123456"
                                                maxLength={6}
                                            />
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                        <Turnstile onVerify={handleCaptcha} className="flex justify-center" />

                        <PrimaryButton type="submit" disabled={loading} className="w-full justify-center">
                            {loading ? (authMode === 'phone' && !otpSent ? 'Sending Code...' : 'Signing in...') : (authMode === 'phone' && !otpSent ? 'Send Code' : 'Sign In')}
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
