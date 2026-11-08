'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { useConversations, useStartConversation } from '@/hooks/useMessages';

export default function NewConversation({ recipientId }: { recipientId: string }) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading: authLoading } = useAuth();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const start = useStartConversation();
    const { data: conversations = [] } = useConversations();
    const valid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(recipientId);
    const { data: recipient, isLoading, isError } = useQuery({
        queryKey: ['message-recipient', recipientId],
        enabled: valid && isAuthenticated && recipientId !== user?.id,
        queryFn: async () => {
            const { data, error } = await supabase.from('profiles').select('id, display_name, username').eq('id', recipientId).maybeSingle();
            if (error) throw error;
            return data;
        },
    });
    const existing = conversations.find(conversation => conversation.participant_ids.includes(recipientId));
    const destination = `/messages/new?to=${encodeURIComponent(recipientId)}`;

    async function send(event: React.FormEvent) {
        event.preventDefault();
        if (!message.trim() || !recipient || start.isPending) return;
        setError('');
        try {
            const id = await start.mutateAsync({ recipientId, initialMessage: message.trim() });
            router.replace(`/messages?conversation=${encodeURIComponent(id)}`);
        } catch { setError('Your message could not be sent. Please try again.'); }
    }

    return <div className="mx-auto max-w-2xl px-4 py-8 lg:py-12">
        <Link href="/messages" className="inline-flex min-h-11 items-center text-sm text-playful-teal-text underline">Back to messages</Link>
        <section className="mt-4 rounded-2xl border border-gray-100 bg-white p-5 sm:p-8">
            <h1 className="font-heading text-2xl font-bold text-playful-text">Start a conversation</h1>
            {authLoading ? <p className="mt-4 text-gray-600">Loading your account…</p>
                : !valid ? <p className="mt-4 text-gray-600">This recipient link is invalid.</p>
                : !isAuthenticated ? <p className="mt-4 text-gray-600"><Link href={`/login?redirect=${encodeURIComponent(destination)}`} className="text-playful-teal-text underline">Sign in</Link> to message this community member.</p>
                : recipientId === user?.id ? <p className="mt-4 text-gray-600">You cannot start a conversation with yourself.</p>
                : isLoading ? <p className="mt-4 text-gray-600">Loading the recipient…</p>
                : isError || !recipient ? <p className="mt-4 text-gray-600">This member is unavailable. Please return to their profile or try again later.</p>
                : <>
                    <p className="mt-3 text-gray-600">To <Link href={`/user/${recipient.username || recipient.id}`} className="font-semibold text-playful-teal-text underline">{recipient.display_name || 'Community member'}</Link></p>
                    {existing && <Link href={`/messages?conversation=${encodeURIComponent(existing.id)}`} className="mt-3 inline-flex min-h-11 items-center text-sm text-playful-teal-text underline">Open your existing conversation</Link>}
                    <form onSubmit={send} className="mt-5">
                        <label htmlFor="first-message" className="mb-2 block text-sm font-medium text-gray-600">Your message</label>
                        <textarea id="first-message" value={message} onChange={event => setMessage(event.target.value)} required maxLength={5000} rows={5} className="block w-full rounded-xl border border-gray-200 bg-playful-cream/40 p-3 text-base text-playful-text" placeholder="Introduce yourself and start a conversation…" />
                        <p className="mt-2 text-xs text-gray-500">Opening this page sends nothing. Send only when you are ready.</p>
                        {error && <p role="alert" className="mt-3 text-sm text-red-600">{error}</p>}
                        <button type="submit" disabled={!message.trim() || start.isPending} className="comment-submit mt-4 min-h-11 rounded-xl px-5 text-sm font-semibold">{start.isPending ? 'Sending…' : 'Send message'}</button>
                    </form>
                </>}
        </section>
    </div>;
}
