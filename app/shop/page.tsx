import ShopPage from '@/views/ShopPage';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Pet Partner Stores & Bestsellers — Earn PawCoins | AdoptDontShop',
    description: 'Shop top pet platforms like Supertails, Amazon, and HUFT via AdoptDontShop. Earn PawCoins and partner discounts while 100% of proceeds fund rescue animals.',
    keywords: [
        'pet partner stores', 'supertails discounts', 'amazon pets India', 'huft coupons',
        'dog food online', 'cat food India', 'earn pawcoins', 'pet affiliate deals'
    ],
    alternates: { canonical: '/shop' },
    openGraph: {
        title: 'Pet Partner Stores & Bestsellers | AdoptDontShop',
        description: 'Shop India top pet platforms, earn PawCoins, and fund animal rescue at zero extra cost.',
        url: 'https://adoptdontshop.in/shop',
        type: 'website',
    },
};

export default function Page() {
    return <ShopPage />;
}
