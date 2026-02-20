/**
 * Authentication-related type definitions
 */

/**
 * User roles for access control
 */
export type UserRole = 'user' | 'admin' | 'shelter_owner' | 'moderator';

/**
 * User profile from Supabase auth
 */
export interface User {
    id: string;
    email: string;
    role: UserRole;
    displayName?: string;
    avatarUrl?: string;
    createdAt?: string;
}

/**
 * User profile from profiles table
 */
export interface Profile {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    account_type: string | null;
    organization_name: string | null;
    bio: string | null;
    location: string | null;
    username: string | null;
    created_at: string | null;
    updated_at: string | null;
}

/**
 * Authentication state for context
 */
export interface AuthState {
    user: User | null;
    profile: Profile | null;
    roles: string[];
    isAdmin: boolean;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

/**
 * Auth context value type
 */
export interface AuthContextValue extends AuthState {
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    refreshProfile: () => Promise<void>;
}

/**
 * Login form data
 */
export interface LoginFormData {
    email: string;
    password: string;
}

/**
 * Registration form data
 */
export interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    displayName?: string;
    accountType?: 'individual' | 'organization';
    organizationName?: string;
}
