'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import type { Message, Conversation } from '@/hooks/useMessages';

interface MessageThreadProps {
    conversation: Conversation | null;
    messages: Message[];
    isLoading: boolean;
    onSend: (content: string) => void;
    isSending: boolean;
    onBack?: () => void;
}

/** Group messages by date */
function groupByDate(messages: Message[]): { label: string; messages: Message[] }[] {
    const groups: { label: string; messages: Message[] }[] = [];
    let currentLabel = '';

    for (const msg of messages) {
        const date = new Date(msg.created_at);
        let label: string;

        if (isToday(date)) label = 'Today';
        else if (isYesterday(date)) label = 'Yesterday';
        else label = format(date, 'MMM d, yyyy');

        if (label !== currentLabel) {
            currentLabel = label;
            groups.push({ label, messages: [] });
        }
        groups[groups.length - 1].messages.push(msg);
    }

    return groups;
}

const MessageThread = ({
    conversation,
    messages,
    isLoading,
    onSend,
    isSending,
    onBack,
}: MessageThreadProps) => {
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const prevLengthRef = useRef(0);

    // Auto-scroll on new messages
    useEffect(() => {
        if (messages.length > prevLengthRef.current) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        prevLengthRef.current = messages.length;
    }, [messages.length]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const content = input.trim();
        if (!content || isSending) return;
        onSend(content);
        setInput('');
    };

    // Empty state
    if (!conversation) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-playful-cream/30">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-soft mb-4">
                    <span className="text-3xl">💬</span>
                </div>
                <h3 className="font-heading font-bold text-xl text-gray-800 mb-2">
                    Select a conversation
                </h3>
                <p className="text-gray-500 text-sm max-w-xs">
                    Choose a conversation from the sidebar to start chatting
                </p>
            </div>
        );
    }

    const dateGroups = groupByDate(messages);

    return (
        <div className="flex-1 flex flex-col h-full">
            {/* Header */}
            <div className="border-b border-gray-100 px-4 py-3 flex items-center gap-3 bg-white/80 backdrop-blur-sm">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-playful-cream transition-colors lg:hidden"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                )}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-playful-cream shrink-0 border-2 border-white shadow-sm">
                    {conversation.pet_image ? (
                        <img
                            src={conversation.pet_image}
                            alt={conversation.pet_name || 'Pet'}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">🐾</div>
                    )}
                </div>
                <div className="min-w-0">
                    <p className="font-bold text-gray-800 text-sm truncate">
                        {conversation.other_participant_name || 'User'}
                    </p>
                    {conversation.pet_name && (
                        <p className="text-xs text-playful-coral font-medium truncate">
                            About: {conversation.pet_name}
                        </p>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-gradient-to-b from-playful-cream/20 to-white">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-sm mb-4">
                            No messages yet. Say hello! 👋
                        </p>
                        <p className="text-[11px] font-semibold text-gray-500 bg-white/60 py-2 px-4 rounded-full mx-auto w-fit shadow-sm border border-gray-100">
                            🛡️ All messages are monitored by the admin for safety and monitoring purposes.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="text-center py-4 px-6 bg-white/60 mb-6 rounded-2xl mx-auto w-fit shadow-sm border border-gray-100">
                            <p className="text-xs font-semibold text-gray-500">
                                🛡️ All messages are monitored by the admin for safety and monitoring purposes.
                            </p>
                        </div>
                        {dateGroups.map((group) => (
                            <div key={group.label}>
                                {/* Date separator */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <span className="text-xs font-medium text-gray-400 bg-white px-3 py-1 rounded-full border border-gray-100">
                                        {group.label}
                                    </span>
                                    <div className="flex-1 h-px bg-gray-200" />
                                </div>

                                {/* Messages in this date group */}
                                <div className="space-y-2">
                                    {group.messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${
                                                    msg.is_mine
                                                        ? 'bg-playful-coral text-white rounded-br-md'
                                                        : 'bg-white text-gray-800 rounded-bl-md border border-gray-100'
                                                }`}
                                            >
                                                {!msg.is_mine && (
                                                    <p className="text-xs font-bold text-playful-teal mb-1">
                                                        {msg.sender_name}
                                                    </p>
                                                )}
                                                <p className="text-sm whitespace-pre-wrap break-words">
                                                    {msg.content}
                                                </p>
                                                <p
                                                    className={`text-[10px] mt-1 ${
                                                        msg.is_mine ? 'text-white/70' : 'text-gray-400'
                                                    }`}
                                                >
                                                    {formatDistanceToNow(new Date(msg.created_at), {
                                                        addSuffix: true,
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </>
                )}
                <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
                onSubmit={handleSubmit}
                className="border-t border-gray-100 p-3 bg-white flex items-center gap-2"
            >
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-full bg-playful-cream/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-playful-coral/30 focus:border-playful-coral text-sm"
                    disabled={isSending}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || isSending}
                    className="p-2.5 rounded-full bg-playful-coral text-white hover:bg-playful-coral/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                    {isSending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </button>
            </form>
        </div>
    );
};

export default MessageThread;
