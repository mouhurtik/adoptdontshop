'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import AdminGuard from '../AdminGuard';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, ExternalLink, RefreshCw, ShoppingBag, Eye, EyeOff } from 'lucide-react';
import type { StoreProduct } from '@/hooks/useShop';

export default function AdminShopPage() {
    const [products, setProducts] = useState<StoreProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Partial<StoreProduct> | null>(null);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('store_products')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) {
            toast.error('Failed to load store products');
        } else {
            setProducts((data || []) as StoreProduct[]);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct?.name || !editingProduct?.affiliate_url) {
            toast.error('Name and affiliate URL are required');
            return;
        }

        if (editingProduct.id) {
            // Update
            const { error } = await supabase
                .from('store_products')
                .update({
                    name: editingProduct.name,
                    description: editingProduct.description || null,
                    category: (editingProduct.category || 'accessories') as "food" | "toys" | "accessories" | "health" | "grooming" | "other",
                    pet_type: (editingProduct.pet_type || 'both') as "dog" | "cat" | "both",
                    price_display: editingProduct.price_display || null,
                    original_price: editingProduct.original_price || null,
                    affiliate_url: editingProduct.affiliate_url,
                    image_url: editingProduct.image_url || null,
                    badge: editingProduct.badge || null,
                    pawcoins_reward: editingProduct.pawcoins_reward || 1,
                    sort_order: editingProduct.sort_order || 0,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', editingProduct.id);

            if (error) {
                toast.error('Failed to update product');
            } else {
                toast.success('Product updated successfully');
                setIsEditing(false);
                setEditingProduct(null);
                fetchProducts();
            }
        } else {
            // Insert
            const { error } = await supabase
                .from('store_products')
                .insert({
                    name: editingProduct.name,
                    description: editingProduct.description || null,
                    category: (editingProduct.category || 'accessories') as "food" | "toys" | "accessories" | "health" | "grooming" | "other",
                    pet_type: (editingProduct.pet_type || 'both') as "dog" | "cat" | "both",
                    price_display: editingProduct.price_display || null,
                    original_price: editingProduct.original_price || null,
                    affiliate_url: editingProduct.affiliate_url,
                    image_url: editingProduct.image_url || null,
                    badge: editingProduct.badge || null,
                    pawcoins_reward: editingProduct.pawcoins_reward || 1,
                    sort_order: editingProduct.sort_order || 0,
                });

            if (error) {
                toast.error('Failed to create product');
            } else {
                toast.success('Product created successfully');
                setIsEditing(false);
                setEditingProduct(null);
                fetchProducts();
            }
        }
    };

    const toggleActive = async (product: StoreProduct) => {
        const nextState = !product.is_active;
        const { error } = await supabase
            .from('store_products')
            .update({ is_active: nextState })
            .eq('id', product.id);

        if (error) {
            toast.error('Failed to update product state');
        } else {
            toast.success(`Product ${nextState ? 'activated' : 'hidden'}`);
            fetchProducts();
        }
    };

    const deleteProduct = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product?')) return;
        const { error } = await supabase
            .from('store_products')
            .delete()
            .eq('id', id);

        if (error) {
            toast.error('Failed to delete product');
        } else {
            toast.success('Product deleted');
            fetchProducts();
        }
    };

    return (
        <AdminGuard>
            <div className="p-6 md:p-10 max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-heading font-black text-gray-900 flex items-center gap-2">
                            <ShoppingBag className="w-8 h-8 text-playful-coral" />
                            Store Products & Affiliate Links
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Manage products, categories, affiliate referral URLs, and PawCoins rewards.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchProducts}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 shadow-xs"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Refresh
                        </button>
                        <button
                            onClick={() => {
                                setEditingProduct({
                                    category: 'accessories',
                                    pet_type: 'both',
                                    pawcoins_reward: 5,
                                    sort_order: products.length + 1,
                                });
                                setIsEditing(true);
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-playful-coral text-white text-xs font-bold hover:bg-playful-coral/90 shadow-sm"
                        >
                            <Plus className="w-4 h-4" />
                            Add Product
                        </button>
                    </div>
                </div>

                {/* Edit / Add Modal */}
                {isEditing && editingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                        <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">
                                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
                            </h3>
                            <form onSubmit={handleSave} className="space-y-4 text-xs">
                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Product Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={editingProduct.name || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-gray-700 mb-1">Category</label>
                                        <select
                                            value={editingProduct.category || 'accessories'}
                                            onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as StoreProduct['category'] })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                                        >
                                            <option value="food">Food</option>
                                            <option value="toys">Toys</option>
                                            <option value="accessories">Accessories</option>
                                            <option value="health">Health</option>
                                            <option value="grooming">Grooming</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block font-bold text-gray-700 mb-1">Pet Type</label>
                                        <select
                                            value={editingProduct.pet_type || 'both'}
                                            onChange={e => setEditingProduct({ ...editingProduct, pet_type: e.target.value as StoreProduct['pet_type'] })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                                        >
                                            <option value="both">Both Dogs & Cats</option>
                                            <option value="dog">Dog</option>
                                            <option value="cat">Cat</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Affiliate Link URL *</label>
                                    <input
                                        type="url"
                                        required
                                        value={editingProduct.affiliate_url || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, affiliate_url: e.target.value })}
                                        placeholder="https://amzn.to/..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl font-mono"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-gray-700 mb-1">Display Price</label>
                                        <input
                                            type="text"
                                            value={editingProduct.price_display || ''}
                                            onChange={e => setEditingProduct({ ...editingProduct, price_display: e.target.value })}
                                            placeholder="e.g. ₹1,299 or View Deal"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-gray-700 mb-1">Original Price</label>
                                        <input
                                            type="text"
                                            value={editingProduct.original_price || ''}
                                            onChange={e => setEditingProduct({ ...editingProduct, original_price: e.target.value })}
                                            placeholder="e.g. ₹1,599"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Image URL</label>
                                    <input
                                        type="text"
                                        value={editingProduct.image_url || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, image_url: e.target.value })}
                                        placeholder="/images/store/dog-food.webp"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block font-bold text-gray-700 mb-1">Badge (Optional)</label>
                                        <input
                                            type="text"
                                            value={editingProduct.badge || ''}
                                            onChange={e => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                                            placeholder="Best Seller, Staff Pick"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-bold text-gray-700 mb-1">PawCoins Reward</label>
                                        <input
                                            type="number"
                                            value={editingProduct.pawcoins_reward || 1}
                                            onChange={e => setEditingProduct({ ...editingProduct, pawcoins_reward: parseInt(e.target.value) || 1 })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block font-bold text-gray-700 mb-1">Description</label>
                                    <textarea
                                        rows={3}
                                        value={editingProduct.description || ''}
                                        onChange={e => setEditingProduct({ ...editingProduct, description: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsEditing(false);
                                            setEditingProduct(null);
                                        }}
                                        className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-playful-coral text-white font-bold rounded-xl hover:bg-playful-coral/90"
                                    >
                                        Save Product
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Table */}
                <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
                    {loading ? (
                        <div className="p-12 text-center text-xs text-gray-400">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="p-12 text-center text-xs text-gray-400">No products found.</div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-bold tracking-wider">
                                    <tr>
                                        <th className="p-4">Product</th>
                                        <th className="p-4">Category</th>
                                        <th className="p-4">For</th>
                                        <th className="p-4">Price</th>
                                        <th className="p-4">PawCoins</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map(p => (
                                        <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    {p.image_url ? (
                                                        <img src={p.image_url} alt="" className="w-10 h-10 rounded-xl object-contain bg-gray-50 p-1 shrink-0" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">🛍️</div>
                                                    )}
                                                    <div>
                                                        <span className="font-bold text-gray-900 block">{p.name}</span>
                                                        {p.badge && (
                                                            <span className="text-[10px] text-amber-600 font-bold">{p.badge}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 capitalize font-semibold text-gray-600">{p.category}</td>
                                            <td className="p-4 capitalize text-gray-500">{p.pet_type}</td>
                                            <td className="p-4 font-bold text-gray-800">{p.price_display || '—'}</td>
                                            <td className="p-4 font-bold text-playful-coral">+{p.pawcoins_reward || 1}</td>
                                            <td className="p-4">
                                                <button
                                                    onClick={() => toggleActive(p)}
                                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                                        p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                                                    }`}
                                                >
                                                    {p.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                    <span>{p.is_active ? 'Active' : 'Hidden'}</span>
                                                </button>
                                            </td>
                                            <td className="p-4 text-right space-x-1">
                                                <a
                                                    href={p.affiliate_url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 inline-block"
                                                    title="Open Link"
                                                >
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                                <button
                                                    onClick={() => {
                                                        setEditingProduct(p);
                                                        setIsEditing(true);
                                                    }}
                                                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50"
                                                    title="Edit"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(p.id)}
                                                    className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </AdminGuard>
    );
}
