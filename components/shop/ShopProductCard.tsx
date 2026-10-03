'use client';

import { ExternalLink, Sparkles, ShoppingBag } from 'lucide-react';
import type { StoreProduct } from '@/hooks/useShop';
import { useTrackAffiliateClick } from '@/hooks/useShop';

interface ShopProductCardProps {
    product: StoreProduct;
}

export default function ShopProductCard({ product }: ShopProductCardProps) {
    const trackClick = useTrackAffiliateClick();

    const handleClick = () => {
        trackClick.mutate(product);
    };

    return (
        <div className="bg-white rounded-[2rem] p-4 sm:p-5 border border-gray-100 shadow-soft hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
            <div>
                {/* Product Image & Badges */}
                <div className="relative h-48 w-full rounded-2xl bg-gray-50 overflow-hidden mb-4 border border-gray-100/80">
                    {product.image_url ? (
                        <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
                        </div>
                    )}

                    {/* Badge */}
                    {product.badge && (
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-xs">
                            {product.badge}
                        </span>
                    )}

                    {/* PawCoins reward */}
                    <span className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-playful-coral text-white shadow-xs">
                        <Sparkles className="w-2.5 h-2.5" />
                        +{product.pawcoins_reward || 1} Coins
                    </span>
                </div>

                {/* Pet Type & Category */}
                <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-gray-400">
                        {product.pet_type === 'dog' ? '🐕 For Dogs' : product.pet_type === 'cat' ? '🐱 For Cats' : '🐾 For All Pets'}
                    </span>
                    <span className="text-gray-300">·</span>
                    <span className="text-[10px] uppercase font-bold text-playful-coral">
                        {product.category}
                    </span>
                </div>

                {/* Product Name & Description */}
                <h3 className="font-heading font-black text-base text-playful-text line-clamp-1 mb-1 group-hover:text-playful-coral transition-colors">
                    {product.name}
                </h3>
                {product.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                        {product.description}
                    </p>
                )}
            </div>

            {/* Price & External Buy CTA */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <div>
                    <span className="text-xs font-bold text-gray-900 block">
                        {product.price_display || 'View Deal'}
                    </span>
                    {product.original_price && (
                        <span className="text-[10px] text-gray-400 line-through">
                            {product.original_price}
                        </span>
                    )}
                </div>

                <a
                    href={product.affiliate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleClick}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-playful-coral hover:bg-playful-coral/90 text-white text-xs font-bold transition-all shadow-xs"
                >
                    <span>View Product</span>
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>
        </div>
    );
}
