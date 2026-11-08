import ExplorePage from '@/views/ExplorePage';

export const metadata = {
    alternates: { canonical: '/explore' },
    title: 'Explore pet stories',
    description: 'Discover pet communities, trending posts, and connect with pet lovers near you.',
};

export default function Explore() {
    return <ExplorePage />;
}
