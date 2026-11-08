import { redirect } from 'next/navigation';

export default async function NewConversationPage({ searchParams }: { searchParams: Promise<{ to?: string }> }) {
    const { to = '' } = await searchParams;
    redirect(to ? `/messages?to=${encodeURIComponent(to)}` : '/messages');
}
