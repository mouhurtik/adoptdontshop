'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, MessageCircle } from 'lucide-react';
import { useConversations, useConversationMessages, useSendMessage, useStartConversation, useMessageRealtime, useMarkAsRead } from '@/hooks/useMessages';
import { isMemberId, useMessageMember } from '@/hooks/useMessageMembers';
import { useAuth } from '@/contexts/AuthContext';
import MessageSidebar from '@/components/messaging/MessageSidebar';
import MessageThread from '@/components/messaging/MessageThread';
import PawprintLoader from '@/components/ui/PawprintLoader';

export default function Messages() {
    const searchParams = useSearchParams();
    const requestedConversation = searchParams.get('conversation');
    const recipientId = searchParams.get('to') || '';
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const conversationsQuery = useConversations();
    const conversations = conversationsQuery.data ?? [];
    const selectedConversation = requestedConversation
        ? conversations.find(conversation => conversation.id === requestedConversation) ?? null
        : conversations.find(conversation => recipientId && conversation.participant_ids.includes(recipientId)) ?? null;
    const selectedId = selectedConversation?.id ?? null;
    const recipientQuery = useMessageMember(recipientId, !conversationsQuery.isLoading && !conversationsQuery.isError && !selectedConversation);
    const recipient = !selectedConversation ? recipientQuery.data ?? null : null;
    const { data: messages = [], isLoading: messagesLoading } = useConversationMessages(selectedId);
    const sendMessage = useSendMessage();
    const startConversation = useStartConversation();
    useMessageRealtime(selectedId);
    const markAsRead = useMarkAsRead();
    useEffect(() => {
        if (selectedId) markAsRead(selectedId);
    }, [selectedId, markAsRead]);

    const selectConversation = (id: string) => router.replace(`/messages?conversation=${encodeURIComponent(id)}`);
    const selectMember = (id: string) => router.replace(`/messages?to=${encodeURIComponent(id)}`);
    const back = () => router.replace('/messages');
    const showThread = !!(requestedConversation || recipientId);

    async function send(content: string) {
        if (selectedId) {
            await sendMessage.mutateAsync({ conversationId: selectedId, content });
        } else if (recipient) {
            const id = await startConversation.mutateAsync({ recipientId: recipient.id, initialMessage: content });
            // Refresh the list before selecting the new conversation. Opening a draft
            // never creates a conversation or sends a greeting.
            await conversationsQuery.refetch();
            selectConversation(id);
        } else {
            throw new Error('No recipient selected');
        }
    }

    if (authLoading) return <PawprintLoader fullScreen size="lg" message="Loading messages..." />;
    if (!isAuthenticated) {
        const destination = requestedConversation ? `/messages?conversation=${encodeURIComponent(requestedConversation)}`
            : recipientId ? `/messages?to=${encodeURIComponent(recipientId)}` : '/messages';
        return <div className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-12">
            <section className="w-full rounded-2xl border border-gray-100 bg-white p-8 text-center">
                <MessageCircle aria-hidden="true" className="mx-auto mb-4 h-9 w-9 text-playful-coral-text" />
                <h1 className="font-heading text-2xl font-bold text-playful-text">Sign in to view messages</h1>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">Connect with members and keep your conversations in one place.</p>
                <Link href={`/login?redirect=${encodeURIComponent(destination)}`} className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#c34b24] px-6 text-sm font-semibold text-white">Sign In</Link>
            </section>
        </div>;
    }

    let status = '';
    let retry: (() => void) | undefined;
    const waiting = conversationsQuery.isLoading || (!!recipientId && isMemberId(recipientId) && recipientId !== user?.id && !selectedConversation && !conversationsQuery.isError && recipientQuery.isPending);
    if (conversationsQuery.isError) { status = 'Could not load your conversations.'; retry = () => { conversationsQuery.refetch(); }; }
    else if (!waiting && requestedConversation && !selectedConversation) status = 'This conversation is unavailable.';
    else if (recipientId && !isMemberId(recipientId)) status = 'This member link is invalid.';
    else if (recipientId && recipientId === user?.id) status = 'Choose another member to start a conversation.';
    else if (recipientQuery.isError) { status = 'Could not load this member.'; retry = () => { recipientQuery.refetch(); }; }
    else if (!waiting && recipientId && !selectedConversation && !recipient) status = 'This member is unavailable.';

    return <div className="fixed bottom-0 right-0 top-0 z-10 flex min-w-0 flex-col bg-white pb-20 pt-14 lg:pb-0 lg:pt-0" style={{ left: 'var(--sidebar-width, 0px)' }}>
        <div className="flex min-h-0 flex-1 overflow-hidden">
            <div className={`h-full min-h-0 w-full shrink-0 border-gray-100 lg:w-[320px] xl:w-[340px] lg:border-r ${showThread ? 'hidden lg:block' : 'block'}`}>
                <MessageSidebar conversations={conversations} selectedId={selectedId} draftRecipient={recipient} isLoading={conversationsQuery.isLoading} isError={conversationsQuery.isError}
                    onRetry={() => { conversationsQuery.refetch(); }} onSelect={selectConversation} onSelectMember={selectMember} />
            </div>
            <div className={`min-h-0 min-w-0 flex-1 flex-col ${showThread ? 'flex' : 'hidden lg:flex'}`}>
                {waiting || status ? <div className="flex min-h-0 flex-1 flex-col bg-playful-cream/30">
                    <div className="shrink-0 border-b border-gray-100 bg-white p-3 lg:hidden"><button type="button" onClick={back} className="inline-flex min-h-11 items-center gap-2 rounded-full px-3 text-sm text-gray-600"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Back to conversations</button></div>
                    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center text-sm text-gray-600">
                        {waiting ? <p role="status" className="flex items-center gap-2"><Loader2 aria-hidden="true" className="h-5 w-5 animate-spin" />Loading conversation…</p>
                            : <><p role="alert">{status}</p>{retry && <button type="button" onClick={retry} className="mt-3 min-h-11 text-playful-teal-text underline">Try again</button>}</>}
                    </div>
                </div> : <MessageThread key={selectedId || recipientId || 'empty'} conversation={selectedConversation} recipient={recipient} messages={messages} isLoading={messagesLoading}
                    onSend={send} isSending={sendMessage.isPending || startConversation.isPending} onBack={back} />}
            </div>
        </div>
    </div>;
}