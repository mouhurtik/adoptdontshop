export interface Product {
    id: number;
    name: string;
    category: string;
    petType: string;
    price: string;
    image: string;
    description: string;
    badge?: string;
}

export const PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Premium Dog Food",
        category: "Food",
        petType: "dog",
        price: "$45.99",
        image: "https://images.unsplash.com/photo-1589924691195-41432c84c161?q=80&w=2070&auto=format&fit=crop",
        description: "High-protein, grain-free formula for active dogs.",
        badge: "Best Seller"
    },
    {
        id: 2,
        name: "Indestructible Chew Toy",
        category: "Toys",
        petType: "dog",
        price: "$15.99",
        image: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?q=80&w=2070&auto=format&fit=crop",
        description: "Durable rubber toy for aggressive chewers.",
        badge: "New"
    },
    {
        id: 3,
        name: "Orthopedic Dog Bed",
        category: "Accessories",
        petType: "dog",
        price: "$89.99",
        image: "https://images.unsplash.com/photo-1591946614720-90a587da4a36?q=80&w=2574&auto=format&fit=crop",
        description: "Memory foam bed for joint support and comfort.",
    },
    {
        id: 4,
        name: "Gourmet Cat Treats",
        category: "Food",
        petType: "cat",
        price: "$12.99",
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=2688&auto=format&fit=crop",
        description: "Salmon infused treats that cats love.",
        badge: "Staff Pick"
    },
    {
        id: 5,
        name: "Interactive Laser Toy",
        category: "Toys",
        petType: "cat",
        price: "$24.99",
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=2070&auto=format&fit=crop",
        description: "Automatic laser toy to keep your cat entertained.",
    },
    {
        id: 6,
        name: "Modern Cat Tower",
        category: "Accessories",
        petType: "cat",
        price: "$129.99",
        image: "https://images.unsplash.com/photo-1545249390-6bdfa286032f?q=80&w=2588&auto=format&fit=crop",
        description: "Stylish condensed wood cat tree.",
    },
    {
        id: 7,
        name: "Tropical Fish Flakes",
        category: "Food",
        petType: "other",
        price: "$9.99",
        image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?q=80&w=2069&auto=format&fit=crop",
        description: "Nutrient-rich food for vibrant community fish.",
    },
    {
        id: 8,
        name: "Hamster Wheel",
        category: "Toys",
        petType: "other",
        price: "$18.50",
        image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=2071&auto=format&fit=crop",
        description: "Silent spinner for small pets.",
    },
];
