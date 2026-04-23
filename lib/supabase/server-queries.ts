import { createServerSupabaseClient } from './server';

export interface ServerPost {
    id: string;
    title: string;
    slug: string;
    content_text: string | null;
    featured_image_url: string | null;
    tags: string[] | null;
    like_count: number;
    comment_count: number;
    view_count: number;
    created_at: string;
    author_id: string;
    author_name: string | null;
    author_avatar: string | null;
    author_username: string | null;
}

export interface ServerPet {
    id: string;
    pet_name: string;
    slug: string;
    animal_type: string | null;
    breed: string | null;
    age: string | null;
    location: string | null;
    description: string | null;
    image_url: string | null;
    status: string;
    created_at: string;
}

export async function fetchCommunityPostsServer({
    tag = 'all',
    sort = 'new',
    limit = 20,
    offset = 0,
}: {
    tag?: string;
    sort?: 'hot' | 'new' | 'top';
    limit?: number;
    offset?: number;
} = {}): Promise<ServerPost[]> {
    const supabase = await createServerSupabaseClient();

    let query = supabase
        .from('community_posts')
        .select(
            `id, title, slug, content_text, featured_image_url, tags, like_count, comment_count, view_count, created_at, author_id`
        )
        .eq('status', 'published')
        .range(offset, offset + limit - 1);

    if (tag !== 'all') {
        query = query.contains('tags', [tag]);
    }

    switch (sort) {
        case 'hot':
            query = query.order('like_count', { ascending: false }).order('created_at', { ascending: false });
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
    if (error || !data) return [];

    // Batch-fetch author profiles
    const authorIds = [...new Set(data.map((p) => p.author_id))];
    const { data: profiles } =
        authorIds.length > 0
            ? await supabase.from('profiles').select('id, display_name, avatar_url, username').in('id', authorIds)
            : { data: [] };

    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));

    return data.map((post) => {
        const profile = profileMap.get(post.author_id);
        return {
            id: post.id,
            title: post.title,
            slug: post.slug,
            content_text: post.content_text,
            featured_image_url: post.featured_image_url,
            tags: post.tags,
            like_count: post.like_count || 0,
            comment_count: post.comment_count || 0,
            view_count: post.view_count || 0,
            created_at: post.created_at,
            author_id: post.author_id,
            author_name: profile?.display_name || null,
            author_avatar: profile?.avatar_url || null,
            author_username: profile?.username || null,
        };
    });
}

export async function fetchPetListingsServer(limit = 100): Promise<ServerPet[]> {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
        .from('pet_listings')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error || !data) return [];

    return data.map((pet) => ({
        id: pet.id,
        pet_name: pet.pet_name,
        slug: `${pet.pet_name?.toLowerCase().replace(/\s+/g, '-')}-${pet.id.slice(0, 8)}`,
        animal_type: pet.animal_type,
        breed: pet.breed,
        age: pet.age,
        location: pet.location,
        description: pet.description,
        image_url: pet.image_url,
        status: pet.status,
        created_at: pet.created_at,
    }));
}

export async function fetchPetBySlugServer(slug: string): Promise<ServerPet | null> {
    const supabase = await createServerSupabaseClient();
    const idPrefix = slug.split('-').pop() || '';

    const { data: pets, error } = await supabase.from('pet_listings').select('*').eq('status', 'available');

    if (error || !pets) return null;
    const pet = pets.find((p) => p.id.startsWith(idPrefix));
    if (!pet) return null;

    return {
        id: pet.id,
        pet_name: pet.pet_name,
        slug: `${pet.pet_name?.toLowerCase().replace(/\s+/g, '-')}-${pet.id.slice(0, 8)}`,
        animal_type: pet.animal_type,
        breed: pet.breed,
        age: pet.age,
        location: pet.location,
        description: pet.description,
        image_url: pet.image_url,
        status: pet.status,
        created_at: pet.created_at,
    };
}

import type { PostCardData } from '@/components/community/PostCard';

export function serverPostsToPostCardData(posts: ServerPost[]): PostCardData[] {
    return posts.map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        content_text: post.content_text || '',
        featured_image_url: post.featured_image_url,
        tags: post.tags || [],
        like_count: post.like_count,
        comment_count: post.comment_count,
        view_count: post.view_count,
        created_at: post.created_at,
        author_id: post.author_id,
        author: post.author_name
            ? {
                  display_name: post.author_name,
                  avatar_url: post.author_avatar,
                  username: post.author_username,
              }
            : undefined,
    }));
}

export async function fetchCommunityPostBySlugServer(slug: string): Promise<
    | (ServerPost & {
          content: Record<string, unknown> | null;
          updated_at: string | null;
          profiles?: { display_name: string | null; avatar_url: string | null; username: string | null } | null;
      })
    | null
> {
    const supabase = await createServerSupabaseClient();
    const { data: post, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single();

    if (error || !post) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url, username')
        .eq('id', post.author_id)
        .single();

    return {
        id: post.id,
        title: post.title,
        slug: post.slug,
        content_text: post.content_text,
        content: post.content as Record<string, unknown> | null,
        featured_image_url: post.featured_image_url,
        tags: post.tags,
        like_count: post.like_count || 0,
        comment_count: post.comment_count || 0,
        view_count: post.view_count || 0,
        created_at: post.created_at,
        updated_at: post.updated_at,
        author_id: post.author_id,
        author_name: profile?.display_name || null,
        author_avatar: profile?.avatar_url || null,
        author_username: profile?.username || null,
        profiles: profile,
    };
}
