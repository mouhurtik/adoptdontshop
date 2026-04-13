'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Camera, Lock, Globe } from 'lucide-react';
import PrimaryButton from '@/components/ui/PrimaryButton';
import { useCreateGroup, GROUP_CATEGORIES } from '@/hooks/useGroups';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase/client';

const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default function CreateGroupPage() {
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuth();
    const createGroup = useCreateGroup();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('general');
    const [isPrivate, setIsPrivate] = useState(false);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [error, setError] = useState('');

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) { setError('Group name is required'); return; }
        if (!user) { setError('You must be logged in'); return; }

        try {
            let avatar_url: string | undefined;

            // Upload avatar if provided
            if (avatarFile) {
                const ext = avatarFile.name.split('.').pop();
                const path = `group-avatars/${Date.now()}.${ext}`;
                const { error: uploadError } = await supabase.storage
                    .from('community')
                    .upload(path, avatarFile);

                if (!uploadError) {
                    const { data: urlData } = supabase.storage.from('community').getPublicUrl(path);
                    avatar_url = urlData?.publicUrl;
                }
            }

            const group = await createGroup.mutateAsync({
                name: name.trim(),
                slug: generateSlug(name.trim()),
                description: description.trim() || undefined,
                category,
                is_private: isPrivate,
                avatar_url,
            });

            router.push(`/groups/${group.slug}`);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'Failed to create group';
            if (message.includes('duplicate')) {
                setError('A group with this name already exists');
            } else {
                setError(message);
            }
        }
    };

    if (authLoading) return <div className="min-h-screen pt-32 bg-playful-cream" />;
    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="pt-6 lg:pt-32 pb-16 bg-playful-cream min-h-screen">
            <div className="container mx-auto px-6 max-w-2xl">
                {/* Back link */}
                <Link
                    href="/groups"
                    className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-playful-text transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Groups
                </Link>

                <div className="bg-white rounded-[2rem] shadow-soft p-8 md:p-12">
                    <h1 className="text-3xl font-heading font-black text-playful-text mb-2">
                        Create a Group
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Start a community for pet lovers to connect and share.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar */}
                        <div className="flex items-center gap-4">
                            <label className="relative cursor-pointer group">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 group-hover:border-playful-teal transition-colors flex items-center justify-center">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <Camera className="w-6 h-6 text-gray-400 group-hover:text-playful-teal transition-colors" />
                                    )}
                                </div>
                                <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                            </label>
                            <div>
                                <p className="font-bold text-playful-text text-sm">Group Avatar</p>
                                <p className="text-xs text-gray-400">Click to upload (optional)</p>
                            </div>
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">
                                Group Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                placeholder="e.g., Pune Pet Lovers"
                                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium placeholder:text-gray-400 focus:outline-none focus:border-playful-teal transition-colors"
                                maxLength={60}
                            />
                            {name && (
                                <p className="text-xs text-gray-400 mt-1">
                                    URL: /groups/{generateSlug(name)}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="What is this group about?"
                                rows={3}
                                className="w-full px-5 py-3.5 bg-gray-50 border-2 border-gray-100 rounded-xl font-medium placeholder:text-gray-400 focus:outline-none focus:border-playful-teal transition-colors resize-none"
                                maxLength={500}
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-2">
                                Category
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {GROUP_CATEGORIES.filter(c => c.value !== 'all').map(cat => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setCategory(cat.value)}
                                        className={`text-sm font-bold px-4 py-2 rounded-full transition-all ${
                                            category === cat.value
                                                ? 'bg-playful-teal text-white shadow-md'
                                                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                        }`}
                                    >
                                        {cat.emoji} {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Privacy */}
                        <div>
                            <label className="block text-sm font-bold text-gray-600 mb-3">
                                Privacy
                            </label>
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsPrivate(false)}
                                    className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                        !isPrivate ? 'border-playful-teal bg-playful-teal/5' : 'border-gray-100 hover:border-gray-200'
                                    }`}
                                >
                                    <Globe className={`w-5 h-5 ${!isPrivate ? 'text-playful-teal' : 'text-gray-400'}`} />
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-playful-text">Public</p>
                                        <p className="text-xs text-gray-400">Anyone can find and join</p>
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsPrivate(true)}
                                    className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                                        isPrivate ? 'border-playful-teal bg-playful-teal/5' : 'border-gray-100 hover:border-gray-200'
                                    }`}
                                >
                                    <Lock className={`w-5 h-5 ${isPrivate ? 'text-playful-teal' : 'text-gray-400'}`} />
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-playful-text">Private</p>
                                        <p className="text-xs text-gray-400">Only members can see posts</p>
                                    </div>
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="text-sm text-red-500 font-medium bg-red-50 py-3 px-4 rounded-xl">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <PrimaryButton
                            size="lg"
                            className="w-full text-lg shadow-lg hover:shadow-xl"
                            disabled={createGroup.isPending}
                        >
                            {createGroup.isPending ? 'Creating...' : 'Create Group'}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
