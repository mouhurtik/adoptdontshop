import { redirect } from 'next/navigation';

// This page exists only as a fallback for direct server-side navigation.
// The primary redirect is handled in next.config.mjs for maximum performance.
export default function CommunityPage() {
    redirect('/');
}
