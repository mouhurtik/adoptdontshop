import Link from 'next/link';
import { CONTACT_EMAIL, OFFICIAL_SOCIALS } from '@/lib/site';
import TrackingPreferences from '@/components/analytics/TrackingPreferences';

export default function SiteFooter() {
    return (
        <footer className="border-t border-playful-text/10 bg-playful-cream px-4 py-8 text-sm text-gray-600 lg:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-5">
                <nav className="flex flex-wrap gap-x-5 gap-y-2" aria-label="About and support">
                    {[['/about', 'About AdoptDontShop'], ['/help', 'Help & FAQs'], ['/contact', 'Contact'], ['/privacy-policy', 'Privacy policy'], ['/terms', 'Terms']].map(([href, label]) => (
                        <Link key={href} href={href} className="inline-flex min-h-11 items-center rounded-md hover:text-playful-teal-text focus-visible:outline focus-visible:outline-2">{label}</Link>
                    ))}
                </nav>
                <div className="flex flex-wrap gap-x-5 gap-y-2">
                    {OFFICIAL_SOCIALS.map(social => <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center rounded-md hover:text-playful-teal-text focus-visible:outline focus-visible:outline-2">{social.name}</a>)}
                    <a href={`mailto:${CONTACT_EMAIL}`} className="inline-flex min-h-11 items-center break-all rounded-md hover:text-playful-teal-text focus-visible:outline focus-visible:outline-2">{CONTACT_EMAIL}</a>
                </div>
                <p className="max-w-2xl leading-relaxed">A community for adoption and everyday pet care. Member posts belong to their authors; publication does not imply verification or veterinary advice.</p>
                <TrackingPreferences />
            </div>
        </footer>
    );
}
