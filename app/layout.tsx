import type { Metadata } from 'next';
import { Suspense } from 'react';
import localFont from 'next/font/local';
import './globals.css';
import Providers from './providers';
import LayoutShell from '@/components/LayoutShell';
import OptionalTracking from '@/components/analytics/OptionalTracking';
import { OFFICIAL_SOCIALS, serializeJsonLd, SITE_DESCRIPTION, SITE_URL } from '@/lib/site';
import { THEME_BOOTSTRAP } from '@/lib/theme';

const quicksand = localFont({
    src: './fonts/quicksand-latin.woff2',
    variable: '--font-quicksand',
    display: 'swap',
    weight: '400 700',
});

const nunito = localFont({
    src: './fonts/nunito-latin.woff2',
    variable: '--font-nunito',
    display: 'swap',
    weight: '400 900',
});



export const metadata: Metadata = {
    title: {
        default: 'AdoptDontShop: Rescue Pet Adoption & Care Community',
        template: '%s | AdoptDontShop',
    },
    description: SITE_DESCRIPTION,
    keywords: [
        'pet adoption India', 'adopt a dog India', 'adopt a cat India',
        'adopt pet near me', 'rescue dogs for adoption', 'rescue cats for adoption',
        'indie dog adoption', 'Indian pariah dog adoption', 'stray dog adoption India',
        'free pet adoption India', 'adopt dont shop', 'puppy adoption near me',
        'adopt dog Mumbai', 'adopt dog Delhi', 'adopt cat Kolkata',
        'adopt dog Bangalore', 'adopt cat Pune', 'adopt dog Hyderabad',
        'adopt cat Chennai', 'animal shelter near me India',
        'pet adoption Kolkata', 'pet adoption Mumbai',
    ],
    metadataBase: new URL('https://adoptdontshop.xyz'),
    openGraph: {
        type: 'website',
        locale: 'en_IN',
        url: 'https://adoptdontshop.xyz',
        siteName: 'AdoptDontShop',
        title: 'AdoptDontShop: Adopt Dogs & Cats in India — Free Pet Adoption',
        description: SITE_DESCRIPTION,
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
        title: 'AdoptDontShop: Adopt Dogs & Cats in India — Free Pet Adoption',
        description: SITE_DESCRIPTION,
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
    '@id': `${SITE_URL}/#organization`,
    name: 'AdoptDontShop',
    url: 'https://adoptdontshop.xyz',
    logo: 'https://adoptdontshop.xyz/logo.png',
    description: SITE_DESCRIPTION,
    sameAs: OFFICIAL_SOCIALS.map(social => social.url),
    founder: {
        '@type': 'Person', name: 'Mouhurtik Ray', url: `${SITE_URL}/about#founder`,
        sameAs: ['https://www.linkedin.com/in/mouhurtik/', 'https://x.com/mouhurtik', 'https://www.youtube.com/@mouhurtik'],
    },
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        url: 'https://adoptdontshop.xyz/contact',
        availableLanguage: ['English', 'Hindi', 'Bengali'],
    },
};

// The community is a website, not a physical shelter or local business.
const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'AdoptDontShop',
    url: 'https://adoptdontshop.xyz',
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://adoptdontshop.xyz/browse?search={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en-IN" className={`${quicksand.variable} ${nunito.variable}`} suppressHydrationWarning>
            <head>
                <script id="theme-init" dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
                <link rel="alternate" type="application/rss+xml" title="AdoptDontShop Community" href="/feed.xml" />
                <link rel="preconnect" href="https://aauevdimrbiowvxpllal.supabase.co" crossOrigin="anonymous" />
                <link rel="preconnect" href="https://uibsmaizlrekfooryrwq.supabase.co" crossOrigin="anonymous" />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationSchema) }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: serializeJsonLd(websiteSchema) }}
                />
            </head>
            <body suppressHydrationWarning>
                <Providers>
                    <Suspense fallback={null}><OptionalTracking /></Suspense>
                    <LayoutShell>{children}</LayoutShell>
                </Providers>
            </body>
        </html>
    );
}
