'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, X, Loader2, PenSquare } from 'lucide-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import ScrollReveal from '@/components/ui/ScrollReveal';
import PrimaryButton from '@/components/ui/PrimaryButton';
const TiptapEditor = dynamic(() => import('@/components/community/TiptapEditor'), { ssr: false });
import { TAG_LABELS } from '@/components/community/PostCard';
import { useCreatePost } from '@/hooks/useCommunity';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';
import { resizeAndConvertToWebP } from '@/lib/imageUtils';

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
            // Convert to WebP (max 1600px wide, 85% quality)
            const webpBlob = await resizeAndConvertToWebP(file, 1600, 0.85);
            const fileName = `${user.id}/${Date.now()}.webp`;

            const { error: uploadError } = await supabase.storage
                .from('community-images')
                .upload(fileName, webpBlob, {
                    contentType: 'image/webp',
                });

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
            <div className="pt-4 lg:pt-8 pb-16 bg-playful-cream min-h-screen">
                <div className="max-w-4xl mx-auto px-4 lg:px-6 text-center py-16">
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-soft border border-gray-100 max-w-md mx-auto">
                        <div className="bg-playful-coral/10 p-4 rounded-2xl w-fit mx-auto mb-4">
                            <PenSquare className="w-8 h-8 text-playful-coral" />
                        </div>
                        <h1 className="text-2xl font-heading font-black text-playful-text mb-2">
                            Sign in to write a post
                        </h1>
                        <p className="text-sm text-gray-500 mb-6">
                            Share your stories with the community
                        </p>
                        <Link href="/login" prefetch={false}>
                            <PrimaryButton size="lg" className="w-full justify-center">Sign In</PrimaryButton>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-4 lg:pt-8 pb-16 bg-playful-cream min-h-screen">
            <div className="max-w-3xl mx-auto px-3 sm:px-4 lg:px-6">
                {/* Back link */}
                <ScrollReveal mode="fade-up" width="100%">
                    <Link
                        href="/"
                        prefetch={false}
                        className="inline-flex items-center gap-2 text-gray-500 hover:text-playful-coral font-bold mb-4 sm:mb-6 transition-colors text-sm"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Feed
                    </Link>
                </ScrollReveal>

                {/* Form */}
                <ScrollReveal mode="fade-up" delay={0.1} width="100%">
                    <div className="bg-white rounded-2xl sm:rounded-[1.75rem] shadow-soft border border-gray-100 overflow-hidden">
                        {/* Title Section — redesigned for better mobile UX */}
                        <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="bg-playful-coral/10 p-1.5 rounded-lg">
                                    <PenSquare className="w-3.5 h-3.5 text-playful-coral" />
                                </div>
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                    Post Title
                                </label>
                            </div>
                            <input
                                type="text"
                                placeholder="What's on your mind?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full text-lg sm:text-xl md:text-2xl font-heading font-bold text-playful-text placeholder-gray-300 bg-transparent border-none outline-none focus:ring-0 pb-3"
                                maxLength={200}
                            />
                            <div className="flex items-center justify-between">
                                <div className="h-0.5 flex-1 bg-gradient-to-r from-playful-coral via-playful-yellow to-playful-teal rounded-full" />
                                <span className="text-[10px] text-gray-300 font-medium ml-3 flex-shrink-0">{title.length}/200</span>
                            </div>
                        </div>

                        <div className="px-4 sm:px-6 pb-5 sm:pb-6 space-y-5 sm:space-y-6">

                        {/* Featured Image */}
                        <div>
                            <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 block">
                                Featured Image (optional)
                            </label>
                            {featuredImageUrl ? (
                                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden">
                                    <img
                                        src={featuredImageUrl}
                                        alt="Featured"
                                        className="w-full h-40 sm:h-48 object-cover"
                                    />
                                    <button
                                        onClick={() => setFeaturedImageUrl('')}
                                        className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full hover:bg-red-50 transition-colors"
                                    >
                                        <X className="h-4 w-4 text-red-500" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex items-center justify-center gap-3 py-6 sm:py-8 border-2 border-dashed border-gray-200 rounded-xl sm:rounded-2xl cursor-pointer hover:border-playful-coral hover:bg-playful-cream/50 transition-all">
                                    {uploading ? (
                                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                    ) : (
                                        <>
                                            <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-gray-400" />
                                            <span className="text-sm text-gray-400 font-medium">Click to upload</span>
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
                            <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                                Tags (select up to 3)
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {ALL_TAGS.map(tag => {
                                    const isSelected = selectedTags.includes(tag);
                                    return (
                                        <button
                                            key={tag}
                                            onClick={() => toggleTag(tag)}
                                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm transition-all duration-200 ${isSelected
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
                            <label className="text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 block">
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

                        {/* Publish — stacked on mobile, inline on desktop */}
                        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-50">
                            <Link href="/" prefetch={false} className="w-full sm:w-auto">
                                <button className="w-full sm:w-auto px-6 py-3 text-gray-500 font-bold hover:text-playful-text transition-colors text-center rounded-xl hover:bg-gray-50">
                                    Cancel
                                </button>
                            </Link>
                            <PrimaryButton
                                size="lg"
                                onClick={handlePublish}
                                disabled={createPost.isPending}
                                className="px-8 sm:px-10 shadow-lg w-full sm:w-auto justify-center"
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

                        </div>{/* close inner px-6 div */}
                    </div>{/* close card div */}
                </ScrollReveal>
            </div>
        </div>
    );
};

export default CommunityWrite;
