import type { Metadata } from 'next';


export const metadata: Metadata = {
    title: 'Community Blog',
    description: 'Join our pet-loving community. Share stories, tips, and connect with fellow adopters.',
};

export default function CommunityLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
