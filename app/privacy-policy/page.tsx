import PrivacyPolicy from '@/views/PrivacyPolicy';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Privacy Policy',
    description: 'Our privacy policy explains how we collect, use, and protect your personal information on AdoptDontShop.',
    alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPolicyPage() {
    return <PrivacyPolicy />;
}
