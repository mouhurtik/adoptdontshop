import Link from 'next/link';
import { PawPrint, Home, Search } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-playful-cream p-4">
            <div className="max-w-2xl w-full bg-white rounded-[2rem] p-8 md:p-12 shadow-soft border-4 border-playful-yellow/20 text-center">
                <div className="bg-playful-coral/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                    <PawPrint className="w-12 h-12 text-playful-coral" />
                </div>

                <h1 className="text-6xl font-heading font-black text-playful-coral mb-4">404</h1>
                <h2 className="text-2xl font-heading font-bold text-playful-text mb-4">
                    Page Not Found
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                    Looks like this page has found a new home! Let&apos;s help you find yours.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-playful-coral text-white font-bold rounded-full hover:bg-playful-coral/90 transition-all shadow-md hover:shadow-lg"
                    >
                        <Home className="w-5 h-5" />
                        Go Home
                    </Link>
                    <Link
                        href="/browse"
                        className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-playful-teal text-white font-bold rounded-full hover:bg-playful-teal/90 transition-all shadow-md hover:shadow-lg"
                    >
                        <Search className="w-5 h-5" />
                        Browse Pets
                    </Link>
                </div>
            </div>
        </div>
    );
}
