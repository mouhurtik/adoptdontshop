'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import FloatingMessages from '@/components/FloatingMessages';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');
    
    const isMessages = pathname === '/messages' || pathname.startsWith('/messages/');
    // Deep views where bottom nav should be hidden (Messages removed so users can navigate away)
    const isDeepView = pathname.startsWith('/pet/');
    const showBottomNav = !isAdminRoute && !isDeepView;
    const showFooter = !isAdminRoute && !isMessages;

    return (
        <div className="min-h-screen flex flex-col bg-playful-cream">
            {!isAdminRoute && <Navbar />}
            <main className={isAdminRoute ? 'flex-grow' : `flex-grow pt-16 ${showBottomNav ? 'pb-14 ' : 'pb-0 '}lg:pb-0`}>
                {children}
            </main>
            {showFooter && <div className="hidden lg:block"><Footer /></div>}
            {showBottomNav && <BottomNav />}
            <FloatingMessages />
        </div>
    );
}



