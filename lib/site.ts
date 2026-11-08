export const SITE_URL = 'https://adoptdontshop.xyz';
export const SITE_DESCRIPTION = 'Find rescue pets for adoption in India, share pet-care stories, and connect with caregivers and animal lovers on AdoptDontShop.';
export const CONTACT_EMAIL = 'mouhurtikr@gmail.com';
// Change when this public copy is substantively reviewed, never on every build.
export const PUBLIC_CONTENT_REVIEWED = '2026-11-08';
export const PUBLIC_CONTENT_REVIEWED_LABEL = '8 November 2026';
export const OFFICIAL_SOCIALS = [
    { name: 'Facebook', url: 'https://www.facebook.com/adoptdontshopxyz' },
    { name: 'Instagram', url: 'https://www.instagram.com/adoptdontshop.xyz/' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/company/adoptdontshop-xyz/' },
] as const;

export function serializeJsonLd(value: unknown): string {
    return JSON.stringify(value).replace(/</g, '\\u003c');
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
    return {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem', position: index + 1, name: item.name,
            item: `${SITE_URL}${item.path}`,
        })),
    };
}
