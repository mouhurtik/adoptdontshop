'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { synchronizeTracking, TRACKING_CHANGED_EVENT, TRACKING_STORAGE_KEY } from '@/lib/tracking';

export default function OptionalTracking() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    useEffect(() => {
        const sync = () => synchronizeTracking(pathname);
        const onStorage = (event: StorageEvent) => { if (event.key === TRACKING_STORAGE_KEY) sync(); };
        sync();
        window.addEventListener(TRACKING_CHANGED_EVENT, sync);
        window.addEventListener('storage', onStorage);
        return () => {
            window.removeEventListener(TRACKING_CHANGED_EVENT, sync);
            window.removeEventListener('storage', onStorage);
        };
    }, [pathname, searchParams]);
    return null;
}
