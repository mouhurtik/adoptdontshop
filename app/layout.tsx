import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
    title: {
        default: 'AdoptDontShop — Find Your Perfect Pet',
        template: '%s | AdoptDontShop',
    },
    description:
        'Adopt a pet today! Browse dogs, cats, and other animals looking for their forever homes. AdoptDontShop connects you with pets that need loving families.',
    keywords: ['pet adoption', 'adopt a pet', 'rescue animals', 'dogs', 'cats', 'adopt dont shop'],
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        siteName: 'AdoptDontShop',
        title: 'AdoptDontShop — Find Your Perfect Pet',
        description:
            'Adopt a pet today! Browse dogs, cats, and other animals looking for their forever homes.',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>
                <Providers>
                    <div className="min-h-screen flex flex-col bg-playful-cream">
                        <Navbar />
                        <main className="flex-grow pt-16">{children}</main>
                        <Footer />
                    </div>
                </Providers>
            </body>
        </html>
    );
}
