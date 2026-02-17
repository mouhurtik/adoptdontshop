'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase/client';
import type { User, AuthState, AuthContextValue, UserRole } from '@/types';

/**
 * Default auth state
 */
const defaultAuthState: AuthState = {
    user: null,
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
        displayName: supabaseUser.user_metadata?.display_name as string | undefined,
        avatarUrl: supabaseUser.user_metadata?.avatar_url as string | undefined,
    };
};

/**
 * Auth Provider component
 * Wraps the app and provides authentication state and methods
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [authState, setAuthState] = useState<AuthState>(defaultAuthState);

    // Initialize auth state on mount
    useEffect(() => {
        // Get initial session
        const initializeAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    setAuthState({
                        user: null,
                        isLoading: false,
                        isAuthenticated: false,
                        error: error.message,
                    });
                    return;
                }

                setAuthState({
                    user: transformUser(session?.user ?? null),
                    isLoading: false,
                    isAuthenticated: !!session?.user,
                    error: null,
                });
            } catch {
                setAuthState({
                    user: null,
                    isLoading: false,
                    isAuthenticated: false,
                    error: 'Failed to initialize authentication',
                });
            }
        };

        initializeAuth();

        // Subscribe to auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setAuthState({
                    user: transformUser(session?.user ?? null),
                    isLoading: false,
                    isAuthenticated: !!session?.user,
                    error: null,
                });
            }
        );

        // Cleanup subscription on unmount
        return () => {
            subscription.unsubscribe();
        };
    }, []);

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
    const signUp = async (email: string, password: string): Promise<void> => {
        setAuthState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            const { error } = await supabase.auth.signUp({
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
                user: null,
                isLoading: false,
                isAuthenticated: false,
                error: null,
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
