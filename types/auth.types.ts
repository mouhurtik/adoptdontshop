/**
 * Authentication-related type definitions
 */

/**
 * User roles for access control
 */
export type UserRole = 'user' | 'admin' | 'shelter';

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
 * Authentication state for context
 */
export interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    error: string | null;
}

/**
 * Auth context value type
 */
export interface AuthContextValue extends AuthState {
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
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
}
