'use client';

import Link from 'next/link';
import { PawPrint } from 'lucide-react';

export default function TopBar() {
    return (
        <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100">
            <div className="flex min-w-0 items-center px-4 h-14">
                {/* Logo — always visible */}
                <Link href="/" aria-label="AdoptDontShop home" className="flex min-h-11 min-w-11 items-center gap-1.5 shrink-0 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-playful-teal-text focus-visible:ring-offset-2">
                    <div className="bg-playful-coral text-white p-1.5 rounded-lg">
                        <PawPrint aria-hidden="true" className="h-4 w-4 fill-current" strokeWidth={2} />
                    </div>
                    <span className="text-lg sm:text-xl leading-tight font-heading font-black tracking-tight text-playful-text">
                        Adopt<span className="text-playful-coral-text">Dont</span>Shop
                    </span>
                </Link>
            </div>
        </header>
    );
}
