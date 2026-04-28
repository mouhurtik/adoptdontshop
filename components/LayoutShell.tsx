'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import TopBar from '@/components/TopBar';
import { AuthModalProvider } from '@/contexts/AuthModalContext';

// Lazy-load heavy components that aren't needed on initial paint
const FloatingMessages = dynamic(() => import('@/components/FloatingMessages'), { ssr: false });
const AuthModal = dynamic(() => import('@/components/AuthModal'), { ssr: false });

// Lazy-load navigation components — AppSidebar is hidden on mobile,
// BottomNav is below the fold. Neither blocks LCP.
const AppSidebar = dynamic(() => import('@/components/AppSidebar'), { ssr: false });
const BottomNav = dynamic(() => import('@/components/BottomNav'), { ssr: false });

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [shellReady, setShellReady] = useState(false);

    const isAdminRoute = pathname.startsWith('/admin');
    const isDeepView = pathname.startsWith('/pet/');
    const showBottomNav = !isAdminRoute && !isDeepView;

    const sidebarWidth = sidebarCollapsed ? 72 : 260;

    // Defer non-critical shell components until after first paint
    useEffect(() => {
        if ('requestIdleCallback' in window) {
            const id = requestIdleCallback(() => setShellReady(true));
            return () => cancelIdleCallback(id);
        } else {
            const timer = setTimeout(() => setShellReady(true), 100);
            return () => clearTimeout(timer);
        }
    }, []);

    // Admin routes use their own layout
    if (isAdminRoute) {
        return (
            <div className="min-h-screen flex flex-col bg-playful-cream">
                <main className="flex-grow">{children}</main>
            </div>
        );
    }

    // Messages — uses standard layout with sidebar (removed early return)

    return (
        <AuthModalProvider>
        <div className="min-h-screen bg-playful-cream">
            {/* Desktop: Persistent left sidebar — lazy-loaded, hidden on mobile via CSS */}
            {shellReady && (
                <AppSidebar
                    collapsed={sidebarCollapsed}
                    onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
                />
            )}

            {/* Mobile: Top bar — lightweight, loads immediately */}
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

            {/* Mobile bottom nav — lazy-loaded, not needed for LCP */}
            {showBottomNav && shellReady && <BottomNav />}

            {/* Floating messages (desktop chat popout) */}
            <FloatingMessages />

            {/* Auth Modal */}
            <AuthModal />
        </div>
        </AuthModalProvider>
    );
}
