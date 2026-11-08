'use client';

import { useState } from 'react';
import ProductsSection from '@/views/essentials/ProductsSection';
import { PRODUCTS } from '@/views/essentials/productsData';

export default function Store() {
    const [category, setCategory] = useState('dog');
    return <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
        <h1 className="font-heading text-3xl font-bold text-playful-text">Store</h1>
        <p className="mt-2 text-gray-600">Practical essentials for the animals in your care.</p>
        <ProductsSection products={PRODUCTS} activeTab={category} onTabChange={setCategory} />
    </div>;
}
