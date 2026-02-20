'use client';

import { useParams } from 'next/navigation';
import CommunityPostDetail from '@/views/CommunityPostDetail';

export default function CommunityPostPage() {
    const params = useParams();
    const slug = params.slug as string;

    return <CommunityPostDetail slug={slug} />;
}
