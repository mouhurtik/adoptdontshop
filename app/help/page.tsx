import type { Metadata } from 'next';
import Link from 'next/link';
import { HELP_QUESTIONS } from '@/lib/help-content';
import { breadcrumbSchema, PUBLIC_CONTENT_REVIEWED, PUBLIC_CONTENT_REVIEWED_LABEL, serializeJsonLd, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Help & FAQs',
    description: 'Learn how pet adoption, community posts, moderation, reporting and privacy choices work on AdoptDontShop.',
    alternates: { canonical: '/help' },
};

export default function HelpPage() {
    const schema = {
        '@context': 'https://schema.org', '@type': 'FAQPage',
        '@id': `${SITE_URL}/help`, dateModified: PUBLIC_CONTENT_REVIEWED,
        publisher: { '@id': `${SITE_URL}/#organization` },
        mainEntity: HELP_QUESTIONS.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })),
    };
    return (
        <article className="mx-auto max-w-4xl px-4 py-8 text-gray-600 lg:px-8 lg:py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Help & FAQs', path: '/help' }])) }} />
            <p className="mb-3 text-sm"><Link href="/" className="text-playful-teal-text underline">Home</Link> / Help</p>
            <h1 className="font-heading text-3xl font-bold text-playful-text lg:text-4xl">Help with adoption and the community</h1>
            <p className="mt-4 text-lg leading-relaxed">Practical answers about finding a pet, sharing stories and keeping the community useful. For the platform&apos;s story, <Link href="/about" className="text-playful-teal-text underline">meet the founder</Link>.</p>
            <p className="mt-3 text-sm">Maintained by the <Link href="/about#founder" rel="author" className="text-playful-teal-text underline">AdoptDontShop team</Link>. Updated <time dateTime={PUBLIC_CONTENT_REVIEWED}>{PUBLIC_CONTENT_REVIEWED_LABEL}</time>.</p>
            <section className="mt-8 rounded-2xl border border-playful-text/10 bg-white p-6 lg:p-8">
                <h2 className="font-heading text-2xl font-bold text-playful-text">How do I get started?</h2>
                <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed">
                    <li><Link href="/browse" className="text-playful-teal-text underline">Browse adoption listings</Link> and read the details before contacting a caregiver.</li>
                    <li>Ask questions, verify available records, and decide whether the animal&apos;s needs fit your home.</li>
                    <li><Link href="/explore" className="text-playful-teal-text underline">Explore member stories</Link> or sign in to participate. Read the <Link href="/terms" className="text-playful-teal-text underline">community terms</Link> before posting.</li>
                </ol>
            </section>
            <section className="mt-8 space-y-7" aria-label="Frequently asked questions">
                {HELP_QUESTIONS.map(item => <section key={item.question}><h2 className="font-heading text-xl font-bold text-playful-text">{item.question}</h2><p className="mt-2 leading-relaxed">{item.answer}</p></section>)}
            </section>
            <section className="mt-10 border-t border-playful-text/10 pt-6">
                <h2 className="font-heading text-xl font-bold text-playful-text">Where can I read independent welfare guidance?</h2>
                <p className="mt-3 leading-relaxed">The <a href="https://awbi.gov.in/" className="text-playful-teal-text underline" rel="noopener noreferrer" target="_blank">Animal Welfare Board of India</a> publishes official animal-welfare information. The <a href="https://www.rspca.org.uk/findapet/adopt" className="text-playful-teal-text underline" rel="noopener noreferrer" target="_blank">RSPCA adoption guide</a> offers general preparation advice; its own adoption process is UK-specific. These organisations do not endorse this platform.</p>
                <p className="mt-3 leading-relaxed">For account or content concerns, <Link href="/contact" className="text-playful-teal-text underline">contact AdoptDontShop</Link>. Read the <Link href="/privacy-policy" className="text-playful-teal-text underline">Privacy Policy</Link> for data and tracking choices.</p>
            </section>
        </article>
    );
}
