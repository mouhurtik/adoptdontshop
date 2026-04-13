'use client';

import { useParams } from 'next/navigation';
import GroupDetail from '@/views/GroupDetail';

export default function GroupSlugPage() {
    const params = useParams();
    const slug = params?.slug as string;

    return <GroupDetail slug={slug} />;
}
