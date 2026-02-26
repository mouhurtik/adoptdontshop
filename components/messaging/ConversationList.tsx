'use client';

import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, User } from 'lucide-react';
import type { Conversation } from '@/hooks/useMessages';

interface ConversationListProps {
    conversations: Conversation[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    isLoading: boolean;
}

const ConversationList = ({ conversations, selectedId, onSelect, isLoading }: ConversationListProps) => {
    if (isLoading) {
        return (
            <div className="space-y-3 p-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="animate-pulse flex gap-3 p-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                        <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <div className="bg-playful-cream p-4 rounded-full mb-4">
                    <MessageCircle className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-heading font-bold text-gray-800 mb-1">No conversations yet</h3>
                <p className="text-sm text-gray-500">
                    Message a caregiver from any pet&apos;s detail page to get started!
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto h-full">
            {conversations.map((convo) => {
                const isSelected = selectedId === convo.id;
                const timeAgo = convo.last_message_at
                    ? formatDistanceToNow(new Date(convo.last_message_at), { addSuffix: true })
                    : '';

                return (
                    <button
                        key={convo.id}
                        onClick={() => onSelect(convo.id)}
                        className={`w-full flex items-start gap-3 p-4 text-left transition-colors border-b border-gray-50 hover:bg-playful-cream/50 ${isSelected ? 'bg-playful-cream/70 border-l-4 border-l-playful-coral' : ''
                            }`}
                    >
                        {/* User avatar or placeholder */}
                        <div className="w-12 h-12 rounded-full overflow-hidden bg-playful-cream shrink-0 border-2 border-white shadow-sm">
                            {convo.other_participant_avatar ? (
                                <img
                                    src={convo.other_participant_avatar}
                                    alt={convo.other_participant_name || 'User'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-playful-teal">
                                    <User className="w-5 h-5" />
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                                <p className={`font-bold text-sm truncate ${convo.unread_count > 0 ? 'text-playful-text' : 'text-gray-700'
                                    }`}>
                                    {convo.other_participant_name || 'User'}
                                </p>
                                <span className="text-xs text-gray-400 shrink-0">{timeAgo}</span>
                            </div>
                            <p className="text-sm text-gray-500 truncate mt-0.5">
                                {convo.last_message || 'No messages yet'}
                            </p>
                        </div>

                        {/* Unread badge */}
                        {convo.unread_count > 0 && (
                            <div className="w-5 h-5 bg-playful-coral rounded-full flex items-center justify-center shrink-0 mt-1">
                                <span className="text-white text-[10px] font-bold">{convo.unread_count}</span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default ConversationList;
