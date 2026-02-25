'use client';

import { useState, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import {
    useConversations,
    useConversationMessages,
    useSendMessage,
    useMessageRealtime,
    useMarkAsRead,
} from '@/hooks/useMessages';
import { useAuth } from '@/contexts/AuthContext';
import ConversationList from '@/components/messaging/ConversationList';
import MessageThread from '@/components/messaging/MessageThread';
import PawprintLoader from '@/components/ui/PawprintLoader';

const Messages = () => {
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [showThread, setShowThread] = useState(false); // For mobile toggle

    const { data: conversations = [], isLoading: convosLoading } = useConversations();
    const { data: messages = [], isLoading: messagesLoading } = useConversationMessages(selectedConversationId);
    const sendMessage = useSendMessage();

    // Realtime updates
    useMessageRealtime(selectedConversationId);

    const selectedConversation = conversations.find(c => c.id === selectedConversationId) ?? null;

    const markAsRead = useMarkAsRead();

    const handleSelectConversation = useCallback((id: string) => {
        setSelectedConversationId(id);
        setShowThread(true); // Show thread on mobile
        markAsRead(id); // Mark messages as read
    }, [markAsRead]);

    const handleBack = useCallback(() => {
        setShowThread(false);
    }, []);

    const handleSend = useCallback(
        (content: string) => {
            if (!selectedConversationId) return;
            sendMessage.mutate({ conversationId: selectedConversationId, content });
        },
        [selectedConversationId, sendMessage]
    );

    // Auth guard
    if (authLoading) {
        return <PawprintLoader fullScreen size="lg" message="Loading messages..." />;
    }

    if (!isAuthenticated) {
        return (
            <div className="pt-32 pb-16 min-h-screen bg-playful-cream">
                <div className="container mx-auto px-4">
                    <div className="max-w-md mx-auto text-center bg-white rounded-[2rem] p-12 shadow-soft">
                        <div className="bg-playful-cream p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                            <MessageCircle className="w-8 h-8 text-playful-coral" />
                        </div>
                        <h1 className="text-2xl font-heading font-bold text-playful-text mb-3">
                            Sign in to view messages
                        </h1>
                        <p className="text-gray-500 mb-6">
                            You need to be logged in to send and receive messages.
                        </p>
                        <a
                            href="/login"
                            className="inline-block bg-playful-coral text-white px-6 py-3 rounded-full font-bold hover:bg-playful-coral/90 transition-colors shadow-md"
                        >
                            Sign In
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 pt-14 pb-16 lg:pt-16 lg:pb-0 bg-white lg:bg-playful-cream flex flex-col">
            <div className="h-full flex-1 flex flex-col min-h-0 lg:px-0">
                <div className="bg-white h-full flex flex-col overflow-hidden min-h-0 lg:border-t lg:border-gray-100">
                    <div className="flex h-full flex-1 min-h-0">
                        {/* Conversation List — hidden on mobile when thread is shown */}
                        <div
                            className={`w-full lg:w-[340px] lg:border-r border-gray-100 flex flex-col shrink-0 min-h-0 ${showThread ? 'hidden lg:flex' : 'flex'
                                }`}
                        >
                            <div className="p-4 border-b border-gray-100">
                                <h1 className="text-xl font-heading font-bold text-playful-text flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 text-playful-coral" />
                                    Messages
                                </h1>
                            </div>
                            <ConversationList
                                conversations={conversations}
                                selectedId={selectedConversationId}
                                onSelect={handleSelectConversation}
                                isLoading={convosLoading}
                            />
                        </div>

                        {/* Message Thread — hidden on mobile when list is shown */}
                        <div
                            className={`flex-1 flex flex-col min-h-0 ${showThread ? 'flex' : 'hidden lg:flex'
                                }`}
                        >
                            <MessageThread
                                conversation={selectedConversation}
                                messages={messages}
                                isLoading={messagesLoading}
                                onSend={handleSend}
                                isSending={sendMessage.isPending}
                                onBack={handleBack}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
