'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Search, Eye, Trash2, Pin, PinOff, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

interface CommunityPost {
    id: string;
    title: string;
    slug: string;
    status: string;
    tags: string[];
    like_count: number;
    comment_count: number;
    view_count: number;
    is_pinned: boolean;
    created_at: string;
    author_id: string;
    author_name?: string;
}

const statusOptions = ['published', 'draft', 'flagged', 'removed'] as const;

const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
    published: { bg: 'bg-green-50 hover:bg-green-100', text: 'text-green-700', dot: 'bg-green-500' },
    draft: { bg: 'bg-gray-100 hover:bg-gray-200', text: 'text-gray-600', dot: 'bg-gray-400' },
    flagged: { bg: 'bg-yellow-50 hover:bg-yellow-100', text: 'text-yellow-700', dot: 'bg-yellow-500' },
    removed: { bg: 'bg-red-50 hover:bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
};

function StatusDropdown({ post, onUpdate }: { post: CommunityPost; onUpdate: (id: string, status: string) => void }) {
    const [open, setOpen] = useState(false);
    const style = statusStyles[post.status] || statusStyles.draft;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (!(e.target as HTMLElement).closest(`[data-dropdown="${post.id}"]`)) setOpen(false);
        };
        if (open) document.addEventListener('click', handler);
        return () => document.removeEventListener('click', handler);
    }, [open, post.id]);

    return (
        <div className="relative" data-dropdown={post.id}>
            <button
                onClick={() => setOpen(!open)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${style.bg} ${style.text}`}
            >
                <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                {post.status}
                <ChevronDown className="w-3 h-3" />
            </button>
            {open && (
                <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20 min-w-[130px]">
                    {statusOptions.map(s => {
                        const st = statusStyles[s];
                        return (
                            <button
                                key={s}
                                onClick={() => { onUpdate(post.id, s); setOpen(false); }}
                                className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center gap-2 ${st.text} hover:bg-gray-50`}
                            >
                                <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                {s}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function PostsPage() {
    const [posts, setPosts] = useState<CommunityPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

    const loadPosts = useCallback(async () => {
        setLoading(true);

        let query = supabase
            .from('community_posts')
            .select('id, title, slug, status, tags, like_count, comment_count, view_count, is_pinned, created_at, author_id')
            .order('created_at', { ascending: false });

        if (statusFilter !== 'all') {
            query = query.eq('status', statusFilter);
        }

        const { data } = await query;
        const postsData = data || [];

        // Batch fetch author names
        const authorIds = [...new Set(postsData.map(p => p.author_id))];
        const { data: profiles } = authorIds.length > 0
            ? await supabase.from('profiles').select('id, display_name').in('id', authorIds)
            : { data: [] };

        const profileMap = new Map((profiles || []).map(p => [p.id, p.display_name || 'Unknown']));

        setPosts(postsData.map(p => ({
            ...p,
            author_name: profileMap.get(p.author_id) || 'Unknown',
        })));
        setLoading(false);
    }, [statusFilter]);

    useEffect(() => {
        loadPosts();
    }, [loadPosts]);

    const updateStatus = async (id: string, status: string) => {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, status } : p));
        await supabase.from('community_posts').update({ status }).eq('id', id);
    };

    const togglePin = async (id: string, currentlyPinned: boolean) => {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, is_pinned: !currentlyPinned } : p));
        await supabase.from('community_posts').update({ is_pinned: !currentlyPinned }).eq('id', id);
    };

    const deletePost = async () => {
        if (!deleteTarget) return;
        const id = deleteTarget;
        setDeleteTarget(null);
        setPosts(prev => prev.filter(p => p.id !== id));
        await supabase.from('community_posts').delete().eq('id', id);
    };

    const filtered = posts.filter(p =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.author_name?.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    );

    const counts = {
        all: posts.length,
        published: posts.filter(p => p.status === 'published').length,
        draft: posts.filter(p => p.status === 'draft').length,
        flagged: posts.filter(p => p.status === 'flagged').length,
        removed: posts.filter(p => p.status === 'removed').length,
    };

    return (
        <div>
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-heading font-bold text-playful-text">Community Posts</h1>
                <p className="text-gray-500 mt-1">Moderate and manage community content</p>
            </div>

            {/* Status tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
                {(['all', ...statusOptions] as const).map(s => (
                    <button
                        key={s}
                        onClick={() => setStatusFilter(s)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${statusFilter === s
                            ? 'bg-playful-teal text-white shadow-md'
                            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                            }`}
                    >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                        <span className="ml-1.5 text-xs opacity-75">
                            ({counts[s as keyof typeof counts] ?? 0})
                        </span>
                    </button>
                ))}
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by title, author, or tag..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-playful-teal/30 focus:border-playful-teal"
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-playful-coral border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <p className="text-gray-400 font-medium">No posts found</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/50">
                                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Title</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Author</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Tags</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                                    <th className="text-center px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Stats</th>
                                    <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Date</th>
                                    <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map((post, i) => (
                                    <tr key={post.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                {post.is_pinned && (
                                                    <Pin className="w-3.5 h-3.5 text-playful-coral flex-shrink-0" />
                                                )}
                                                <span className="font-medium text-playful-text line-clamp-1 max-w-[220px]">
                                                    {post.title}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{post.author_name}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {post.tags.slice(0, 2).map(tag => (
                                                    <span key={tag} className="px-2 py-0.5 bg-playful-cream text-playful-text rounded-full text-xs font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {post.tags.length > 2 && (
                                                    <span className="text-xs text-gray-400">+{post.tags.length - 2}</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-4">
                                            <StatusDropdown post={post} onUpdate={updateStatus} />
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                                                <span title="Likes">❤️ {post.like_count}</span>
                                                <span title="Comments">💬 {post.comment_count}</span>
                                                <span title="Views">👁 {post.view_count}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 text-gray-500 text-xs">
                                            {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <Link
                                                    href={`/community/${post.slug}`}
                                                    target="_blank"
                                                    className="p-2 rounded-lg text-gray-400 hover:text-playful-teal hover:bg-playful-teal/10 transition-colors"
                                                    title="View post"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => togglePin(post.id, post.is_pinned)}
                                                    className={`p-2 rounded-lg transition-colors ${post.is_pinned
                                                        ? 'text-playful-coral hover:bg-playful-coral/10'
                                                        : 'text-gray-400 hover:text-playful-coral hover:bg-playful-coral/10'
                                                        }`}
                                                    title={post.is_pinned ? 'Unpin' : 'Pin'}
                                                >
                                                    {post.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(post.id)}
                                                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Delete post"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ConfirmDialog
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={deletePost}
                title="Delete Post?"
                message="Permanently delete this post? This cannot be undone."
                confirmLabel="Delete"
                variant="danger"
            />
        </div>
    );
}
