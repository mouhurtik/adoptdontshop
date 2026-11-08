'use client';

import { useEffect, useState } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import type { Conversation } from '@/hooks/useMessages';
import { normalizeMemberSearch, useMessageMemberSearch, type MessageMember } from '@/hooks/useMessageMembers';
import ConversationList from './ConversationList';

interface Props {
    conversations: Conversation[];
    selectedId: string | null;
    draftRecipient: MessageMember | null;
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
    onSelect: (id: string) => void;
    onSelectMember: (id: string) => void;
}

export default function MessageSidebar({ conversations, selectedId, draftRecipient, isLoading, isError, onRetry, onSelect, onSelectMember }: Props) {
    const [search, setSearch] = useState('');
    const [debounced, setDebounced] = useState('');
    const needle = normalizeMemberSearch(search).toLocaleLowerCase();
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(needle), 300);
        return () => clearTimeout(timer);
    }, [needle]);
    const members = useMessageMemberSearch(debounced);
    const filtered = conversations.filter(conversation => !needle ||
        [conversation.other_participant_name, conversation.other_participant_username].some(value => value?.toLocaleLowerCase().includes(needle)));
    const existingIds = new Set(conversations.map(conversation => conversation.other_participant_id));
    const people = (members.data ?? []).filter(member => !existingIds.has(member.id) && member.id !== draftRecipient?.id);
    const searching = needle !== debounced || members.isFetching;

    return <aside aria-label="Message sidebar" className="flex h-full min-h-0 flex-col bg-white">
        <div className="shrink-0 border-b border-gray-100 p-4 lg:p-5">
            <h1 className="font-heading text-2xl font-bold text-playful-text">Messages</h1>
            <div className="relative mt-4">
                <label htmlFor="message-search" className="sr-only">Search conversations or members</label>
                <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                <input id="message-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search name or @username" maxLength={80}
                    className="min-h-11 w-full min-w-0 rounded-xl border border-gray-200 bg-playful-cream/50 py-2.5 pl-9 pr-10 text-sm text-playful-text outline-none focus:border-playful-coral-text focus:ring-2 focus:ring-playful-coral-text/20 [&::-webkit-search-cancel-button]:hidden" />
                {search && <button type="button" aria-label="Clear message search" onClick={() => setSearch('')} className="absolute right-0 top-0 inline-flex h-11 w-10 items-center justify-center rounded-xl text-gray-500 hover:text-playful-text"><X aria-hidden="true" className="h-4 w-4" /></button>}
            </div>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
            {draftRecipient && <div className="border-b border-gray-100">
                <p className="px-4 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">New message</p>
                <MemberRow member={draftRecipient} selected onSelect={() => onSelectMember(draftRecipient.id)} />
            </div>}
            {isError ? <div role="alert" className="p-5 text-sm text-gray-600"><p>Could not load conversations.</p><button type="button" onClick={onRetry} className="mt-2 min-h-11 text-playful-teal-text underline">Try again</button></div>
                : <>
                    {needle && <h2 className="px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">Conversations</h2>}
                    {needle && !isLoading && !filtered.length ? <p className="px-4 py-3 text-sm text-gray-500">No matching conversations.</p>
                        : <ConversationList conversations={filtered} selectedId={selectedId} onSelect={onSelect} isLoading={isLoading} />}
                </>}
            {needle && <section aria-label="Find members" className="border-t border-gray-100 pb-4">
                <h2 className="px-4 pb-1 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-500">People</h2>
                {needle.length < 2 ? <p className="px-4 py-3 text-sm text-gray-500">Type at least two characters to find members.</p>
                    : searching ? <p role="status" className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500"><Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />Searching members…</p>
                        : members.isError ? <div role="alert" className="px-4 py-3 text-sm text-gray-600"><p>Member search is unavailable.</p><button type="button" onClick={() => members.refetch()} className="min-h-11 text-playful-teal-text underline">Retry search</button></div>
                            : people.length ? people.map(member => <MemberRow key={member.id} member={member} onSelect={() => onSelectMember(member.id)} />)
                                : <p className="px-4 py-3 text-sm text-gray-500">No other members found.</p>}
            </section>}
        </div>
    </aside>;
}

function MemberRow({ member, onSelect, selected = false }: { member: MessageMember; onSelect: () => void; selected?: boolean }) {
    return <button type="button" onClick={onSelect} aria-label={`Message ${member.display_name || member.username || 'member'}${member.username ? ` (@${member.username})` : ''}`} aria-pressed={selected} className={`flex min-h-16 w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-playful-cream/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-playful-coral-text ${selected ? 'bg-playful-coral/10' : ''}`}>
        <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-playful-teal/10 font-semibold text-playful-teal-text">
            {member.avatar_url ? <img src={member.avatar_url} alt="" className="h-full w-full object-cover" /> : (member.display_name || member.username || 'U').slice(0, 1).toUpperCase()}
        </span>
        <span className="min-w-0"><span className="block truncate text-sm font-semibold text-playful-text">{member.display_name || member.username || 'Member'}</span>{member.username && <span className="block truncate text-xs text-gray-500">@{member.username}</span>}</span>
    </button>;
}
