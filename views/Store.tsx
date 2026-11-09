'use client';

import CollectionBrowser from '@/views/essentials/CollectionBrowser';

export default function Store() {
    return (
        <div className="pt-4 lg:pt-8 pb-16 min-h-screen">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8 xl:px-12">
                <header className="mb-4 flex flex-wrap items-start justify-between gap-4 sm:mb-6">
                    <div>
                        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-playful-text">Store</h1>
                        <p className="mt-2 max-w-xl text-sm md:text-base leading-relaxed text-gray-600">
                            Food, toys and everyday care for cats and dogs.
                        </p>
                    </div>
                </header>
                <CollectionBrowser />
            </div>
        </div>
    );
}
