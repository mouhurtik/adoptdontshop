'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AdminSidebar from './AdminSidebar';

const AUTH_TIMEOUT_MS = 8000;
const STORAGE_KEY = 'admin-sidebar-collapsed';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
    const { user, isAdmin, isLoading } = useAuth();
    const router = useRouter();
    const [timedOut, setTimedOut] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    // Load persisted sidebar state
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored === 'true') setCollapsed(true);
    }, []);

    const toggleCollapse = () => {
        setCollapsed(prev => {
            localStorage.setItem(STORAGE_KEY, String(!prev));
            return !prev;
        });
    };

    // Timeout fallback — if auth takes too long, redirect to login
    useEffect(() => {
        if (!isLoading) return;
        const timer = setTimeout(() => setTimedOut(true), AUTH_TIMEOUT_MS);
        return () => clearTimeout(timer);
    }, [isLoading]);

    useEffect(() => {
        if (timedOut || (!isLoading && !user)) {
            router.replace('/login?redirect=/admin');
        } else if (!isLoading && user && !isAdmin) {
            router.replace('/');
        }
    }, [user, isAdmin, isLoading, timedOut, router]);

    if (isLoading && !timedOut) {
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
            <AdminSidebar collapsed={collapsed} onToggle={toggleCollapse} />
            <main
                className={`min-h-screen p-6 md:p-8 transition-all duration-300 ${collapsed ? 'md:ml-[68px]' : 'md:ml-64'}`}
            >
                {children}
            </main>
        </div>
    );
}
