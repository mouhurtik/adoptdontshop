import MapView from '@/views/MapView';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Paw Map — Street Cat & Dog Community Map | AdoptDontShop',
    description: 'Interactive map of street cats and dogs across Mumbai, Delhi, Bangalore and India. Track feeding spots, sterilizations (ABC), and vaccination status.',
    keywords: [
        'paw map', 'street cat map', 'stray dog map India', 'community animal map',
        'meowmbai', 'map cat', 'stray animal feeding spots', 'indie dog tracker'
    ],
    alternates: { canonical: '/map' },
    openGraph: {
        title: 'Paw Map — Street Cat & Dog Community Map | AdoptDontShop',
        description: 'Explore and spot community animals in your neighborhood. Help keep strays vaccinated, sterilized, and fed.',
        url: 'https://adoptdontshop.in/map',
        type: 'website',
    },
};

export default function Page() {
    return <MapView />;
}
