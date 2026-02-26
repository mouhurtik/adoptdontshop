'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { MessageCircle, Maximize2, Minus, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useConversations, useConversationMessages, useSendMessage, useStartConversation, useMessageRealtime } from '@/hooks/useMessages';
import ConversationList from '@/components/messaging/ConversationList';
import MessageThread from '@/components/messaging/MessageThread';
import Link from 'next/link';

export default function FloatingMessages() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    const { data: conversations = [], isLoading: convosLoading } = useConversations();
    const { data: messages = [], isLoading: messagesLoading } = useConversationMessages(selectedConversationId);
    const sendMessage = useSendMessage();
    const startConversation = useStartConversation();

    // Set up realtime subscriptions for messages and conversations
    useMessageRealtime(selectedConversationId);

    // Listen for 'open-floating-chat' custom events from other components
    const handleOpenChat = useCallback(async (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (!detail?.recipientId) return;

        // Open the widget
        setIsOpen(true);

        // Check if we already have a conversation with this user
        const existing = conversations.find(
            (c) => (c.participant_ids as string[])?.includes(detail.recipientId)
        );

        if (existing) {
            setSelectedConversationId(existing.id);
        } else {
            // Create a new conversation with a greeting (include pet name if available)
            const greeting = detail.petName
                ? `Hi! 🐾 Asking about ${detail.petName}`
                : 'Hi! 👋';
            try {
                const convId = await startConversation.mutateAsync({
                    recipientId: detail.recipientId,
                    initialMessage: greeting,
                });
                setSelectedConversationId(convId);
            } catch (err) {
                console.error('Failed to start conversation:', err);
            }
        }
    }, [conversations, startConversation]);

    useEffect(() => {
        window.addEventListener('open-floating-chat', handleOpenChat);
        return () => window.removeEventListener('open-floating-chat', handleOpenChat);
    }, [handleOpenChat]);

    // Don't render if we aren't fully authed or if we are on pages where this shouldn't show
    if (authLoading || !isAuthenticated) return null;
    // Show on community and pet detail routes (not admin/messages since they have their own UI)
    const showOnRoutes = pathname.startsWith('/community') || pathname.startsWith('/pet/');
    if (!showOnRoutes) return null;
    if (pathname.startsWith('/admin') || pathname.startsWith('/messages')) return null;

    const selectedConversation = conversations.find(c => c.id === selectedConversationId) ?? null;
    const unreadTotal = conversations.reduce((acc, curr) => acc + curr.unread_count, 0);

    return (
        <div className="fixed bottom-6 right-6 z-50 hidden lg:flex flex-col items-end">
            {/* Popout Chat Window */}
            {isOpen && (
                <div className="bg-white border border-gray-200 rounded-2xl shadow-xl w-80 h-[480px] flex flex-col mb-4 overflow-hidden origin-bottom-right transition-transform">
                    {/* Header */}
                    <div className="bg-playful-coral text-white p-3 flex items-center justify-between shadow-sm z-10">
                        <h3 className="font-bold flex items-center gap-2 text-sm">
                            {selectedConversationId ? (
                                <button onClick={() => setSelectedConversationId(null)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                                    <ArrowLeft className="w-4 h-4" />
                                </button>
                            ) : (
                                <MessageCircle className="w-4 h-4 fill-current" />
                            )}
                            {selectedConversationId ? 'Chat' : 'Messages'}
                        </h3>
                        <div className="flex items-center gap-1">
                            <Link href="/messages" className="p-1 hover:bg-white/20 rounded-full transition-colors text-white" title="Maximize">
                                <Maximize2 className="w-4 h-4" />
                            </Link>
                            <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                                <Minus className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-hidden flex flex-col bg-playful-cream">
                        {!selectedConversationId ? (
                            <div className="flex-1 overflow-y-auto">
                                <ConversationList
                                    conversations={conversations}
                                    selectedId={selectedConversationId}
                                    onSelect={setSelectedConversationId}
                                    isLoading={convosLoading}
                                />
                            </div>
                        ) : (
                            <div className="flex-1 overflow-hidden flex flex-col relative">
                                <MessageThread
                                    conversation={selectedConversation}
                                    messages={messages}
                                    isLoading={messagesLoading}
                                    onSend={(content) => sendMessage.mutate({ conversationId: selectedConversationId, content })}
                                    isSending={sendMessage.isPending}
                                    onBack={() => setSelectedConversationId(null)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Floating FAB Toggle */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-playful-coral text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all relative group"
                >
                    <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                    {unreadTotal > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white">
                            {unreadTotal > 99 ? '99+' : unreadTotal}
                        </span>
                    )}
                </button>
            )}
        </div>
    );
}
