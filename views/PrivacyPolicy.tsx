import Link from 'next/link';
import { breadcrumbSchema, CONTACT_EMAIL, PUBLIC_CONTENT_REVIEWED, PUBLIC_CONTENT_REVIEWED_LABEL, serializeJsonLd, SITE_URL } from '@/lib/site';

export default function PrivacyPolicy() {
    return (
        <article className="mx-auto max-w-4xl px-4 py-8 text-gray-600 lg:px-8 lg:py-12">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({ '@context': 'https://schema.org', '@type': 'WebPage', name: 'AdoptDontShop Privacy Policy', url: `${SITE_URL}/privacy-policy`, dateModified: PUBLIC_CONTENT_REVIEWED }) }} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema([{ name: 'Home', path: '/' }, { name: 'Privacy policy', path: '/privacy-policy' }])) }} />
            <h1 className="font-heading text-3xl font-bold text-playful-text lg:text-4xl">Privacy policy</h1>
            <p className="mt-3 text-sm">Updated <time dateTime={PUBLIC_CONTENT_REVIEWED}>{PUBLIC_CONTENT_REVIEWED_LABEL}</time>.</p>
            <p className="mt-5 leading-relaxed">AdoptDontShop connects caregivers, prospective adopters and a pet-care community. This page explains the information used by those features and the choices available to you. The founder currently handles platform support and privacy requests.</p>
            <section className="mt-8 space-y-3">
                <h2 className="font-heading text-xl font-bold text-playful-text">Information you provide</h2>
                <ul className="list-disc space-y-2 pl-5 leading-relaxed">
                    <li>Account information such as your email, sign-in details and public profile fields.</li>
                    <li>Posts, comments, pet listings, photographs and information you choose to publish.</li>
                    <li>Messages, adoption enquiries and application details submitted through member features.</li>
                    <li>Support requests, reports and feedback you send to the team.</li>
                </ul>
                <p className="leading-relaxed">Public profiles, posts and listings can be read, shared and indexed by others. Share only what you intend to make public. Avoid identity documents, private contact details and precise locations of vulnerable animals in public content.</p>
            </section>
            <section className="mt-8 space-y-3">
                <h2 className="font-heading text-xl font-bold text-playful-text">How the platform uses information</h2>
                <p className="leading-relaxed">Information supports sign-in, profiles, adoption enquiries, member conversations, saved pets, community participation, moderation and account security. Supabase provides account and database services; Cloudflare hosts and delivers the website. These providers may process technical request and security information to operate their services.</p>
                <p className="leading-relaxed">A caregiver receives the information you submit in an adoption enquiry. Authorised platform administrators may access information needed to operate the service, investigate reports or address misuse. Member messages are not advertised as end-to-end encrypted. We do not sell personal information.</p>
            </section>
            <section className="mt-8 space-y-3">
                <h2 className="font-heading text-xl font-bold text-playful-text">Optional analytics and Meta Pixel</h2>
                <p className="leading-relaxed">Optional Google Analytics helps us understand public-page use and interactions, such as a product-link click. Optional Meta Pixel, ID 1462969085759164, measures advertising activity and page visits. Meta Pixel is an advertising measurement tool; it does not improve search rankings.</p>
                <p className="leading-relaxed">These optional scripts wait for your separate choices in Tracking preferences. Neither option is selected by default. The integration does not supply account emails, phone numbers, message text or precise animal coordinates to these tools, and does not enable Meta advanced matching. The providers may receive technical browser/device data, page information and identifiers through their scripts and cookies after you opt in.</p>
                <p className="leading-relaxed">You can reject either category, change your choice using Tracking preferences in the footer, or use your browser controls to manage stored cookies. Withdrawing consent stops future measurement through this integration; it does not erase information already received by a provider. Read <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-playful-teal-text underline">Google's privacy policy</a> and <a href="https://www.facebook.com/privacy/policy/" target="_blank" rel="noopener noreferrer" className="text-playful-teal-text underline">Meta's privacy policy</a> for their processing and available controls.</p>
            </section>
            <section className="mt-8 space-y-3">
                <h2 className="font-heading text-xl font-bold text-playful-text">Browser storage and essential features</h2>
                <p className="leading-relaxed">The site uses browser storage or cookies for account sessions, security, interface settings and your tracking preferences. Optional tracking preferences are stored for this browser. Rejecting optional tracking does not prevent you from browsing or using account features. Provider-side infrastructure or security records are separate from optional browser analytics.</p>
            </section>
            <section className="mt-8 space-y-3">
                <h2 className="font-heading text-xl font-bold text-playful-text">Product links and external websites</h2>
                <p className="leading-relaxed">Product links are currently being updated. When an affiliate link is available, it will be identified. Following a link opens a separate merchant service with its own policies; a qualifying transaction may earn commission for AdoptDontShop. The platform does not receive your merchant password or infer which member purchased from a click. Amazon/store visits do not earn PawCoins.</p>
            </section>
            <section className="mt-8 space-y-3">
                <h2 className="font-heading text-xl font-bold text-playful-text">Your content and privacy requests</h2>
                <p className="leading-relaxed">Use the available profile and content controls to manage your information. For account deletion, access, correction or a content-removal request, email <a href={`mailto:${CONTACT_EMAIL}`} className="break-all text-playful-teal-text underline">{CONTACT_EMAIL}</a>. The team may need to verify account ownership before acting. Information needed for security, abuse investigation or applicable obligations may need to be retained; public copies held by other services are outside this site's direct control.</p>
                <p className="leading-relaxed">For reporting guidance, see <Link href="/contact" className="text-playful-teal-text underline">Contact</Link>. Community participation is governed by the <Link href="/terms" className="text-playful-teal-text underline">Terms</Link>; general adoption questions belong in <Link href="/help" className="text-playful-teal-text underline">Help &amp; FAQs</Link>.</p>
            </section>
        </article>
    );
}
