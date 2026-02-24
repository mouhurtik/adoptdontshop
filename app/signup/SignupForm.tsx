'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { PawPrint, Mail, Lock, Eye, EyeOff, User, Building2, AtSign, Check, X, Loader2, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import PrimaryButton from '@/components/ui/PrimaryButton';
import Turnstile from '@/components/ui/Turnstile';

export default function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');
  const [accountType, setAccountType] = useState<'individual' | 'organization'>('individual');
  const [organizationName, setOrganizationName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [authMode, _setAuthMode] = useState<'email' | 'phone'>('email');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
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

  // Username validation: lowercase, alphanumeric, underscores, 3-20 chars
  const isValidUsername = (u: string) => /^[a-z0-9_]{3,20}$/.test(u);

  // Debounced username availability check
  const checkUsername = useCallback(async (value: string) => {
    if (!value || !isValidUsername(value)) {
      setUsernameStatus(value.length > 0 ? 'invalid' : 'idle');
      return;
    }
    setUsernameStatus('checking');
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', value)
      .maybeSingle();
    setUsernameStatus(data ? 'taken' : 'available');
  }, []);

  const handleUsernameChange = (value: string) => {
    const normalized = value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(normalized);
    // Debounce check
    const timeout = setTimeout(() => checkUsername(normalized), 500);
    return () => clearTimeout(timeout);
  };

  const handlePhoneSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (accountType === 'organization' && !organizationName.trim()) {
      setError('Please enter your organization name');
      setLoading(false);
      return;
    }

    if (!username || !isValidUsername(username)) {
      setError('Please choose a valid username (3-20 chars, lowercase letters, numbers, underscores)');
      setLoading(false);
      return;
    }

    if (usernameStatus === 'taken') {
      setError('Username is already taken');
      setLoading(false);
      return;
    }

    if (!otpSent) {
      // Send OTP
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          captchaToken,
          data: {
            full_name: fullName,
            username: username,
            account_type: accountType,
            organization_name: accountType === 'organization' ? organizationName : undefined,
          }
        }
      });
      if (error) {
        setError(error.message);
      } else {
        setOtpSent(true);
      }
      setLoading(false);
    } else {
      // Verify OTP
      const { error, data } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        if (data?.user?.id) {
          await supabase
            .from('profiles')
            .update({ username })
            .eq('id', data.user.id);
        }
        setSuccess(true);
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'phone') {
      return handlePhoneSignup(e);
    }
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (accountType === 'organization' && !organizationName.trim()) {
      setError('Please enter your organization name');
      return;
    }

    if (!username || !isValidUsername(username)) {
      setError('Please choose a valid username (3-20 chars, lowercase letters, numbers, underscores)');
      return;
    }

    if (usernameStatus === 'taken') {
      setError('Username is already taken');
      return;
    }

    setLoading(true);

    const { data: signUpData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        captchaToken,
        data: {
          full_name: fullName,
          username: username,
          account_type: accountType,
          organization_name: accountType === 'organization' ? organizationName : undefined,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Set username on profile immediately
      if (signUpData.user?.id) {
        await supabase
          .from('profiles')
          .update({ username })
          .eq('id', signUpData.user.id);
      }
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-playful-cream">
        <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-soft border-2 border-gray-100 text-center">
          <div className="text-6xl mb-4">📧</div>
          <h2 className="text-3xl font-heading font-bold text-playful-text mb-2">Check your email!</h2>
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.
          </p>
          <Link href="/login">
            <PrimaryButton className="w-full justify-center">
              Go to Login
            </PrimaryButton>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-playful-cream">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="bg-playful-teal text-white p-3 rounded-2xl -rotate-3 shadow-md">
              <PawPrint className="h-8 w-8 fill-current" />
            </div>
          </div>
          <h1 className="text-4xl font-heading font-black text-playful-text">
            Join the Family 🐕
          </h1>
          <p className="mt-2 text-gray-600 font-medium">
            Create an account to list pets and manage adoptions
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-[2rem] p-8 shadow-soft border-2 border-gray-100">

          <div className="flex flex-col gap-3 mb-6">
            <button
              onClick={() => handleOAuth('google')}
              disabled={loading}
              type="button"
              className="flex items-center justify-center gap-3 w-full bg-white border-2 border-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              Sign up with Google
            </button>
            {/* Facebook OAuth hidden - requires App Review
            <button
              onClick={() => handleOAuth('facebook')}
              disabled={loading}
              type="button"
              className="flex items-center justify-center gap-3 w-full bg-[#1877F2] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#1865F2] transition-colors"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/facebook.svg" alt="Facebook" className="w-5 h-5" />
              Sign up with Facebook
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
              type="button"
              onClick={() => { setAuthMode('email'); setError(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'email' ? 'bg-white shadow-sm text-playful-text' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('phone'); setError(null); }}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${authMode === 'phone' ? 'bg-white shadow-sm text-playful-text' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Phone
            </button>
          </div>
          */}

          <form onSubmit={handleSignup} className="space-y-5">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl font-medium text-sm">
                {error}
              </div>
            )}

            {authMode === 'phone' ? (
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
                      className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm focus:border-playful-teal focus:ring-playful-teal focus:bg-white transition-colors disabled:opacity-50"
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
                        className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm focus:border-playful-teal focus:ring-playful-teal focus:bg-white transition-colors tracking-widest font-mono text-lg"
                        placeholder="123456"
                        maxLength={6}
                      />
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-bold text-playful-text mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm focus:border-playful-teal focus:ring-playful-teal focus:bg-white transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label htmlFor="username" className="block text-sm font-bold text-playful-text mb-2">
                    Username
                    <span className="text-xs font-normal text-gray-400 ml-1">(cannot be changed later)</span>
                  </label>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => handleUsernameChange(e.target.value)}
                      className={`block w-full rounded-xl border-2 bg-gray-50 pl-10 pr-10 py-3 text-sm focus:bg-white transition-colors ${usernameStatus === 'available' ? 'border-green-400 focus:border-green-500 focus:ring-green-500' :
                        usernameStatus === 'taken' || usernameStatus === 'invalid' ? 'border-red-400 focus:border-red-500 focus:ring-red-500' :
                          'border-gray-200 focus:border-playful-teal focus:ring-playful-teal'
                        }`}
                      placeholder="your_username"
                      maxLength={20}
                    />
                    {/* Status indicator */}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      {usernameStatus === 'checking' && <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />}
                      {usernameStatus === 'available' && <Check className="h-4 w-4 text-green-500" />}
                      {(usernameStatus === 'taken' || usernameStatus === 'invalid') && <X className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                  {usernameStatus === 'taken' && (
                    <p className="text-xs text-red-500 mt-1 font-medium">Username is already taken</p>
                  )}
                  {usernameStatus === 'invalid' && username.length > 0 && (
                    <p className="text-xs text-red-500 mt-1 font-medium">3-20 chars, lowercase letters, numbers & underscores only</p>
                  )}
                  {usernameStatus === 'available' && (
                    <p className="text-xs text-green-600 mt-1 font-medium">Username is available! ✓</p>
                  )}
                </div>

                {/* Email */}
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
                      className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm focus:border-playful-teal focus:ring-playful-teal focus:bg-white transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
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
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-10 pr-12 py-3 text-sm focus:border-playful-teal focus:ring-playful-teal focus:bg-white transition-colors"
                      placeholder="Min. 6 characters"
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

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-bold text-playful-text mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm focus:border-playful-teal focus:ring-playful-teal focus:bg-white transition-colors"
                      placeholder="Repeat your password"
                    />
                  </div>
                </div>

                {/* Account Type */}
                <div>
                  <label className="block text-sm font-bold text-playful-text mb-2">
                    Account Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAccountType('individual')}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${accountType === 'individual'
                        ? 'border-playful-teal bg-playful-teal/10 text-playful-teal'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                      <User className="h-4 w-4" />
                      Individual
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('organization')}
                      className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${accountType === 'organization'
                        ? 'border-playful-teal bg-playful-teal/10 text-playful-teal'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                    >
                      <Building2 className="h-4 w-4" />
                      Organization
                    </button>
                  </div>
                </div>

                {/* Organization Name (conditional) */}
                {accountType === 'organization' && (
                  <div>
                    <label htmlFor="orgName" className="block text-sm font-bold text-playful-text mb-2">
                      Organization Name
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        id="orgName"
                        type="text"
                        required
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        className="block w-full rounded-xl border-2 border-gray-200 bg-gray-50 pl-10 pr-4 py-3 text-sm focus:border-playful-teal focus:ring-playful-teal focus:bg-white transition-colors"
                        placeholder="Your organization name"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            <Turnstile onVerify={handleCaptcha} className="flex justify-center" />

            <PrimaryButton type="submit" disabled={loading} variant="secondary" className="w-full justify-center">
              {loading ? (authMode === 'phone' && !otpSent ? 'Sending Code...' : 'Creating Account...') : (authMode === 'phone' && !otpSent ? 'Send Code' : 'Create Account')}
            </PrimaryButton>

            <p className="text-center text-sm text-gray-600 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-playful-teal hover:underline font-bold">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
