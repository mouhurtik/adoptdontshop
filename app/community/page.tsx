import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Community | AdoptDontShop',
    description: 'Join the AdoptDontShop community — share stories, tips, and connect with pet lovers.',
};

export default function CommunityPage() {
    redirect('/');
}
