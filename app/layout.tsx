import type { Metadata } from 'next';
import Script from 'next/script';
import { Quicksand, Nunito } from 'next/font/google';
import './globals.css';
import Providers from './providers';
import LayoutShell from '@/components/LayoutShell';

const quicksand = Quicksand({
    subsets: ['latin'],
    variable: '--font-quicksand',
    display: 'swap',
    weight: ['400', '500', '600', '700'],
});

const nunito = Nunito({
    subsets: ['latin'],
    variable: '--font-nunito',
    display: 'swap',
    weight: ['400', '600', '700'],
});



export const metadata: Metadata = {
    title: {
        default: 'AdoptDontShop: Rescue Pet Adoption & Care Community',
        template: '%s | AdoptDontShop',
    },
    description:
        'Give a rescue pet a forever home. Browse thousands of dogs, cats, and other animals available for adoption. Join our community of animal lovers!',
    keywords: ['pet adoption', 'adopt a pet', 'rescue animals', 'dogs', 'cats', 'adopt dont shop', 'pet adoption india', 'rescue dogs', 'rescue cats'],
    metadataBase: new URL('https://adoptdontshop.xyz'),
    alternates: {
        canonical: '/',
    },
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://adoptdontshop.xyz',
        siteName: 'AdoptDontShop',
        title: 'AdoptDontShop: Rescue Pet Adoption & Care Community',
        description:
            'Give a rescue pet a forever home. Browse thousands of dogs, cats, and other animals available for adoption. Join our community of animal lovers!',
        images: [
            {
                url: 'https://adoptdontshop.xyz/og-image.webp',
                width: 1200,
                height: 630,
                alt: 'AdoptDontShop - Rescue Pet Adoption & Care Community',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'AdoptDontShop: Rescue Pet Adoption & Care Community',
        description: 'Give a rescue pet a forever home. Browse thousands of dogs, cats, and other animals available for adoption. Join our community of animal lovers!',
        images: ['https://adoptdontshop.xyz/og-image.webp'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
        },
    },
    icons: {
        icon: [
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: '/apple-touch-icon.png',
    },
    manifest: '/site.webmanifest',
};

// Schema.org Organization structured data
const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'AdoptDontShop',
    url: 'https://adoptdontshop.xyz',
    logo: 'https://adoptdontshop.xyz/logo.png',
    description: 'India\'s largest pet adoption community connecting rescue animals with loving families.',
    sameAs: [
        'https://www.facebook.com/profile.php?id=61583730512051',
        'https://x.com/mouhurtik',
        'https://instagram.com/adoptdontshop.xyz',
        'https://www.youtube.com/@mouhurtik',
        'https://www.linkedin.com/company/adoptdontshop-xyz/',
        'https://github.com/mouhurtik/adoptdontshop',
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${quicksand.variable} ${nunito.variable}`} suppressHydrationWarning>
            <head>
                <link rel="alternate" type="application/rss+xml" title="AdoptDontShop Community" href="/feed.xml" />
                <link rel="preload" as="image" href="/images/hero-dogs.webp" type="image/webp" />
                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=G-FJ0SET7VX9"
                    strategy="lazyOnload"
                />
                <Script id="google-analytics" strategy="lazyOnload">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-FJ0SET7VX9');
                    `}
                </Script>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
                />
            </head>
            <body suppressHydrationWarning>
                <Providers>
                    <LayoutShell>{children}</LayoutShell>
                </Providers>
            </body>
        </html>
    );
}
