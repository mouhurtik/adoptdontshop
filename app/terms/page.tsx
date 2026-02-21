import TermsAndConditions from '@/views/TermsAndConditions';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
    title: 'Terms and Conditions | AdoptDontShop',
    description: 'Read the terms and conditions for using the AdoptDontShop pet adoption platform.',
};

export default function TermsPage() {
    return <TermsAndConditions />;
}
