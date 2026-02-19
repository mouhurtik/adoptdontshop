'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isAdminRoute = pathname.startsWith('/admin');

    return (
        <div className="min-h-screen flex flex-col bg-playful-cream">
            {!isAdminRoute && <Navbar />}
            <main className={isAdminRoute ? 'flex-grow' : 'flex-grow pt-16'}>
                {children}
            </main>
            {!isAdminRoute && <Footer />}
        </div>
    );
}
