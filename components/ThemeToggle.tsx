'use client';

import { useSyncExternalStore } from 'react';
import { Moon, Sun } from 'lucide-react';
import { setTheme, subscribeTheme } from '@/lib/theme';

export default function ThemeToggle() {
    const dark = useSyncExternalStore(subscribeTheme, () => document.documentElement.classList.contains('dark'), () => false);
    const label = `Switch to ${dark ? 'light' : 'dark'} mode`;
    return (
        <button type="button" onClick={() => setTheme(dark ? 'light' : 'dark')} aria-label={label} title={label}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100">
            {dark ? <Sun aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} /> : <Moon aria-hidden="true" className="h-5 w-5" strokeWidth={1.5} />}
        </button>
    );
}
