'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from './AdminSidebar';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isAdmin, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.replace('/login?redirect=/admin');
        } else if (!isLoading && user && !isAdmin) {
            router.replace('/');
        }
    }, [user, isAdmin, isLoading, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-playful-coral border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-medium">Loading admin...</p>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-6 md:p-8 md:ml-64">
                    {children}
                </main>
            </div>
        </div>
    );
}
