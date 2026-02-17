'use client';

import { ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { UserRole } from '@/types';
import LoadingSpinner from './LoadingSpinner';
import { useEffect } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRoles?: UserRole[];
    redirectTo?: string;
}

const ProtectedRoute = ({
    children,
    requiredRoles,
    redirectTo = '/login',
}: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (isLoading) return;

        if (!isAuthenticated) {
            router.replace(`${redirectTo}?from=${encodeURIComponent(pathname)}`);
            return;
        }

        if (requiredRoles && requiredRoles.length > 0) {
            const hasRequiredRole = user && requiredRoles.includes(user.role);
            if (!hasRequiredRole) {
                router.replace('/');
            }
        }
    }, [isLoading, isAuthenticated, user, requiredRoles, redirectTo, pathname, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!isAuthenticated) return null;

    if (requiredRoles && requiredRoles.length > 0) {
        const hasRequiredRole = user && requiredRoles.includes(user.role);
        if (!hasRequiredRole) return null;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
