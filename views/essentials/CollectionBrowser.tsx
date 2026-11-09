'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { ArrowUpRight, ShieldCheck, ShoppingBag } from 'lucide-react';
import { trackAffiliateClick } from '@/lib/tracking';
import { AMAZON_COLLECTIONS, type AmazonCollection, type PetType } from './collectionsData';
import styles from './CollectionBrowser.module.css';

type ShopFilter = 'all' | PetType;
const filters = [{ value: 'all', label: 'All' }, { value: 'cat', label: 'Cats' }, { value: 'dog', label: 'Dogs' }] as const;
const displayOrder = ['cat-food-dry', 'dog-food-dry', 'cat-food-wet', 'dog-food-wet', 'cat-friskies', 'cat-whiskas', 'cat-sheba', 'dog-pedigree', 'dog-royal-canin', 'cat-toys', 'cat-accessories', 'cat-spot-on', 'cat-fountain'];
const sortedCollections = [...AMAZON_COLLECTIONS].sort((a, b) => displayOrder.indexOf(a.id) - displayOrder.indexOf(b.id));

function CategoryArt({ collection }: { collection: AmazonCollection }) {
    const pet = collection.petType === 'cat' ? 'Cat' : 'Dog';
    return (
        <img
            src={collection.image}
            alt={`${collection.name} for ${pet.toLowerCase()}s`}
            width={600}
            height={450}
            loading="lazy"
            decoding="async"
            className={styles.photo}
        />
    );
}

function ProductCard({ collection }: { collection: AmazonCollection }) {
    const pet = collection.petType === 'cat' ? 'Cat' : 'Dog';
    const title = collection.group === 'brand' ? collection.name : `${pet} ${collection.name.toLowerCase()}`;
    return (
        <a
            href={collection.affiliateLink}
            target="_blank"
            rel="sponsored noopener noreferrer"
            aria-label={`Shop ${title.toLowerCase()} on Amazon (opens in a new tab)`}
            onClick={() => trackAffiliateClick(collection)}
            className={styles.card}
        >
            <div className={styles.media}>
                <CategoryArt collection={collection} />
                <span className={styles.petBadge}>{pet}</span>
            </div>
            <div className={styles.cardBody}>
                <span className={styles.category}>
                    {collection.group === 'food' ? 'Food' : collection.group === 'brand' ? 'Brand selection' : 'Play & care'}
                </span>
                <h3>{title}</h3>
                <p>{collection.description}</p>
                <span className={styles.cardAction}>
                    Shop on Amazon <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.6} />
                </span>
            </div>
        </a>
    );
}

export default function CollectionBrowser({ defaultPet = 'all' }: { defaultPet?: ShopFilter }) {
    const [filter, setFilter] = useState<ShopFilter>(defaultPet);
    return (
        <div className={styles.browser}>
            <div className={styles.disclosure}>
                <ShoppingBag aria-hidden="true" size={17} strokeWidth={1.5} />
                <p><span>Affiliate links</span> As an Amazon Associate I earn from qualifying purchases.</p>
            </div>
            <Tabs.Root value={filter} onValueChange={value => setFilter(value as ShopFilter)}>
                <div className={styles.toolbar}>
                    <Tabs.List className={styles.tabs} aria-label="Shop by pet">
                        {filters.map(({ value, label }) => (
                            <Tabs.Trigger key={value} value={value} className={styles.tab} aria-label={label}>
                                {label}
                                <span aria-hidden="true">
                                    {value === 'all' ? AMAZON_COLLECTIONS.length : AMAZON_COLLECTIONS.filter(item => item.petType === value).length}
                                </span>
                            </Tabs.Trigger>
                        ))}
                    </Tabs.List>
                </div>
                {filters.map(({ value, label }) => (
                    <Tabs.Content key={value} value={value} className={styles.panel}>
                        <h2 className="sr-only">{label === 'All' ? 'All pet essentials' : `${label} essentials`}</h2>
                        <div className={styles.productGrid}>
                            {sortedCollections.filter(item => value === 'all' || item.petType === value).map(collection => (
                                <ProductCard key={collection.id} collection={collection} />
                            ))}
                        </div>
                    </Tabs.Content>
                ))}
            </Tabs.Root>

            <div className={styles.affiliateNoticeCard}>
                <div className={styles.noticeIcon}>
                    <ShieldCheck aria-hidden="true" size={22} strokeWidth={1.75} />
                </div>
                <div className={styles.noticeBody}>
                    <h3 className={styles.noticeTitle}>Brand & Affiliate Notice</h3>
                    <p>
                        <strong>Brand Ownership:</strong> Product images, brand names, and logos displayed on this page (such as Whiskas®, Sheba®, Pedigree®, Royal Canin®, Friskies®, and others) belong to their respective copyright and trademark owners. They are displayed strictly for product identification and reference. AdoptDontShop is not the manufacturer, distributor, or official representative of these brands.
                    </p>
                    <p>
                        <strong>Affiliate Partnership:</strong> AdoptDontShop is an independent rescue and adoption community participating in the Amazon Associates Program. As an Amazon Associate, we earn from qualifying purchases at no extra cost to you. Choose from the selection on Amazon. Prices, orders, fulfillment, and delivery are handled there. Store visits and purchases do not earn PawCoins.
                    </p>
                </div>
            </div>
        </div>
    );
}
