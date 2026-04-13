'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import AppSidebar from '@/components/AppSidebar';
import TopBar from '@/components/TopBar';
import BottomNav from '@/components/BottomNav';
import { AuthModalProvider } from '@/contexts/AuthModalContext';

// Lazy-load heavy components that aren't needed on initial paint
const FloatingMessages = dynamic(() => import('@/components/FloatingMessages'), { ssr: false });
const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const isAdminRoute = pathname.startsWith('/admin');
    const isMessages = pathname === '/messages' || pathname.startsWith('/messages/');
    const isDeepView = pathname.startsWith('/pet/');
    const showBottomNav = !isAdminRoute && !isDeepView;

    const sidebarWidth = sidebarCollapsed ? 72 : 260;

    // Admin routes use their own layout
    if (isAdminRoute) {
        return (
            <div className="min-h-screen flex flex-col bg-playful-cream">
                <main className="flex-grow">{children}</main>
            </div>
        );
    }

    // Messages — full-screen layout, sidebar hidden on messages
    if (isMessages) {
        return (
            <div className="min-h-screen bg-white">
                {children}
                <FloatingMessages />
            </div>
        );
    }

    return (
        <AuthModalProvider>
        <div className="min-h-screen bg-playful-cream">
            {/* Desktop: Persistent left sidebar */}
            <AppSidebar
                collapsed={sidebarCollapsed}
                onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
            />

            {/* Mobile: Top bar */}
            <TopBar />

            {/* Main content area — offset by sidebar on desktop */}
            <main
                className={`${showBottomNav ? 'pb-20 lg:pb-0' : 'pb-0'} pt-14 lg:pt-0 min-h-screen transition-all duration-300`}
                style={{ marginLeft: `var(--sidebar-width, 0px)` }}
            >
                <style>{`
                    @media (min-width: 1024px) {
                        :root { --sidebar-width: ${sidebarWidth}px; }
                    }
                    @media (max-width: 1023px) {
                        :root { --sidebar-width: 0px; }
                    }
                `}</style>
                {children}
            </main>

            {/* Mobile bottom nav */}
            {showBottomNav && <BottomNav />}

            {/* Floating messages (desktop chat popout) */}
            <FloatingMessages />

            {/* Auth Modal */}
            <AuthModal />
        </div>
        </AuthModalProvider>
    );
}
