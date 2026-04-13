'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, ArrowLeft, Users } from 'lucide-react';
import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';
import type { Message } from '@/hooks/useMessages';
import {
    useGroupConversation,
    useGroupMessages,
    useSendGroupMessage,
    useCreateGroupConversation,
    useGroupMessageRealtime,
} from '@/hooks/useGroupChat';
import { useGroupMembers } from '@/hooks/useGroups';
import { useAuth } from '@/contexts/AuthContext';

interface GroupChatProps {
    groupId: string;
    groupName: string;
    groupAvatarUrl?: string | null;
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

const GroupChat = ({ groupId, groupName, groupAvatarUrl, onBack }: GroupChatProps) => {
    const { user } = useAuth();
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);
    const prevLengthRef = useRef(0);

    // Hooks
    const { data: conversation, isLoading: loadingConv } = useGroupConversation(groupId);
    const { data: messages = [], isLoading: loadingMessages } = useGroupMessages(conversation?.id || null);
    const { data: members } = useGroupMembers(groupId);
    const sendMessage = useSendGroupMessage();
    const createConversation = useCreateGroupConversation();

    // Realtime
    useGroupMessageRealtime(conversation?.id || null);

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
        if (!content || sendMessage.isPending) return;

        let convId = conversation?.id;

        // Create conversation if it doesn't exist
        if (!convId) {
            const memberIds = members?.map(m => m.user_id) || (user ? [user.id] : []);
            const newConv = await createConversation.mutateAsync({
                groupId,
                groupName,
                groupAvatarUrl,
                memberIds,
            });
            convId = newConv.id;
        }

        if (convId) {
            sendMessage.mutate({ conversationId: convId, content });
            setInput('');
        }
    };

    const isLoading = loadingConv || loadingMessages;
    const dateGroups = groupByDate(messages);

    return (
        <div className="flex flex-col h-[70vh] md:h-[60vh] bg-white rounded-[2rem] shadow-soft overflow-hidden">
            {/* Header */}
            <div className="border-b border-gray-100 px-4 py-3 flex items-center gap-3 bg-white/80 backdrop-blur-sm">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="p-2 rounded-full hover:bg-playful-cream transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                )}
                <div className="w-10 h-10 rounded-full overflow-hidden bg-playful-cream shrink-0 border-2 border-white shadow-sm">
                    {groupAvatarUrl ? (
                        <img src={groupAvatarUrl} alt={groupName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-playful-teal to-playful-coral flex items-center justify-center text-white font-heading font-bold text-sm">
                            {groupName.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-800 text-sm truncate">{groupName}</p>
                    <p className="text-[11px] text-gray-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {members?.length || 0} members
                    </p>
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
                        <div className="w-16 h-16 bg-playful-teal/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Users className="w-8 h-8 text-playful-teal" />
                        </div>
                        <p className="text-gray-500 text-sm mb-2 font-medium">
                            Start chatting with the group!
                        </p>
                        <p className="text-xs text-gray-400">
                            Be the first to send a message 💬
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="text-center py-2 px-4 bg-white/60 mb-4 rounded-2xl mx-auto w-fit shadow-sm border border-gray-100">
                            <p className="text-[11px] font-semibold text-gray-500">
                                🛡️ Group messages are monitored for safety.
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
                                                    className={`text-[10px] mt-1.5 ${msg.is_mine ? 'text-white/80 text-right' : 'text-gray-400 text-left'}`}
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
                    placeholder="Message the group..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-1 px-4 py-2.5 rounded-full bg-playful-cream/50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-playful-teal/30 focus:border-playful-teal text-sm"
                    disabled={sendMessage.isPending || createConversation.isPending}
                />
                <button
                    type="submit"
                    disabled={!input.trim() || sendMessage.isPending}
                    className="p-2.5 rounded-full bg-playful-teal text-white hover:bg-playful-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md"
                >
                    {sendMessage.isPending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Send className="w-5 h-5" />
                    )}
                </button>
            </form>
        </div>
    );
};

export default GroupChat;
