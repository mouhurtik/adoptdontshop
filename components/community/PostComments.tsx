'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, MessageCircle, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAddComment, usePostComments } from '@/hooks/useCommunity';

type Comment = NonNullable<ReturnType<typeof usePostComments>['data']>[number];

export default function PostComments({ postId }: { postId: string }) {
    const { user, profile, isAuthenticated } = useAuth();
    const { data: comments = [], isLoading, isError } = usePostComments(postId);
    const addComment = useAddComment();
    const [text, setText] = useState('');
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [reply, setReply] = useState('');
    const [error, setError] = useState('');

    async function submit(parentId?: string) {
        const content = (parentId ? reply : text).trim();
        if (!content || addComment.isPending) return;
        setError('');
        try {
            await addComment.mutateAsync({ postId, content, ...(parentId ? { parentId } : {}) });
            if (parentId) { setReply(''); setReplyTo(null); } else setText('');
        } catch { setError('Your comment could not be sent. Please try again.'); }
    }

    function identity(comment: Comment) {
        const name = comment.profiles?.display_name || 'Community member';
        const url = `/user/${comment.profiles?.username || comment.author_id}`;
        return <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            <Link href={url} className="inline-flex min-h-11 min-w-0 items-center gap-2 rounded-lg text-sm font-semibold text-playful-text hover:text-playful-teal-text">
                {comment.profiles?.avatar_url
                    ? <img src={comment.profiles.avatar_url} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                    : <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-playful-teal/15 text-playful-teal-text">{name.charAt(0).toUpperCase()}</span>}
                <span className="break-words">{name}</span>
            </Link>
            <time dateTime={comment.created_at} className="text-xs text-gray-500">{new Date(comment.created_at).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</time>
            {comment.author_id !== user?.id && <Link href={`/messages/new?to=${encodeURIComponent(comment.author_id)}`} aria-label={`Message ${name}`} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-playful-teal-text" title={`Message ${name}`}><MessageCircle aria-hidden="true" className="h-4 w-4" /></Link>}
        </div>;
    }

    return <section aria-labelledby="post-comments-heading" className="mt-10 rounded-2xl bg-white p-4 shadow-soft sm:p-6 md:p-8">
        <h2 id="post-comments-heading" className="mb-5 font-heading text-2xl font-bold text-playful-text">Comments ({comments.length})</h2>
        {isAuthenticated ? <form onSubmit={event => { event.preventDefault(); void submit(); }} className="mb-6">
            <label htmlFor="new-post-comment" className="mb-2 block text-sm font-medium text-gray-600">Comment as {profile?.display_name || 'your account'}</label>
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-playful-cream/40 focus-within:border-playful-teal-text focus-within:ring-1 focus-within:ring-playful-teal-text">
                <textarea id="new-post-comment" value={text} onChange={event => setText(event.target.value)} placeholder="Share your thoughts…" rows={3} maxLength={5000} required className="block min-h-24 w-full resize-y border-0 bg-transparent px-4 py-3 text-base text-playful-text placeholder:text-gray-500 focus:outline-none focus:ring-0" />
                <div className="flex justify-end border-t border-gray-100 p-2">
                    <button type="submit" disabled={!text.trim() || addComment.isPending} className="comment-submit inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed">
                        {addComment.isPending ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Send aria-hidden="true" className="h-4 w-4" />}Post comment
                    </button>
                </div>
            </div>
        </form> : <p className="mb-6 rounded-xl bg-playful-cream/60 p-4 text-sm text-gray-600"><Link href="/login" className="text-playful-teal-text underline">Sign in</Link> to join the conversation.</p>}
        {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
        {isError ? <p role="alert" className="text-sm text-gray-600">Comments could not be loaded. Please reload to try again.</p> : isLoading ? <p className="text-sm text-gray-500">Loading comments…</p> : comments.length === 0 ? <p className="py-4 text-sm text-gray-500">No comments yet. Share the first thought.</p> : null}
        <div className="space-y-5">
            {comments.filter(comment => !comment.parent_comment_id).map(comment => <article key={comment.id} className="min-w-0">
                {identity(comment)}
                <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-600">{comment.content}</p>
                {isAuthenticated && <button type="button" aria-expanded={replyTo === comment.id} onClick={() => { setReplyTo(replyTo === comment.id ? null : comment.id); setReply(''); }} className="min-h-11 rounded-lg px-2 text-sm text-playful-teal-text hover:bg-gray-100">{replyTo === comment.id ? 'Cancel reply' : 'Reply'}</button>}
                {replyTo === comment.id && <form className="mt-2 flex min-w-0 flex-wrap gap-2" onSubmit={event => { event.preventDefault(); void submit(comment.id); }}>
                    <label htmlFor={`reply-${comment.id}`} className="sr-only">Reply to {comment.profiles?.display_name || 'this comment'}</label>
                    <input id={`reply-${comment.id}`} value={reply} onChange={event => setReply(event.target.value)} placeholder="Write a reply…" maxLength={5000} required className="min-h-11 min-w-0 flex-1 rounded-lg border border-gray-200 bg-playful-cream/40 px-3 text-base text-playful-text" />
                    <button type="submit" disabled={!reply.trim() || addComment.isPending} className="comment-submit min-h-11 rounded-lg px-4 text-sm font-semibold">Send reply</button>
                </form>}
                <div className="ml-3 mt-3 space-y-3 border-l border-gray-200 pl-4 sm:ml-4">
                    {comments.filter(reply => reply.parent_comment_id === comment.id).map(reply => <article key={reply.id} className="min-w-0">{identity(reply)}<p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-gray-600">{reply.content}</p></article>)}
                </div>
            </article>)}
        </div>
    </section>;
}
