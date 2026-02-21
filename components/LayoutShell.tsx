'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');
    
    const isMessages = pathname === '/messages' || pathname.startsWith('/messages/');
    // Deep views where bottom nav should be hidden
    const isDeepView = pathname.startsWith('/pet/') || isMessages;
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
        </div>
    );
}



