'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import {
    User, Mail, Lock, ArrowLeft, Save, Check,
    AlertTriangle, Eye, EyeOff, Link2, Unlink,
} from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import PawprintLoader from '@/components/ui/PawprintLoader';

export default function SettingsPage() {
    const { user, profile, isLoading, refreshProfile } = useAuth();
    const router = useRouter();

    // Profile fields
    const [displayName, setDisplayName] = useState('');
    const [phone, setPhone] = useState('');
    const [bio, setBio] = useState('');
    const [location, setLocation] = useState('');

    // Email change
    const [newEmail, setNewEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);

    // Password change
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [passwordChanged, setPasswordChanged] = useState(false);

    // Google link status
    const [identities, setIdentities] = useState<{ provider: string; identity_id: string }[]>([]);

    // UI state
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);

    // Load profile data into form
    useEffect(() => {
        if (profile) {
            setDisplayName(profile.display_name || '');
            setPhone(profile.phone || '');
            setBio(profile.bio || '');
            setLocation(profile.location || '');
        }
    }, [profile]);

    // Load identities (Google linked?)
    const loadIdentities = useCallback(async () => {
        const { data } = await supabase.auth.getUserIdentities();
        if (data?.identities) {
            setIdentities(data.identities.map(i => ({ provider: i.provider, identity_id: i.identity_id })));
        }
    }, []);

    useEffect(() => {
        if (user) loadIdentities();
    }, [user, loadIdentities]);

    const isGoogleLinked = identities.some(i => i.provider === 'google');
    const isEmailProvider = identities.some(i => i.provider === 'email');

    // Save profile
    const handleSaveProfile = async () => {
        if (!user) return;
        setSaving(true);
        setError(null);
        setSaved(false);
        try {
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    display_name: displayName.trim() || null,
                    phone: phone.trim() || null,
                    bio: bio.trim() || null,
                    location: location.trim() || null,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (updateError) throw updateError;
            await refreshProfile();
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    // Change email
    const handleEmailChange = async () => {
        setEmailError(null);
        setEmailSent(false);
        if (!newEmail.trim()) {
            setEmailError('Please enter a new email address');
            return;
        }
        try {
            const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
            if (error) throw error;
            setEmailSent(true);
            setNewEmail('');
        } catch (err: unknown) {
            setEmailError(err instanceof Error ? err.message : 'Failed to update email');
        }
    };

    // Change password
    const handlePasswordChange = async () => {
        setPasswordError(null);
        setPasswordChanged(false);
        if (newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        try {
            // If user has email provider, verify current password first
            if (isEmailProvider && currentPassword) {
                const { error: verifyError } = await supabase.auth.signInWithPassword({
                    email: user!.email,
                    password: currentPassword,
                });
                if (verifyError) {
                    setPasswordError('Current password is incorrect');
                    return;
                }
            }
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            setPasswordChanged(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setPasswordChanged(false), 3000);
        } catch (err: unknown) {
            setPasswordError(err instanceof Error ? err.message : 'Failed to update password');
        }
    };

    // Link Google
    const handleLinkGoogle = async () => {
        setError(null);
        try {
            const { error } = await supabase.auth.linkIdentity({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback?next=/profile/settings`,
                },
            });
            if (error) throw error;
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to link Google account');
        }
    };

    // Unlink Google
    const handleUnlinkGoogle = async () => {
        setError(null);
        if (identities.length <= 1) {
            setError('You cannot unlink your only sign-in method');
            return;
        }
        const googleIdentity = identities.find(i => i.provider === 'google');
        if (!googleIdentity) return;
        try {
            const { error } = await supabase.auth.unlinkIdentity({
                provider: 'google',
                identity_id: googleIdentity.identity_id,
            } as Parameters<typeof supabase.auth.unlinkIdentity>[0]);
            if (error) throw error;
            await loadIdentities();
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to unlink Google account');
        }
    };

    if (isLoading) {
        return <PawprintLoader fullScreen size="lg" message="Loading settings..." />;
    }
    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="pt-24 lg:pt-28 pb-16 bg-playful-cream min-h-screen">
            <div className="max-w-2xl mx-auto px-4">
                {/* Back button */}
                <button
                    onClick={() => router.push('/profile')}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-playful-coral mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Profile
                </button>

                <h1 className="text-2xl font-heading font-black text-playful-text mb-8">Settings</h1>

                {/* Global error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        {error}
                    </div>
                )}

                {/* ─────── PROFILE SECTION ─────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-bold text-playful-text mb-5 flex items-center gap-2">
                        <User className="w-5 h-5 text-playful-coral" />
                        Profile Information
                    </h2>

                    {/* Username (read-only) */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Username</label>
                        <div className="relative">
                            <input
                                type="text"
                                value={profile?.username || '—'}
                                disabled
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed text-sm"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                                Unchangeable
                            </span>
                        </div>
                    </div>

                    {/* Display Name */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Full Name</label>
                        <input
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Your full name"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/30 focus:border-playful-coral transition-all"
                        />
                    </div>

                    {/* Phone */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Phone</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Your phone number"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/30 focus:border-playful-coral transition-all"
                        />
                    </div>

                    {/* Location */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Location</label>
                        <input
                            type="text"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City, State"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-playful-coral/30 focus:border-playful-coral transition-all"
                        />
                    </div>

                    {/* Bio */}
                    <div className="mb-5">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Bio</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            rows={3}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-playful-coral/30 focus:border-playful-coral transition-all"
                        />
                    </div>

                    {/* Save button */}
                    <PrimaryButton
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="w-full sm:w-auto"
                    >
                        {saved ? (
                            <span className="flex items-center gap-2"><Check className="w-4 h-4" /> Saved!</span>
                        ) : saving ? (
                            'Saving...'
                        ) : (
                            <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Changes</span>
                        )}
                    </PrimaryButton>
                </div>

                {/* ─────── EMAIL SECTION ─────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-bold text-playful-text mb-5 flex items-center gap-2">
                        <Mail className="w-5 h-5 text-blue-500" />
                        Email Address
                    </h2>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Current Email</label>
                        <input
                            type="text"
                            value={user.email}
                            disabled
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed text-sm"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">New Email</label>
                        <input
                            type="email"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            placeholder="Enter new email address"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                        />
                    </div>

                    {emailError && (
                        <p className="text-sm text-red-500 mb-3 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> {emailError}
                        </p>
                    )}
                    {emailSent && (
                        <p className="text-sm text-green-600 mb-3 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Confirmation email sent to your new address. Please check your inbox.
                        </p>
                    )}

                    <PrimaryButton onClick={handleEmailChange} className="w-full sm:w-auto">
                        Update Email
                    </PrimaryButton>
                </div>

                {/* ─────── PASSWORD SECTION ─────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-bold text-playful-text mb-5 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-amber-500" />
                        Change Password
                    </h2>

                    {isEmailProvider && (
                        <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-600 mb-1">Current Password</label>
                            <div className="relative">
                                <input
                                    type={showCurrentPw ? 'text' : 'password'}
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">New Password</label>
                        <div className="relative">
                            <input
                                type={showNewPw ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPw(!showNewPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-semibold text-gray-600 mb-1">Confirm New Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPw ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPw(!showConfirmPw)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>

                    {passwordError && (
                        <p className="text-sm text-red-500 mb-3 flex items-center gap-1">
                            <AlertTriangle className="w-3.5 h-3.5" /> {passwordError}
                        </p>
                    )}
                    {passwordChanged && (
                        <p className="text-sm text-green-600 mb-3 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Password updated successfully!
                        </p>
                    )}

                    <PrimaryButton onClick={handlePasswordChange} className="w-full sm:w-auto">
                        Update Password
                    </PrimaryButton>
                </div>

                {/* ─────── CONNECTED ACCOUNTS ─────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                    <h2 className="text-lg font-bold text-playful-text mb-5 flex items-center gap-2">
                        <Link2 className="w-5 h-5 text-green-500" />
                        Connected Accounts
                    </h2>

                    {/* Google */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <img
                                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                                alt="Google"
                                className="w-6 h-6"
                            />
                            <div>
                                <p className="text-sm font-semibold text-gray-700">Google</p>
                                <p className="text-xs text-gray-400">
                                    {isGoogleLinked ? 'Connected' : 'Not connected'}
                                </p>
                            </div>
                        </div>
                        {isGoogleLinked ? (
                            <button
                                onClick={handleUnlinkGoogle}
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-red-500 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <Unlink className="w-3.5 h-3.5" />
                                Unlink
                            </button>
                        ) : (
                            <button
                                onClick={handleLinkGoogle}
                                className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-playful-coral bg-white border border-playful-coral/30 rounded-lg hover:bg-playful-coral/5 transition-colors"
                            >
                                <Link2 className="w-3.5 h-3.5" />
                                Connect
                            </button>
                        )}
                    </div>
                </div>

                {/* ─────── ACCOUNT INFO ─────── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-playful-text mb-4">Account Info</h2>
                    <div className="space-y-3 text-sm text-gray-500">
                        <div className="flex justify-between">
                            <span>Account Type</span>
                            <span className="font-medium text-gray-700 capitalize">{profile?.account_type || 'Individual'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Member Since</span>
                            <span className="font-medium text-gray-700">
                                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', {
                                    month: 'long', year: 'numeric'
                                }) : '—'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
