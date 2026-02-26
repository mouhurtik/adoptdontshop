'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import type { Json } from '@/lib/supabase/types';
import { useAuth } from '@/contexts/AuthContext';
import type { PostCardData } from '@/components/community/PostCard';

export type SortOption = 'hot' | 'new' | 'top';

interface FetchPostsParams {
    tag?: string;
    sort?: SortOption;
    limit?: number;
    offset?: number;
}

// Fetch community posts
export function useCommunityPosts({ tag = 'all', sort = 'new', limit = 20, offset = 0 }: FetchPostsParams = {}) {
    return useQuery({
        queryKey: ['community-posts', tag, sort, limit, offset],
        queryFn: async (): Promise<PostCardData[]> => {
            // Use plain select without typed FK join — FK exists in DB but not in generated types
            let query = supabase
                .from('community_posts')
                .select(`
                    id,
                    title,
                    slug,
                    content_text,
                    featured_image_url,
                    tags,
                    like_count,
                    comment_count,
                    view_count,
                    created_at,
                    author_id
                `)
                .eq('status', 'published')
                .range(offset, offset + limit - 1);

            // Tag filter
            if (tag !== 'all') {
                query = query.contains('tags', [tag]);
            }

            // Sort
            switch (sort) {
                case 'hot':
                    query = query.order('like_count', { ascending: false })
                        .order('created_at', { ascending: false });
                    break;
                case 'top':
                    query = query.order('like_count', { ascending: false });
                    break;
                case 'new':
                default:
                    query = query.order('created_at', { ascending: false });
                    break;
            }

            const { data, error } = await query;
            if (error) throw error;

            // Batch-fetch author profiles
            const authorIds = [...new Set((data || []).map(p => p.author_id))];
            const { data: profiles } = authorIds.length > 0
                ? await supabase.from('profiles').select('id, display_name, avatar_url, username').in('id', authorIds)
                : { data: [] };

            const profileMap = new Map((profiles || []).map(p => [p.id, p]));

            return (data || []).map(post => {
                const profile = profileMap.get(post.author_id);
                return {
                    id: post.id,
                    title: post.title,
                    slug: post.slug,
                    content_text: post.content_text || '',
                    featured_image_url: post.featured_image_url,
                    tags: post.tags || [],
                    like_count: post.like_count || 0,
                    comment_count: post.comment_count || 0,
                    view_count: post.view_count || 0,
                    created_at: post.created_at,
                    author_id: post.author_id,
                    author: profile ? {
                        display_name: profile.display_name,
                        avatar_url: profile.avatar_url,
                        username: profile.username,
                    } : undefined,
                };
            });
        },
    });
}

// Fetch single post by slug
export function useCommunityPost(slug: string) {
    return useQuery({
        queryKey: ['community-post', slug],
        queryFn: async () => {
            const { data: post, error } = await supabase
                .from('community_posts')
                .select('*')
                .eq('slug', slug)
                .eq('status', 'published')
                .single();

            if (error) throw error;

            // Fetch author profile separately
            const { data: profile } = await supabase
                .from('profiles')
                .select('display_name, avatar_url, username')
                .eq('id', post.author_id)
                .single();

            // Increment view count (fire & forget)
            supabase.rpc('increment_view_count', { post_id: post.id }).then(() => { });

            return {
                ...post,
                profiles: profile,
            };
        },
        enabled: !!slug,
    });
}

// Fetch comments for a post
export function usePostComments(postId: string | undefined) {
    return useQuery({
        queryKey: ['post-comments', postId],
        queryFn: async () => {
            const { data: comments, error } = await supabase
                .from('post_comments')
                .select('*')
                .eq('post_id', postId!)
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Batch-fetch comment author profiles
            const authorIds = [...new Set((comments || []).map(c => c.author_id))];
            const { data: profiles } = authorIds.length > 0
                ? await supabase.from('profiles').select('id, display_name, avatar_url').in('id', authorIds)
                : { data: [] };

            const profileMap = new Map((profiles || []).map(p => [p.id, p]));

            return (comments || []).map(comment => ({
                ...comment,
                profiles: profileMap.get(comment.author_id) || null,
            }));
        },
        enabled: !!postId,
    });
}

