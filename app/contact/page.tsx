import type { Metadata } from 'next';
import Link from 'next/link';
import { breadcrumbSchema, CONTACT_EMAIL, OFFICIAL_SOCIALS, PUBLIC_CONTENT_REVIEWED, PUBLIC_CONTENT_REVIEWED_LABEL, serializeJsonLd, SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Contact & official profiles',
    description: 'Contact AdoptDontShop about accounts, community content or privacy, and find the platform’s official social profiles.',
    alternates: { canonical: '/contact' },
};

export default function ContactPage() {
    return (
        <article className="mx-auto max-w-3xl px-4 py-8 text-gray-600 lg:px-8 lg:py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({ '@context': 'https://schema.org', '@type': 'ContactPage', url: `${SITE_URL}/contact`, dateModified: PUBLIC_CONTENT_REVIEWED, about: { '@id': `${SITE_URL}/#organization` } }) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }])) }} />
            <h1 className="font-heading text-3xl font-bold text-playful-text">Contact AdoptDontShop</h1>
            <p className="mt-4 leading-relaxed">The founder currently handles platform support and moderation. For an account issue, a content concern or a privacy request, email <a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-playful-teal-text underline">{CONTACT_EMAIL}</a>.</p>
            <h2 className="mt-8 font-heading text-xl font-bold text-playful-text">How can I report content?</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 leading-relaxed">
                <li>Include the link to the post, listing or profile and describe the concern.</li>
                <li>Send sensitive details privately. Do not publish identity documents or precise animal locations.</li>
                <li>For an urgent welfare concern, contact a suitable local rescue or authority directly; this is not an emergency response service.</li>
            </ul>
            <h2 className="mt-8 font-heading text-xl font-bold text-playful-text">Which social profiles are official?</h2>
            <ul className="mt-3 space-y-2">{OFFICIAL_SOCIALS.map(social => <li key={social.name}><a href={social.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-playful-teal-text underline">AdoptDontShop on {social.name}</a></li>)}</ul>
            <p className="mt-6 leading-relaxed"><Link href="/about#founder" className="text-playful-teal-text underline">Meet founder Mouhurtik Ray</Link>, find answers in <Link href="/help" className="text-playful-teal-text underline">Help &amp; FAQs</Link>, or read the <Link href="/privacy-policy" className="text-playful-teal-text underline">Privacy Policy</Link>.</p>
            <p className="mt-6 text-sm">Updated <time dateTime={PUBLIC_CONTENT_REVIEWED}>{PUBLIC_CONTENT_REVIEWED_LABEL}</time>.</p>
        </article>
    );
}
