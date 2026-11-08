import NewConversation from '@/components/messaging/NewConversation';

export default async function NewConversationPage({ searchParams }: { searchParams: Promise<{ to?: string }> }) {
    const { to = '' } = await searchParams;
    return <NewConversation recipientId={to} />;
}