// Create a new post
export function useCreatePost() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async (post: {
            title: string;
            slug: string;
            content: Record<string, unknown>;
            content_text: string;
            tags: string[];
            featured_image_url?: string;
        }) => {
            const { data, error } = await supabase
                .from('community_posts')
                .insert({
                    title: post.title,
                    slug: post.slug,
                    content: post.content as unknown as Json,
                    content_text: post.content_text,
                    tags: post.tags,
                    featured_image_url: post.featured_image_url || null,
                    author_id: user!.id,
                    status: 'published',
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['community-posts'] });
        },
    });
}

// Like a post
export function useLikePost() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
            if (liked) {
                // Unlike
                const { error } = await supabase
                    .from('post_likes')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', user!.id);
                if (error) throw error;
            } else {
                // Like
                const { error } = await supabase
                    .from('post_likes')
                    .insert({ post_id: postId, user_id: user!.id });
                if (error) throw error;
            }
        },
        onSuccess: (_, { postId }) => {
            queryClient.invalidateQueries({ queryKey: ['community-posts'] });
            queryClient.invalidateQueries({ queryKey: ['community-post'] });
            queryClient.invalidateQueries({ queryKey: ['user-liked', postId] });
        },
    });
}

// Check if user liked a post
export function useUserLiked(postId: string | undefined) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['user-liked', postId, user?.id],
        queryFn: async () => {
            if (!user) return false;
            const { data } = await supabase
                .from('post_likes')
                .select('id')
                .eq('post_id', postId!)
                .eq('user_id', user.id)
                .maybeSingle();
            return !!data;
        },
        enabled: !!postId && !!user,
    });
}

// Add a comment
export function useAddComment() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({ postId, content, parentId }: {
            postId: string;
            content: string;
            parentId?: string;
        }) => {
            const { data, error } = await supabase
                .from('post_comments')
                .insert({
                    post_id: postId,
                    author_id: user!.id,
                    content,
                    parent_comment_id: parentId || null,
                })
                .select()
                .single();

            if (error) throw error;
            return data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['post-comments', variables.postId] });
            queryClient.invalidateQueries({ queryKey: ['community-post'] });
        },
    });
}

// Save / unsave a post (bookmark)
export function useSavePost() {
    const queryClient = useQueryClient();
    const { user } = useAuth();

    return useMutation({
        mutationFn: async ({ postId, saved }: { postId: string; saved: boolean }) => {
            if (!user) throw new Error('Must be logged in');
            if (saved) {
                // Unsave
                const { error } = await supabase
                    .from('saved_posts')
                    .delete()
                    .eq('post_id', postId)
                    .eq('user_id', user.id);
                if (error) throw error;
            } else {
                // Save
                const { error } = await supabase
                    .from('saved_posts')
                    .insert({ post_id: postId, user_id: user.id });
                if (error) throw error;
            }
        },
        onSuccess: (_, { postId }) => {
            queryClient.invalidateQueries({ queryKey: ['user-saved-post', postId] });
            queryClient.invalidateQueries({ queryKey: ['saved-posts'] });
        },
    });
}

// Check if user saved a post
export function useUserSavedPost(postId: string | undefined) {
    const { user } = useAuth();

    return useQuery({
        queryKey: ['user-saved-post', postId, user?.id],
        queryFn: async () => {
            if (!user) return false;
            const { data } = await supabase
                .from('saved_posts')
                .select('id')
                .eq('post_id', postId!)
                .eq('user_id', user.id)
                .maybeSingle();
            return !!data;
        },
        enabled: !!postId && !!user,
    });
}
