import { permanentRedirect } from 'next/navigation';

export const metadata = {
    title: 'Explore | AdoptDontShop',
    description: 'Discover pet communities, trending posts, and connect with pet lovers near you.',
    alternates: { canonical: '/' },
};

export default function Explore() {
    permanentRedirect('/');
}
