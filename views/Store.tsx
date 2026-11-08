'use client';

import CollectionBrowser from '@/views/essentials/CollectionBrowser';

export default function Store() {
    return <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-10 lg:py-9">
        <header className="mb-2 flex flex-wrap items-start justify-between gap-4 sm:mb-3">
            <div><h1 className="font-heading text-3xl font-bold tracking-tight text-playful-text">Store</h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-600">Food, toys and everyday care for cats and dogs.</p></div>
        </header>
        <CollectionBrowser />
    </div>;
}
