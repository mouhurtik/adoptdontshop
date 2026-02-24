import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Providers from './providers';
import LayoutShell from '@/components/LayoutShell';

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
        <html lang="en" suppressHydrationWarning>
            <head>
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-FJ0SET7VX9"
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-FJ0SET7VX9');
                    `}
                </Script>
            </head>
            <body suppressHydrationWarning>
                <Providers>
                    <LayoutShell>{children}</LayoutShell>
                </Providers>
            </body>
        </html>
    );
}
