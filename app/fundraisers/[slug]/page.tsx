import type { Metadata } from 'next';
import { createPublicSupabaseClient } from '@/lib/supabase/server';
import FundraiserDetail from '@/views/FundraiserDetail';

export const revalidate = 300;

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const supabase = createPublicSupabaseClient();
    if (!supabase) {
        return {
            title: 'Animal Fundraiser | AdoptDontShop',
            description: 'Support verified animal fundraisers on AdoptDontShop.',
            robots: { index: false, follow: true },
        };
    }

    const { data: fundraiser } = await supabase
        .from('fundraisers')
        .select('title, description_text, image_url, category, city')
        .eq('slug', slug)
        .maybeSingle();

    if (!fundraiser) {
        return {
            title: 'Animal Fundraiser | AdoptDontShop',
            description: 'Support verified animal fundraisers on AdoptDontShop.',
            robots: { index: false, follow: true },
        };
    }

    const title = `${fundraiser.title} | AdoptDontShop`;
    const description =
        fundraiser.description_text?.substring(0, 160) ||
        `Help fund ${fundraiser.title}. Every direct rupee goes straight to the animal caregiver.`;

    return {
        title,
        description,
        alternates: {
            canonical: `/fundraisers/${slug}`,
        },
        openGraph: {
            title,
            description,
            images: fundraiser.image_url ? [fundraiser.image_url] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: fundraiser.image_url ? [fundraiser.image_url] : [],
        },
    };
}

export default async function FundraiserPage({ params }: Props) {
    const { slug } = await params;
    return <FundraiserDetail slug={slug} />;
}
