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
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    setAuthState({
                        ...defaultAuthState,
                        isLoading: false,
                        error: error.message,
                    });
                    return;
                }

                const user = transformUser(session?.user ?? null);

                // Set user first but keep isLoading=true until roles are loaded
                if (user) {
                    setAuthState(prev => ({
                        ...prev,
                        user,
                        isAuthenticated: true,
                        error: null,
                    }));
                    await loadProfileAndRoles(user.id);
                }

                // NOW set isLoading=false — roles/profile are loaded
                setAuthState(prev => ({
                    ...prev,
                    user,
                    isLoading: false,
                    isAuthenticated: !!user,
                    error: null,
                }));
            } catch {
                setAuthState({
                    ...defaultAuthState,
                    isLoading: false,
                    error: 'Failed to initialize authentication',
                });
            }
        };

        initializeAuth();

        // Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                const user = transformUser(session?.user ?? null);

                if (!user) {
                    // Logged out — clear everything immediately
                    setAuthState({
                        ...defaultAuthState,
                        isLoading: false,
                    });
                    return;
                }

                // Set user but keep isLoading=true until roles are fetched
                setAuthState(prev => ({
                    ...prev,
                    user,
                    isAuthenticated: true,
                    error: null,
                }));

                await loadProfileAndRoles(user.id);

                // NOW mark loading complete
                setAuthState(prev => ({
                    ...prev,
                    isLoading: false,
                }));
            }
        );

        return () => {
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
