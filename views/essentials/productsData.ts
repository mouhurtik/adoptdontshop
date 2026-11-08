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
        name: "Dog Food",
        category: "Food",
        petType: "dog",
        price: "Links being updated",
        image: "/images/store/dog-food.webp",
        description: "Food options for dogs at different life stages. Check individual dietary needs with your veterinarian.",
    },
    {
        id: 2,
        name: "Dog Toys",
        category: "Toys",
        petType: "dog",
        price: "Links being updated",
        image: "/images/store/dog-toys.webp",
        description: "Explore toys suited to your dog’s size and supervised play.",
    },
    {
        id: 3,
        name: "Dog Accessories",
        category: "Accessories",
        petType: "dog",
        price: "Links being updated",
        image: "/images/store/dog-accessories.webp",
        description: "Beds, leads and everyday essentials to help prepare your home.",
    },
    {
        id: 4,
        name: "Cat Food",
        category: "Food",
        petType: "cat",
        price: "Links being updated",
        image: "/images/store/cat-food.webp",
        description: "Compare food options suited to your cat’s age and individual needs.",
    },
    {
        id: 5,
        name: "Cat Toys",
        category: "Toys",
        petType: "cat",
        price: "Links being updated",
        image: "/images/store/cat-toys.webp",
        description: "Ideas for supervised play and enrichment for cats.",
    },
    {
        id: 6,
        name: "Cat Accessories",
        category: "Accessories",
        petType: "cat",
        price: "Links being updated",
        image: "/images/store/cat-accessories.webp",
        description: "Everyday essentials such as scratchers, resting spaces and litter supplies.",
}
];
