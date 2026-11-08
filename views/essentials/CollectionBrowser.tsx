'use client';

import { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { ArrowRight, ArrowUpRight, Cat, Dog, CircleDot, Droplets, Soup, Package, Pipette, ShoppingBag, Waves } from 'lucide-react';
import { trackAffiliateClick } from '@/lib/tracking';
import { AMAZON_COLLECTIONS, type AmazonCollection, type CollectionIcon, type PetType } from './collectionsData';
import styles from './CollectionBrowser.module.css';

const icons: Record<CollectionIcon, typeof Soup> = {
    'dry-food': Soup, 'wet-food': Droplets, toy: CircleDot,
    accessories: Package, 'spot-on': Pipette, fountain: Waves,
};

function CollectionLink({ collection, variant = 'care' }: { collection: AmazonCollection; variant?: 'food' | 'brand' | 'care' }) {
    const Icon = collection.icon ? icons[collection.icon] : null;
    const pet = collection.petType === 'cat' ? 'cats' : 'dogs';
    const label = variant === 'brand' ? collection.name.toLowerCase() : `${collection.name.toLowerCase()} for ${pet}`;
    return <a href={collection.affiliateLink} target="_blank" rel="sponsored noopener noreferrer"
        aria-label={`Browse ${label} on Amazon (opens in a new tab)`}
        onClick={() => trackAffiliateClick(collection)}
        className={`${styles.collection} ${styles[variant]}`}>
        {Icon && <span className={styles.collectionIcon}><Icon aria-hidden="true" strokeWidth={1.5} /></span>}
        <div className={styles.collectionCopy}>
            <h4>{collection.name}</h4>
            {variant !== 'brand' && <p>{collection.description}</p>}
            {variant === 'food' && <span className={styles.browseLabel}>Browse selection <ArrowRight aria-hidden="true" size={15} /></span>}
        </div>
        <ArrowUpRight aria-hidden="true" className={styles.outbound} strokeWidth={1.5} />
    </a>;
}

export default function CollectionBrowser({ defaultPet = 'cat' }: { defaultPet?: PetType }) {
    const [pet, setPet] = useState<PetType>(defaultPet);
    return <div className={styles.browser} data-pet={pet}>
        <div className={styles.disclosure}>
            <ShoppingBag aria-hidden="true" size={18} strokeWidth={1.5} />
            <p><span>Affiliate links</span> As an Amazon Associate I earn from qualifying purchases.</p>
        </div>
        <Tabs.Root value={pet} onValueChange={value => setPet(value as PetType)}>
            <Tabs.List className={styles.petTabs} aria-label="Shop by pet">
                {(['cat', 'dog'] as const).map(type => {
                    const Icon = type === 'cat' ? Cat : Dog;
                    return <Tabs.Trigger key={type} value={type} className={styles.petTab}>
                        <span className={styles.petIcon}><Icon aria-hidden="true" strokeWidth={1.4} /></span>
                        <span className={styles.petTabCopy}><span className={styles.petName}>{type === 'cat' ? 'Cats' : 'Dogs'}</span><span className={styles.petDescription}>{type === 'cat' ? 'Food, play & care' : 'Food & familiar brands'}</span></span>
                        <span aria-hidden="true" className={styles.tabMarker} />
                    </Tabs.Trigger>;
                })}
            </Tabs.List>
            {(['cat', 'dog'] as const).map(type => {
                const collections = AMAZON_COLLECTIONS.filter(collection => collection.petType === type);
                const care = collections.filter(collection => collection.group === 'care');
                return <Tabs.Content key={type} value={type} className={styles.panel}>
                    <div className={styles.panelHeading}><h2>For your {type}</h2><p>Each selection opens Amazon in a new tab.</p></div>
                    <div className={styles.topGrid}>
                        <section aria-label={`${type} food`}>
                            <div className={styles.sectionHeading}><h3>Food cupboard</h3><span>Dry & wet</span></div>
                            <div className={styles.foodGrid}>{collections.filter(collection => collection.group === 'food').map(collection => <CollectionLink key={collection.id} collection={collection} variant="food" />)}</div>
                        </section>
                        <section className={styles.brands} aria-label={`${type} food brands`}>
                            <div className={styles.sectionHeading}><h3>Browse by brand</h3></div>
                            <div className={styles.brandList}>{collections.filter(collection => collection.group === 'brand').map(collection => <CollectionLink key={collection.id} collection={collection} variant="brand" />)}</div>
                        </section>
                    </div>
                    {care.length > 0 && <section className={styles.careSection} aria-label="Cat play and care">
                        <div className={styles.sectionHeading}><h3>Play, comfort & care</h3></div>
                        <div className={styles.careGrid}>{care.map(collection => <CollectionLink key={collection.id} collection={collection} />)}</div>
                    </section>}
                </Tabs.Content>;
            })}
        </Tabs.Root>
        <div className={styles.howItWorks}>
            <div><h2>A few things to know</h2><p>These links open Amazon search selections, where you can compare products, prices and sellers. Brands shown here are browsing categories.</p></div>
            <div><p>Choose products suited to your pet. Orders, delivery and returns are handled by Amazon and the seller.</p><p>Store visits and purchases do not earn PawCoins.</p></div>
        </div>
    </div>;
}
