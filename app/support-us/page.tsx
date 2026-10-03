import SupportUs from '@/views/SupportUs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Support AdoptDontShop — Donate & Partner for Stray Animal Welfare',
    description: 'Support India’s 100% free animal adoption and welfare network. Direct UPI donations and CSR grant partnerships with 0% platform fees.',
    keywords: [
        'donate to animal shelter India', 'support animal welfare', 'adopt dont shop donation',
        'CSR grant animal welfare India', 'help stray animals'
    ],
    alternates: { canonical: '/support-us' },
    openGraph: {
        title: 'Support AdoptDontShop — Donate & Partner for Stray Animal Welfare',
        description: 'Power free open pet adoption, street animal mapping, and emergency medical care across India.',
        url: 'https://adoptdontshop.in/support-us',
        type: 'website',
    },
};

export default function Page() {
    return <SupportUs />;
}
