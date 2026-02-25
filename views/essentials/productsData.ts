export interface Product {
    id: number;
    name: string;
    category: string;
    petType: string;
    price: string;
    image: string;
    description: string;
    badge?: string;
    affiliateLink?: string;
}

export const PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Premium Dog Food",
        category: "Food",
        petType: "dog",
        price: "View on Amazon",
        image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=2070&auto=format&fit=crop",
        description: "High-protein, grain-free formula for active dogs.",
        badge: "Best Seller",
        affiliateLink: "https://amzn.to/44VAWBs"
    },
    {
        id: 2,
        name: "Indestructible Chew Toys",
        category: "Toys",
        petType: "dog",
        price: "View on Amazon",
        image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2070&auto=format&fit=crop",
        description: "Durable rubber toys for aggressive chewers.",
        badge: "New",
        affiliateLink: "https://amzn.to/4rGdwtx"
    },
    {
        id: 3,
        name: "Essential Dog Accessories",
        category: "Accessories",
        petType: "dog",
        price: "View on Amazon",
        image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=2574&auto=format&fit=crop",
        description: "Beds, leashes, and accessories for joint support and comfort.",
        affiliateLink: "https://amzn.to/4pV8QP4"
    },
    {
        id: 4,
        name: "Gourmet Cat Food",
        category: "Food",
        petType: "cat",
        price: "View on Amazon",
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop",
        description: "Nutritious and delicious food that cats love.",
        badge: "Staff Pick",
        affiliateLink: "https://amzn.to/4pXFpvN"
    },
    {
        id: 5,
        name: "Interactive Cat Toys",
        category: "Toys",
        petType: "cat",
        price: "View on Amazon",
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2070&auto=format&fit=crop",
        description: "Automatic toys to keep your cat entertained.",
        affiliateLink: "https://amzn.to/48JvNxz"
    },
    {
        id: 6,
        name: "Modern Cat Accessories",
        category: "Accessories",
        petType: "cat",
        price: "View on Amazon",
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=2588&auto=format&fit=crop",
        description: "Stylish condensed wood cat trees and accessories.",
        affiliateLink: "https://amzn.to/4iIxfER"
    }
];
