'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import dynamic from 'next/dynamic';
import { AuthProvider } from '@/contexts/AuthContext';
import { useState } from 'react';

// Lazy-load Sonner — the single toast system (Radix toast removed, see AUDIT_Aug2026.md DEBT-2)
const Sonner = dynamic(
    () => import('@/components/ui/sonner').then((mod) => ({ default: mod.Toaster })),
    { ssr: false }
);

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 1000 * 60 * 5, // 5 minutes
                        retry: 1,
                        refetchOnWindowFocus: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <TooltipProvider>
                    <Sonner />
                    {children}
                </TooltipProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}
