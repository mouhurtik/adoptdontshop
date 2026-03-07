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
        image: "/images/store/dog-food.webp",
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
        image: "/images/store/dog-toys.webp",
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
        image: "/images/store/dog-accessories.webp",
        description: "Beds, leashes, and accessories for joint support and comfort.",
        affiliateLink: "https://amzn.to/4pV8QP4"
    },
    {
        id: 4,
        name: "Gourmet Cat Food",
        category: "Food",
        petType: "cat",
        price: "View on Amazon",
        image: "/images/store/cat-food.webp",
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
        image: "/images/store/cat-toys.webp",
        description: "Automatic toys to keep your cat entertained.",
        affiliateLink: "https://amzn.to/48JvNxz"
    },
    {
        id: 6,
        name: "Modern Cat Accessories",
        category: "Accessories",
        petType: "cat",
        price: "View on Amazon",
        image: "/images/store/cat-accessories.webp",
        description: "Stylish condensed wood cat trees and accessories.",
        affiliateLink: "https://amzn.to/4iIxfER"
    }
];
