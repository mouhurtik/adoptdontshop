'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ScrollReveal from '@/components/ui/ScrollReveal';
import PrimaryButton from '@/components/ui/PrimaryButton';
import TiptapEditor from '@/components/community/TiptapEditor';
import { TAG_LABELS } from '@/components/community/PostCard';
import { useCreatePost } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';

const ALL_TAGS = ['success_story', 'fundraiser', 'virtual_adoption', 'tips', 'discussion', 'lost_found'];

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80)
        + '-' + Date.now().toString(36);
}

const CommunityWrite = () => {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const createPost = useCreatePost();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState<Record<string, unknown> | null>(null);
    const [contentText, setContentText] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [featuredImageUrl, setFeaturedImageUrl] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleEditorChange = useCallback((json: Record<string, unknown>, text: string) => {
        setContent(json);
        setContentText(text);
    }, []);

    const toggleTag = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : prev.length < 3
                    ? [...prev, tag]
                    : prev
        );
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !user) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}/${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from('community-images')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: urlData } = supabase.storage
                .from('community-images')
                .getPublicUrl(fileName);

            setFeaturedImageUrl(urlData.publicUrl);
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handlePublish = async () => {
        if (!title.trim()) {
            setError('Please add a title');
            return;
        }
        if (!content || !contentText.trim()) {
            setError('Please write some content');
            return;
        }
        if (selectedTags.length === 0) {
            setError('Please select at least one tag');
            return;
        }

        setError('');
        try {
            const post = await createPost.mutateAsync({
                title: title.trim(),
                slug: slugify(title),
                content,
                content_text: contentText,
                tags: selectedTags,
                featured_image_url: featuredImageUrl || undefined,
            });

            router.push(`/community/${post.slug}`);
        } catch (err) {
            console.error('Publish error:', err);
            setError('Failed to publish. Please try again.');
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-3xl font-heading font-black text-playful-text mb-4">
                        Sign in to write a post
                    </h1>
                    <Link href="/login" prefetch={false}>
                        <PrimaryButton size="lg">Sign In</PrimaryButton>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-32 pb-16 bg-playful-cream min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Back link */}
                <ScrollReveal mode="fade-up" width="100%">
                    <Link
                        href="/community"
                        prefetch={false}
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-playful-coral font-bold mb-8 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Community
                    </Link>
                </ScrollReveal>

                {/* Header */}
                <ScrollReveal mode="fade-up" delay={0.05} width="100%" className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-heading font-black text-playful-text">
                        Write a
                        <span className="relative inline-block ml-3 transform -rotate-1">
                            <span className="absolute inset-0 bg-playful-teal rounded-2xl transform rotate-1"></span>
                            <span className="relative text-white px-4 py-1">Post</span>
                        </span>
                    </h1>
                </ScrollReveal>

                {/* Form */}
                <ScrollReveal mode="fade-up" delay={0.1} width="100%">
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <input
                                type="text"
                                placeholder="Give your post a catchy title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-2xl md:text-3xl font-heading font-bold text-playful-text placeholder-gray-300 bg-transparent border-none outline-none py-4"
                                maxLength={200}
                            />
                            <div className="h-1 bg-gradient-to-r from-playful-coral via-playful-yellow to-playful-teal rounded-full" />
                        </div>

                        {/* Featured Image */}
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                Featured Image (optional)
                            </label>
                            {featuredImageUrl ? (
                                <div className="relative rounded-2xl overflow-hidden">
                                    <img
                                        src={featuredImageUrl}
                                        alt="Featured"
                                        className="w-full h-48 object-cover"
                                    />
                                    <button
                                        onClick={() => setFeaturedImageUrl('')}
                                        className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                        <X className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex items-center justify-center gap-3 py-8 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer hover:border-playful-coral hover:bg-playful-cream/50 transition-all">
                                    {uploading ? (
                                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                    ) : (
                                        <>
                                            <Upload className="h-6 w-6 text-gray-400" />
                                            <span className="text-gray-400 font-medium">Click to upload an image</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        disabled={uploading}
                                    />
                                </label>
                            )}
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                                Tags (select up to 3)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {ALL_TAGS.map(tag => {
                                    const isSelected = selectedTags.includes(tag);
                                    return (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-4 py-2 rounded-full font-bold text-sm transition-all duration-200 ${isSelected
                                                ? 'bg-playful-coral text-white shadow-md'
                                                : 'bg-white text-gray-500 hover:bg-playful-cream border border-gray-100'
                                                }`}
                                        >
                                            {TAG_LABELS[tag] || tag}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Editor */}
                        <div>
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                                Content
                            </label>
                            <TiptapEditor onChange={handleEditorChange} />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl font-medium text-sm">
                                {error}
                            </div>
                        )}

                        {/* Publish */}
                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Link href="/community" prefetch={false}>
                                <button className="px-6 py-3 text-gray-500 font-bold hover:text-playful-text transition-colors">
                                    Cancel
                                </button>
                            </Link>
                            <PrimaryButton
                                size="lg"
                                onClick={handlePublish}
                                disabled={createPost.isPending}
                                className="px-10 shadow-lg"
                            >
                                {createPost.isPending ? (
                                    <>
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    'Publish Post'
                                )}
                            </PrimaryButton>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
};

export default CommunityWrite;
