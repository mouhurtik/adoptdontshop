import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, expect, it, vi } from 'vitest';
import { useCommunityPosts } from '@/hooks/useCommunity';
import type { PostCardData } from '@/components/community/PostCard';

vi.mock('@/contexts/AuthContext', () => ({ useAuth: () => ({ user: null }) }));
vi.mock('@/lib/supabase/client', () => ({ supabase: { from: (table: string) => {
    if (table === 'profiles') return { select: () => ({ in: async () => ({ data: [] }) }) };
    const query = {
        select: () => query, eq: () => query, range: () => query, contains: () => query, order: () => query,
        then: (resolve: (value: unknown) => unknown) => Promise.resolve({ data: [{ id: 'tip', title: 'A useful care tip', slug: 'care-tip', content_text: '', tags: ['tips'], author_id: 'member', created_at: '2026-11-08', like_count: 0, comment_count: 0, view_count: 0 }], error: null }).then(resolve),
    };
    return query;
} } }));

describe('Community feed server seed', () => {
    it('does not mistake the unfiltered seed for a fresh topic result', async () => {
        const client = new QueryClient({ defaultOptions: { queries: { retry: false, staleTime: Infinity } } });
        const initialData: PostCardData[] = [{ id: 'other', title: 'An unrelated story', slug: 'other', content_text: '', tags: ['discussion'], created_at: '2026-11-08', like_count: 0, comment_count: 0, view_count: 0 }];
        const wrapper = ({ children }: { children: React.ReactNode }) => <QueryClientProvider client={client}>{children}</QueryClientProvider>;
        const { result, unmount } = renderHook(() => useCommunityPosts({ tag: 'tips', initialData }), { wrapper });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data?.map(post => post.id)).toEqual(['tip']);
        unmount();
        client.clear();
    });
});
