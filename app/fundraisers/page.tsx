import FundraisersPage from '@/views/FundraisersPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Animal Fundraisers — Support Stray & Injured Pets in India | AdoptDontShop',
    description: 'Help fund life-saving medical treatment, sterilizations, and emergency rescues for stray animals across India. 100% direct UPI donations with 0% platform fees.',
    keywords: [
        'animal fundraisers India', 'dog surgery donation', 'cat rescue funds',
        'stray animal sterilization', 'vet bill help India', 'animal welfare donation'
    ],
    alternates: { canonical: '/fundraisers' },
    openGraph: {
        title: 'Animal Welfare Fundraisers | AdoptDontShop',
        description: 'Direct 0% fee donations to verified animal rescuers and caregivers across India.',
        url: 'https://adoptdontshop.in/fundraisers',
        type: 'website',
    },
};

export default function Page() {
    return <FundraisersPage />;
}
