import FundraiserCreate from '@/views/FundraiserCreate';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Start an Animal Fundraiser | AdoptDontShop',
    description: 'Launch a direct-to-UPI fundraiser for injured strays, medical bills, sterilizations, and rescue operations.',
    alternates: { canonical: '/fundraisers/create' },
};

export default function Page() {
    return <FundraiserCreate />;
}
