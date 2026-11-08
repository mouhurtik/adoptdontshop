'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { ArrowUpRight, Cat, Dog, ShoppingBag } from 'lucide-react';
import { trackAffiliateClick } from '@/lib/tracking';
import { AMAZON_COLLECTIONS, type AmazonCollection, type PetType } from './collectionsData';
import styles from './CollectionBrowser.module.css';

type ShopFilter = 'all' | PetType;
const filters = [{ value: 'all', label: 'All' }, { value: 'cat', label: 'Cats' }, { value: 'dog', label: 'Dogs' }] as const;
const displayOrder = ['cat-food-dry', 'dog-food-dry', 'cat-food-wet', 'dog-food-wet', 'cat-friskies', 'cat-whiskas', 'cat-sheba', 'dog-pedigree', 'dog-royal-canin', 'cat-toys', 'cat-accessories', 'cat-spot-on', 'cat-fountain'];
const sortedCollections = [...AMAZON_COLLECTIONS].sort((a, b) => displayOrder.indexOf(a.id) - displayOrder.indexOf(b.id));

function CategoryArt({ collection }: { collection: AmazonCollection }) {
    const Pet = collection.petType === 'cat' ? Cat : Dog;
    if (collection.group === 'brand') return <div className={styles.brandArt} data-brand={collection.id} aria-hidden="true"><span>{collection.name}</span><small>Food & favourites</small></div>;
    if (collection.icon === 'dry-food') return <div className={styles.drawnArt} data-pet={collection.petType} aria-hidden="true">
        <svg viewBox="0 0 240 180" fill="none"><ellipse cx="122" cy="158" rx="72" ry="9" fill="currentColor" opacity=".09" /><path d="M70 30h94l9 119c-34 9-69 9-112 0L70 30Z" fill="currentColor" opacity=".13" /><path d="M76 31h82l7 112c-30 7-57 7-96 0L76 31Z" stroke="currentColor" strokeWidth="2" /><path d="M79 42h76M82 123h69" stroke="currentColor" strokeWidth="2" opacity=".45" /><circle cx="183" cy="147" r="7" fill="currentColor" opacity=".5" /><circle cx="198" cy="153" r="5" fill="currentColor" opacity=".3" /><circle cx="173" cy="157" r="4" fill="currentColor" opacity=".35" /></svg>
        <Pet className={styles.bagPet} strokeWidth={1.3} />
    </div>;
    if (collection.icon === 'spot-on') return <div className={styles.drawnArt} aria-hidden="true"><svg viewBox="0 0 240 180" fill="none"><ellipse cx="121" cy="155" rx="67" ry="8" fill="currentColor" opacity=".09" /><rect x="67" y="59" width="69" height="90" rx="13" fill="currentColor" opacity=".15" /><rect x="67" y="59" width="69" height="90" rx="13" stroke="currentColor" strokeWidth="2" /><path d="M82 58V39h39v19M83 82h37M83 120h37M169 40l15 6-27 77-15-6 27-77ZM145 128l-5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M102 92c-12 14-9 20 0 20s12-6 0-20Z" fill="currentColor" opacity=".5" /></svg></div>;
    if (collection.icon === 'fountain') return <div className={styles.drawnArt} aria-hidden="true"><svg viewBox="0 0 240 180" fill="none"><ellipse cx="120" cy="154" rx="75" ry="9" fill="currentColor" opacity=".09" /><path d="M55 105h130l-13 39c-29 9-72 9-104 0l-13-39Z" fill="currentColor" opacity=".15" /><ellipse cx="120" cy="105" rx="65" ry="20" stroke="currentColor" strokeWidth="2" /><path d="M55 105l13 39c32 9 75 9 104 0l13-39M120 93V58c0-17 23-17 23 0v5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /><path d="M143 74v13M132 100c-9-4-22-4-31 0M95 109c15 7 34 7 49 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".5" /></svg></div>;
    const image = collection.icon === 'toy' ? '/images/store/cat-toys.webp' : collection.icon === 'accessories' ? '/images/store/cat-accessories.webp' : `/images/store/${collection.petType}-food.webp`;
    return <img src={image} alt="" width={600} height={600} loading="lazy" decoding="async" className={styles.photo} />;
}

function ProductCard({ collection }: { collection: AmazonCollection }) {
    const pet = collection.petType === 'cat' ? 'Cat' : 'Dog';
    const title = collection.group === 'brand' ? collection.name : `${pet} ${collection.name.toLowerCase()}`;
    return <a href={collection.affiliateLink} target="_blank" rel="sponsored noopener noreferrer" aria-label={`Shop ${title.toLowerCase()} on Amazon (opens in a new tab)`}
        onClick={() => trackAffiliateClick(collection)} className={styles.card}>
        <div className={styles.media}><CategoryArt collection={collection} /><span className={styles.petBadge}>{pet}</span></div>
        <div className={styles.cardBody}>
            <span className={styles.category}>{collection.group === 'food' ? 'Food' : collection.group === 'brand' ? 'Brand selection' : 'Play & care'}</span>
            <h3>{title}</h3><p>{collection.description}</p>
            <span className={styles.cardAction}>Shop on Amazon <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.6} /></span>
        </div>
    </a>;
}

export default function CollectionBrowser({ defaultPet = 'all' }: { defaultPet?: ShopFilter }) {
    const [filter, setFilter] = useState<ShopFilter>(defaultPet);
    return <div className={styles.browser}>
        <div className={styles.disclosure}><ShoppingBag aria-hidden="true" size={17} strokeWidth={1.5} /><p><span>Affiliate links</span> As an Amazon Associate I earn from qualifying purchases.</p></div>
        <Tabs.Root value={filter} onValueChange={value => setFilter(value as ShopFilter)}>
            <div className={styles.toolbar}><Tabs.List className={styles.tabs} aria-label="Shop by pet">
                {filters.map(({ value, label }) => <Tabs.Trigger key={value} value={value} className={styles.tab} aria-label={label}>{label}<span aria-hidden="true">{value === 'all' ? AMAZON_COLLECTIONS.length : AMAZON_COLLECTIONS.filter(item => item.petType === value).length}</span></Tabs.Trigger>)}
            </Tabs.List></div>
            {filters.map(({ value, label }) => <Tabs.Content key={value} value={value} className={styles.panel}>
                <h2 className="sr-only">{label === 'All' ? 'All pet essentials' : `${label} essentials`}</h2>
                <div className={styles.productGrid}>{sortedCollections.filter(item => value === 'all' || item.petType === value).map(collection => <ProductCard key={collection.id} collection={collection} />)}</div>
            </Tabs.Content>)}
        </Tabs.Root>
        <p className={styles.footnote}>Choose from the selection on Amazon. Prices, orders and delivery are handled there. Store visits and purchases do not earn PawCoins.</p>
    </div>;
}
