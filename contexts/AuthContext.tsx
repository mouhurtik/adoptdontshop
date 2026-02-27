
'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User, AuthState, AuthContextValue, Profile, UserRole } from '@/types';

/**
 * Default auth state
 */
const defaultAuthState: AuthState = {
    user: null,
    profile: null,
    roles: [],
    isAdmin: false,
    isLoading: true,
    isAuthenticated: false,
    error: null,
};

/**
 * Auth context
 */
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Transform Supabase user to our User type
 */
const transformUser = (supabaseUser: { id: string; email?: string; user_metadata?: Record<string, unknown> } | null): User | null => {
    if (!supabaseUser) return null;

    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        role: (supabaseUser.user_metadata?.role as UserRole) || 'user',
        displayName: supabaseUser.user_metadata?.full_name as string | undefined,
        avatarUrl: supabaseUser.user_metadata?.avatar_url as string | undefined,
    };
};

/**
 * Auth Provider component
 * Wraps the app and provides authentication state and methods
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

    /**
     * Load user profile and roles from database
     */
    const loadProfileAndRoles = useCallback(async (userId: string) => {
        try {
            // Fetch profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            // Auto-generate username if missing (OAuth users)
            if (profile && !profile.username) {
                const baseName = (profile.display_name || 'user')
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '')
                    .substring(0, 20) || 'user';

                // Try clean name first, only add numbers if taken
                let generatedUsername = baseName;
                const { data: existing } = await supabase
                    .from('profiles')
                    .select('id')
                    .eq('username', baseName)
                    .maybeSingle();

                if (existing) {
                    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
                    generatedUsername = `${baseName.substring(0, 16)}${randomSuffix}`;
                }

                const { error: updateErr } = await supabase
                    .from('profiles')
                    .update({ username: generatedUsername })
                    .eq('id', userId);

                if (!updateErr) {
                    profile.username = generatedUsername;
                }
            }

            // Fetch roles
            const { data: roleRows, error: rolesError } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', userId);

            if (rolesError) {
                console.error('[AuthContext] Failed to fetch user_roles:', rolesError.message, rolesError);
            }

            const roles = (roleRows || []).map(r => r.role).filter(Boolean) as string[];
            const isAdmin = roles.includes('admin');

            setAuthState(prev => ({
                ...prev,
                profile: profile as Profile | null,
                roles,
                isAdmin,
            }));
        } catch {
            // Profile/roles fetch failed — non-critical
        }
    }, []);

    /**
     * Refresh profile data (callable from components)
     */
    const refreshProfile = useCallback(async () => {
        if (authState.user?.id) {
            await loadProfileAndRoles(authState.user.id);
        }
    }, [authState.user?.id, loadProfileAndRoles]);

    // Initialize auth state on mount
    // Uses ONLY onAuthStateChange (Supabase recommended pattern) to avoid
    // the double-fire race condition where getSession() + INITIAL_SESSION
    // both trigger state updates concurrently when logged in.
    useEffect(() => {
        let cancelled = false;
        // Track in-flight profile loads to prevent duplicates
        let profileLoadId = 0;

        const handleAuthChange = async (
            event: string,
            session: { user: { id: string; email?: string; user_metadata?: Record<string, unknown> } } | null
        ) => {
            if (cancelled) return;

            const user = transformUser(session?.user ?? null);

            if (!user) {
                // Logged out or no session — clear everything
                setAuthState({
                    ...defaultAuthState,
                    isLoading: false,
                });
                return;
            }

            // Set user immediately (still loading profile/roles)
            setAuthState(prev => ({
                ...prev,
                user,
                isAuthenticated: true,
                error: null,
            }));

            // Load profile and roles (with dedup guard)
            const thisLoadId = ++profileLoadId;
            try {
                if (cancelled) return;
                await loadProfileAndRoles(user.id);
            } catch {
                // Non-critical — profile/roles fetch failed
            }

            // Only apply if this is still the latest load
            if (cancelled || thisLoadId !== profileLoadId) return;

            setAuthState(prev => ({
                ...prev,
                isLoading: false,
            }));
        };

        // Subscribe to auth state changes — this fires INITIAL_SESSION
        // on mount, which replaces the old getSession() call.
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
                // Ignore TOKEN_REFRESHED during initial load since
                // INITIAL_SESSION already provides the session
                if (event === 'TOKEN_REFRESHED') return;
                handleAuthChange(event, session);
            }
        );

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, [loadProfileAndRoles]);

    /**
     * Sign in with email and password
     */
    const signIn = async (email: string, password: string): Promise<void> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setAuthState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message,
                }));
                throw error;
            }
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign in failed';
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: message,
            }));
            throw err;
        }
    };

    /**
     * Sign up with email and password
     */
    const signUp = async (email: string, password: string, metadata?: Record<string, unknown>): Promise<void> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: metadata ? { data: metadata } : undefined,
            });

            if (error) {
                setAuthState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message,
                }));
                throw error;
            }

            setAuthState(prev => ({
                ...prev,
                isLoading: false,
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign up failed';
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: message,
            }));
            throw err;
        }
    };

    /**
     * Sign out
     */
    const signOut = async (): Promise<void> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const { error } = await supabase.auth.signOut();

            if (error) {
                setAuthState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message,
                }));
                throw error;
            }

            setAuthState({
                ...defaultAuthState,
                isLoading: false,
            });
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Sign out failed';
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: message,
            }));
            throw err;
        }
    };

    /**
     * Reset password
     */
    const resetPassword = async (email: string): Promise<void> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) {
                setAuthState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: error.message,
                }));
                throw error;
            }

            setAuthState(prev => ({
                ...prev,
                isLoading: false,
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Password reset failed';
            setAuthState(prev => ({
                ...prev,
                isLoading: false,
                error: message,
            }));
            throw err;
        }
    };

    const value: AuthContextValue = {
        ...authState,
        signIn,
        signUp,
        signOut,
        resetPassword,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to access auth context
 * Must be used within AuthProvider
 */
export const useAuth = (): AuthContextValue => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default AuthContext;
