'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Send, ArrowLeft, Loader2, Check, CheckCheck } from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import type { Message, Conversation } from '@/hooks/useMessages';
import type { MessageMember } from '@/hooks/useMessageMembers';

interface MessageThreadProps {
    conversation: Conversation | null;
    recipient?: MessageMember | null;
    messages: Message[];
    isLoading: boolean;
    onSend: (content: string) => void | Promise<void>;
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
    recipient,
    messages,
    isLoading,
    onSend,
    isSending,
    onBack,
}: MessageThreadProps) => {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const prevLengthRef = useRef(0);

    // Auto-scroll on new messages
    useEffect(() => {
        if (messages.length > prevLengthRef.current) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        prevLengthRef.current = messages.length;
    }, [messages.length]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const content = input.trim();
        if (!content || isSending || submitting) return;
        setError('');
        setSubmitting(true);
        try {
            await onSend(content);
            setInput('');
        } catch {
            setError('Your message could not be sent. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // Empty state
    if (!conversation && !recipient) {
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
    const name = recipient?.display_name || conversation?.other_participant_name || 'Member';
    const avatar = recipient?.avatar_url || conversation?.other_participant_avatar;
    const username = recipient?.username || conversation?.other_participant_username;
    const memberId = recipient?.id || conversation?.other_participant_id;
    const pending = isSending || submitting;

    return (
        <div className="flex-1 flex min-h-0 min-w-0 flex-col h-full">
            {/* Header */}
            <div className="border-b border-gray-100 px-4 py-3 flex items-center gap-3 bg-white/80 backdrop-blur-sm">
                {onBack && (
                    <button
                        type="button"
                        aria-label="Back to conversations"
                        onClick={onBack}
                        className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full hover:bg-playful-cream transition-colors lg:hidden"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                )}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-playful-teal/10 text-playful-teal-text shrink-0 border border-gray-200">
                    {avatar ? (
                        <img
                            src={avatar}
                            alt=""
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div aria-hidden="true" className="w-full h-full flex items-center justify-center font-semibold">{name.slice(0, 1).toUpperCase()}</div>
                    )}
                </div>
                <div className="min-w-0">
                    {memberId ? <Link href={`/user/${username || memberId}`} className="block truncate text-sm font-semibold text-playful-text hover:underline">{name}</Link> : <p className="truncate text-sm font-semibold text-playful-text">{name}</p>}
                    {username && <p className="truncate text-xs text-gray-500">@{username}</p>}
                </div>
            </div>

            {/* Messages */}
            <div className="min-h-0 flex-1 overflow-y-auto p-4 space-y-6 bg-playful-cream/40">
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-sm mb-4">
                            No messages yet. Say hello! 👋
                        </p>
                        <p className="mx-auto max-w-sm text-xs leading-relaxed text-gray-500">
                            Messages may be reviewed by administrators for safety.
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="text-center py-2 px-4 mb-4 mx-auto max-w-sm">
                            <p className="text-xs leading-relaxed text-gray-500">
                                Messages may be reviewed by administrators for safety.
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
                                                className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-sm ${msg.is_mine
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
                                                    className={`text-[10px] mt-1.5 ${msg.is_mine ? 'text-white/80 text-right' : 'text-gray-400 text-left'
                                                        }`}
                                                >
                                                    {formatDistanceToNow(new Date(msg.created_at), {
                                                        addSuffix: true,
                                                    })}
                                                    {msg.is_mine && (
                                                        <span className="ml-1 inline-flex align-middle">
                                                            {msg.read_by && msg.read_by.length > 1 ? (
                                                                <CheckCheck className="w-3 h-3 text-blue-300" />
                                                            ) : (
                                                                <Check className="w-3 h-3 text-white/60" />
                                                            )}
                                                        </span>
                                                    )}
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
            {error && <p role="alert" className="border-t border-gray-100 bg-white px-4 pt-3 text-sm text-red-600">{error}</p>}
            <form
                onSubmit={handleSubmit}
                className="shrink-0 border-t border-gray-100 p-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] bg-white flex items-center gap-2"
            >
                <label htmlFor="chat-message" className="sr-only">Your message</label>
                <input
                    id="chat-message"
                    type="text"
                    placeholder="Type a message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="min-h-11 min-w-0 flex-1 px-4 py-2.5 rounded-full bg-playful-cream/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-playful-coral/30 focus:border-playful-coral text-sm"
                    disabled={pending}
                    maxLength={5000}
                />
                <button
                    type="submit"
                    aria-label="Send message"
                    disabled={!input.trim() || pending}
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#c34b24] text-white hover:bg-[#ad401c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {pending ? (
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
