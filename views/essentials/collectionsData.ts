export type PetType = 'cat' | 'dog';
export type CollectionGroup = 'food' | 'brand' | 'care';
export type CollectionIcon = 'dry-food' | 'wet-food' | 'toy' | 'accessories' | 'spot-on' | 'fountain';

export interface AmazonCollection {
    id: string;
    name: string;
    petType: PetType;
    group: CollectionGroup;
    description: string;
    affiliateLink: string;
    icon?: CollectionIcon;
}

// Publisher-supplied URLs, preserved exactly. Each resolves to tagged Amazon.in search results.
// These are category/brand browsing links, not individual products or official brand stores.
export const AMAZON_COLLECTIONS: readonly AmazonCollection[] = [
    { id: 'cat-food-dry', name: 'Dry food', petType: 'cat', group: 'food', description: 'Explore dry food for cats.', icon: 'dry-food', affiliateLink: 'https://link.amazon/B0brLSDMX' },
    { id: 'cat-food-wet', name: 'Wet food', petType: 'cat', group: 'food', description: 'Explore wet food for cats.', icon: 'wet-food', affiliateLink: 'https://link.amazon/B04zx4Ihl' },
    { id: 'cat-friskies', name: 'Friskies', petType: 'cat', group: 'brand', description: 'Browse Friskies on Amazon.', affiliateLink: 'https://link.amazon/B0heZ2g0D' },
    { id: 'cat-whiskas', name: 'Whiskas', petType: 'cat', group: 'brand', description: 'Browse Whiskas on Amazon.', affiliateLink: 'https://link.amazon/B0jl3KssC' },
    { id: 'cat-sheba', name: 'Sheba', petType: 'cat', group: 'brand', description: 'Browse Sheba on Amazon.', affiliateLink: 'https://link.amazon/B0eb40t7j' },
    { id: 'cat-toys', name: 'Toys', petType: 'cat', group: 'care', description: 'For chasing, pouncing and play.', icon: 'toy', affiliateLink: 'https://link.amazon/B0cJ2Y2Cl' },
    { id: 'cat-accessories', name: 'Accessories', petType: 'cat', group: 'care', description: 'Everyday extras for your cat.', icon: 'accessories', affiliateLink: 'https://link.amazon/B074X7HiS' },
    { id: 'cat-spot-on', name: 'Spot-on care', petType: 'cat', group: 'care', description: 'Browse cat spot-on products.', icon: 'spot-on', affiliateLink: 'https://link.amazon/B038Tmk78' },
    { id: 'cat-fountain', name: 'Water fountains', petType: 'cat', group: 'care', description: 'Explore drinking fountains.', icon: 'fountain', affiliateLink: 'https://link.amazon/B077yPOdr' },
    { id: 'dog-food-dry', name: 'Dry food', petType: 'dog', group: 'food', description: 'Explore dry food for dogs.', icon: 'dry-food', affiliateLink: 'https://link.amazon/B00xz6ND5' },
    { id: 'dog-food-wet', name: 'Wet food', petType: 'dog', group: 'food', description: 'Explore wet food for dogs.', icon: 'wet-food', affiliateLink: 'https://link.amazon/B02WtXzwA' },
    { id: 'dog-pedigree', name: 'Pedigree', petType: 'dog', group: 'brand', description: 'Browse Pedigree on Amazon.', affiliateLink: 'https://link.amazon/B01ZyiMTj' },
    { id: 'dog-royal-canin', name: 'Royal Canin', petType: 'dog', group: 'brand', description: 'Browse Royal Canin on Amazon.', affiliateLink: 'https://link.amazon/B0gCKvTcs' },
];
