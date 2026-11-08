import Messages from '@/views/Messages';
import { Suspense } from 'react';

export default function MessagesPage() {
    return <Suspense fallback={<p className="p-8 text-gray-600">Loading messages…</p>}><Messages /></Suspense>;
}
